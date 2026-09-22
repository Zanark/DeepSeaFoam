# DeepSeaFoam for Godot

Generated from the canonical palette, version **0.7.0**. Do not edit
generated files. [DeepSeaFoam.tet](DeepSeaFoam.tet) is a native **text-editor
syntax theme** for Godot's built-in script editor, source-checked against
**Godot 4.7.2-stable**. It is not a game/runtime `Theme.tres`, editor plugin,
project asset or replacement `editor_settings-*.tres`. Godot 3.x is unsupported;
other 4.x versions have not been runtime-tested and may expose different controls.

## Install / native import

If using the versioned release asset, save a copy as `DeepSeaFoam.tet` in a
new download directory first. Godot derives the imported theme name from that
filename; the steps below assume the canonical name, not the release suffix.

1. Record **Editor -> Editor Settings -> Text Editor -> Theme -> Color Theme**
   (`text_editor/theme/color_theme`). In the **Script** workspace, use its
   **File -> Theme -> Save Theme As...** to back up the current syntax colors to a
   new, uniquely named `.tet`, especially if using Custom or modified colors.
   Saving inside the theme directory can select that backup's name; record the
   original selection first. Back up any pre-existing `DeepSeaFoam.tet` too:
   the native importer copies over a same-named theme.
2. In that Script workspace's File menu, select **Theme -> Import Theme...** and
   choose the downloaded `DeepSeaFoam.tet`. Import copies and immediately selects
   the theme. It changes only text-editor highlighting colors and the theme name,
   not shortcuts, fonts, layouts, project settings, scripts or media.
3. Verify **Editor Settings -> Text Editor -> Theme -> Color Theme** now says
   **DeepSeaFoam**. Some highlighting controls require **Advanced Settings**.
   Keep your preferred current-line, safe-line-number, whitespace, syntax
   highlighter and other display toggles; importing colors does not enable them.

Alternative: with Godot closed, copy only the `.tet` into
`%APPDATA%\Godot\text_editor_themes\`, reopen the editor and choose DeepSeaFoam
in Color Theme. Self-contained/Steam installations use
`editor_data\text_editor_themes\` beside the executable instead. Native import
is preferable when your configuration directory differs. Do not copy this file
into a project or replace the full editor-settings resource.

## Exact format and mapping

The `.tet` is a Godot **ConfigFile**, with one `[color_theme]` section and
**49 recognized color keys**, not a resource header. Values are **quoted HTML hex
strings**, `"#RRGGBB"` or `"#RRGGBBAA"`. Godot validates HTML colors, calls
`Color::html`, and preserves last-byte alpha; no `Color(...)` constructors,
ARGB byte-swapping or opaque substitution is needed. Subkeys such as
`gdscript/annotation_color` remain keys in this same section, not new sections.
The loader prefixes each key with `text_editor/theme/highlighting/`, ignores
unrecognized/non-color settings, and leaves omitted settings at their previous
values. This export supplies every color in the checked native save contract.

Base/panel/ordinary/faint/warm text stay distinct. Shared editor syntax semantics
are retained: keywords/control flow use document green, strings use seafoam,
numbers use warning yellow, functions use warm text and types use heritage blue.
NodePath strings and StringName literals also use the string accent; node
references retain accent. String placeholders stay heritage magenta, while
operators, member variables and annotations retain heritage violet. Godot's
highlighter decides which tokens share each native slot; there is no independent
constant-color key in this format. These are not terminal ANSI colors.
Safe-line/notice markers stay document green. Caret uses lightEdge;
breakpoints/brace mismatch use error; execution uses warning. Selection keeps
the canonical RGBA overlay, as do hover, guide and separator colors. Error lines
use the derived error tint; warning lines use a matching 15% warning tint.

All keys below are relative to `text_editor/theme/highlighting/`:

| Native key | Generated color |
| --- | --- |
| `background_color` | `#000F13` |
| `base_type_color` | `#268BD2` |
| `bookmark_color` | `#00A591` |
| `brace_mismatch_color` | `#E84A5F` |
| `breakpoint_color` | `#E84A5F` |
| `caret_background_color` | `#000F13` |
| `caret_color` | `#FDF6E3` |
| `code_folding_color` | `#586E75` |
| `comment_color` | `#839496` |
| `comment_markers/critical_color` | `#E84A5F` |
| `comment_markers/notice_color` | `#45D072` |
| `comment_markers/warning_color` | `#EBE565` |
| `completion_background_color` | `#001E26` |
| `completion_existing_color` | `#586E7533` |
| `completion_font_color` | `#93A1A1` |
| `completion_scroll_color` | `#586E75` |
| `completion_scroll_hovered_color` | `#00A591` |
| `completion_selected_color` | `#00A59126` |
| `control_flow_keyword_color` | `#45D072` |
| `current_line_color` | `#001E26` |
| `doc_comment_color` | `#93A1A1` |
| `engine_type_color` | `#268BD2` |
| `executing_line_color` | `#EBE565` |
| `folded_code_region_color` | `#586E7533` |
| `function_color` | `#EEE8D5` |
| `gdscript/annotation_color` | `#6C71C4` |
| `gdscript/function_definition_color` | `#EEE8D5` |
| `gdscript/global_function_color` | `#268BD2` |
| `gdscript/node_path_color` | `#00A591` |
| `gdscript/node_reference_color` | `#00A591` |
| `gdscript/string_name_color` | `#00A591` |
| `keyword_color` | `#45D072` |
| `line_length_guideline_color` | `#586E7566` |
| `line_number_color` | `#839496` |
| `mark_color` | `#E84A5F26` |
| `member_variable_color` | `#6C71C4` |
| `number_color` | `#EBE565` |
| `safe_line_number_color` | `#45D072` |
| `search_result_border_color` | `#00A59188` |
| `search_result_color` | `#00A59126` |
| `selection_color` | `#00A59126` |
| `string_color` | `#00A591` |
| `string_placeholder_color` | `#D33682` |
| `symbol_color` | `#6C71C4` |
| `text_color` | `#93A1A1` |
| `text_selected_color` | `#EEE8D5` |
| `user_type_color` | `#268BD2` |
| `warning_color` | `#EBE56526` |
| `word_highlighted_color` | `#586E7533` |

