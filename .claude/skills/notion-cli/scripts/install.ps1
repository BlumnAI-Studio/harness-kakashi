#requires -Version 5.1
<#
.SYNOPSIS
    Notion CLI (ntn) bootstrap for Windows + WSL.

.DESCRIPTION
    Installs `ntn` into a WSL Linux distro, configures token loading from
    .secret/notion.json, and registers a `ntn` PowerShell wrapper in $PROFILE.

    Idempotent: safe to run multiple times.

.PARAMETER WSLDistro
    WSL distro name. If omitted, uses the system default distro.

.PARAMETER SecretPath
    Path to notion.json. If omitted, defaults to <repoRoot>/.secret/notion.json.

.PARAMETER SkipProfileEdit
    Don't modify $PROFILE — useful for CI or when managing $PROFILE manually.

.PARAMETER Verify
    After install, run `ntn doctor` and `ntn api -X GET /v1/users/me` to verify.

.EXAMPLE
    .\install.ps1
    .\install.ps1 -WSLDistro Ubuntu-24.04 -Verify
    .\install.ps1 -SecretPath C:\custom\notion.json
#>

param(
    [string] $WSLDistro    = "",
    [string] $SecretPath   = "",
    [switch] $SkipProfileEdit,
    [switch] $Verify
)

$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Info($msg)  { Write-Host "==> $msg" -ForegroundColor Cyan }
function Write-Warn2($msg) { Write-Host "!!  $msg" -ForegroundColor Yellow }
function Write-Err($msg)   { Write-Host "ERR $msg" -ForegroundColor Red }

