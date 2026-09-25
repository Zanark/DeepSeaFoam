# DeepSeaFoam for Notepad++

Generated from the canonical palette, version **0.7.0**. Do not edit
the generated files. [DeepSeaFoam.xml](DeepSeaFoam.xml) is a native **Style
Configurator theme**, not a User Defined Language or a replacement configuration.
The source-checked support baseline is **Notepad++ 8.9.8 on Windows**. Older
versions are not certified; 8.9+ supplies default foreground/background for
missing language styles rather than inserting the light model's colors.

## Install without replacing settings

If using the versioned release asset, save a copy as `DeepSeaFoam.xml` in a
new download directory first. The theme chooser uses the XML filename; the steps
below assume this canonical name. Back up any same-named installed theme.

1. Record your current theme, Dark Mode/tone, font choices and Global override
   checkboxes. Back up your current theme XML (or `stylers.xml`) and any existing
   `DeepSeaFoam.xml` before replacing that same-named file. Save documents before
   restarting; do not delete session or backup files.
2. Copy only `DeepSeaFoam.xml` into `%APPDATA%\Notepad++\themes\`.
   For portable/local-configuration installs, use `themes\` beside the executable.
   For Cloud or `-settingsDir` configurations, use that active configuration's
   `themes\` directory. Create the directory if missing, but never overwrite
   `config.xml`, `stylers.xml`, `langs.xml` or an unrelated theme.
3. Restart Notepad++, then choose **Settings -> Preferences -> Dark Mode -> Dark
   Mode** if desired. Set the mode first: switching modes can restore a different
   remembered theme. This mode change is optional and separate from the XML.
4. Open **Settings -> Style Configurator -> Select theme -> DeepSeaFoam**, then
   **Save & Close**. Keep your desired font and size; this theme specifies no
   font family or size. It does style comments italic and search headings bold.
   Existing Global override checkboxes can suppress syntax colors: record them
   before optionally disabling their color overrides.

The built-in **Settings -> Import -> Import Style Themes...** is an alternative,
but attempts to copy to the executable's theme directory, which may require
elevation. The per-user copy route above avoids that requirement.

Font, user-defined extensions and custom keyword lists can be **theme-specific**.
The original theme retains your customizations; they are not automatically
merged into this one. Built-in extension/keyword definitions are left to Notepad++.
UDLs and plugin lexers keep their independent color definitions.

## Coverage and deliberate mappings

The export contains all native styles for **22 language lexers plus Search
result**, including separate `javascript.js` (ordinary JS files) and
`javascript` (embedded scripts): Bash, Batch, C, C++, C#, CSS, diff, Go, HTML,
Java, JavaScript, JSON, Makefile, PowerShell, properties, Python, Rust, SQL,
TypeScript, XML and YAML. Plain text uses Global Styles / Default Style.
Unlisted built-in languages receive host fallbacks, not bespoke syntax mappings.
No fictitious Markdown lexer or invented style IDs are included.

| Role | Mapping |
| --- | --- |
| Editor / surrounding gutters | base <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` / panel <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |
| Ordinary / comment / emphasized text | <img src="swatches/93a1a1.png" width="32" height="12" alt="Color swatch"> `#93A1A1` / <img src="swatches/839496.png" width="32" height="12" alt="Color swatch"> `#839496` / <img src="swatches/eee8d5.png" width="32" height="12" alt="Color swatch"> `#EEE8D5` |
| Keywords / strings | document <img src="swatches/45d072.png" width="32" height="12" alt="Color swatch"> `#45D072` / accent <img src="swatches/00a591.png" width="32" height="12" alt="Color swatch"> `#00A591` |
| Numbers and literal constants | warning <img src="swatches/ebe565.png" width="32" height="12" alt="Color swatch"> `#EBE565` |
| Types / escapes and markup entities | heritage blue <img src="swatches/268bd2.png" width="32" height="12" alt="Color swatch"> `#268BD2` / magenta <img src="swatches/d33682.png" width="32" height="12" alt="Color swatch"> `#D33682` |
| Operators and attributes / preprocessor and regex | heritage violet <img src="swatches/6c71c4.png" width="32" height="12" alt="Color swatch"> `#6C71C4` / orange <img src="swatches/cb4b16.png" width="32" height="12" alt="Color swatch"> `#CB4B16` |
| Selection / selected foreground | <img src="swatches/002526.png" width="32" height="12" alt="Color swatch"> `#002526` / <img src="swatches/eee8d5.png" width="32" height="12" alt="Color swatch"> `#EEE8D5` |
| Caret / current line / indent and edge guide | <img src="swatches/fdf6e3.png" width="32" height="12" alt="Color swatch"> `#FDF6E3` / <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` / <img src="swatches/23353a.png" width="32" height="12" alt="Color swatch"> `#23353A` |
| Saved / modified / invalid or deleted | <img src="swatches/45d072.png" width="32" height="12" alt="Color swatch"> `#45D072` / <img src="swatches/ebe565.png" width="32" height="12" alt="Color swatch"> `#EBE565` / <img src="swatches/e84a5f.png" width="32" height="12" alt="Color swatch"> `#E84A5F` |

Syntax follows the repository's shared editor mappings: document-green keywords,
seafoam strings, warning-yellow numbers/constants, warm functions and blue types.
JSON escapes and HTML/XML entities stay magenta, separate from numeric literals.
JSON boolean/null keywords and YAML boolean keywords are literal constants.
True character/rune literals in C/C++/C#/Java/Go/Rust use the constant color;
single-quoted strings in JavaScript, Python, Bash and PowerShell remain strings.
Search-result file headers and diff command headers retain accent; diff additions
retain document green rather than borrowing the string color.

