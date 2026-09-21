# Visual Studio Code

## Scope

`package.json` and `themes/deepseafoam-color-theme.json` form a normal VS Code color-theme extension. The editor is black, surrounding workbench surfaces are `#001E26`, and focus remains cyan. Syntax colors use the explicitly documented heritage extension because the original SpriteCanvas UI did not define programming-language roles.

## Preview without installation

1. Open `targets\vscode` as a folder in VS Code.
2. Press `F5` to launch an Extension Development Host.
3. In that window, run **Preferences: Color Theme** and select **DeepSeaFoam**.

## Install

Package this folder with the official `vsce` tool, then install the resulting VSIX through **Extensions: Install from VSIX**. Packaging or marketplace publication is not performed by this repository.

## Remove / restore

Uninstall or disable the DeepSeaFoam extension and select the previous color theme. No user settings are modified by the export itself.

## Limitations

Extensions may contribute their own colors or webviews that do not inherit every workbench token. Runtime validation in a specific VS Code build remains separate from generation and schema checks.
