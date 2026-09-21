# Application mappings

This document separates exact core mappings from application-specific design work. Property names are implementation details; semantic roles are the source of truth.

## Vibrant pastel correction (0.4.1)

The 0.4.1 correction makes the overly light 0.4.0 signals darker and richer: bright, saturated colors with pastel softness, not pale or chalky fills. Their semantic roles remain unchanged:

| Role | Original hue source (0.3.0) | Current (0.4.1) |
| --- | --- | --- |
| Accent / focus | `#2AA198` | `#28C0B5` seafoam |
| Document indicator | `#859900` | `#A0B256` kelp |
| Warning | `#B58900` | `#C9A244` amber |
| Error | `#DC322F` | `#E9897E` coral |

Each original 0.3.0 sRGB color is converted to OKLCH, its hue retained, and lightness/chroma set to **0.73 / 0.12**, rather than 0.4.0's **0.78 / 0.08**. Conversion back to in-gamut sRGB and rounding to 8-bit channels produces the canonical values above. All four remain lightened relative to the originals; this is not uniform desaturation, since seafoam now has slightly higher chroma than its original. Derivation metadata lives in [`palette/deepseafoam.json`](../palette/deepseafoam.json).

The inventory remains **27 core values**. All seven neutral solids (base, panel, text, faint text, warm emphasis, light edge, border), the other overlays, and all preview neutrals stay unchanged. The symmetry guide follows the accent as `#28C0B588`, retaining alpha `88`. SpriteCanvas remains a read-only origin, not a target of this correction.

## Surface hierarchy

| Semantic surface | VS Code | Visual Studio | Obsidian | Windows Terminal | Firefox |
| --- | --- | --- | --- | --- | --- |
| Primary work area `#000F13` | Editor, terminal, active tab, inputs | Code editor, output and command windows | Note editor and reading view | Terminal buffer | Tab strip behind inactive tabs, address field, new-tab surface |
| Surrounding panel `#001E26` | Activity bar, sidebars, panels, title/tab bars | Shell, tool windows, headers, tree views | Sidebars, ribbon, tabs, status, prompts, menus | Not separately exposed | Selected tab, toolbar, popups, sidebar |
| Focus / active signal `#28C0B5` | Focus border, active markers, links | Semantic accent, environment border | Focus outline, active navigation, links | Cursor and ANSI use the terminal extension | Active-tab line, focused field border, attention icons |
| Primary text `#93A1A1` | Ordinary labels and editor text | Shell, editor, and tool-window text | Ordinary note and chrome text | `#9CC2C3` terminal foreground | Ordinary chrome text |
| Warm emphasis `#EEE8D5` | Active titles, headings, error-message text | Headers and selected text | Headings and active tabs | `#EAE3CB` / `#FCF4DC` terminal whites | Selected tab and focused-field text |

The 0.2.0 base is intentionally near-black teal rather than the original pure black. Windows Terminal exposes one text buffer rather than a content area surrounded by application panels. Its background therefore uses `#000F13`; forcing the lighter panel color into the buffer would invert the hierarchy.

Firefox deliberately places its inactive tabs on the near-black teal tab strip with `#839496` titles. The selected tab uses the blue-green panel surface, warm text, and the seafoam active line. This preserves the reference theme's quiet, background-blending tab behavior without importing its Solarized background colors.

## Interaction adaptations

| Role | Mapping |
| --- | --- |
| Primary action | Accent fill with near-black teal text where the host exposes button colors |
| Hover | Existing `#586E7533` overlay when alpha is supported |
| Focus | `#28C0B5` border, outline, or tab line |
| Selected controls | Near-black teal fill with cyan foreground or outline |
| UI text selection | Derived `#28C0B526` (38/255 = 14.90% opacity); distinct from the original pale pixel-selection edge |
| Terminal selection | Exact `#003748` from the supplied higher-contrast reference, with `#9CC2C3` foreground |
| Error presentation | Warm text where a host separates text from state, with `#E9897E` borders, underlines, or icons; dark text on opaque coral fills |
| Shadows | Transparent black only |

UI selection keeps its 14.90% opacity: `#28C0B526` composites to `#06292B` on the base and `#06363B` on the panel. Ordinary `#93A1A1` text has approximately 5.78:1 and 4.91:1 contrast respectively, retaining at least 4.5:1 on both. The generator checks these pairs, terminal foreground against its background and selection, and cursor contrast. These checks do not establish universal accessibility compliance or contrast for every syntax/ANSI color emitted by applications.

VS Code uses `#28C0B51A` (10.20% opacity) for incidental selection/word highlights, `#C9A24426` for the active find fill, and `#C9A2441A` for other find matches. Full-color borders keep the subdued fills distinguishable. Invalid-token errors use `#000F13` text over opaque `#E9897E`.

Obsidian error surfaces use `#E9897E26` and hover `#E9897E2E`, not an opaque pastel fill behind warm text. HSL/RGB aliases are generated from the canonical colors rather than hardcoded independently.

## Syntax heritage extension

The original interface did not define language syntax. Editor exports retain the following Solarized heritage values as an explicitly labeled extension:

| Extension role | Value | Current use |
| --- | --- | --- |
| Orange | `#CB4B16` | Preprocessor / regular-expression distinction |
| Magenta | `#D33682` | Special constants and escape characters |
| Violet | `#6C71C4` | Properties, operators and brace levels |
| Blue | `#268BD2` | Types, tags and properties |

These four extension colors are unchanged in 0.4.1. Syntax roles sourced from the core are not frozen: strings inherit seafoam, keywords kelp, and numbers amber; diagnostics and other core-backed semantic roles inherit their corresponding richer pastels.

## Higher-contrast terminal extension

Windows Terminal and VS Code's integrated terminal share the canonical `terminal` group: all 16 ANSI colors plus foreground, cursor and selection. They retain the supplied **Solarized Dark Higher Contrast** colors, with `#000F13` replacing the reference's `#001E27` background. See the [visible terminal swatches](../README.md#higher-contrast-terminals).

Introduced in 0.3.0, this extension supplies stronger bright variants, `#9CC2C3` text, warm `#EAE3CB` / `#FCF4DC` whites, and an orange `#F34B00` cursor. It remains separate from editor syntax, the document indicator, and application diagnostics. **All 19 terminal colors, both terminals' `#000F13` backgrounds, and Windows Terminal scheme content are unchanged in 0.4.1.** UI selection is now `#28C0B526`; the terminal retains its own opaque `#003748` selection rather than the retired 0.2.0 composite.

## Unsupported or host-controlled areas

- **VS Code:** extension webviews and contributed custom color tokens can remain independently styled.
- **Visual Studio:** extensions and version-specific feature tokens may fall back to the selected dark base theme.
- **Obsidian:** community plugins can ship independent CSS; authored inline colors remain document content.
- **Windows Terminal:** applications can emit fixed 24-bit RGB colors that bypass the ANSI palette.
- **Firefox:** websites and some operating-system title-bar surfaces are outside the static-theme API.

No export filters images, rewrites document data, or changes exported content.
