# Application mappings

This document separates exact core mappings from application-specific design work. Property names are implementation details; semantic roles are the source of truth.

Version **0.5.0** added seven application targets; **0.6.0** adds Monkeytype as the thirteenth. Neither changes any of the 27 core values, four syntax heritage colors or 19 terminal-extension colors. Installation, removal and format references live in each target's README. Thirteen targets do not mean thirteen identical or universally supported importers.

## Terminal-derived vivid signals (0.4.2)

Version 0.4.2 uses the approved higher-contrast terminal group as its direct reference: vivid terminal-style intensity, a little darker and richer, not pale or chalky pastels. Each core role has its own source and shade scale:

| Role | Terminal source (unchanged) | Scale | Current (0.4.2) |
| --- | --- | --- | --- |
| Accent / focus | `brightCyan` / `#00B39E` | 0.94 | `#00A591` vivid seafoam |
| Document indicator | `brightGreen` / `#51EF84` | 0.90 | `#45D072` vivid green |
| Warning | `brightYellow` / `#FFF96E` | 0.94 | `#EBE565` bright yellow |
| Error | `red` / `#F54F65` | 0.96 | `#E84A5F` vivid rose |

Convert each terminal source from sRGB to OKLCH, multiply **both lightness and chroma** by its role's scale, preserve hue, then convert back to sRGB and round to 8-bit channels. This proportional shade keeps the source's color character without mixing in white/gray or forcing equal lightness/chroma across roles. In [`palette/deepseafoam.json`](../palette/deepseafoam.json), `signalAdaptation` records `space: "oklch"`, `method: "proportional-shade"`, `sourceGroup: "terminal"`, and each role's `source` / `scale`.

The inventory remains **27 core values**. All seven neutral solids (base, panel, text, faint text, warm emphasis, light edge, border), the other overlays, and all preview neutrals stay unchanged. The symmetry guide follows the accent as `#00A59188`, retaining alpha `88`. SpriteCanvas remains a read-only origin, not a target of this tuning.

## Surface hierarchy

| Semantic surface | VS Code | Visual Studio | Obsidian | Windows Terminal | Firefox |
| --- | --- | --- | --- | --- | --- |
| Primary work area `#000F13` | Editor, terminal, active tab, inputs | Code editor, output and command windows | Note editor and reading view | Terminal buffer | Tab strip behind inactive tabs, address field, new-tab surface |
| Surrounding panel `#001E26` | Activity bar, sidebars, panels, title/tab bars | Shell, tool windows, headers, tree views | Sidebars, ribbon, tabs, status, prompts, menus | Not separately exposed | Selected tab, toolbar, popups, sidebar |
| Focus / active signal `#00A591` | Focus border, active markers, links | Semantic accent, environment border | Focus outline, active navigation, links | Cursor and ANSI use the terminal extension | Active-tab line, focused field border, attention icons |
| Primary text `#93A1A1` | Ordinary labels and editor text | Shell, editor, and tool-window text | Ordinary note and chrome text | `#9CC2C3` terminal foreground | Ordinary chrome text |
| Warm emphasis `#EEE8D5` | Active titles, headings, error-message text | Headers and selected text | Headings and active tabs | `#EAE3CB` / `#FCF4DC` terminal whites | Selected tab and focused-field text |

The 0.2.0 base is intentionally near-black teal rather than the original pure black. Windows Terminal exposes one text buffer rather than a content area surrounded by application panels. Its background therefore uses `#000F13`; forcing the lighter panel color into the buffer would invert the hierarchy.

Firefox deliberately places its inactive tabs on the near-black teal tab strip with `#839496` titles. The selected tab uses the blue-green panel surface, warm text, and the seafoam active line. This preserves the reference theme's quiet, background-blending tab behavior without importing its Solarized background colors.

## Interaction adaptations

| Role | Mapping |
| --- | --- |
| Primary action | Accent fill with near-black teal text where the host exposes button colors |
| Hover | Existing `#586E7533` overlay when alpha is supported |
| Focus | `#00A591` border, outline, or tab line |
| Selected controls | Near-black teal fill with cyan foreground or outline |
| UI text selection | Derived `#00A59126` (38/255 = 14.90% opacity); distinct from the original pale pixel-selection edge |
| Terminal selection | Exact `#003748` from the supplied higher-contrast reference, with `#9CC2C3` foreground |
| Error presentation | Warm text where a host separates text from state, with `#E84A5F` borders, underlines, or icons; dark text on opaque rose fills |
| Shadows | Transparent black only |