function Get-RepoRoot {
    # script lives at <repoRoot>\.claude\skills\notion-cli\scripts\install.ps1
    return (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
}

function Convert-WindowsPathToWSL([string] $winPath) {
    $abs = (Resolve-Path $winPath).Path
    $drive = $abs.Substring(0, 1).ToLower()
    $rest  = $abs.Substring(2) -replace '\\', '/'
    return "/mnt/$drive$rest"
}

function Get-DefaultWSLDistro {
    $raw = (wsl -l -q | Out-String) -split "`r?`n"
    # wsl outputs UTF-16 LE on Windows; strip nulls/BOM
    $clean = $raw | ForEach-Object { ($_ -replace "`0", "").Trim() } |
             Where-Object { $_ -and $_ -ne "" }
    return $clean[0]
}

# ---------------------------------------------------------------------------
# 1. Resolve repo root + paths
# ---------------------------------------------------------------------------

$repoRoot = Get-RepoRoot
Write-Info "Repo root: $repoRoot"

if ([string]::IsNullOrWhiteSpace($SecretPath)) {
    $SecretPath = Join-Path $repoRoot ".secret\notion.json"
}
Write-Info "Secret:    $SecretPath"

if (-not (Test-Path $SecretPath)) {
    Write-Warn2 "Secret file not found: $SecretPath"
    Write-Warn2 "Create it with: { ""api_key"": ""ntn_<your-token>"" }"
    Write-Warn2 "Install will continue; token verification will be skipped."
}

# ---------------------------------------------------------------------------
# 2. Resolve WSL distro
# ---------------------------------------------------------------------------

if ([string]::IsNullOrWhiteSpace($WSLDistro)) {
    try {
        $WSLDistro = Get-DefaultWSLDistro
    } catch {
        Write-Err "Could not determine WSL distro. Is WSL installed? Try: wsl --install -d Ubuntu-24.04"
        exit 1
    }
}
if ([string]::IsNullOrWhiteSpace($WSLDistro)) {
    Write-Err "No WSL distro found. Run: wsl --install -d Ubuntu-24.04"
    exit 1
}
Write-Info "WSL distro: $WSLDistro"

# ---------------------------------------------------------------------------
# 3. Run wsl-bootstrap.sh inside WSL
# ---------------------------------------------------------------------------

$bootstrapWin = Join-Path $PSScriptRoot "wsl-bootstrap.sh"
if (-not (Test-Path $bootstrapWin)) {
    Write-Err "wsl-bootstrap.sh not found next to install.ps1"
    exit 1
}
$bootstrapWsl = Convert-WindowsPathToWSL $bootstrapWin
$repoRootWsl  = Convert-WindowsPathToWSL $repoRoot
$secretWsl    = Convert-WindowsPathToWSL $SecretPath

Write-Info "Running wsl-bootstrap.sh in $WSLDistro …"

# Pass paths through environment so the bootstrap script picks them up
$env:WSLENV   = "NOTION_REPO_ROOT/u:NOTION_SECRET_PATH/u"
$env:NOTION_REPO_ROOT   = $repoRootWsl
$env:NOTION_SECRET_PATH = $secretWsl
try {
    & wsl -d $WSLDistro -- bash $bootstrapWsl
    if ($LASTEXITCODE -ne 0) {
        Write-Err "wsl-bootstrap.sh failed with exit code $LASTEXITCODE"
        exit $LASTEXITCODE
    }
} finally {
    Remove-Item Env:NOTION_REPO_ROOT   -ErrorAction SilentlyContinue
    Remove-Item Env:NOTION_SECRET_PATH -ErrorAction SilentlyContinue
    Remove-Item Env:WSLENV             -ErrorAction SilentlyContinue
}

# ---------------------------------------------------------------------------
# 4. Wire $PROFILE to dot-source ntn-wrapper.ps1
# ---------------------------------------------------------------------------

if (-not $SkipProfileEdit) {
    $wrapperPath = Join-Path $PSScriptRoot "ntn-wrapper.ps1"
    if (-not (Test-Path $wrapperPath)) {
        Write-Err "ntn-wrapper.ps1 not found next to install.ps1"
        exit 1
    }

    $profileDir = Split-Path $PROFILE -Parent
    if (-not (Test-Path $profileDir)) {
        New-Item -ItemType Directory -Path $profileDir -Force | Out-Null
    }
    if (-not (Test-Path $PROFILE)) {
        New-Item -ItemType File -Path $PROFILE -Force | Out-Null
    }

    $markerBegin = "# >>> notion-cli skill: wrapper >>>"
    $markerEnd   = "# <<< notion-cli skill: wrapper <<<"
    $existing = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
    if ($existing -and $existing.Contains($markerBegin)) {
        Write-Info "Refreshing $markerBegin block in `$PROFILE …"
        $pattern = [Regex]::Escape($markerBegin) + "[\s\S]*?" + [Regex]::Escape($markerEnd)
        $cleaned = [Regex]::Replace($existing, $pattern, "").TrimEnd() + "`r`n"
        Set-Content -Path $PROFILE -Value $cleaned -NoNewline
    } else {
        Write-Info "Adding wrapper block to `$PROFILE …"
    }

    # Also remove any earlier inline `function ntn { ... }` we may have added before
    $contentAfter = Get-Content $PROFILE -Raw -ErrorAction SilentlyContinue
    if ($contentAfter -match '(?ms)^# --- Notion CLI \(ntn\) WSL wrapper ---.*?^}\s*$') {
        Write-Info "Removing legacy inline `ntn` function from `$PROFILE …"
        $contentAfter = [Regex]::Replace($contentAfter, '(?ms)^# --- Notion CLI \(ntn\) WSL wrapper ---.*?^}\s*$', '').TrimEnd() + "`r`n"
        Set-Content -Path $PROFILE -Value $contentAfter -NoNewline
    }

    $block = @"

$markerBegin
# Notion CLI wrapper — dot-source the skill-managed script.
. "$wrapperPath"
# Optional overrides (uncomment as needed):
# `$env:NOTION_SECRET_PATH    = "C:\path\to\notion.json"
# `$env:NOTION_CLI_WSL_DISTRO = "$WSLDistro"
$markerEnd
"@
    Add-Content -Path $PROFILE -Value $block
    Write-Info "Wrote wrapper block to: $PROFILE"
} else {
    Write-Info "Skipped `$PROFILE edit (-SkipProfileEdit)"
}

# ---------------------------------------------------------------------------
# 5. Verify (optional)
# ---------------------------------------------------------------------------

if ($Verify) {
    Write-Info "Verifying via fresh WSL shell (loads .bashrc → NOTION_API_TOKEN)…"
    & wsl -d $WSLDistro -- bash -lc 'ntn doctor && echo "--- api: users/me ---" && ntn api -X GET /v1/users/me | head -20'
    if ($LASTEXITCODE -ne 0) {
        Write-Warn2 "Verify step returned exit code $LASTEXITCODE"
    }
}

Write-Info "Done. Open a new PowerShell window (or run: . `$PROFILE) and try: ntn doctor"
