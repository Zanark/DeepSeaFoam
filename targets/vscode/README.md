# Visual Studio Code

## Scope

`package.json` and `themes/deepseafoam-color-theme.json` form a normal VS Code color-theme extension. The editor is near-black teal (<img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13`) and surrounding workbench surfaces are <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26`. Version 0.4.2 derives vivid seafoam (<img src="swatches/00a591.png" width="32" height="12" alt="Color swatch"> `#00A591`), green (<img src="swatches/45d072.png" width="32" height="12" alt="Color swatch"> `#45D072`), bright yellow (<img src="swatches/ebe565.png" width="32" height="12" alt="Color swatch"> `#EBE565`), and rose (<img src="swatches/e84a5f.png" width="32" height="12" alt="Color swatch"> `#E84A5F`) directly from the approved terminal colors, shaded slightly darker and richer by role rather than softened into pale pastels. Focus, core-backed strings, keywords, numbers, and diagnostics inherit these signals. The four separate Solarized heritage syntax colors remain unchanged.

The integrated terminal shares Windows Terminal's [higher-contrast extension](https://github.com/Zanark/DeepSeaFoam/blob/main/docs/PALETTE.md#higher-contrast-terminals): <img src="swatches/9cc2c3.png" width="32" height="12" alt="Color swatch"> `#9CC2C3` text, rich ANSI colors, warm whites, an orange <img src="swatches/f34b00.png" width="32" height="12" alt="Color swatch"> `#F34B00` cursor and <img src="swatches/003748.png" width="32" height="12" alt="Color swatch"> `#003748` selection. All 19 terminal colors and its <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` background stay unchanged in 0.4.2, separate from editor text, syntax, UI selection and diagnostics.

## Readability adaptations

- UI text selection uses <img src="swatches/00a59126.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `#00A59126` (unchanged 14.90% alpha); incidental selection/word highlights use <img src="swatches/00a5911a.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `#00A5911A` (10.20%).
- Active find fill uses <img src="swatches/ebe56526.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `#EBE56526`; other matches use <img src="swatches/ebe5651a.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `#EBE5651A`, with full-color borders for distinction.
- Invalid-token errors use dark <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` text on <img src="swatches/e84a5f.png" width="32" height="12" alt="Color swatch"> `#E84A5F` rose rather than warm text on the fill.

## Preview without installation

1. Open `targets\vscode` as a folder in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. In that window, run **Preferences: Color Theme** and select **DeepSeaFoam**.

## Install

Install [DeepSeaFoam from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=zanark.deepseafoam-theme), then select **Preferences: Color Theme > DeepSeaFoam**. The extension ID is `zanark.deepseafoam-theme`.

For offline installation, download the VSIX from the [latest release](https://github.com/Zanark/DeepSeaFoam/releases/latest) and use **Extensions: Install from VSIX**. To build it locally, run `npm run package:release` from the repository root.

## Remove / restore

Uninstall or disable the DeepSeaFoam extension and select the previous color theme. No user settings are modified by the export itself.

## Limitations

Extensions may contribute their own colors or webviews that do not inherit every workbench token. Runtime validation in a specific VS Code build remains separate from generation and schema checks.