UI selection keeps its 14.90% opacity: `#00A59126` composites to `#002526` on the base and `#003236` on the panel. Ordinary `#93A1A1` text has approximately 6.08:1 and 5.20:1 contrast respectively, retaining at least 4.5:1 on both. The generator checks these pairs, terminal foreground against its background and selection, and cursor contrast. These checks do not establish universal accessibility compliance or contrast for every syntax/ANSI color emitted by applications.

VS Code uses `#00A5911A` (10.20% opacity) for incidental selection/word highlights, `#EBE56526` for the active find fill, and `#EBE5651A` for other find matches. Full-color borders keep the subdued fills distinguishable. Invalid-token errors use `#000F13` text over opaque `#E84A5F`.

Obsidian error surfaces use `#E84A5F26` and hover `#E84A5F2E`, not an opaque rose fill behind warm text. HSL/RGB aliases are generated from the canonical colors rather than hardcoded independently.

## Additional application mappings (0.5.0)

The pure emitters in [`scripts/chat-themes.mjs`](../scripts/chat-themes.mjs) and [`scripts/desktop-themes.mjs`](../scripts/desktop-themes.mjs) receive the same canonical color accessors as the original ports. All outputs remain generated by `scripts/generate.mjs`; do not edit target files by hand.

| Target | Workspace and structure | Signals and selection | Important boundary |
| --- | --- | --- | --- |
| [Discord](../targets/discord/README.md) | Base for chat/recesses, panel for navigation/raised surfaces; refreshed and legacy semantic variables | Accent controls with dark ink, warm links, native alpha overlays; green presence is a deliberate document-color adaptation | Optional unofficial CSS for modified clients, not native import; Discord terms and client-update risks apply |
| [Telegram Desktop](../targets/telegram/README.md) | Base window/list, panel menus/composer/incoming bubbles; outgoing bubbles use the panel selection composite | Explicit readable message metadata, warm service text, accent buttons, rose exceptions and document-green presence/delivery | Plain-text native desktop palette; existing wallpaper and compiled fallback surfaces remain host-controlled |
| [Slack](../targets/slack/README.md) | Panel supplies system-navigation color; other backgrounds are host-derived | Four slots: panel, accent, document/presence, error/notifications | Limited native preset, not independent chat/text/control colors; Dark mode and gradients are separate preferences |
| [Chrome / Edge](../targets/chromium/README.md) | Base frame/inactive tabs/address field, panel toolbar/active tab | Warm selected-tab text, mist ordinary text, accent NTP links | RGB arrays and finite Chromium keys only; Edge-specific controls and incognito appearance are not claimed |
| [JetBrains](../targets/jetbrains/README.md) | Islands Dark parent; base editor/recesses, panel surrounding UI | Core/syntax heritage roles, native UI and icon signals, opaque readable selection composites | Resource-only plugin for 2025.3+; language plugins and unlisted controls inherit fallback styling |
| [Sublime Text](../targets/sublime-text/README.md) | Base editor and panel line highlight/minihtml surfaces | Shared editor syntax roles plus Sublime refinements; native RGBA selection | Color scheme, not a full UI-theme replacement; Adaptive chrome derives its own colors |
| [Alacritty](../targets/alacritty/README.md) | Base terminal buffer; panel footer/line indicator | All 19 terminal-extension colors, including purple-to-magenta aliases; terminal colors also supply search/hints | Colors-only TOML, imported through `general.import`; existing config, opacity and application truecolor can override appearance |

Telegram UI selection is composited over the base or panel. Outgoing bubbles use the panel composite; selected outgoing bubbles apply one more selection layer. Message links and selected metadata use warm text where accent or faint text on the tinted fill would be insufficient. Service text has an explicit warm override so it does not inherit the dark foreground intended for accent-filled buttons. None of these adaptations changes the canonical source colors or imports the terminal's selection color into chat UI.

Discord, Telegram and Slack use document green for particular host presence/status meanings deliberately. This is a port decision, not evidence that the original SpriteCanvas palette defined a universal success-state system. Discord's native Nitro controls are documented separately as a manual approximation, not as an exact DeepSeaFoam importer.

The [target regressions](../scripts/test-targets.mjs) cover generation/nonmutation, palette propagation, supported format shapes, representative contrast pairs, resource references and install/removal documentation. The release builder parses XML before packaging. These boundaries do not constitute an installed-application visual audit.

