param(
    [string]$SourcePath = "src/quicksynth.js",
    [string]$OutputPath = "dist/quicksynth.bookmarklet.js",
    [switch]$SkipValidation
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Minify-JavaScriptSimple {
    param([string]$Code)

    $sb = New-Object System.Text.StringBuilder

    $inSingle = $false
    $inDouble = $false
    $inTemplate = $false
    $inLineComment = $false
    $inBlockComment = $false
    $escape = $false
    $lastWasSpace = $false
    $charBackslash = [char]92
    $charSingleQuote = [char]39
    $charDoubleQuote = [char]34
    $charBacktick = [char]96

    for ($i = 0; $i -lt $Code.Length; $i++) {
        $c = $Code[$i]
        $n = if ($i + 1 -lt $Code.Length) { $Code[$i + 1] } else { [char]0 }

        if ($inLineComment) {
            if ($c -eq "`n" -or $c -eq "`r") {
                $inLineComment = $false
                if (-not $lastWasSpace) {
                    [void]$sb.Append(" ")
                    $lastWasSpace = $true
                }
            }
            continue
        }

        if ($inBlockComment) {
            if ($c -eq "*" -and $n -eq "/") {
                $inBlockComment = $false
                $i++
            }
            continue
        }

        if (-not $inSingle -and -not $inDouble -and -not $inTemplate) {
            if ($c -eq "/" -and $n -eq "/") {
                $inLineComment = $true
                $i++
                continue
            }
            if ($c -eq "/" -and $n -eq "*") {
                $inBlockComment = $true
                $i++
                continue
            }
        }

        if ($inSingle -or $inDouble -or $inTemplate) {
            [void]$sb.Append($c)
            $lastWasSpace = $false

            if ($escape) {
                $escape = $false
                continue
            }

            if ($c -eq $charBackslash) {
                $escape = $true
                continue
            }

            if ($inSingle -and $c -eq $charSingleQuote) { $inSingle = $false; continue }
            if ($inDouble -and $c -eq $charDoubleQuote) { $inDouble = $false; continue }
            if ($inTemplate -and $c -eq $charBacktick) { $inTemplate = $false; continue }
            continue
        }

        if ($c -eq $charSingleQuote) {
            $inSingle = $true
            [void]$sb.Append($c)
            $lastWasSpace = $false
            continue
        }
        if ($c -eq $charDoubleQuote) {
            $inDouble = $true
            [void]$sb.Append($c)
            $lastWasSpace = $false
            continue
        }
        if ($c -eq $charBacktick) {
            $inTemplate = $true
            [void]$sb.Append($c)
            $lastWasSpace = $false
            continue
        }

        if ([char]::IsWhiteSpace($c)) {
            if (-not $lastWasSpace) {
                [void]$sb.Append(" ")
                $lastWasSpace = $true
            }
            continue
        }

        [void]$sb.Append($c)
        $lastWasSpace = $false
    }

    return ($sb.ToString().Trim())
}

if (-not (Test-Path -LiteralPath $SourcePath)) {
    throw "Source file not found: $SourcePath"
}

$source = Get-Content -LiteralPath $SourcePath -Raw
$output = Minify-JavaScriptSimple -Code $source

if (-not $output.StartsWith("javascript:")) {
    $output = "javascript:" + $output
}

$outputDir = Split-Path -Parent $OutputPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

Set-Content -LiteralPath $OutputPath -Value $output -NoNewline
Write-Host "Built bookmarklet: $OutputPath"

if (-not $SkipValidation) {
    & "$PSScriptRoot/validate-bookmarklet.ps1" -Path $OutputPath
}
