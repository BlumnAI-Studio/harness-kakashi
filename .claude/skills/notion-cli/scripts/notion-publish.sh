#!/usr/bin/env bash
# Notion page publisher — wraps `ntn pages create | update` and the Notion
# File Upload API so it works with a plain Internal Integration Token (PAT)
# on a Free workspace.
#
# Usage:
#   bash notion-publish.sh create <parent_page_id> <markdown_file | ->
#   bash notion-publish.sh update <page_id>        <markdown_file | ->
#   bash notion-publish.sh attach <page_id>        <image_file> [after_block_id]
#
#   # Back-compat (omitted subcommand = create):
#   bash notion-publish.sh <parent_page_id> <markdown_file | ->
#
# `attach` uses the single_part File Upload API (Free-plan compatible, ≤5 MB)
# and then PATCHes <page_id>/children with an image block referencing the
# upload. If [after_block_id] is given, the image is inserted right after that
# block; otherwise it is appended to the page tail.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
REPO_ROOT="${NOTION_REPO_ROOT:-$DEFAULT_REPO_ROOT}"
SECRET_PATH="${NOTION_SECRET_PATH:-$REPO_ROOT/.secret/notion.json}"
API_VERSION="${NOTION_API_VERSION:-2022-06-28}"

fail() { printf 'error: %s\n' "$*" >&2; exit 1; }

# ---- Parse subcommand ------------------------------------------------------
if [ $# -lt 2 ]; then
    fail "usage: $0 {create <parent>|update <page_id>|attach <page_id> <image>} ..."
fi

case "$1" in
    create|update)
        MODE="$1"; TARGET="$2"; SOURCE="${3:-}"
        [ -n "$SOURCE" ] || fail "usage: $0 $MODE <id> <markdown_file|->"
        ;;
    attach)
        [ $# -ge 3 ] || fail "usage: $0 attach <page_id> <image_file> [after_block_id]"
        MODE="attach"; TARGET="$2"; SOURCE="$3"; AFTER_BLOCK="${4:-}"
        ;;
    *)
        MODE="create"; TARGET="$1"; SOURCE="$2"
        ;;
esac

# ---- Tooling ---------------------------------------------------------------
[ -f "$SECRET_PATH" ] || fail "Secret not found: $SECRET_PATH"
command -v python3 >/dev/null 2>&1 || fail "python3 required"
command -v curl    >/dev/null 2>&1 || fail "curl required"
if ! command -v ntn >/dev/null 2>&1; then
    if [ -x "$HOME/.local/bin/ntn" ]; then
        export PATH="$HOME/.local/bin:$PATH"
    else
        fail "ntn not found on PATH; install via skill's install.ps1"
    fi
fi

# ---- Token -----------------------------------------------------------------
NOTION_API_TOKEN="$(python3 -c "import json; print(json.load(open('$SECRET_PATH'))['api_key'])")"
[ -n "$NOTION_API_TOKEN" ] || fail "api_key empty in $SECRET_PATH"
export NOTION_API_TOKEN

# ---- Workspace ID ----------------------------------------------------------
if [ -z "${NOTION_WORKSPACE_ID:-}" ]; then
    WORKSPACE_ID="$(curl -sS \
        -H "Authorization: Bearer $NOTION_API_TOKEN" \
        -H "Notion-Version: $API_VERSION" \
        https://api.notion.com/v1/users/me \
        | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('bot',{}).get('workspace_id',''))")"
    [ -n "$WORKSPACE_ID" ] || fail "Could not auto-detect workspace_id"
    export NOTION_WORKSPACE_ID="$WORKSPACE_ID"
fi

printf '==> mode:         %s\n' "$MODE"                   >&2
printf '==> target:       %s\n' "$TARGET"                 >&2
printf '==> workspace:    %s\n' "$NOTION_WORKSPACE_ID"    >&2

read_md() {
    if [ "$SOURCE" = "-" ]; then cat; else [ -f "$SOURCE" ] || fail "markdown file not found: $SOURCE"; cat "$SOURCE"; fi
}

