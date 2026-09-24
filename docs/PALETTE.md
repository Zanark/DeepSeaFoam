# DeepSeaFoam color reference

Generated from the [dark source](../palette/deepseafoam.json) and [Harbor Daylight source](../palette/harbor-daylight.json).
The dark inventory remains 27 core values plus 19 independent terminal values.
Harbor Daylight adds 12 solids and 4 overlays; it does not recolor existing native exports.
See [light-role guidance](HARBOR-DAYLIGHT.md), [application mappings](MAPPINGS.md) and the [project guide](GUIDE.md).
All eight-digit values use alpha-last RGBA. Overlay swatches below use a neutral checkerboard, not a contrast guarantee.

## Core interface palette

| Swatch | Role | Value |
| --- | --- | --- |
| ![Near-black teal workspace and recessed surface](swatches/000f13.svg) | Near-black teal workspace and recessed surface | `#000F13` |
| ![Headers, toolbars, and surrounding panels](swatches/001e26.svg) | Headers, toolbars, and surrounding panels | `#001E26` |
| ![Rich seafoam interaction, focus, and active outline](swatches/00a591.svg) | Rich seafoam interaction, focus, and active outline | `#00A591` |
| ![Primary text and primary-action hover](swatches/93a1a1.svg) | Primary text and primary-action hover | `#93A1A1` |
| ![Genuinely lower-emphasis labels and markers](swatches/839496.svg) | Genuinely lower-emphasis labels and markers | `#839496` |
| ![Warm emphasis, headings, and notices](swatches/eee8d5.svg) | Warm emphasis, headings, and notices | `#EEE8D5` |
| ![Precise light selection edge](swatches/fdf6e3.svg) | Precise light selection edge | `#FDF6E3` |
| ![Strong structural border](swatches/586e75.svg) | Strong structural border | `#586E75` |
| ![Vivid green document indicator](swatches/45d072.svg) | Vivid green document indicator | `#45D072` |
| ![Bright yellow warning indicator](swatches/ebe565.svg) | Bright yellow warning indicator | `#EBE565` |
| ![Vivid rose error boundary and indicator](swatches/e84a5f.svg) | Vivid rose error boundary and indicator | `#E84A5F` |

## Harbor Daylight

| Swatch | Role | Value |
| --- | --- | --- |
| ![Warm limestone page background](light-swatches/f3f2e9.svg) | Warm limestone page background | `#F3F2E9` |
| ![Sea-glass panels and structure](light-swatches/e3ece7.svg) | Sea-glass panels and structure | `#E3ECE7` |
| ![Raised paper and filled-action text](light-swatches/fcfaf2.svg) | Raised paper and filled-action text | `#FCFAF2` |
| ![Deep sea-slate body text](light-swatches/355451.svg) | Deep sea-slate body text | `#355451` |
| ![Readable secondary ink](light-swatches/536b66.svg) | Readable secondary ink | `#536B66` |
| ![Tidal headings and selected text](light-swatches/173d3a.svg) | Tidal headings and selected text | `#173D3A` |
| ![Solid structural edge, not text](light-swatches/6b857e.svg) | Solid structural edge, not text | `#6B857E` |
| ![Daylight seafoam interaction](light-swatches/006f63.svg) | Daylight seafoam interaction | `#006F63` |
| ![Deeper kelp action hover](light-swatches/00594f.svg) | Deeper kelp action hover | `#00594F` |
| ![Labeled document indicator](light-swatches/247449.svg) | Labeled document indicator | `#247449` |
| ![Ochre caution ink](light-swatches/77600e.svg) | Ochre caution ink | `#77600E` |
| ![Berry error ink](light-swatches/ad3e55.svg) | Berry error ink | `#AD3E55` |

## Daylight overlays

| Swatch | Role | Value |
| --- | --- | --- |
| ![Decorative separator, 40% alpha](light-swatches/6b857e66.svg) | Decorative separator, 40% alpha | `#6B857E66` |
| ![Hover wash; use heading ink](light-swatches/6b857e1a.svg) | Hover wash; use heading ink | `#6B857E1A` |
| ![Text selection; use heading ink](light-swatches/006f631f.svg) | Text selection; use heading ink | `#006F631F` |
| ![Transparent black shadow](light-swatches/00000014.svg) | Transparent black shadow | `#00000014` |

Button text reuses paper. Shared safety fill/ink, sunset and pearl reference dark warning/base, heritage orange and light edge.
Ordinary selection and hovered labels use heading ink. Filled-action selection keeps paper ink on the opaque accent-hover fill.

## Transparent overlays

