# DeepSeaFoam

<img src="site/mark.svg" width="80" height="80" alt="Seaweed with foam bubbles in front">

**A quiet workstation beneath deep water, with small seafoam-colored signals and warm light illuminating what matters.**

[Explore the live DeepSeaFoam showcase](https://zanark.github.io/DeepSeaFoam/) · [Download the latest release](https://github.com/Zanark/DeepSeaFoam/releases/latest)

DeepSeaFoam is a cross-application dark theme derived from [Ethan Schoonover's Solarized palette](https://ethanschoonover.com/solarized/), but it is not Solarized Dark renamed. Its defining relationship is an extremely dark teal working surface surrounded by slightly lighter blue-green structure:

- **Workspace / recessed surface:** `#000F13`
- **Headers, toolbars, and panels:** `#001E26`
- **Primary interaction accent:** `#00A591`

The interface should recede behind the work. Cyan is a restrained signal, ivory supplies selective warmth, and errors remain clear exceptions. Application exports do not add ocean decoration, colored glow, gradients, or textures, and never recolor documents, artwork, images, videos, or exported content.

Version **0.2.0** deliberately replaces the original pure-black workspace with near-black teal. This updates the cross-application design without changing the read-only SpriteCanvas origin. Shadow and backdrop overlays retain their transparent black; they are not workspace surfaces.

Version [**0.4.0**](docs/releases/v0.4.0.md) introduced pastel signals; [**0.4.1**](docs/releases/v0.4.1.md) made them richer. **0.4.2 takes its core signals directly from the approved higher-contrast terminal colors, shaded a little darker and richer**: vivid seafoam, green, bright yellow, and rose, not pale or chalky pastels. Focus, document indicators, diagnostics, and core-backed syntax inherit these signals; selection and error fills retain their readability adaptations. Dark surfaces, neutral colors, and the actual terminal scheme remain unchanged. See the [0.4.2 release notes](docs/releases/v0.4.2.md).

Version **0.5.0** expands the collection to **twelve application targets**, adding Discord, Telegram Desktop, Slack, Chrome/Edge, JetBrains IDEs, Sublime Text and Alacritty without changing the palette. Discord is explicitly unofficial custom CSS; Slack exposes only a limited native color preset. See the [0.5.0 release notes](docs/releases/v0.5.0.md) and each application's installation and restoration guide.

Version **0.6.0** adds **Monkeytype**, bringing the collection to **thirteen targets** with the same palette. Its native colors-only share link uses warm typing text, seafoam signals and readable secondary gray without resetting unrelated settings. See the [install/restore guide](targets/monkeytype/README.md) and [0.6.0 release notes](docs/releases/v0.6.0.md). Local export readiness does not imply upstream acceptance.

Version **0.7.0** expands the collection to **21 targets**: Notepad++, Zsh, rofi,
Xfce4 Terminal, Termux, GitHub Pages, Godot Engine and a **manual Nova Launcher
preset**. BetterDiscord explicitly reuses the existing Discord theme, with an
identical named download rather than a duplicate palette. No palette colors change.
See the [0.7.0 release notes](docs/releases/v0.7.0.md) for format and support boundaries.

## The underwater showcase

The [website](https://zanark.github.io/DeepSeaFoam/) interprets the theme as a quiet underwater workstation. Its hero opens without an eyebrow, with a short four-line poem and a document-green (`#45D072`) **Find your app** link beside **Explore the palette**. Application exports follow the palette immediately; the interaction study remains below them. The former four principle cards, signal legend, and heritage/extension section are removed from the page, not from the theme's documented mappings.

The shared seaweed-and-foam [mark](site/mark.svg) now has **18 lower-half bubbles and five reflection strokes**, painted in front of the fronds. Header, footer, workspace study, favicon, and web-app icon reuse it; website icon references use the `seaweed-foam-cluster` cache key.

A brief, skippable descent leads into refracted light, drifting particles, and swaying kelp. Ten background clusters and two small, softly blurred **foreground edge clusters** reuse the local kelp SVG. The close-up fronds sway at different speeds on the left and right, cropped to narrow side gutters rather than over the text. Top/bottom clearance protects the header and fixed controls; phone footer credits share the reading area's inset. Pause motion, reduced motion and no-JavaScript behavior apply to these plants too. Scrolling releases bubbles below the visible viewport; pressing or tapping releases them immediately at the pointer, without duplicate compatibility-click bursts. Mouse/pen movement and single-finger swipes drive a bounded Canvas2D wave field; phone taps create a small water displacement that propagates through the same simulation. Passive touch listeners preserve native scrolling and pinch zoom, including when the browser cancels pointer events to begin a pan. This is a stylized effect, not a fluid-accuracy claim; it does not warp text or exact-color studies.

The nautilus roams across a fixed **background scene layer**, moving left, right, up, down and diagonally, independently of page scrolling. It remains above the ocean scenery but below all readable page content, so its full-viewport freedom never paints over text. Its seeded model chooses 4–10-second legs with **30–84 CSS-pixel/s target speeds, three times the previous targets**, smooth damping and soft confinement; turns can repeat a direction. Actual screen speed eases near the edges rather than wrapping or teleporting. It follows the visible viewport during phone zoom, never intercepts clicks or touches, and parks near the lower-right without JavaScript or with reduced motion. Pause preserves its current pose; the intro, hidden pages and loss of focus suspend movement.

The click-only anglerfish follows the interaction study. The **blobfish now lives at the bottom of the footer**, behind a separate twenty-cluster kelp hideout. Its native reveal parts the foliage outward; click/tap or keyboard Space reveals and retracts either creature without JavaScript or expanding their sections. This order and the 0–2,000 m gauge are theatrical composition, **not a biological depth-order claim**.

The blobfish is a **user-supplied transparent illustration**, cleaned of isolated specks, cropped, and resized to a 640×345 WebP. The fish has no CSS opacity reduction or filter; its painted colors are not dimmed for concealment. Its original artist and license were not supplied; no blanket project license is asserted. [Processing metadata](docs/showcase-artwork.json), the optional [Pillow preparation script](scripts/prepare-blobfish.py), and the [artwork notice](site/artwork-NOTICE.txt) document that boundary. The private source image is not distributed with the repository.

Scenery belongs **only to the showcase**, not the application exports. The site includes the owner's supplied **2:56 background music** as a **2,817,068-byte MP3** rather than the 33.8 MB WAV. On eligible fresh visible loads, music **preloads during the descent and attempts audible playback after the dive completes**. Skipped, deep-linked or reduced-motion openings can complete immediately. If browser policy blocks autoplay, the request stays ready for the **first scroll gesture**, tap, click or key press; you do not have to find **Play music**. Wheel/trackpad movement and single-finger swipes share one scroll attempt, not repeated retries on every scroll frame. Scripted page movement does not trigger it. Some browsers do not accept scrolling as permission for sound and still require a tap, click or key: this is not a policy bypass or a guarantee of zero-click sound. **Cancel music** cancels queued/loading playback; **Pause music** preserves position and prevents later gestures from restarting it. Hiding/leaving the page and history restoration also suppress automatic retries; a fresh load or reload is eligible again. Playback loops at 35% element volume where supported; phone hardware volume remains authoritative.

**Pause motion** and reduced motion do not mute music; finishing or bypassing the intro only gates its initial automatic request. Music and motion buttons have a subtle **static seafoam border and halo**, independent of animation preferences. Gesture recovery ignores synthetic events, key repeats, modified shortcuts and multi-touch scrolling, does not prevent ordinary interactions, and excludes music-button activations to avoid play-then-pause races. Scrolling over the button is not an activation. Real failures show **Retry music** rather than retrying on later page gestures. The player retains explicit controls and live status; without JavaScript, a direct MP3 link replaces them. The music's original artist/license were not supplied; it remains outside the original theme/code MIT grant. [Media provenance](docs/showcase-artwork.json) and the [artwork/audio notice](site/artwork-NOTICE.txt) record that boundary.

The **3 MiB all-file cap counts the music and every other deployed file**. The visible photograph keeps its **48 KiB allowance**. Version 0.7.0 explicitly adds **16 KiB for the eight new cards, identifiers and notices**, taking the other-asset limit from 256 to **272 KiB** and maximum non-audio assets to **320 KiB**. No licenses are excluded. The photo is locally hosted and lazy-loaded, not a request for the 5.5 MB original or an external image service. There is no video, WebGL, or runtime library dependency. **Pause motion** freezes scenery and clears transient wakes; reduced motion skips the descent. **Skip descent**, Escape, Tab, navigation, or scrolling also bypasses the opening. Without JavaScript, the page, photo and native creature reveals remain usable; the dynamic palette instead links to the README swatches.

The design essay distinguishes Solarized's designer rationale, maritime night-lookout guidance, a 2013 display-polarity study's abstract, and WCAG contrast guidance. None tests DeepSeaFoam or establishes universal comfort or eye-health benefits. See the [showcase architecture, motion lifecycle, artwork pipeline, and evidence limits](docs/SHOWCASE.md).

The 21 cards use local, lazy-loaded artwork: nineteen product marks and two clearly
documented original text identifiers for rofi and Nova Launcher, not invented
official logos. Existing artwork is preserved. Five added Simple Icons marks receive
only their metadata brand-color root fill; Godot's mark retains its **CC BY 4.0**
credit/license, distinct from the shared CC0 marks. GitHub Pages' dark mark has a
white backing. Three large new marks use lossless 144px WebP renderings, with their
SVG sources preserved outside the deployed site to protect the 3 MiB cap. Termux's
unmodified geometric mark retains its Commons PD-shape provenance.
[Pinned sources, hashes and derivations](docs/application-icons.json)
and [notices/licenses](site/icons/NOTICE.txt) record the boundaries. Product marks
belong to their owners; no endorsement is implied. Obsidian's
[brand guidelines](https://obsidian.md/brand) still apply to its unmodified mark.

## Download

**VS Code:** [Install DeepSeaFoam from the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=zanark.deepseafoam-theme).

The original theme files and generator code are now available under the [MIT license](licenses/MIT.txt). This is **not a blanket artwork license**: [scope and exclusions](LICENSE) preserve third-party marks, upstream notices, and the supplied blobfish's unresolved rights. Marketplace submission and approval are separate from GitHub release availability.

Version **0.5.1** packages that license without changing theme colors. Existing releases are not replaced. [Publication routes and current status](docs/PUBLISHING.md) distinguish downloadable files, submitted listings and approved directory entries.

Download packages from the [latest GitHub release](https://github.com/Zanark/DeepSeaFoam/releases/latest), or build **0.7.0** locally with `npm run package:release`. Published releases remain immutable. Monkeytype's [built-in preset PR #8421](https://github.com/monkeytypegame/monkeytype/pull/8421) is separate from its downloadable native share link:

| Asset | Intended use |
| --- | --- |
| `DeepSeaFoam-VSCode-<version>.vsix` | Installable Visual Studio Code extension |
| `DeepSeaFoam-Obsidian-<version>.zip` | Obsidian theme folder |
| `DeepSeaFoam-WindowsTerminal-<version>.json` | Windows Terminal scheme object |
| `DeepSeaFoam-VisualStudio-<version>.vstheme` | Visual Studio theme source for Color Theme Designer / VSIX packaging |
| `DeepSeaFoam-Firefox-<version>.zip` | Firefox static-theme source; permanent installation requires Mozilla signing |
| `DeepSeaFoam-Discord-<version>.theme.css` | Optional unofficial CSS for already-modified Discord clients |
| `DeepSeaFoam-BetterDiscord-<version>.theme.css` | Byte-identical Discord theme alias; install one, not both |
| `DeepSeaFoam-TelegramDesktop-<version>.tdesktop-theme` | Native colors-only Telegram Desktop theme |
| `DeepSeaFoam-Slack-<version>.txt` | Four-color string for Slack's native custom-theme controls |
| `DeepSeaFoam-Chromium-<version>.zip` | Extractable Chrome/Edge theme source for Load unpacked |
| `DeepSeaFoam-JetBrains-<version>.jar` | Resource-only theme plugin for JetBrains 2025.3+ |
| `DeepSeaFoam-SublimeText-<version>.sublime-color-scheme` | Sublime Text 4 editor/syntax color scheme |
| `DeepSeaFoam-Alacritty-<version>.toml` | Colors-only fragment imported into an existing Alacritty config |
| `DeepSeaFoam-Monkeytype-<version>.zip` | Native colors-only share payload, URL, install/restore guide and MIT license |
| `DeepSeaFoam-NotepadPlusPlus-<version>.xml` | Native Style Configurator theme |
| `DeepSeaFoam-Zsh-<version>.zip` | Dependency-free prompt, install/restore guide and license |
| `DeepSeaFoam-Rofi-<version>.rasi` | Native Rasi theme based on the default layout |
| `DeepSeaFoam-Xfce4Terminal-<version>.theme` | Native terminal color preset |
| `DeepSeaFoam-Termux-<version>.zip` | Native `colors.properties`, guide and license |
| `DeepSeaFoam-GitHubPages-<version>.zip` | Static HTML/CSS starter, optional Jekyll layout and guide |
| `DeepSeaFoam-Godot-<version>.tet` | Native script-editor syntax theme; not a game Theme resource |
| `DeepSeaFoam-NovaLauncher-<version>.zip` | **Manual** color reference and guide; not a Nova backup/import file |
| `DeepSeaFoam-<version>.zip` | Complete palette, documentation, generator, and all application exports |
| `DeepSeaFoam-Themes-LICENSE.txt` | MIT license for original theme files; retain with redistributed single-file exports |
| `SHA256SUMS.txt` | SHA-256 checksums for every release asset |

The showcase on `main` and GitHub Pages can advance independently of immutable source bundles. Website-only refinements do not require a palette version bump or replacement artifacts; **0.7.0 is a new native-export version**, not a palette-color change. Earlier releases and the historical Instagram campaign remain untouched.

## Supported applications

| Application | Export format | Scope |
| --- | --- | --- |
| [Visual Studio Code](targets/vscode/README.md) | Color-theme extension | Workbench, editor, syntax, terminal, diagnostics |
| [Visual Studio](targets/visual-studio/README.md) | `.vstheme` | Visual Studio 2022 editor categories plus Visual Studio 2026 semantic shell tokens |
| [Obsidian](targets/obsidian/README.md) | `manifest.json` + `theme.css` | Workspace chrome, editor, reading view, controls, graph |
| [Windows Terminal](targets/windows-terminal/README.md) | Color-scheme JSON | Terminal background, foreground, selection, cursor, ANSI colors |
| [Firefox](targets/firefox/README.md) | Static WebExtension theme | Browser chrome, tabs, fields, popups, sidebar, Firefox new-tab surface |
| [Discord / BetterDiscord](targets/discord/README.md) | `.theme.css` (unofficial) | BetterDiscord or Vencord CSS; not a stock Discord importer |
| [Telegram Desktop](targets/telegram/README.md) | `.tdesktop-theme` | Desktop navigation, chat/message surfaces, text and controls |
| [Slack](targets/slack/README.md) | Native custom-color preset | Only Slack's exposed theme controls, not a whole-client CSS replacement |
| [Chrome / Edge](targets/chromium/README.md) | Chromium theme manifest | Browser-owned chrome; no website injection or permissions |
| [JetBrains IDEs](targets/jetbrains/README.md) | Theme-only plugin | IDE chrome plus editor color scheme |
| [Sublime Text](targets/sublime-text/README.md) | `.sublime-color-scheme` | Editor and syntax; pair with the built-in Adaptive UI |
| [Alacritty](targets/alacritty/README.md) | TOML color fragment | Terminal, selection, cursor and the same higher-contrast ANSI palette |
| [Monkeytype](targets/monkeytype/README.md) | Native custom-theme share URL + JSON payload | Ten native color slots; no full-settings import, background or custom CSS replacement |
| [Notepad++](targets/notepad-plus-plus/README.md) | Native XML | Editor, 22 language lexers plus search results; chrome is separate |
| [Zsh](targets/zsh/README.md) | `.zsh-theme` | Prompt only; plain Zsh and optional Oh My Zsh |
| [rofi](targets/rofi/README.md) | `.rasi` | Default layout, text and normal/active/urgent selection states |
| [Xfce4 Terminal](targets/xfce4-terminal/README.md) | `[Scheme]` preset | Shared terminal/ANSI colors; not GTK chrome |
| [Termux](targets/termux/README.md) | `colors.properties` | Background, foreground, cursor and 16 ANSI colors; no selection key |
| [GitHub Pages](targets/github-pages/README.md) | HTML/CSS plus optional Jekyll layout | Your hosted site, not github.com or a remote-theme registration |
| [Godot Engine](targets/godot/README.md) | `.tet` | Built-in script editor; optional manual chrome, not game assets |
| [Nova Launcher](targets/nova-launcher/README.md) | **Manual** text/background/accent recipe | Version-dependent Android launcher controls; no backup or icon pack |

These are export files, not proof of runtime validation in every application version. Nothing in this repository installs a theme or modifies live application settings.

## Core interface palette

| Swatch | Semantic role | Value |
| --- | --- | --- |
| ![Near-black teal](docs/swatches/000f13.svg) | Base / recessed surface | `#000F13` |
| ![Deep blue-green](docs/swatches/001e26.svg) | Panel surface | `#001E26` |
| ![Vivid seafoam](docs/swatches/00a591.svg) | Primary accent | `#00A591` |
| ![Soft gray](docs/swatches/93a1a1.svg) | Primary text | `#93A1A1` |
| ![Distant gray](docs/swatches/839496.svg) | Secondary / faint text | `#839496` |
| ![Warm ivory](docs/swatches/eee8d5.svg) | Warm emphasis | `#EEE8D5` |
| ![Pale pearl](docs/swatches/fdf6e3.svg) | Light selection edge | `#FDF6E3` |
| ![Submerged slate](docs/swatches/586e75.svg) | Strong border | `#586E75` |
| ![Vivid green](docs/swatches/45d072.svg) | Document indicator | `#45D072` |
| ![Bright yellow](docs/swatches/ebe565.svg) | Warning indicator | `#EBE565` |
| ![Vivid rose](docs/swatches/e84a5f.svg) | Error indicator | `#E84A5F` |

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
| ![Symmetry guide](docs/swatches/00a59188.svg) | Symmetry guide | `#00A59188` |
| ![Brush cursor](docs/swatches/fdf6e3aa.svg) | Brush cursor | `#FDF6E3AA` |

## Higher-contrast terminals

Version **0.3.0** introduced a terminal-only extension inspired by the supplied **Solarized Dark Higher Contrast** scheme: brighter mist text, richer ANSI colors, warm whites, and an orange cursor. Windows Terminal, VS Code's integrated terminal and the new Alacritty export share these exact 19 values. The reference background `#001E27` is deliberately replaced by DeepSeaFoam's `#000F13`; the rest of the reference's terminal colors are preserved.

This terminal group remains **separate from the 27-value core UI palette**. Its 0.3.0 introduction left editor syntax, application chrome, diagnostics, and the core unchanged. Version 0.4.2 derives four core signals from selected terminal entries without changing the source group. **0.5.0 preserves all 19 colors and extends that same scheme to Alacritty**, mapping `purple` to its native `magenta` key.

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

Code editors and terminals require roles that SpriteCanvas never defined. The canonical source separates the retained Solarized **syntax heritage extension** from the **higher-contrast terminal extension**. The four heritage syntax colors stay unchanged in 0.4.2, while strings, keywords, numbers, and diagnostics mapped from the core inherit the vivid terminal-derived signals. `signalAdaptation` records each terminal source and its proportional shade scale; derived UI selection/error colors are recorded separately.

See [application mappings](docs/MAPPINGS.md) for the surface decisions, extension roles, source references and unsupported boundaries across all thirteen targets.

Run:

```powershell
npm run generate
npm test
npm run package:release
```

`generate` rebuilds the application exports and all core/terminal SVG swatches. `test` checks theme invariants, contrast pairs, swatches, generated freshness, the export and site contracts, and scene controllers including nautilus drift. `package:release` recreates **only** `dist\releases\<version>\` (currently `dist\releases\0.6.0\`), preserving sibling releases and unrelated `dist\instagram\` / historical deliverables. Its manual VS Code kit is under that version's `marketplace\vscode\` folder. It does not upload, publish, or replace existing remote assets.

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

DeepSeaFoam originated in [SpriteCanvas](https://github.com/Zanark/SpriteCanvas). SpriteCanvas remains the read-only reference for the original surface hierarchy, interaction recipes, overlays, and neutral previews. Its original black workspace and signal colors are historical provenance; the 0.2.0 base and later signal revisions do not alter that origin.

DeepSeaFoam is derived from [Solarized by Ethan Schoonover](https://ethanschoonover.com/solarized/). The retained heritage colors are identified explicitly in the canonical palette rather than silently restoring the full Solarized theme.

The project's photographic inspiration is [**Bay with Orange Seashore Under White and Gray Clouds**](https://www.pexels.com/photo/bay-with-orange-seashore-under-white-and-gray-clouds-8567869/) by [**JJ Perks**](https://www.pexels.com/@jj-perks-868548/) on Pexels. The [visible website panel](https://zanark.github.io/DeepSeaFoam/#photo-reference) shows its full composition as an **800 x 534, 47,570-byte WebP** with a credit and descriptive alternative text. It works without JavaScript; only following the source link loads the **7952 x 5304 original**. The preview is resized and lossy, not cropped or theme-filtered. This is visual inspiration, not a claim of palette sampling or photographer endorsement. [Reference metadata](docs/showcase-artwork.json) records both hashes, the offline [preparation script](scripts/prepare-photo.py), the [Pexels License](https://www.pexels.com/license/) and official use guidance. The photograph is not covered by the theme/code MIT grant.