# ---- single-part file upload (Free-plan compatible, ≤5 MB) -----------------
# Echoes the upload_id on stdout, logs progress to stderr.
upload_single_part() {
    local file="$1"
    local fname="$(basename "$file")"
    local ext="${fname##*.}"
    local ctype
    case "$ext" in
        png|PNG)            ctype="image/png" ;;
        jpg|JPG|jpeg|JPEG)  ctype="image/jpeg" ;;
        gif|GIF)            ctype="image/gif" ;;
        webp|WEBP)          ctype="image/webp" ;;
        svg|SVG)            ctype="image/svg+xml" ;;
        *) fail "unsupported image extension: $ext" ;;
    esac
    local size
    size="$(stat -c %s "$file" 2>/dev/null || wc -c < "$file")"
    if [ "$size" -gt 5242880 ]; then
        fail "file > 5 MB; Free plan only supports single_part uploads up to 5 MB"
    fi
    printf '==> image:        %s (%s, %s bytes)\n' "$file" "$ctype" "$size" >&2

    # 1) Create file_upload (single_part)
    local create_resp
    create_resp="$(curl -sS -X POST https://api.notion.com/v1/file_uploads \
        -H "Authorization: Bearer $NOTION_API_TOKEN" \
        -H "Notion-Version: $API_VERSION" \
        -H "Content-Type: application/json" \
        -d "$(printf '{"mode":"single_part","filename":"%s","content_type":"%s"}' "$fname" "$ctype")")"

    local upload_id upload_url
    upload_id="$(printf '%s' "$create_resp" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('id',''))")"
    upload_url="$(printf '%s' "$create_resp" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('upload_url',''))")"
    if [ -z "$upload_id" ] || [ -z "$upload_url" ]; then
        printf '%s\n' "$create_resp" >&2
        fail "file_upload create failed"
    fi
    printf '==> upload_id:    %s\n' "$upload_id" >&2

    # 2) Send bytes via multipart/form-data to upload_url
    local send_resp
    send_resp="$(curl -sS -X POST "$upload_url" \
        -H "Authorization: Bearer $NOTION_API_TOKEN" \
        -H "Notion-Version: $API_VERSION" \
        -F "file=@${file};type=${ctype}")"

    local status
    status="$(printf '%s' "$send_resp" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('status',''))")"
    if [ "$status" != "uploaded" ]; then
        printf '%s\n' "$send_resp" >&2
        fail "file upload send failed (status=$status)"
    fi
    printf '==> status:       %s\n' "$status" >&2

    printf '%s' "$upload_id"
}

# ---- Dispatch --------------------------------------------------------------
case "$MODE" in
    create) read_md | ntn pages create --parent "page:$TARGET" --json ;;
    update) read_md | ntn pages update "$TARGET" --json ;;
    attach)
        [ -f "$SOURCE" ] || fail "image file not found: $SOURCE"
        UPLOAD_ID="$(upload_single_part "$SOURCE")"
        PAYLOAD_PY='
import json, os
upload_id = os.environ["UPLOAD_ID"]
after = os.environ.get("AFTER_BLOCK", "").strip()
body = {"children": [{"object":"block","type":"image","image":{"type":"file_upload","file_upload":{"id": upload_id}}}]}
if after:
    body["after"] = after
print(json.dumps(body))
'
        PAYLOAD="$(UPLOAD_ID="$UPLOAD_ID" AFTER_BLOCK="${AFTER_BLOCK:-}" python3 -c "$PAYLOAD_PY")"
        curl -sS -X PATCH "https://api.notion.com/v1/blocks/$TARGET/children" \
            -H "Authorization: Bearer $NOTION_API_TOKEN" \
            -H "Notion-Version: $API_VERSION" \
            -H "Content-Type: application/json" \
            -d "$PAYLOAD" | python3 -m json.tool
        ;;
esac
