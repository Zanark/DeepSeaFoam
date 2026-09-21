# DeepSeaFoam

<img src="site/mark.svg" width="80" height="80" alt="Seaweed with foam bubbles in front">

**A quiet workstation beneath deep water, with small seafoam-colored signals and warm light illuminating what matters.**

[Explore the live DeepSeaFoam showcase](https://zanark.github.io/DeepSeaFoam/) · [Download the latest release](https://github.com/Zanark/DeepSeaFoam/releases/latest)

DeepSeaFoam is a cross-application dark theme derived from [Ethan Schoonover's Solarized palette](https://ethanschoonover.com/solarized/), but it is not Solarized Dark renamed. Its defining relationship is an extremely dark teal working surface surrounded by slightly lighter blue-green structure:

- **Workspace / recessed surface:** `#000F13`
- **Headers, toolbars, and panels:** `#001E26`
- **Primary interaction accent:** `#28C0B5`

The interface should recede behind the work. Cyan is a restrained signal, ivory supplies selective warmth, and errors remain clear exceptions. Application exports do not add ocean decoration, colored glow, gradients, or textures, and never recolor documents, artwork, images, videos, or exported content.

Version **0.2.0** deliberately replaces the original pure-black workspace with near-black teal. This updates the cross-application design without changing the read-only SpriteCanvas origin. Shadow and backdrop overlays retain their transparent black; they are not workspace surfaces.

Version [**0.4.0**](docs/releases/v0.4.0.md) introduced pastel seafoam, kelp, amber, and coral. **0.4.1 corrects their overly light appearance** with lower lightness and richer chroma: bright, saturated signals with pastel softness, not pale or washed-out colors. Focus, document indicators, diagnostics, and core-backed syntax inherit the correction; selection and error fills retain their readability adaptations. Dark surfaces, neutral colors, and the separate higher-contrast terminal scheme remain unchanged. See the [0.4.1 release notes](docs/releases/v0.4.1.md).

## The underwater showcase

The logo is seafoam-colored kelp with warm foam bubbles layered in front. One local [SVG](site/mark.svg) supplies the website header, footer, workspace study, favicon and web-app icon.

The [website](https://zanark.github.io/DeepSeaFoam/) is a cinematic interpretation of the theme: a brief surface-crossing descent, refracted light, drifting particles, and strongly swaying layered kelp with out-of-focus foreground fronds. Scrolling releases bubbles from below; clicking or tapping releases a small burst from that exact point. They drift upward without blocking links or controls. Scroll deeper and the light fades.

Ten background kelp clusters form a denser underwater forest, with staggered heights, mirrored silhouettes and offset sway. Two lens-close clusters remain at the edges. All reuse the same local SVG; background foliage stays behind the reading shade and content, with smaller, quieter plants on narrow screens.

On hover-capable fine-pointer devices, mouse and pen movement disturb a small, damped wave field behind the content. Directional pressure follows the movement and speed; waves propagate, overlap and settle rather than spawning decorative ring animations. Surface slopes refract the existing local light texture into restrained highlights and troughs. This is a stylized, physically inspired effect, not a fluid-accuracy claim. The grid is resolution-capped, stops once the wake is no longer visible, and clears on pause, reduced motion, resizing or leaving the page. Touch scrolling and text remain unaffected.

Three encounters occupy separate levels, with no collapsible cards: a nautilus continuously drifts right-to-left through the upper water after the workspace study; a blobfish peeks through foreground kelp farther down after the palette; and the anglerfish waits in the deepest scene after the application exports. Only its lure is visible until clicked. Its native checkbox also supports keyboard Space and works without JavaScript, without expanding any section.

The ordering is **habitat-inspired, not a literal ecosystem model**. NOAA describes the [nautilus's shell and backward propulsion](https://www.fisheries.noaa.gov/species/chambered-nautilus); UT Marine Science Institute places [blobfish around 2,000-4,000 feet](https://utmsi.utexas.edu/science-and-the-sea/radio-program/blobfish/); MBARI describes [deep-sea anglerfish in the midnight zone](https://www.mbari.org/animal/deep-sea-anglerfish/). Habitats overlap and vary by species. The 0-2,000 m scroll gauge is narrative. Deep kelp is deliberately theatrical foreground: [real kelp needs shallow, sunlit water](https://oceanservice.noaa.gov/facts/kelp.html). The creatures are stylized illustrations, not biological reconstructions.

This scenery belongs **only to the showcase**, not the canonical palette or application exports. Exact-color swatches and interface studies remain unfiltered. Scene artwork and the DeepSeaFoam mark are original local SVG/CSS/Canvas; application marks are credited third-party assets. There is no video, WebGL, external image service, audio, or runtime library dependency. The complete site stays within a **144 KiB asset budget**: the original 100 KiB cap grew to 128 KiB for unmodified application SVGs/licenses, then to 144 KiB for the dependency-free water simulation. **Pause motion** freezes scenery and clears transient wakes; reduced-motion preferences skip the descent and keep the nautilus stationary and visible. **Skip descent**, Escape, or scrolling also bypasses the opening. All three encounters remain available without JavaScript.

Pause, reduced motion, hidden tabs and page departure clear transient bubbles. Scroll bursts are frame-coalesced and rate-limited; at most 64 bubbles exist, and completed animations remove themselves. The generated gallery JSON is compact and contains only the core groups it displays; full extension metadata stays in the canonical palette.

The five application cards use locally hosted, lazy-loaded SVGs in their original colors: VS Code and Visual Studio from Devicon, Windows Terminal from Microsoft's repository, Firefox from Browser Logos, and Obsidian from its official brand assets. [Pinned source URLs and checksums](docs/application-icons.json) preserve provenance; [notices and license files](site/icons/NOTICE.txt) accompany the assets. Product marks belong to their respective owners and do not imply endorsement. Obsidian's [brand guidelines](https://obsidian.md/brand) prohibit modifying its mark and require contacting its owner for commercial use.

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
| ![Near-black teal](docs/swatches/000f13.svg) | Base / recessed surface | `#000F13` |
| ![Deep blue-green](docs/swatches/001e26.svg) | Panel surface | `#001E26` |
| ![Vibrant pastel seafoam](docs/swatches/28c0b5.svg) | Primary accent | `#28C0B5` |
| ![Soft gray](docs/swatches/93a1a1.svg) | Primary text | `#93A1A1` |
| ![Distant gray](docs/swatches/839496.svg) | Secondary / faint text | `#839496` |
| ![Warm ivory](docs/swatches/eee8d5.svg) | Warm emphasis | `#EEE8D5` |
| ![Pale pearl](docs/swatches/fdf6e3.svg) | Light selection edge | `#FDF6E3` |
| ![Submerged slate](docs/swatches/586e75.svg) | Strong border | `#586E75` |
| ![Vibrant pastel kelp](docs/swatches/a0b256.svg) | Document indicator | `#A0B256` |
| ![Vibrant pastel amber](docs/swatches/c9a244.svg) | Warning indicator | `#C9A244` |
| ![Vibrant pastel coral](docs/swatches/e9897e.svg) | Error indicator | `#E9897E` |

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
| ![Symmetry guide](docs/swatches/28c0b588.svg) | Symmetry guide | `#28C0B588` |
| ![Brush cursor](docs/swatches/fdf6e3aa.svg) | Brush cursor | `#FDF6E3AA` |

## Higher-contrast terminals

Version **0.3.0** adds a terminal-only extension inspired by the supplied **Solarized Dark Higher Contrast** scheme: brighter mist text, richer ANSI colors, warm whites, and an orange cursor. Windows Terminal and VS Code's integrated terminal share these exact 19 values. The reference background `#001E27` is deliberately replaced by DeepSeaFoam's `#000F13`; the rest of the reference's terminal colors are preserved.

These are **not additions to the core UI palette**. The 0.3.0 terminal-only change left editor syntax, application chrome, diagnostics, and all 27 core values unchanged. The 0.4.1 pastel correction changes core-backed roles, not this extension: **all 19 terminal colors and both terminals' `#000F13` backgrounds are preserved**.

| Swatch | Terminal role | Value |
| --- | --- | --- |
| ![Brighter mist](docs/terminal-swatches/9cc2c3.svg) | Foreground | `#9CC2C3` |
| ![Orange cursor](docs/terminal-swatches/f34b00.svg) | Cursor | `#F34B00` |
| ![Deep teal selection](docs/terminal-swatches/003748.svg) | Selection background | `#003748` |
| ![ANSI black](docs/terminal-swatches/002831.svg) | Black | `#002831` |
| ![ANSI red](docs/terminal-swatches/f54f65.svg) | Red | `#F54F65` |
| ![ANSI green](docs/terminal-swatches/6cbe6c.svg) | Green | `#6CBE6C` |
| ![ANSI yellow](docs/terminal-swatches/edae29.svg) | Yellow | `#EDAE29` |
| ![ANSI blue](docs/terminal-swatches/2176c7.svg) | Blue | `#2176C7` |
| ![ANSI magenta](docs/terminal-swatches/c61c6f.svg) | Magenta | `#C61C6F` |
| ![ANSI cyan](docs/terminal-swatches/259286.svg) | Cyan | `#259286` |
| ![Warm ANSI white](docs/terminal-swatches/eae3cb.svg) | White | `#EAE3CB` |
| ![Bright black](docs/terminal-swatches/006488.svg) | Bright black | `#006488` |
| ![Bright red](docs/terminal-swatches/f5858c.svg) | Bright red | `#F5858C` |
| ![Bright green](docs/terminal-swatches/51ef84.svg) | Bright green | `#51EF84` |
| ![Bright yellow](docs/terminal-swatches/fff96e.svg) | Bright yellow | `#FFF96E` |
| ![Bright blue](docs/terminal-swatches/178ec8.svg) | Bright blue | `#178EC8` |
| ![Bright magenta](docs/terminal-swatches/e24d8e.svg) | Bright magenta | `#E24D8E` |
| ![Bright cyan](docs/terminal-swatches/00b39e.svg) | Bright cyan | `#00B39E` |
| ![Warm bright white](docs/terminal-swatches/fcf4dc.svg) | Bright white | `#FCF4DC` |

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

[`palette/deepseafoam.json`](palette/deepseafoam.json) is the machine-readable source for all exports. The verified core inventory remains **11 interface solids + 8 overlays + 8 preview neutrals = 27 values**.

Code editors and terminals require roles that SpriteCanvas never defined. The canonical source separates the retained Solarized **syntax heritage extension** from the **higher-contrast terminal extension**. The four heritage syntax colors stay unchanged in 0.4.1, while strings, keywords, numbers, and diagnostics mapped from the core inherit the richer pastels. Pastel derivation metadata and derived UI selection/error colors are recorded in the canonical source.

See [application mappings](docs/MAPPINGS.md) for the exact surface decisions, extension roles, and unsupported boundaries across all five targets.

Run:

```powershell
npm run generate
npm test
npm run package:release
```

`generate` rebuilds the five application exports and all core/terminal SVG swatches. `test` verifies JSON, XML, required theme invariants, contrast pairs, swatch coverage, and generated freshness. `package:release` creates the downloadable files under ignored `dist\`.

## Porting rules

1. Preserve the near-black teal workspace / lighter blue-green panel relationship when the host exposes both surfaces.
2. Map semantic roles rather than similarly named fields.
3. Keep cyan restrained and preserve warm emphasis.
4. Treat text selection, diagnostics, syntax, and ANSI colors as deliberate application-specific mappings.
5. Preserve alpha when supported; otherwise record the background and opaque composite.
6. Keep user content separate from application chrome.
7. Document unsupported surfaces and runtime-validation status honestly.
8. Treat export, installation, and application validation as separate actions.

## Origin and attribution

DeepSeaFoam originated in [SpriteCanvas](https://github.com/Zanark/SpriteCanvas). SpriteCanvas remains the read-only reference for the original surface hierarchy, interaction recipes, overlays, and neutral previews. Its original black workspace and signal colors are historical provenance; the 0.2.0 base, 0.4.0 pastels, and 0.4.1 color correction do not alter that origin.

DeepSeaFoam is derived from [Solarized by Ethan Schoonover](https://ethanschoonover.com/solarized/). The retained heritage colors are identified explicitly in the canonical palette rather than silently restoring the full Solarized theme.
