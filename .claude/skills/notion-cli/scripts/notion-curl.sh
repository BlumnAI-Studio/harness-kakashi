#!/usr/bin/env bash
# Notion REST API helper — reads token from .secret/notion.json at runtime.
#
# This is the *primary* call path for the notion-cli skill: direct REST calls
# work with a plain Internal Integration Token, whereas `ntn api` additionally
# requires a workspace selection (OAuth `ntn login` or NOTION_WORKSPACE_ID).
#
# Usage:
#   bash notion-curl.sh whoami
#   bash notion-curl.sh page    <page_id>
#   bash notion-curl.sh blocks  <page_id> [page_size]
#   bash notion-curl.sh search  [query]
#   bash notion-curl.sh raw     <METHOD> <path-after-/v1>  [json-body]
#
# Overrides:
#   NOTION_SECRET_PATH   — full path to notion.json
#                          (default: <repoRoot>/.secret/notion.json)
#   NOTION_API_VERSION   — Notion-Version header value (default: 2022-06-28)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEFAULT_REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
REPO_ROOT="${NOTION_REPO_ROOT:-$DEFAULT_REPO_ROOT}"
SECRET_PATH="${NOTION_SECRET_PATH:-$REPO_ROOT/.secret/notion.json}"
API_VERSION="${NOTION_API_VERSION:-2022-06-28}"
API_BASE="https://api.notion.com/v1"

fail() { printf 'error: %s\n' "$*" >&2; exit 1; }

[ -f "$SECRET_PATH" ] || fail "Secret file not found: $SECRET_PATH"
command -v python3 >/dev/null 2>&1 || fail "python3 required (for JSON parsing)"
command -v curl    >/dev/null 2>&1 || fail "curl required"

TOKEN="$(python3 -c "import json; print(json.load(open('$SECRET_PATH'))['api_key'])")"
[ -n "$TOKEN" ] || fail "api_key empty in $SECRET_PATH"

call() {
    local method="$1" path="$2" body="${3:-}"
    if [ -n "$body" ]; then
        curl -sS -X "$method" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Notion-Version: $API_VERSION" \
            -H "Content-Type: application/json" \
            -d "$body" \
            "$API_BASE$path"
    else
        curl -sS -X "$method" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Notion-Version: $API_VERSION" \
            "$API_BASE$path"
    fi
}

pretty() { python3 -m json.tool; }

cmd="${1:-}"
case "$cmd" in
    whoami)
        call GET /users/me | pretty
        ;;
    page)
        [ $# -ge 2 ] || fail "usage: $0 page <page_id>"
        call GET "/pages/$2" | pretty
        ;;
    blocks)
        [ $# -ge 2 ] || fail "usage: $0 blocks <page_id> [page_size]"
        size="${3:-100}"
        call GET "/blocks/$2/children?page_size=$size" | pretty
        ;;
    search)
        query="${2:-}"
        if [ -n "$query" ]; then
            body=$(python3 -c "import json,sys; print(json.dumps({'query': sys.argv[1], 'page_size': 25}))" "$query")
        else
            body='{"page_size": 25}'
        fi
        call POST /search "$body" | python3 -c "
import json, sys
data = json.load(sys.stdin)
results = data.get('results', [])
print(f'Total accessible: {len(results)}')
for r in results:
    title = ''
    if r.get('object') == 'page':
        for k, v in (r.get('properties') or {}).items():
            if v.get('type') == 'title':
                title = ''.join(t.get('plain_text','') for t in v.get('title', []))
                break
    elif r.get('object') == 'database':
        title = ''.join(t.get('plain_text','') for t in r.get('title', []))
    print(f\"  [{r.get('object')}] id={r.get('id')}  title={title!r}\")
"
        ;;
    raw)
        [ $# -ge 3 ] || fail "usage: $0 raw <METHOD> <path-after-/v1> [json-body]"
        method="$2"
        path="$3"
        body="${4:-}"
        case "$path" in
            /*) ;;
            *)  path="/$path" ;;
        esac
        call "$method" "$path" "$body" | pretty
        ;;
    ""|-h|--help|help)
        sed -n '2,/^$/p' "$0" | sed 's/^# \{0,1\}//'
        ;;
    *)
        fail "Unknown subcommand: $cmd  (run '$0 help')"
        ;;
esac
