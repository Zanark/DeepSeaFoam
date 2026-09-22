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
if ($Version -ne $package.version) {
    throw "Release version must match the generated package version ($($package.version))."
}

$dist = Join-Path (Join-Path $repoRoot "dist\releases") $Version
if (Test-Path $dist) {
    Remove-Item -Recurse -Force $dist
}
New-Item -ItemType Directory -Path $dist -Force | Out-Null

Push-Location $repoRoot
try {
    npm test
    if ($LASTEXITCODE -ne 0) {
        throw "Theme validation failed."
    }
    foreach ($xmlPath in @(
        "targets\visual-studio\DeepSeaFoam.vstheme",
        "targets\jetbrains\resources\META-INF\plugin.xml",
        "targets\jetbrains\resources\DeepSeaFoam.xml",
        "targets\notepad-plus-plus\DeepSeaFoam.xml"
    )) {
        $null = [xml](Get-Content -Raw (Join-Path $repoRoot $xmlPath))
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

    $singleFiles = @(
        @{ Target = "windows-terminal"; Name = "WindowsTerminal"; Extension = "json" },
        @{ Target = "visual-studio"; Name = "VisualStudio"; Extension = "vstheme" },
        @{ Target = "discord"; Name = "Discord"; Extension = "theme.css" },
        @{ Target = "discord"; Name = "BetterDiscord"; Extension = "theme.css" },
        @{ Target = "telegram"; Name = "TelegramDesktop"; Extension = "tdesktop-theme" },
        @{ Target = "slack"; Name = "Slack"; Extension = "txt" },
        @{ Target = "sublime-text"; Name = "SublimeText"; Extension = "sublime-color-scheme" },
        @{ Target = "alacritty"; Name = "Alacritty"; Extension = "toml" },
        @{ Target = "notepad-plus-plus"; Name = "NotepadPlusPlus"; Extension = "xml" },
        @{ Target = "rofi"; Name = "Rofi"; Extension = "rasi" },
        @{ Target = "xfce4-terminal"; Name = "Xfce4Terminal"; Extension = "theme" },
        @{ Target = "godot"; Name = "Godot"; Extension = "tet" }
    )
    foreach ($asset in $singleFiles) {
        Copy-Item `
            (Join-Path $repoRoot "targets\$($asset.Target)\DeepSeaFoam.$($asset.Extension)") `
            (Join-Path $dist "DeepSeaFoam-$($asset.Name)-$Version.$($asset.Extension)")
    }
    Copy-Item (Join-Path $repoRoot "licenses\MIT.txt") (Join-Path $dist "DeepSeaFoam-Themes-LICENSE.txt")

    foreach ($asset in @(
        @{ Target = "zsh"; Name = "Zsh" },
        @{ Target = "termux"; Name = "Termux" },
        @{ Target = "github-pages"; Name = "GitHubPages" },
        @{ Target = "nova-launcher"; Name = "NovaLauncher" }
    )) {
        [System.IO.Compression.ZipFile]::CreateFromDirectory(
            (Join-Path $repoRoot "targets\$($asset.Target)"),
            (Join-Path $dist "DeepSeaFoam-$($asset.Name)-$Version.zip"),
            [System.IO.Compression.CompressionLevel]::Optimal,
            $false
        )
    }

    Compress-Archive `
        -Path @(
            (Join-Path $repoRoot "targets\monkeytype\DeepSeaFoam.json"),
            (Join-Path $repoRoot "targets\monkeytype\DeepSeaFoam.txt"),
            (Join-Path $repoRoot "targets\monkeytype\README.md"),
            (Join-Path $repoRoot "targets\monkeytype\LICENSE")
        ) `
        -DestinationPath (Join-Path $dist "DeepSeaFoam-Monkeytype-$Version.zip") `
        -CompressionLevel Optimal

    Compress-Archive `
        -Path @(
            (Join-Path $repoRoot "targets\chromium\manifest.json"),
            (Join-Path $repoRoot "targets\chromium\README.md"),
            (Join-Path $repoRoot "targets\chromium\LICENSE")
        ) `
        -DestinationPath (Join-Path $dist "DeepSeaFoam-Chromium-$Version.zip") `
        -CompressionLevel Optimal
    [System.IO.Compression.ZipFile]::CreateFromDirectory(
        (Join-Path $repoRoot "targets\jetbrains\resources"),
        (Join-Path $dist "DeepSeaFoam-JetBrains-$Version.jar"),
        [System.IO.Compression.CompressionLevel]::Optimal,
        $false
    )

    $obsidianRoot = Join-Path $dist "_obsidian"
    $obsidianTheme = Join-Path $obsidianRoot "DeepSeaFoam"
    New-Item -ItemType Directory -Path $obsidianTheme -Force | Out-Null
    Copy-Item (Join-Path $repoRoot "targets\obsidian\manifest.json") $obsidianTheme
    Copy-Item (Join-Path $repoRoot "targets\obsidian\theme.css") $obsidianTheme
    Copy-Item (Join-Path $repoRoot "targets\obsidian\README.md") $obsidianTheme
    Copy-Item (Join-Path $repoRoot "targets\obsidian\LICENSE") $obsidianTheme
    Compress-Archive `
        -Path $obsidianTheme `
        -DestinationPath (Join-Path $dist "DeepSeaFoam-Obsidian-$Version.zip") `
        -CompressionLevel Optimal
    Remove-Item -Recurse -Force $obsidianRoot

    $bundleRoot = Join-Path $dist "_bundle"
    $bundle = Join-Path $bundleRoot "DeepSeaFoam-$Version"
    New-Item -ItemType Directory -Path $bundle -Force | Out-Null
    Copy-Item (Join-Path $repoRoot "README.md") $bundle
    Copy-Item (Join-Path $repoRoot "LICENSE") $bundle
    Copy-Item (Join-Path $repoRoot "licenses") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "package.json") $bundle
    Copy-Item (Join-Path $repoRoot ".gitattributes") $bundle
    Copy-Item (Join-Path $repoRoot ".gitignore") $bundle
    Copy-Item (Join-Path $repoRoot "palette") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "docs") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "scripts") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "publishing") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "site") $bundle -Recurse
    Copy-Item (Join-Path $repoRoot "targets") $bundle -Recurse
    $chromiumCache = Join-Path $bundle "targets\chromium\Cached Theme.pak"
    if (Test-Path $chromiumCache) {
        Remove-Item -Force $chromiumCache
    }
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

    $vscodeUpload = Join-Path $dist "marketplace\vscode"
    New-Item -ItemType Directory -Path $vscodeUpload -Force | Out-Null
    Copy-Item (Join-Path $dist "DeepSeaFoam-VSCode-$Version.vsix") $vscodeUpload
    Get-ChildItem (Join-Path $repoRoot "publishing\vscode\*.txt") | ForEach-Object {
        $text = (Get-Content -Raw $_.FullName).Replace("{{VERSION}}", $Version)
        [System.IO.File]::WriteAllText(
            (Join-Path $vscodeUpload $_.Name), $text, [System.Text.UTF8Encoding]::new($false)
        )
    }
    Copy-Item (Join-Path $repoRoot "targets\vscode\icon.png") $vscodeUpload

    Get-ChildItem -Path $dist -File |
        Sort-Object Name |
        Select-Object Name, Length
}
finally {
    Pop-Location
}
