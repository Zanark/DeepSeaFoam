# DeepSeaFoam color reference

Generated from the [dark source](../palette/deepseafoam.json) and [Harbor Daylight source](../palette/harbor-daylight.json).
The dark inventory remains 27 core values plus 19 independent terminal values.
Harbor Daylight adds 12 solids and 4 overlays; it does not recolor existing native exports.
See [light-role guidance](HARBOR-DAYLIGHT.md), [application mappings](MAPPINGS.md) and the [project guide](GUIDE.md).
All eight-digit values use alpha-last RGBA. Overlay swatches below use a neutral checkerboard, not a contrast guarantee.

## Core interface palette

| Role | Color |
| --- | --- |
| Near-black teal workspace and recessed surface | ![Near-black teal workspace and recessed surface](swatches/000f13.svg) `#000F13` |
| Headers, toolbars, and surrounding panels | ![Headers, toolbars, and surrounding panels](swatches/001e26.svg) `#001E26` |
| Rich seafoam interaction, focus, and active outline | ![Rich seafoam interaction, focus, and active outline](swatches/00a591.svg) `#00A591` |
| Primary text and primary-action hover | ![Primary text and primary-action hover](swatches/93a1a1.svg) `#93A1A1` |
| Genuinely lower-emphasis labels and markers | ![Genuinely lower-emphasis labels and markers](swatches/839496.svg) `#839496` |
| Warm emphasis, headings, and notices | ![Warm emphasis, headings, and notices](swatches/eee8d5.svg) `#EEE8D5` |
| Precise light selection edge | ![Precise light selection edge](swatches/fdf6e3.svg) `#FDF6E3` |
| Strong structural border | ![Strong structural border](swatches/586e75.svg) `#586E75` |
| Vivid green document indicator | ![Vivid green document indicator](swatches/45d072.svg) `#45D072` |
| Bright yellow warning indicator | ![Bright yellow warning indicator](swatches/ebe565.svg) `#EBE565` |
| Vivid rose error boundary and indicator | ![Vivid rose error boundary and indicator](swatches/e84a5f.svg) `#E84A5F` |

## Harbor Daylight

| Role | Color |
| --- | --- |
| Warm limestone page background | ![Warm limestone page background](light-swatches/f3f2e9.svg) `#F3F2E9` |
| Sea-glass panels and structure | ![Sea-glass panels and structure](light-swatches/e3ece7.svg) `#E3ECE7` |
| Raised paper and filled-action text | ![Raised paper and filled-action text](light-swatches/fcfaf2.svg) `#FCFAF2` |
| Deep sea-slate body text | ![Deep sea-slate body text](light-swatches/355451.svg) `#355451` |
| Readable secondary ink | ![Readable secondary ink](light-swatches/536b66.svg) `#536B66` |
| Tidal headings and selected text | ![Tidal headings and selected text](light-swatches/173d3a.svg) `#173D3A` |
| Solid structural edge, not text | ![Solid structural edge, not text](light-swatches/6b857e.svg) `#6B857E` |
| Daylight seafoam interaction | ![Daylight seafoam interaction](light-swatches/006f63.svg) `#006F63` |
| Deeper kelp action hover | ![Deeper kelp action hover](light-swatches/00594f.svg) `#00594F` |
| Labeled document indicator | ![Labeled document indicator](light-swatches/247449.svg) `#247449` |
| Ochre caution ink | ![Ochre caution ink](light-swatches/77600e.svg) `#77600E` |
| Berry error ink | ![Berry error ink](light-swatches/ad3e55.svg) `#AD3E55` |

## Daylight overlays

| Role | Color |
| --- | --- |
| Decorative separator, 40% alpha | ![Decorative separator, 40% alpha](light-swatches/6b857e66.svg) `#6B857E66` |
| Hover wash; use heading ink | ![Hover wash; use heading ink](light-swatches/6b857e1a.svg) `#6B857E1A` |
| Text selection; use heading ink | ![Text selection; use heading ink](light-swatches/006f631f.svg) `#006F631F` |
| Transparent black shadow | ![Transparent black shadow](light-swatches/00000014.svg) `#00000014` |

Button text reuses paper. Shared safety fill/ink, sunset and pearl reference dark warning/base, heritage orange and light edge.
Ordinary selection and hovered labels use heading ink. Filled-action selection keeps paper ink on the opaque accent-hover fill.

## Transparent overlays

