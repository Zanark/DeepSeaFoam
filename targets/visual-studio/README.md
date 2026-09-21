# Visual Studio

## Scope

`DeepSeaFoam.vstheme` combines:

- legacy Visual Studio 2022 environment, editor, language-service, output, and tree-view categories;
- the Visual Studio 2026 dark-theme `FallbackId` and semantic `Shell` / `ShellInternal` tokens.

The code editor and output surfaces are near-black teal (`#000F13`). Tool windows and shell structure use `#001E26`. Visual Studio colors use `AARRGGBB`, not the palette's `RRGGBBAA`.

Version 0.4.2 derives accent seafoam (`#00A591`), vivid document green (`#45D072`), bright warning yellow (`#EBE565`), and error rose (`#E84A5F`) from the approved terminal group. Role-specific proportional shades retain terminal-style intensity, a little darker and richer, not pale pastels. Native semantic tokens and core-backed syntax inherit these signals; the four Solarized heritage syntax colors and neutral surfaces remain unchanged. Text selection derives from `#00A59126`, written as `2600A591` in this format, retaining 14.90% alpha.

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
