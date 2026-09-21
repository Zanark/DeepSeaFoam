# Application mappings

This document separates exact core mappings from application-specific design work. Property names are implementation details; semantic roles are the source of truth.

## Surface hierarchy

| Semantic surface | VS Code | Visual Studio | Obsidian | Windows Terminal | Firefox |
| --- | --- | --- | --- | --- | --- |
| Primary work area `#000000` | Editor, terminal, active tab, inputs | Code editor, output and command windows | Note editor and reading view | Terminal buffer | Selected tab, address field, new-tab surface |
| Surrounding panel `#001E26` | Activity bar, sidebars, panels, title/tab bars | Shell, tool windows, headers, tree views | Sidebars, ribbon, tabs, status, prompts, menus | Not separately exposed | Frame, toolbar, inactive tabs, popups, sidebar |
| Focus / active signal `#2AA198` | Focus border, active markers, links | Semantic accent, environment border | Focus outline, active navigation, links | ANSI cyan only | Active-tab line, focused field border, attention icons |
| Primary text `#93A1A1` | Ordinary labels and editor text | Shell, editor, and tool-window text | Ordinary note and chrome text | Foreground | Ordinary chrome text |
| Warm emphasis `#EEE8D5` | Active titles, headings, error-message text | Headers and selected text | Headings and active tabs | Bright white | Selected tab and focused-field text |

Windows Terminal exposes one text buffer rather than a content area surrounded by application panels. Its background therefore stays black; forcing the panel color into the buffer would invert the defining hierarchy.

## Interaction adaptations

| Role | Mapping |
| --- | --- |
| Primary action | Accent fill with black text where the host exposes button colors |
| Hover | Existing `#586E7533` overlay when alpha is supported |
| Focus | `#2AA198` border, outline, or tab line |
| Selected controls | Black fill with cyan foreground or outline |
| Text selection | Derived `#2AA19855`; this is intentionally not the original pale pixel-selection edge |
| Terminal selection | `#165651`, the opaque composite of `#2AA19888` over `#000000` |
| Error presentation | Warm text where a host separates text from state, with `#DC322F` borders, underlines, or icons |
| Shadows | Transparent black only |

## Syntax and ANSI extension

The original interface did not define language syntax or a 16-color terminal palette. These exports retain the following Solarized heritage values as an explicitly labeled extension:

| Extension role | Value | Current use |
| --- | --- | --- |
| Orange | `#CB4B16` | Preprocessor / regular-expression distinction |
| Magenta | `#D33682` | Special constants, escape characters, ANSI purple |
| Violet | `#6C71C4` | Properties, operators, brace level, bright ANSI purple |
| Blue | `#268BD2` | Types, tags, properties, ANSI blue |

Bright terminal variants reuse approved core or heritage colors rather than inventing a fluorescent ramp.

## Unsupported or host-controlled areas

- **VS Code:** extension webviews and contributed custom color tokens can remain independently styled.
- **Visual Studio:** extensions and version-specific feature tokens may fall back to the selected dark base theme.
- **Obsidian:** community plugins can ship independent CSS; authored inline colors remain document content.
- **Windows Terminal:** applications can emit fixed 24-bit RGB colors that bypass the ANSI palette.
- **Firefox:** websites and some operating-system title-bar surfaces are outside the static-theme API.

No export filters images, rewrites document data, or changes exported content.
