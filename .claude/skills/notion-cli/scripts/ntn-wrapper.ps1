# Notion CLI (ntn) PowerShell wrapper
#
# Dot-source this from $PROFILE:
#     . "<repo>\.claude\skills\notion-cli\scripts\ntn-wrapper.ps1"
#
# Defines `ntn` function that:
#   1. Loads token from .secret/notion.json at call time (never baked).
#   2. Passes it to WSL via $env:NOTION_API_TOKEN + WSLENV.
#   3. Invokes ~/.local/bin/ntn in the selected WSL distro.
#   4. Cleans up the token from the PowerShell session on exit.
#
# Overrides (set in $PROFILE or session):
#   $env:NOTION_SECRET_PATH     — full path to a notion.json (default: <repoRoot>/.secret/notion.json)
#   $env:NOTION_CLI_WSL_DISTRO  — WSL distro name (default: WSL default distro)

function Get-NotionRepoRoot {
    # This script lives at: <repoRoot>\.claude\skills\notion-cli\scripts\ntn-wrapper.ps1
    # repoRoot = 4 levels up
    return (Resolve-Path (Join-Path $PSScriptRoot "..\..\..\..")).Path
}

function Get-NotionSecretPath {
    if ($env:NOTION_SECRET_PATH -and (Test-Path $env:NOTION_SECRET_PATH)) {
        return $env:NOTION_SECRET_PATH
    }
    $repoRoot = Get-NotionRepoRoot
    return (Join-Path $repoRoot ".secret\notion.json")
}

function ntn {
    [CmdletBinding()]
    param([Parameter(ValueFromRemainingArguments = $true)] [string[]] $RemainingArgs)

    $secretFile = Get-NotionSecretPath
    if (-not (Test-Path $secretFile)) {
        Write-Error "Notion secret file not found: $secretFile`n  Place a JSON with { `"api_key`": `"ntn_...`" } there, or set `$env:NOTION_SECRET_PATH."
        return
    }

    $prevToken  = $env:NOTION_API_TOKEN
    $prevWslEnv = $env:WSLENV
    try {
        $cfg = Get-Content $secretFile -Raw | ConvertFrom-Json
        $token = $cfg.api_key
        if ([string]::IsNullOrWhiteSpace($token)) {
            Write-Error "api_key is empty in $secretFile"
            return
        }

        $env:NOTION_API_TOKEN = $token
        if ($env:WSLENV) {
            if ($env:WSLENV -notmatch "(^|:)NOTION_API_TOKEN(/u)?(:|$)") {
                $env:WSLENV = "$($env:WSLENV):NOTION_API_TOKEN/u"
            }
        } else {
            $env:WSLENV = "NOTION_API_TOKEN/u"
        }

        $distro = $env:NOTION_CLI_WSL_DISTRO
        if ([string]::IsNullOrWhiteSpace($distro)) {
            wsl -- /home/$env:USERNAME/.local/bin/ntn @RemainingArgs 2>&1 |
                ForEach-Object { $_ }
            if ($LASTEXITCODE -ne 0) {
                # Fallback: try with explicit $HOME resolution via login shell
                wsl -- bash -lc "ntn $($RemainingArgs -join ' ')"
            }
        } else {
            wsl -d $distro -- bash -lc "ntn $($RemainingArgs -join ' ')"
        }
    } finally {
        $env:NOTION_API_TOKEN = $prevToken
        $env:WSLENV           = $prevWslEnv
    }
}

# Note: this file is meant to be dot-sourced from $PROFILE, not imported as a
# module. Dot-sourcing automatically exposes `ntn` (and the helpers) into the
# caller scope, so Export-ModuleMember is unnecessary and would error here.
