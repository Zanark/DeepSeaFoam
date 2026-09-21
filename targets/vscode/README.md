# Visual Studio Code

## Scope

`package.json` and `themes/deepseafoam-color-theme.json` form a normal VS Code color-theme extension. The editor is near-black teal (`#000F13`), surrounding workbench surfaces are `#001E26`, and focus remains cyan. Syntax colors use the explicitly documented heritage extension because the original SpriteCanvas UI did not define programming-language roles.

The integrated terminal shares Windows Terminal's [higher-contrast extension](https://github.com/Zanark/DeepSeaFoam#higher-contrast-terminals): `#9CC2C3` text, rich ANSI colors, warm whites, an orange `#F34B00` cursor and `#003748` selection. This is separate from editor text, syntax, UI selection and diagnostic colors.

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
