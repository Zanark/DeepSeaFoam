---
title: "Harbor Daylight"
description: "The adopted light companion: exact roles, provenance, interaction safeguards and scope."
---

# Harbor Daylight

[Visible palettes](../README.md) · [Full reference](PALETTE.md) · [Install / guide](GUIDE.md)

## Adoption and provenance

Harbor Daylight carries DeepSeaFoam's coastal hierarchy into daylight: warm background, cooler sea-glass structure, raised ivory paper and deep tidal ink. These are design intentions, not measured emotional or health effects. It is neither RGB inversion nor a Solarized Light import.

The supplied **2026-09-24 “Harbor Daylight: portfolio palette design and handoff”** originally authorized a portfolio-specific companion, not an upstream change. Its exact colors were selected by the implementing agent, not individually prescribed or visually approved by the user. **The subsequent explicit user request adopts those values into this repository** as a separate light companion. That adoption changes the original scope; it does not invent retrospective visual approval or copy the portfolio's deployment/test evidence to this website.

The original handoff remains read-only outside this repository. The reproducible public contract is now [`palette/harbor-daylight.json`](../palette/harbor-daylight.json), alongside the unchanged [dark source](../palette/deepseafoam.json). **This is a palette and HTML/CSS web study, not 21 new native light exports.** Existing dark targets, release artifacts and installed application settings are separate.

DeepSeaFoam's [SpriteCanvas and Solarized lineage](GUIDE.md#origin-attribution-and-rights) remains credited. Shared visual ideas do not make this companion a recreation of Solarized's CIELAB construction or a claim of perceptual symmetry.

## Exact role contract

There are **12 new opaque solids + 4 alpha derivations**. Paper also supplies button text; that alias is not a thirteenth solid. Do not merge paper with surface, heading with body text, or any of these daylight roles with dark warm emphasis.

| Token | Value | Intended role |
| --- | --- | --- |
| `background` | `#F3F2E9` | Warm ambient page field |
| `surface` | `#E3ECE7` | Cooler structural panels |
| `paper` | `#FCFAF2` | Raised paper/sign; also filled-button ink |
| `text` | `#355451` | Ordinary reading ink |
| `muted` | `#536B66` | Secondary labels on checked opaque surfaces |
| `heading` | `#173D3A` | Strong emphasis; selected and hovered labels |
| `border` | `#6B857E` | Full-opacity structural edge, not ordinary text |
| `accent` | `#006F63` | Links, interactive outlines, primary-action fill |
| `accentHover` | `#00594F` | Darker accent action fill/foreground |
| `document` | `#247449` | Document indicator; explicit status adaptations need words/icons |
| `warning` | `#77600E` | Ochre caution ink, not decorative yellow fill |
| `error` | `#AD3E55` | Error ink accompanied by a message or recognizable indicator |

CSS eight-digit hex is **`#RRGGBBAA`**, with alpha last:

| Overlay | Value | Opacity | Boundary |
| --- | --- | --- | --- |
| Separator | `#6B857E66` | 102/255 = 40% | Decorative, not an essential control edge |
| Hover | `#6B857E1A` | 26/255 ≈ 10.196% | Translucent state fill, not `accentHover` |
| Selection | `#006F631F` | 31/255 ≈ 12.157% | Ordinary text selection with explicit heading ink |
| Shadow | `#00000014` | 20/255 ≈ 7.843% | Transparent black outside readable content |

The shadow's `14` is hexadecimal for decimal 20, **not 20%**. Composite overlays against their actual background; stacking, opacity, images and gradients can change the result. Interpolated/rendered colors do not create new named semantic solids or inherit a contrast guarantee.

### Shared roles, not additional light solids

| Role | Existing value | Limit |
| --- | --- | --- |
| Safety fill | `#EBE565` · dark warning | Small construction details or daylight sun, not general daylight text |
| Safety ink | `#000F13` · dark base | Dark lettering on a continuous safety-fill backing |
| Sunset | `#CB4B16` · syntax-heritage orange | Decorative dusk accent, not an error/warning taxonomy |
| Pearl | `#FDF6E3` · dark light edge | Decorative moon/stars, not assured daylight contrast |

These roles explain the portfolio handoff's reuse; they do not require importing its construction scene, music, artwork or other assets into DeepSeaFoam.

### Reuse on the web

Load the generated [`palette/harbor-daylight.css`](../palette/harbor-daylight.css) and
place `class="harbor-daylight"` on a wrapper. It defines the handoff's `--background`,
`--surface`, `--paper`, `--text`, `--muted`, `--heading`, `--border`, `--accent`,
`--accent-hover`, status, overlay and shared variables without recoloring the page.
Style your components with those roles. Use `.daylight-action` for filled actions so
their selected text gets the separate opaque-hover recipe. This file supplies
tokens and selection safeguards, not a complete component framework or native theme.

## Interaction safeguards

1. **Ordinary selection:** explicitly use heading `#173D3A` over selection `#006F631F` on page, panel or paper. Do not retain inherited muted, accent or status ink. Body ink also passes the documented pairs, but heading is the chosen stronger rule.
2. **Filled actions:** use paper `#FCFAF2` on accent `#006F63` and accent-hover `#00594F`. Their `::selection`, including selected child text, must keep paper ink on **opaque accent-hover**, not apply the ordinary translucent-selection recipe.
3. **Hover:** promote muted/status labels to heading (or separately checked body ink) on the translucent hover fill. Passing on an opaque surface does not justify retaining the same foreground after tinting.
4. **Borders:** solid `#6B857E` exceeds 3:1 on the three opaque surfaces, but fails 4.5:1 for ordinary text. The 40% separator is decorative; neither it nor the subtle hover/selection fill is the sole required focus, boundary or selected-control indicator. Check actual adjacent colors.
5. **Meaning and operation:** retain words/icons, underlined inline links, visible keyboard focus, opaque readable surfaces and usable zoom/reduced-motion/no-JavaScript behavior. Color alone must not carry status or selection meaning.

### Specific contrast evidence, not certification

The original handoff uses W3C sRGB relative luminance and normal source-over compositing, rounded to 8-bit channels before calculating documented overlay pairs. The figures below describe those exact pairs, not a blanket accessibility or browser-validation claim. Threshold comparisons must use unrounded values.

| Pair | Approximate ratio | Consequence |
| --- | ---: | --- |
| Body on panel | 6.862:1 | Ordinary text pair passes 4.5:1 |
| Muted on panel | 4.756:1 | Passes, with limited reserve |
| Solid border on panel | 3.298:1 | Structural 3:1 pair passes; ordinary text does not |
| Paper on accent / accent-hover | 5.818:1 / 7.906:1 | Checked filled-button and selected-button ink |
| Heading on selected panel `#C7DDD7` | 8.358:1 | Chosen selection foreground |
| Muted on selected panel | 4.028:1 | Inherited muted selection fails 4.5:1 |
| Heading on hovered panel `#D7E1DC` | 8.891:1 | Checked hover foreground |
| Muted / document / error on hovered panel | 4.284:1 / 4.277:1 / 4.363:1 | Inherited secondary/status ink fails 4.5:1 |
| Border against hovered panel | 2.971:1 | Opaque-panel boundary result does not transfer |

Reference: [W3C text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) and [G18 calculation method](https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html). These are the primary references identified in the supplied handoff, not a claim of a newly performed standards review.

Actual integration still needs token-parity, selected-button text, hover ink, focus adjacency, keyboard, zoom, responsive-layout and reduced-motion checks. Browser PNGs of simulated interface studies are useful examples, not native-port availability, physical-device coverage, universal WCAG certification, deployment receipts or user acceptance.