XML colors are six-digit **RRGGBB without #**, not RGBA. Selection composites
<img src="swatches/00a59126.png" width="32" height="12" alt="Color swatch (alpha over checkerboard)"> `#00A59126` over base; search-result hits composite it over
panel (<img src="swatches/003236.png" width="32" height="12" alt="Color swatch"> `#003236`). Indent/edge guides composite the canonical separator.
The host applies its own indicator opacity (100/255 in the checked source) to
smart/find/tag/mark highlights; those styles deliberately contain the uncomposited
signal colors, avoiding a second alpha reduction. Five mark styles and both
light/dark tab-color groups are provided. Tab colors are subtle 15% tints on panel.

Current-line visibility/frame mode, change history, whitespace and search markers
remain governed by your existing preferences. To use the warm selected foreground,
optionally enable **Preferences -> Editing -> Apply custom color to selected text
foreground**. Otherwise Notepad++ preserves syntax foregrounds on the selection.
The XML does not toggle any of these preferences.

## Optional surrounding chrome (manual)

**This XML does not recolor all Notepad++ chrome.** Dark Mode has independent
tones; especially tab text/inactive tab backgrounds in Dark Mode need not follow
their similarly named XML styles. OS-owned file dialogs and plugin UI can differ.
For an optional closer match, record every previous value first, then use
**Preferences -> Dark Mode -> Customized**:

| Native tone control | Suggested color |
| --- | --- |
| Top / Main | <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |
| Active | <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` |
| Menu hot track | <img src="swatches/003236.png" width="32" height="12" alt="Color swatch"> `#003236` |
| Error | <img src="swatches/23252e.png" width="32" height="12" alt="Color swatch"> `#23252E` |
| Text / Darker text / Disabled text | <img src="swatches/93a1a1.png" width="32" height="12" alt="Color swatch"> `#93A1A1` / <img src="swatches/839496.png" width="32" height="12" alt="Color swatch"> `#839496` / <img src="swatches/586e75.png" width="32" height="12" alt="Color swatch"> `#586E75` |
| Link / Edge highlight | <img src="swatches/00a591.png" width="32" height="12" alt="Color swatch"> `#00A591` |
| Edge / Edge disabled | <img src="swatches/586e75.png" width="32" height="12" alt="Color swatch"> `#586E75` / <img src="swatches/233e46.png" width="32" height="12" alt="Color swatch"> `#233E46` |

These are manual suggestions, not settings applied by the theme. Leave unrelated
preferences, document contents and media untouched.

## Remove / restore

Choose your former theme in Style Configurator. Restore any separately changed
Dark Mode/tone, font, override or Editing options to the values you recorded.
After closing all Notepad++ instances, remove only the installed DeepSeaFoam XML,
or restore its same-named backup. Never delete `stylers.xml` or reset all
preferences to uninstall this theme.

## Source contract and validation limits

Pinned Notepad++ **v8.9.8**, commit `40f896e6f6c49a29b6ca3f559696dd786f40152d`:

- [Native lexer names, every emitted style ID/keyword class and global style names](https://github.com/notepad-plus-plus/notepad-plus-plus/blob/40f896e6f6c49a29b6ca3f559696dd786f40152d/PowerEditor/src/stylers.model.xml).
- [Native JSON boolean/null and YAML boolean keyword lists](https://github.com/notepad-plus-plus/notepad-plus-plus/blob/40f896e6f6c49a29b6ca3f559696dd786f40152d/PowerEditor/src/langs.model.xml).
- [XML loading and style attributes](https://github.com/notepad-plus-plus/notepad-plus-plus/blob/40f896e6f6c49a29b6ca3f559696dd786f40152d/PowerEditor/src/Parameters.cpp#L4953-L4999)
  and [color/font parsing](https://github.com/notepad-plus-plus/notepad-plus-plus/blob/40f896e6f6c49a29b6ca3f559696dd786f40152d/PowerEditor/src/Parameters.cpp#L5140-L5205).
- [Selections, caret, margins and change-history controls](https://github.com/notepad-plus-plus/notepad-plus-plus/blob/40f896e6f6c49a29b6ca3f559696dd786f40152d/PowerEditor/src/ScintillaComponent/ScintillaEditView.cpp#L3164-L3340).
- [Indicator alpha and under-text rendering](https://github.com/notepad-plus-plus/notepad-plus-plus/blob/40f896e6f6c49a29b6ca3f559696dd786f40152d/PowerEditor/src/ScintillaComponent/ScintillaEditView.cpp#L453-L473).
- Official manual, pinned at `7d0f743be24802c15e8424833adb7ea619901692`:
  [theme installation and model fallbacks](https://github.com/notepad-plus-plus/npp-usermanual/blob/7d0f743be24802c15e8424833adb7ea619901692/content/docs/themes.md),
  [Dark Mode and Style Configurator boundaries](https://github.com/notepad-plus-plus/npp-usermanual/blob/7d0f743be24802c15e8424833adb7ea619901692/content/docs/preferences.md#dark-mode).
  The published manual URL returned HTTP 403 during research; its official source
  was read instead.

Tests validate the complete emitted schema against pinned native-contract
fingerprints, mappings, palette propagation, determinism and nonmutation; an
independent XML parser checks well-formedness. **No Notepad++ runtime/visual
validation is claimed.** No application was installed or live settings modified.
The colors/design are original mappings with the separate
[Solarized syntax heritage](https://ethanschoonover.com/solarized/) retained.
Original theme files are MIT-licensed; retain the accompanying [LICENSE](LICENSE).
