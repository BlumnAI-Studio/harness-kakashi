#!/usr/bin/env bash
# Notion CLI (ntn) WSL bootstrap — idempotent.
#
# What it does:
#   1. Installs ntn to $HOME/.local/bin (no sudo) using the official install script.
#   2. Adds $HOME/.local/bin to PATH in ~/.bashrc (between markers, idempotent).
#   3. Adds a runtime NOTION_API_TOKEN loader to ~/.bashrc that reads from
#      <repoRoot>/.secret/notion.json — token is never baked into bashrc.
#
# Usage:
#   bash /mnt/<drive>/<path-to-repo>/.claude/skills/notion-cli/scripts/wsl-bootstrap.sh
#
# Overrides (env vars):
#   NOTION_REPO_ROOT     — repo root path inside WSL (default: derived from script location)
#   NOTION_SECRET_PATH   — full path to notion.json (default: $NOTION_REPO_ROOT/.secret/notion.json)
#   NTN_INSTALL_DIR      — install dir (default: $HOME/.local/bin)
#   NTN_BASE_URL         — install source (default: https://ntn.dev)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# repoRoot = 4 levels up from scripts/
DEFAULT_REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
REPO_ROOT="${NOTION_REPO_ROOT:-$DEFAULT_REPO_ROOT}"
SECRET_PATH="${NOTION_SECRET_PATH:-$REPO_ROOT/.secret/notion.json}"
INSTALL_DIR="${NTN_INSTALL_DIR:-$HOME/.local/bin}"
NTN_SOURCE="${NTN_BASE_URL:-https://ntn.dev}"

info()  { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn()  { printf '\033[1;33m!!\033[0m %s\n' "$*" >&2; }
fail()  { printf '\033[1;31merror:\033[0m %s\n' "$*" >&2; exit 1; }

require() { command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"; }

# ----------------------------------------------------------------------------
# 1. Preflight
# ----------------------------------------------------------------------------
info "repo root:    $REPO_ROOT"
info "secret path:  $SECRET_PATH"
info "install dir:  $INSTALL_DIR"

require curl
require python3
require tar

mkdir -p "$INSTALL_DIR"

# ----------------------------------------------------------------------------
# 2. Install ntn (skip if already present and up-to-date enough)
# ----------------------------------------------------------------------------
if [ -x "$INSTALL_DIR/ntn" ]; then
  CURRENT_VER="$("$INSTALL_DIR/ntn" --version 2>/dev/null | awk '{print $2}')"
  info "ntn already installed: v${CURRENT_VER:-unknown}"
else
  info "Downloading official install script…"
  TMP_SCRIPT="$(mktemp)"
  trap 'rm -f "$TMP_SCRIPT"' EXIT
  curl -fsSL "$NTN_SOURCE" -o "$TMP_SCRIPT"

  info "Running installer (NTN_INSTALL_DIR=$INSTALL_DIR)…"
  NTN_INSTALL_DIR="$INSTALL_DIR" bash "$TMP_SCRIPT"
  rm -f "$TMP_SCRIPT"
  trap - EXIT
fi

# ----------------------------------------------------------------------------
# 3. Configure ~/.bashrc — PATH + token loader (idempotent via markers)
# ----------------------------------------------------------------------------
BASHRC="$HOME/.bashrc"
PATH_MARKER_BEGIN="# >>> notion-cli skill: PATH >>>"
PATH_MARKER_END="# <<< notion-cli skill: PATH <<<"
TOKEN_MARKER_BEGIN="# >>> notion-cli skill: token loader >>>"
TOKEN_MARKER_END="# <<< notion-cli skill: token loader <<<"

# Helper: remove existing block between markers (POSIX-safe)
remove_block() {
  local begin="$1" end="$2" file="$3"
  if grep -qF "$begin" "$file" 2>/dev/null; then
    # Use awk to delete inclusive range
    awk -v b="$begin" -v e="$end" '
      $0==b {skip=1}
      !skip {print}
      $0==e {skip=0}
    ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
}

remove_block "$PATH_MARKER_BEGIN"  "$PATH_MARKER_END"  "$BASHRC"
remove_block "$TOKEN_MARKER_BEGIN" "$TOKEN_MARKER_END" "$BASHRC"

cat >> "$BASHRC" <<EOF

$PATH_MARKER_BEGIN
# Added by notion-cli skill (wsl-bootstrap.sh) on $(date -u +%Y-%m-%dT%H:%M:%SZ)
case ":\$PATH:" in
  *":$INSTALL_DIR:"*) ;;
  *) export PATH="$INSTALL_DIR:\$PATH" ;;
esac
$PATH_MARKER_END

$TOKEN_MARKER_BEGIN
# Notion API token — runtime load from secret file (never baked into bashrc).
# Override secret path: export NOTION_SECRET_PATH=/custom/path/notion.json
__notion_secret="\${NOTION_SECRET_PATH:-$SECRET_PATH}"
if [ -f "\$__notion_secret" ] && command -v python3 >/dev/null 2>&1; then
  export NOTION_API_TOKEN="\$(python3 -c "import json,sys; print(json.load(open('\$__notion_secret'))['api_key'])" 2>/dev/null)"
fi
unset __notion_secret
$TOKEN_MARKER_END
EOF

info "Updated $BASHRC (PATH + token loader blocks)"

# ----------------------------------------------------------------------------
# 4. Self-check (load PATH + token in a child shell)
# ----------------------------------------------------------------------------
info "Verifying installation…"
bash -lc '
  set -e
  command -v ntn >/dev/null || { echo "ntn not on PATH after bashrc reload"; exit 1; }
  ntn --version
  if [ -n "${NOTION_API_TOKEN:-}" ]; then
    echo "NOTION_API_TOKEN loaded (length=${#NOTION_API_TOKEN})"
  else
    echo "NOTION_API_TOKEN NOT loaded — check secret file path"
  fi
  ntn doctor
'

info "Done. Open a new WSL shell or run: source ~/.bashrc"
