# DeepSeaFoam

**A quiet workstation beneath deep water, with small seafoam-colored signals and warm light illuminating what matters.**

DeepSeaFoam is a cross-application dark theme derived from [Ethan Schoonover's Solarized palette](https://ethanschoonover.com/solarized/), but it is not Solarized Dark renamed. Its defining relationship is a genuinely black working surface surrounded by extremely dark blue-green structure:

- **Workspace / recessed surface:** `#000000`
- **Headers, toolbars, and panels:** `#001E26`
- **Primary interaction accent:** `#2AA198`

The interface should recede behind the work. Cyan is a restrained signal, ivory supplies selective warmth, and errors remain clear exceptions. The theme does not add ocean decoration, colored glow, gradients, or textures, and it does not recolor documents, artwork, images, videos, or exported content.

## Download

Download the current packages from the [latest GitHub release](https://github.com/Zanark/DeepSeaFoam/releases/latest):

| Asset | Intended use |
| --- | --- |
| `DeepSeaFoam-VSCode-<version>.vsix` | Installable Visual Studio Code extension |
| `DeepSeaFoam-Obsidian-<version>.zip` | Obsidian theme folder |
| `DeepSeaFoam-WindowsTerminal-<version>.json` | Windows Terminal scheme object |
| `DeepSeaFoam-VisualStudio-<version>.vstheme` | Visual Studio theme source for Color Theme Designer / VSIX packaging |
| `DeepSeaFoam-Firefox-<version>.zip` | Firefox static-theme source; permanent installation requires Mozilla signing |
| `DeepSeaFoam-<version>.zip` | Complete palette, documentation, generator, and all application exports |
| `SHA256SUMS.txt` | SHA-256 checksums for every release asset |

## Supported applications

| Application | Native format | Scope |
| --- | --- | --- |
| [Visual Studio Code](targets/vscode/README.md) | Color-theme extension | Workbench, editor, syntax, terminal, diagnostics |
| [Visual Studio](targets/visual-studio/README.md) | `.vstheme` | Visual Studio 2022 editor categories plus Visual Studio 2026 semantic shell tokens |
| [Obsidian](targets/obsidian/README.md) | `manifest.json` + `theme.css` | Workspace chrome, editor, reading view, controls, graph |
| [Windows Terminal](targets/windows-terminal/README.md) | Color-scheme JSON | Terminal background, foreground, selection, cursor, ANSI colors |
| [Firefox](targets/firefox/README.md) | Static WebExtension theme | Browser chrome, tabs, fields, popups, sidebar, Firefox new-tab surface |

These are export files, not proof of runtime validation in every application version. Nothing in this repository installs a theme or modifies live application settings.

## Core interface palette

| Swatch | Semantic role | Value |
| --- | --- | --- |
| ![Black](docs/swatches/000000.svg) | Base / recessed surface | `#000000` |
| ![Deep blue-green](docs/swatches/001e26.svg) | Panel surface | `#001E26` |
| ![Seafoam cyan](docs/swatches/2aa198.svg) | Primary accent | `#2AA198` |
| ![Soft gray](docs/swatches/93a1a1.svg) | Primary text | `#93A1A1` |
| ![Distant gray](docs/swatches/839496.svg) | Secondary / faint text | `#839496` |
| ![Warm ivory](docs/swatches/eee8d5.svg) | Warm emphasis | `#EEE8D5` |
| ![Pale pearl](docs/swatches/fdf6e3.svg) | Light selection edge | `#FDF6E3` |
| ![Submerged slate](docs/swatches/586e75.svg) | Strong border | `#586E75` |
| ![Kelp green](docs/swatches/859900.svg) | Document indicator | `#859900` |
| ![Muted amber](docs/swatches/b58900.svg) | Warning indicator | `#B58900` |
| ![Signal red](docs/swatches/dc322f.svg) | Error indicator | `#DC322F` |

## Transparent overlays

The values below use `#RRGGBBAA`, with alpha last. Their swatches are composited over a neutral checkerboard because the displayed color depends on the surface beneath them.

| Swatch | Semantic role | Value |
| --- | --- | --- |
| ![Separator overlay](docs/swatches/586e7566.svg) | Separators | `#586E7566` |
| ![Hover overlay](docs/swatches/586e7533.svg) | Hover fills | `#586E7533` |
| ![Soft shadow](docs/swatches/00000066.svg) | Soft shadows | `#00000066` |
| ![Strong shadow](docs/swatches/000000cc.svg) | Strong shadows | `#000000CC` |
| ![Modal backdrop](docs/swatches/000000b8.svg) | Modal backdrop | `#000000B8` |
| ![Pixel grid](docs/swatches/002b3630.svg) | Pixel grid | `#002B3630` |
| ![Symmetry guide](docs/swatches/2aa19888.svg) | Symmetry guide | `#2AA19888` |
| ![Brush cursor](docs/swatches/fdf6e3aa.svg) | Brush cursor | `#FDF6E3AA` |

## Preview-only neutrals

These colors keep image and transparency previews visually neutral. They are not alternate application backgrounds.

| Swatch | Established role | Value |
| --- | --- | --- |
| ![Checkerboard light](docs/swatches/d0d1c9.svg) | Main checkerboard light square | `#D0D1C9` |
| ![Checkerboard dark](docs/swatches/b2b5ae.svg) | Main checkerboard dark square | `#B2B5AE` |
| ![Navigator shade one](docs/swatches/292e33.svg) | Navigator preview shade one | `#292E33` |
| ![Navigator shade two](docs/swatches/30363b.svg) | Navigator preview shade two | `#30363B` |
| ![Comparison shade one](docs/swatches/30373a.svg) | Comparison preview shade one | `#30373A` |
| ![Comparison shade two](docs/swatches/394143.svg) | Comparison preview shade two | `#394143` |
| ![Frame thumbnail](docs/swatches/343b40.svg) | Frame-thumbnail background | `#343B40` |
| ![Layer thumbnail](docs/swatches/191d22.svg) | Layer-thumbnail background | `#191D22` |

## Canonical source and extensions

[`palette/deepseafoam.json`](palette/deepseafoam.json) is the machine-readable source for all exports. The verified active inventory remains **11 interface solids + 8 overlays + 8 preview neutrals = 27 values**.

Code editors and terminals require syntax and ANSI roles that SpriteCanvas never defined. The canonical source therefore labels the retained Solarized orange, magenta, violet, and blue as a **heritage extension**, not as newly approved core interface colors. It also records each derived opaque fallback and its compositing background.

See [application mappings](docs/MAPPINGS.md) for the exact surface decisions, extension roles, and unsupported boundaries across all five targets.

Run:

```powershell
npm run generate
npm test
npm run package:release
```

`generate` rebuilds the five application exports and all local SVG swatches. `test` verifies JSON, XML, required theme invariants, swatch coverage, and that generated files are current. `package:release` creates the downloadable files under ignored `dist\`.

## Porting rules

1. Preserve the black workspace / blue-green panel relationship when the host exposes both surfaces.
2. Map semantic roles rather than similarly named fields.
3. Keep cyan restrained and preserve warm emphasis.
4. Treat text selection, diagnostics, syntax, and ANSI colors as deliberate application-specific mappings.
5. Preserve alpha when supported; otherwise record the background and opaque composite.
6. Keep user content separate from application chrome.
7. Document unsupported surfaces and runtime-validation status honestly.
8. Treat export, installation, and application validation as separate actions.

## Origin and attribution

DeepSeaFoam originated in [SpriteCanvas](https://github.com/Zanark/SpriteCanvas). SpriteCanvas remains the read-only reference implementation for the original surface hierarchy, active palette, interaction recipes, transparency overlays, and neutral previews.

DeepSeaFoam is derived from [Solarized by Ethan Schoonover](https://ethanschoonover.com/solarized/). The retained heritage colors are identified explicitly in the canonical palette rather than silently restoring the full Solarized theme.
