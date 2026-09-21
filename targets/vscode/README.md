# Visual Studio Code

## Scope

`package.json` and `themes/deepseafoam-color-theme.json` form a normal VS Code color-theme extension. The editor is near-black teal (`#000F13`), surrounding workbench surfaces are `#001E26`, and 0.4.0 focus uses pastel seafoam (`#78C8C0`). Core-backed strings, keywords, numbers, and diagnostics inherit seafoam, kelp (`#B2BF84`), amber (`#CEB47C`), and coral (`#E6A49C`) as appropriate. The four separate Solarized heritage syntax colors remain unchanged.

The integrated terminal shares Windows Terminal's [higher-contrast extension](https://github.com/Zanark/DeepSeaFoam#higher-contrast-terminals): `#9CC2C3` text, rich ANSI colors, warm whites, an orange `#F34B00` cursor and `#003748` selection. All 19 terminal colors and its `#000F13` background stay unchanged in 0.4.0, separate from editor text, syntax, UI selection and diagnostics.

## Pastel readability adaptations

- UI text selection uses `#78C8C026` (14.90% alpha); incidental selection/word highlights use `#78C8C01A` (10.20%).
- Active find fill uses `#CEB47C26`; other matches use `#CEB47C1A`, with full-color borders for distinction.
- Invalid-token errors use dark `#000F13` text on pastel coral rather than warm text on the light fill.

## Preview without installation

1. Open `targets\vscode` as a folder in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. In that window, run **Preferences: Color Theme** and select **DeepSeaFoam**.

## Install

Download the VSIX from the [latest release](https://github.com/Zanark/DeepSeaFoam/releases/latest) and use **Extensions: Install from VSIX**. To build it locally, run `npm run package:release` from the repository root. Marketplace publication is separate.

## Remove / restore

Uninstall or disable the DeepSeaFoam extension and select the previous color theme. No user settings are modified by the export itself.

## Limitations

Extensions may contribute their own colors or webviews that do not inherit every workbench token. Runtime validation in a specific VS Code build remains separate from generation and schema checks.