## Monkeytype native colors (0.6.0)

[`addMonkeytypeTheme`](../scripts/monkeytype-theme.mjs) receives the same canonical
palette/accessors as the chat and desktop emitters. It emits the native share
payload object, an ordinary Base64/percent-encoded URL and a generated guide;
the main generator supplies the MIT license automatically.

| Array index | Native role | Canonical source | Value |
| --- | --- | --- | --- |
| 0 | `bg` | `solid.base` | `#000F13` |
| 1, 2 | `main`, `caret` | `solid.accent` | `#00A591` |
| 3 | `sub` | `solid.faintText` | `#839496` |
| 4 | `subAlt` | `solid.panel` | `#001E26` |
| 5 | `text` | `solid.warm` | `#EEE8D5` |
| 6, 7, 8, 9 | `error`, `errorExtra`, `colorfulError`, `colorfulErrorExtra` | `solid.error` | `#E84A5F` |

Warm ivory intentionally becomes normal typed text to meet upstream's near-white
or black text guidance. Normal typing uses `text` for correct letters and `sub`
for untyped letters; flip swaps them. Colorful mode substitutes `main` for
`text`, including when flipped; all four combinations retain the same base.
The four error slots share canonical rose, without adding darker error colors.
Native roles overlap other UI: main/sub also drive active/secondary controls and
subAlt supplies supporting surfaces. There are no separate document, warning,
border or light-edge slots. A host need not consume all eleven interface solids.

The URL decodes to **`{c: [ten colors]}`**, never a naked array or a partial
full-settings object. The native handler sets only `customThemeColors` and
`customTheme`; omitting `i`/`s`/`f` preserves separate background preferences.
Existing custom CSS remains outside this export and can affect appearance.
No login is required to use the link; account-saved presets are optional.
A partial settings import would reset unrelated omitted settings, so the
[guide](../targets/monkeytype/README.md) uses native sharing with explicit
custom-color backup and preset/custom restoration.

Pinned official sources: [array conversion](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/ts/controllers/theme-controller.ts#L25-L52),
[URL handler](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/ts/controllers/url-handler.tsx#L83-L140),
[typing rules](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/styles/test.scss#L115-L176),
[flip/colorful rules](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/styles/test.scss#L278-L302).

## Syntax heritage extension

The original interface did not define language syntax. Editor exports retain the following Solarized heritage values as an explicitly labeled extension:

| Extension role | Value | Current use |
| --- | --- | --- |
| Orange | `#CB4B16` | Preprocessor / regular-expression distinction |
| Magenta | `#D33682` | Special constants and escape characters |
| Violet | `#6C71C4` | Properties, operators and brace levels |
| Blue | `#268BD2` | Types, tags and properties |

These four extension colors are unchanged in 0.4.2. Syntax roles sourced from the core are not frozen: strings inherit vivid seafoam, keywords vivid green, and numbers bright yellow; diagnostics and other core-backed semantic roles inherit the corresponding terminal-derived signals.

## Higher-contrast terminal extension

Windows Terminal, VS Code's integrated terminal and Alacritty share the canonical `terminal` group: all 16 ANSI colors plus foreground, cursor and selection. They retain the supplied **Solarized Dark Higher Contrast** colors, with `#000F13` replacing the reference's `#001E27` background. See the [visible terminal swatches](../README.md#higher-contrast-terminals).

Introduced in 0.3.0, this extension supplies stronger bright variants, `#9CC2C3` text, warm `#EAE3CB` / `#FCF4DC` whites, and an orange `#F34B00` cursor. It remains a separate stored group even though 0.4.2 uses four entries as sources for derived core signals. **All 19 terminal colors and the Windows Terminal scheme content remain unchanged in 0.5.0.** UI selection is `#00A59126`; terminals retain opaque `#003748`. Alacritty uses its native `magenta` key for the source's `purple`, without changing the value.

## Unsupported or host-controlled areas

- **VS Code:** extension webviews and contributed custom color tokens can remain independently styled.
- **Visual Studio:** extensions and version-specific feature tokens may fall back to the selected dark base theme.
- **Obsidian:** community plugins can ship independent CSS; authored inline colors remain document content.
- **Windows Terminal:** applications can emit fixed 24-bit RGB colors that bypass the ANSI palette.
- **Firefox:** websites and some operating-system title-bar surfaces are outside the static-theme API.

No export filters images, rewrites document data, or changes exported content.
