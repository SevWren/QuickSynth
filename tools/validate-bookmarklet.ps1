param(
    [string]$Path = "dist/quicksynth.bookmarklet.js"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $Path)) {
    throw "Bookmarklet file not found: $Path"
}

$content = Get-Content -LiteralPath $Path -Raw

if ([string]::IsNullOrWhiteSpace($content)) {
    throw "Bookmarklet file is empty: $Path"
}

if ($content -match "(`r|`n)") {
    throw "Bookmarklet must be single-line: $Path"
}

if (-not $content.StartsWith("javascript:")) {
    throw "Bookmarklet must start with 'javascript:'"
}

if ($content -notmatch "void\s*\(function\s*\(") {
    throw "Bookmarklet does not appear to contain the expected IIFE prefix"
}

if ($content -notmatch "\}\)\(\)\s*;?$") {
    throw "Bookmarklet does not appear to contain the expected IIFE suffix"
}

Write-Host "Validation passed: $Path"