## Optional editor chrome (manual, not part of the import)

The `.tet` does **not** set dock, inspector, toolbar, 2D/3D viewport or game
colors. For a closer surrounding interface, record the old values and change
only these controls under **Editor Settings -> Interface -> Theme**:

| Godot 4.7 setting | Suggested value |
| --- | --- |
| Follow System Theme (`interface/theme/follow_system_theme`) | Off |
| Use System Accent Color (`interface/theme/use_system_accent_color`) | Off |
| Color Preset (`interface/theme/color_preset`) | Custom |
| Base Color (`interface/theme/base_color`) | panel `#001E26` |
| Accent Color (`interface/theme/accent_color`) | `#00A591` |
| Contrast (`interface/theme/contrast`) | 0.30 |
| Icon And Font Color (`interface/theme/icon_and_font_color`) | Light |

Set the system-follow options off before choosing Custom; otherwise system
settings can override the base/accent. **Light** means light ink/icons on this
dark background, not a light editor. Godot derives its other chrome colors from
these inputs, its selected Style and its own theme logic: they are **not a
pixel-exact mapping** of all eleven DeepSeaFoam solids. In 4.7 the setting is
`color_preset`, not the older `preset`. Leave Style, spacing, fonts and other
preferences alone. An existing custom editor theme resource may override some
colors; it is not removed or replaced by this export.

## Remove / restore

Choose the previous text-editor Color Theme, or import the uniquely named backup
`.tet` to restore your exact previous custom syntax colors. Restore the recorded
chrome values separately if you changed them. Close Godot and remove only the
installed `DeepSeaFoam.tet` (or restore its same-named backup). Do not reset
editor settings or delete project files. A backup saved under a new name restores
the colors but will display that backup's name as the selected theme.

## Sources and validation limits

Pinned Godot **4.7.2-stable**, commit `ed1daf0bf001b61586d9930840f2f1394092c079`:

- [Native import, safe theme-name checks and save format](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/editor/script/script_editor_plugin.cpp#L852-L916).
- [Actual loader: section, recognized-key checks and HTML parsing](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/editor/themes/editor_theme_manager.cpp#L448-L479).
- [All 49 saved/registered highlighting colors](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/editor/settings/editor_settings.cpp#L1867-L1919).
- [RGB/RGBA HTML parsing and validity](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/core/math/color.cpp#L331-L393).
- [Theme directory and self-contained configuration](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/editor/file_system/editor_paths.cpp).
- [Chrome settings and source-derived colors](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/editor/themes/editor_theme_manager.cpp#L240-L383)
  and [official EditorSettings reference](https://github.com/godotengine/godot/blob/ed1daf0bf001b61586d9930840f2f1394092c079/doc/classes/EditorSettings.xml).
- [Official syntax-theme install instructions](https://github.com/godotengine/godot-syntax-themes/blob/f1abd1deb6ce51bb190d26ba2cd3c58c6fa6ccb6/README.md).

Offline tests validate the complete key set, ConfigFile string subset, RGBA
encoding, mappings, supplied-palette propagation, determinism and nonmutation.
**No Godot engine import or visual validation is claimed.** No engine/application
was installed, launched or configured. Actual rendering still depends on the
selected syntax highlighter, Godot version and user settings; this is not an
Asset Library listing or a game UI theme.

Original theme files are MIT-licensed; retain the accompanying [LICENSE](LICENSE).
The separate [Solarized syntax heritage](https://ethanschoonover.com/solarized/)
is retained deliberately.
