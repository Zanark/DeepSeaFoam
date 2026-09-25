# Visual Studio

## Scope

`DeepSeaFoam.vstheme` combines:

- legacy Visual Studio 2022 environment, editor, language-service, output, and tree-view categories;
- the Visual Studio 2026 dark-theme `FallbackId` and semantic `Shell` / `ShellInternal` tokens.

The code editor and output surfaces are near-black teal (<img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13`). Tool windows and shell structure use <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26`. Visual Studio colors use `AARRGGBB`, not the palette's `RRGGBBAA`.

Version 0.4.2 derives accent seafoam (<img src="swatches/00a591.png" width="32" height="12" alt="Color swatch"> `#00A591`), vivid document green (<img src="swatches/45d072.png" width="32" height="12" alt="Color swatch"> `#45D072`), bright warning yellow (<img src="swatches/ebe565.png" width="32" height="12" alt="Color swatch"> `#EBE565`), and error rose (<img src="swatches/e84a5f.png" width="32" height="12" alt="Color swatch"> `#E84A5F`) from the approved terminal group. Role-specific proportional shades retain terminal-style intensity, a little darker and richer, not pale pastels. Native semantic tokens and core-backed syntax inherit these signals; the four Solarized heritage syntax colors and neutral surfaces remain unchanged. Text selection derives from <img src="swatches/00a59126.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `#00A59126`, written as ARGB <img src="swatches/00a59126.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `2600A591` in this format, retaining 14.90% alpha.

## Build and install

Visual Studio does not install a raw `.vstheme` through the normal settings-import wizard. Use Microsoft's Visual Studio theme tooling:

1. Install **Color Theme Designer** for the Visual Studio version you target.
2. Create a **VSTheme Project**.
3. Replace its generated `.vstheme` with `DeepSeaFoam.vstheme`.
4. Build the project to produce a VSIX.
5. Back up current settings, install the VSIX, restart Visual Studio, and select **DeepSeaFoam** under **Tools > Options > Environment > General**.

The `.vstheme` is the portable source artifact. This repository does not install the designer, build a version-specific VSIX, or modify Visual Studio.

## Remove / restore

Select the previous theme under **Tools > Options > Environment > General**, or restore the settings backup made during import. Visual Studio 2026 per-theme overrides can also be reset from **Environment > Visual Experience > Theme colors**.

## Limitations

Visual Studio's theming surface changes between releases, and extensions can define independent tokens. The file includes current semantic tokens and a focused legacy set, not thousands of historical feature-specific colors. Validate the imported result in the exact Visual Studio version and installed extension set before calling it complete.