| Role | Color |
| --- | --- |
| Quiet structural separation | ![Quiet structural separation](swatches/586e7566.svg) `#586E7566` |
| Subtle interaction acknowledgement | ![Subtle interaction acknowledgement](swatches/586e7533.svg) `#586E7533` |
| Soft shadow | ![Soft shadow](swatches/00000066.svg) `#00000066` |
| Strong shadow | ![Strong shadow](swatches/000000cc.svg) `#000000CC` |
| Modal backdrop | ![Modal backdrop](swatches/000000b8.svg) `#000000B8` |
| Faint pixel grid | ![Faint pixel grid](swatches/002b3630.svg) `#002B3630` |
| Symmetry guide | ![Symmetry guide](swatches/00a59188.svg) `#00A59188` |
| Brush cursor | ![Brush cursor](swatches/fdf6e3aa.svg) `#FDF6E3AA` |

## Preview-only neutrals

These are preview materials, not the light companion.

| Role | Color |
| --- | --- |
| Main checkerboard light square | ![Main checkerboard light square](swatches/d0d1c9.svg) `#D0D1C9` |
| Main checkerboard dark square | ![Main checkerboard dark square](swatches/b2b5ae.svg) `#B2B5AE` |
| Navigator preview shade one | ![Navigator preview shade one](swatches/292e33.svg) `#292E33` |
| Navigator preview shade two | ![Navigator preview shade two](swatches/30363b.svg) `#30363B` |
| Comparison preview shade one | ![Comparison preview shade one](swatches/30373a.svg) `#30373A` |
| Comparison preview shade two | ![Comparison preview shade two](swatches/394143.svg) `#394143` |
| Frame-thumbnail background | ![Frame-thumbnail background](swatches/343b40.svg) `#343B40` |
| Layer-thumbnail background | ![Layer-thumbnail background](swatches/191d22.svg) `#191D22` |

## Higher-contrast terminals

These retain their supplied non-background values. The workspace stays <img src="swatches/000f13.svg" width="32" height="12" alt="Color swatch"> `#000F13`.

| Role | Color |
| --- | --- |
| Terminal foreground | ![Terminal foreground](terminal-swatches/9cc2c3.svg) `#9CC2C3` |
| Terminal cursor | ![Terminal cursor](terminal-swatches/f34b00.svg) `#F34B00` |
| Terminal selection | ![Terminal selection](terminal-swatches/003748.svg) `#003748` |
| ANSI black | ![ANSI black](terminal-swatches/002831.svg) `#002831` |
| ANSI red | ![ANSI red](terminal-swatches/f54f65.svg) `#F54F65` |
| ANSI green | ![ANSI green](terminal-swatches/6cbe6c.svg) `#6CBE6C` |
| ANSI yellow | ![ANSI yellow](terminal-swatches/edae29.svg) `#EDAE29` |
| ANSI blue | ![ANSI blue](terminal-swatches/2176c7.svg) `#2176C7` |
| ANSI magenta | ![ANSI magenta](terminal-swatches/c61c6f.svg) `#C61C6F` |
| ANSI cyan | ![ANSI cyan](terminal-swatches/259286.svg) `#259286` |
| ANSI white | ![ANSI white](terminal-swatches/eae3cb.svg) `#EAE3CB` |
| ANSI bright black | ![ANSI bright black](terminal-swatches/006488.svg) `#006488` |
| ANSI bright red | ![ANSI bright red](terminal-swatches/f5858c.svg) `#F5858C` |
| ANSI bright green | ![ANSI bright green](terminal-swatches/51ef84.svg) `#51EF84` |
| ANSI bright yellow | ![ANSI bright yellow](terminal-swatches/fff96e.svg) `#FFF96E` |
| ANSI bright blue | ![ANSI bright blue](terminal-swatches/178ec8.svg) `#178EC8` |
| ANSI bright magenta | ![ANSI bright magenta](terminal-swatches/e24d8e.svg) `#E24D8E` |
| ANSI bright cyan | ![ANSI bright cyan](terminal-swatches/00b39e.svg) `#00B39E` |
| ANSI bright white | ![ANSI bright white](terminal-swatches/fcf4dc.svg) `#FCF4DC` |

## Syntax heritage

Four retained Solarized extensions; not daylight text roles or terminal replacements.

| Role | Color |
| --- | --- |
| Syntax role not defined by the original UI | ![Syntax role not defined by the original UI](syntax-swatches/cb4b16.svg) `#CB4B16` |
| Syntax role not defined by the original UI | ![Syntax role not defined by the original UI](syntax-swatches/d33682.svg) `#D33682` |
| Syntax role not defined by the original UI | ![Syntax role not defined by the original UI](syntax-swatches/6c71c4.svg) `#6C71C4` |
| Syntax role not defined by the original UI | ![Syntax role not defined by the original UI](syntax-swatches/268bd2.svg) `#268BD2` |
