param(
    [string]$Version
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$package = Get-Content -Raw (Join-Path $repoRoot "package.json") | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace($Version)) {
    $Version = $package.version
}

if ($Version -notmatch '^\d+\.\d+\.\d+([-.][0-9A-Za-z.-]+)?$') {
    throw "Version '$Version' is not a supported release version."
}

$dist = Join-Path $repoRoot "dist"
if (Test-Path $dist) {
    Remove-Item -Recurse -Force $dist
}
New-Item -ItemType Directory -Path $dist | Out-Null

Push-Location $repoRoot
try {
    npm test
    if ($LASTEXITCODE -ne 0) {
        throw "Theme validation failed."
    }

    Push-Location (Join-Path $repoRoot "targets\vscode")
    try {
        npx --yes "@vscode/vsce@4.0.0" package --no-dependencies --out (Join-Path $dist "DeepSeaFoam-VSCode-$Version.vsix")
        if ($LASTEXITCODE -ne 0) {
            throw "VS Code packaging failed."
        }
    }
    finally {
        Pop-Location
    }

    npx --yes "web-ext@10.6.0" build `
        --source-dir (Join-Path $repoRoot "targets\firefox") `
        --artifacts-dir $dist `
        --filename "DeepSeaFoam-Firefox-$Version.zip" `
        --overwrite-dest
    if ($LASTEXITCODE -ne 0) {
        throw "Firefox packaging failed."
    }
    $firefoxGenerated = Join-Path $dist "deepseafoam-firefox-$Version.zip"
    $firefoxAsset = Join-Path $dist "DeepSeaFoam-Firefox-$Version.zip"
    if (Test-Path $firefoxGenerated) {
        Move-Item $firefoxGenerated $firefoxAsset
    }

    Copy-Item `
        (Join-Path $repoRoot "targets\windows-terminal\DeepSeaFoam.json") `
        (Join-Path $dist "DeepSeaFoam-WindowsTerminal-$Version.json")
    Copy-Item `
        (Join-Path $repoRoot "targets\visual-studio\DeepSeaFoam.vstheme") `
        (Join-Path $dist "DeepSeaFoam-VisualStudio-$Version.vstheme")

    $obsidianRoot = Join-Path $dist "_obsidian"
    $obsidianTheme = Join-Path $obsidianRoot "DeepSeaFoam"
    New-Item -ItemType Directory -Path $obsidianTheme -Force | Out-Null
    Copy-Item (Join-Path $repoRoot "targets\obsidian\manifest.json") $obsidianTheme
    Copy-Item (Join-Path $repoRoot "targets\obsidian\theme.css") $obsidianTheme
    Copy-Item (Join-Path $repoRoot "targets\obsidian\README.md") $obsidianTheme
    Compress-Archive `
        -Path $obsidianTheme `
        -DestinationPath (Join-Path $dist "DeepSeaFoam-Obsidian-$Version.zip") `
        -CompressionLevel Optimal
    Remove-Item -Recurse -Force $obsidianRoot

    $bundleRoot = Join-Path $dist "_bundle"
    $bundle = Join-Path $bundleRoot "DeepSeaFoam-$Version"
    New-Item -ItemType Directory -Path $bundle -Force | Out-Null
    Copy-Item (Join-Path $repoRoot "README.md") $bundle
    Copy-Item (Join-Path $repoRoot "package.json") $bundle
    Copy-Item (Join-Path $repoRoot ".gitattributes") $bundle
    Copy-Item (Join-Path $repoRoot "palette") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "docs") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "scripts") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "site") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "targets") $bundle -Recurse
    Compress-Archive `
        -Path $bundle `
        -DestinationPath (Join-Path $dist "DeepSeaFoam-$Version.zip") `
        -CompressionLevel Optimal
    Remove-Item -Recurse -Force $bundleRoot

    $checksumLines = Get-ChildItem -Path $dist -File |
        Sort-Object Name |
        ForEach-Object {
            $hash = (Get-FileHash -Algorithm SHA256 -Path $_.FullName).Hash.ToLowerInvariant()
            "$hash  $($_.Name)"
        }
    [System.IO.File]::WriteAllLines(
        (Join-Path $dist "SHA256SUMS.txt"),
        [string[]]$checksumLines,
        [System.Text.UTF8Encoding]::new($false)
    )

    Get-ChildItem -Path $dist -File |
        Sort-Object Name |
        Select-Object Name, Length
}
finally {
    Pop-Location
}