| Swatch | Role | Value |
| --- | --- | --- |
| ![Quiet structural separation](swatches/586e7566.svg) | Quiet structural separation | `#586E7566` |
| ![Subtle interaction acknowledgement](swatches/586e7533.svg) | Subtle interaction acknowledgement | `#586E7533` |
| ![Soft shadow](swatches/00000066.svg) | Soft shadow | `#00000066` |
| ![Strong shadow](swatches/000000cc.svg) | Strong shadow | `#000000CC` |
| ![Modal backdrop](swatches/000000b8.svg) | Modal backdrop | `#000000B8` |
| ![Faint pixel grid](swatches/002b3630.svg) | Faint pixel grid | `#002B3630` |
| ![Symmetry guide](swatches/00a59188.svg) | Symmetry guide | `#00A59188` |
| ![Brush cursor](swatches/fdf6e3aa.svg) | Brush cursor | `#FDF6E3AA` |

## Preview-only neutrals

These are preview materials, not the light companion.

| Swatch | Role | Value |
| --- | --- | --- |
| ![Main checkerboard light square](swatches/d0d1c9.svg) | Main checkerboard light square | `#D0D1C9` |
| ![Main checkerboard dark square](swatches/b2b5ae.svg) | Main checkerboard dark square | `#B2B5AE` |
| ![Navigator preview shade one](swatches/292e33.svg) | Navigator preview shade one | `#292E33` |
| ![Navigator preview shade two](swatches/30363b.svg) | Navigator preview shade two | `#30363B` |
| ![Comparison preview shade one](swatches/30373a.svg) | Comparison preview shade one | `#30373A` |
| ![Comparison preview shade two](swatches/394143.svg) | Comparison preview shade two | `#394143` |
| ![Frame-thumbnail background](swatches/343b40.svg) | Frame-thumbnail background | `#343B40` |
| ![Layer-thumbnail background](swatches/191d22.svg) | Layer-thumbnail background | `#191D22` |

## Higher-contrast terminals

These retain their supplied non-background values. The workspace stays `#000F13`.

| Swatch | Role | Value |
| --- | --- | --- |
| ![Terminal foreground](terminal-swatches/9cc2c3.svg) | Terminal foreground | `#9CC2C3` |
| ![Terminal cursor](terminal-swatches/f34b00.svg) | Terminal cursor | `#F34B00` |
| ![Terminal selection](terminal-swatches/003748.svg) | Terminal selection | `#003748` |
| ![ANSI black](terminal-swatches/002831.svg) | ANSI black | `#002831` |
| ![ANSI red](terminal-swatches/f54f65.svg) | ANSI red | `#F54F65` |
| ![ANSI green](terminal-swatches/6cbe6c.svg) | ANSI green | `#6CBE6C` |
| ![ANSI yellow](terminal-swatches/edae29.svg) | ANSI yellow | `#EDAE29` |
| ![ANSI blue](terminal-swatches/2176c7.svg) | ANSI blue | `#2176C7` |
| ![ANSI magenta](terminal-swatches/c61c6f.svg) | ANSI magenta | `#C61C6F` |
| ![ANSI cyan](terminal-swatches/259286.svg) | ANSI cyan | `#259286` |
| ![ANSI white](terminal-swatches/eae3cb.svg) | ANSI white | `#EAE3CB` |
| ![ANSI bright black](terminal-swatches/006488.svg) | ANSI bright black | `#006488` |
| ![ANSI bright red](terminal-swatches/f5858c.svg) | ANSI bright red | `#F5858C` |
| ![ANSI bright green](terminal-swatches/51ef84.svg) | ANSI bright green | `#51EF84` |
| ![ANSI bright yellow](terminal-swatches/fff96e.svg) | ANSI bright yellow | `#FFF96E` |
| ![ANSI bright blue](terminal-swatches/178ec8.svg) | ANSI bright blue | `#178EC8` |
| ![ANSI bright magenta](terminal-swatches/e24d8e.svg) | ANSI bright magenta | `#E24D8E` |
| ![ANSI bright cyan](terminal-swatches/00b39e.svg) | ANSI bright cyan | `#00B39E` |
| ![ANSI bright white](terminal-swatches/fcf4dc.svg) | ANSI bright white | `#FCF4DC` |

## Syntax heritage

Four retained Solarized extensions; not daylight text roles or terminal replacements.

| Swatch | Role | Value |
| --- | --- | --- |
| ![Syntax role not defined by the original UI](syntax-swatches/cb4b16.svg) | Syntax role not defined by the original UI | `#CB4B16` |
| ![Syntax role not defined by the original UI](syntax-swatches/d33682.svg) | Syntax role not defined by the original UI | `#D33682` |
| ![Syntax role not defined by the original UI](syntax-swatches/6c71c4.svg) | Syntax role not defined by the original UI | `#6C71C4` |
| ![Syntax role not defined by the original UI](syntax-swatches/268bd2.svg) | Syntax role not defined by the original UI | `#268BD2` |
