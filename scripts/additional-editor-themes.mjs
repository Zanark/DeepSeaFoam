import { composite } from "./colors.mjs";

const nppCommit = "40f896e6f6c49a29b6ca3f559696dd786f40152d";
const godotCommit = "ed1daf0bf001b61586d9930840f2f1394092c079";
const nppSource = `https://github.com/notepad-plus-plus/notepad-plus-plus/blob/${nppCommit}`;
const godotSource = `https://github.com/godotengine/godot/blob/${godotCommit}`;
const nppManual = "https://github.com/notepad-plus-plus/npp-usermanual/blob/7d0f743be24802c15e8424833adb7ea619901692/content/docs";
const xml = value => String(value).replace(/[&<>"']/g, character =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[character]);

// Names, IDs and keyword classes are native Notepad++ 8.9.8 contracts, not TextMate scopes.
const userStyles = (start, count = 8, label = "USER KEYWORDS ", offset = 1, role = "keyword") =>
  Array.from({ length: count }, (_, index) =>
    [start + index, `${label}${index + 1}`, role, `substyle${index + offset}`]);
const cStyles = ({ preprocessor = false, raw, extra, character = "string" } = {}) => [
  ...(preprocessor ? [[9, "PREPROCESSOR", "preprocessor"],
    [23, "PREPROCESSOR COMMENT", "comment"], [24, "PREPROCESSOR COMMENT DOC", "docComment"]] : []),
  [11, "DEFAULT", "text"], [5, "INSTRUCTION WORD", "keyword", "instre1"],
  [16, "TYPE WORD", "type", "type1"], [4, "NUMBER", "number"],
  [6, "STRING", "string"], [7, "CHARACTER", character], [10, "OPERATOR", "operator"],
  [13, "VERBATIM", "string"], [14, "REGEX", "regex"], [1, "COMMENT", "comment"],
  [2, "COMMENT LINE", "comment"], [3, "COMMENT DOC", "docComment"],
  [15, "COMMENT LINE DOC", "docComment"], [17, "COMMENT DOC KEYWORD", "keyword"],
  [18, "COMMENT DOC KEYWORD ERROR", "error"],
  ...(raw ? [[20, raw, "string"]] : []), ...(extra ? [extra] : []), ...userStyles(128)
];
const markupStyles = [
  [0, "DEFAULT", "text"], [9, "COMMENT", "comment"], [5, "NUMBER", "number"],
  [6, "DOUBLE STRING", "string"], [7, "SINGLE STRING", "string"],
  [11, "TAG END", "type"], [2, "TAG UNKNOWN", "type"],
  [3, "ATTRIBUTE", "attribute"], [4, "ATTRIBUTE UNKNOWN", "attribute"],
  [21, "SGML DEFAULT", "text"], [23, "SGML 1ST PARAM", "attribute"],
  [24, "SGML DOUBLESTRING", "string"], [25, "SGML SIMPLESTRING", "string"],
  [31, "SGML BLOCK DEFAULT", "text"], [17, "CDATA", "string"], [10, "ENTITY", "escape"]
];
const lexers = [
  ["bash", "Bash", [
    [0, "DEFAULT", "text"], [1, "ERROR", "error"], [4, "INSTRUCTION WORD", "keyword", "instre1"],
    [3, "NUMBER", "number"], [5, "STRING", "string"], [6, "CHARACTER", "string"],
    [7, "OPERATOR", "operator"], [8, "IDENTIFIER", "text"], [9, "SCALAR", "attribute"],
    [2, "COMMENT LINE", "comment"], [10, "PARAM", "attribute"], [11, "BACKTICKS", "function"],
    [12, "HERE DELIM", "preprocessor"], [13, "HERE Q", "string"],
    ...userStyles(128, 4), ...userStyles(132, 4, "USER SCALAR ", 5, "attribute")
  ]],
  ["batch", "Batch", [
    [0, "DEFAULT", "text"], [1, "COMMENT", "comment"], [2, "KEYWORDS", "keyword", "instre1"],
    [3, "LABEL", "function"], [4, "HIDE SYMBOL", "operator"], [5, "COMMAND", "function"],
    [6, "VARIABLE", "attribute"], [7, "OPERATOR", "operator"], [8, "AFTER LABEL", "comment"]
  ]],
  ["c", "C", cStyles({ preprocessor: true, character: "constant" })],
  ["cpp", "C++", cStyles({ preprocessor: true, raw: "STRINGRAW", character: "constant" })],
  ["cs", "C#", cStyles({ preprocessor: true, character: "constant" })],
  ["css", "CSS", [
    [0, "DEFAULT", "text"], [1, "TAG", "type"], [2, "CLASS", "type"],
    [3, "PSEUDOCLASS", "attribute", "instre2"], [4, "UNKNOWN PSEUDOCLASS", "attribute"],
    [5, "OPERATOR", "operator"], [6, "IDENTIFIER", "attribute", "instre1"],
    [7, "UNKNOWN IDENTIFIER", "attribute"], [8, "VALUE", "string"], [9, "COMMENT", "comment"],
    [10, "ID", "type"], [11, "IMPORTANT", "preprocessor"], [12, "DIRECTIVE", "keyword"],
    [13, "DOUBLE STRING", "string"], [14, "SINGLE STRING", "string"], [16, "ATTRIBUTE", "attribute"],
    [18, "PSEUDOELEMENT", "type", "type3"], [20, "LEGACY PSEUDOELEMENT", "type", "type5"],
    [22, "MEDIA", "keyword"], [23, "VARIABLE", "attribute"]
  ]],
  ["diff", "diff file", [
    [0, "DEFAULT", "text"], [1, "COMMENT", "comment"], [2, "COMMAND", "signal"],
    [3, "HEADER", "heading"], [4, "POSITION", "type"], [5, "DELETED", "error"], [6, "ADDED", "added"]
  ]],
  ["go", "Go", cStyles({ preprocessor: true, raw: "STRING RAW", character: "constant",
    extra: [19, "PREDECLARED IDENTIFIERS", "type", "instre2"] })],
  ["html", "HTML", [
    ...markupStyles, [1, "TAG", "type", "instre1"], [22, "SGML COMMAND", "keyword", "instre2"],
    [19, "VALUE", "string"], ...userStyles(192, 4, "USER TAGS", 1, "type"),
    ...userStyles(196, 4, "USER ATTRIBUTES", 5, "attribute")
  ]],
  ["java", "Java", cStyles({ character: "constant" })],
  ["javascript", "JavaScript (embedded)", [
    [41, "DEFAULT", "text"], [45, "NUMBER", "number"], [46, "WORD", "text"],
    [47, "KEYWORD", "keyword", "instre1"], [48, "DOUBLE STRING", "string"],
    [49, "SINGLE STRING", "string"], [53, "TEMPLATE LIT. (CLIENT)", "string"],
    [68, "TEMPLATE LIT. (SERVER)", "string"], [50, "SYMBOLS", "operator"],
    [52, "REGEX", "regex"], [42, "COMMENT", "comment"], [43, "COMMENT LINE", "comment"],
    [44, "COMMENT DOC", "docComment"], ...userStyles(200)
  ]],
  ["javascript.js", "JavaScript", cStyles({ raw: "STRING RAW",
    extra: [19, "WINDOW INSTRUCTION", "type", "instre2"] })],
  ["json", "JSON", [
    [0, "DEFAULT", "text"], [1, "NUMBER", "number"], [2, "STRING", "string"],
    [3, "STRING EOL", "error"], [4, "PROPERTY NAME", "attribute"], [5, "ESCAPE SEQUENCE", "escape"],
    [6, "LINE COMMENT", "comment"], [7, "BLOCK COMMENT", "comment"], [8, "OPERATOR", "operator"],
    [9, "URI", "type"], [10, "COMPACT IRI", "type"], [11, "KEYWORD", "constant", "instre1"],
    [12, "LD KEYWORD", "keyword", "instre2"], [13, "ERROR", "error"]
  ]],
  ["makefile", "Makefile", [
    [0, "DEFAULT", "text"], [1, "COMMENT", "comment"], [2, "PREPROCESSOR", "preprocessor"],
    [3, "IDENTIFIER", "attribute"], [4, "OPERATOR", "operator"], [5, "TARGET", "function"],
    [9, "IDEOL", "error"]
  ]],
  ["powershell", "PowerShell", [
    [0, "DEFAULT", "text"], [1, "COMMENT", "comment"], [2, "STRING", "string"],
    [3, "CHARACTER", "string"], [4, "NUMBER", "number"], [5, "VARIABLE", "attribute"],
    [6, "OPERATOR", "operator"], [7, "IDENTIFIER", "text"],
    [8, "INSTRUCTION WORD", "keyword", "instre1"], [9, "CMDLET", "function", "instre2"],
    [10, "ALIAS", "function", "type1"], [11, "FUNCTION", "function", "type2"],
    [12, "USER KEYWORDS", "keyword", "type3"], [13, "COMMENT STREAM", "comment"],
    [14, "HERE STRING", "string"], [15, "HERE CHARACTER", "string"],
    [16, "COMMENT DOC KEYWORD", "keyword", "type4"]
  ]],
  ["props", "Properties file", [
    [0, "DEFAULT", "text"], [1, "COMMENT", "comment"], [2, "SECTION", "heading"],
    [3, "ASSIGNMENT", "operator"], [4, "DEFVAL", "string"], [5, "KEY", "attribute"]
  ]],
  ["python", "Python", [
    [0, "DEFAULT", "text"], [1, "COMMENT LINE", "comment"], [2, "NUMBER", "number"],
    [3, "STRING", "string"], [4, "CHARACTER", "string"], [5, "KEYWORDS", "keyword", "instre1"],
    [6, "TRIPLE", "string"], [7, "TRIPLE DOUBLE", "string"], [8, "CLASS NAME", "type"],
    [9, "DEF NAME", "function"], [10, "OPERATOR", "operator"], [11, "IDENTIFIER", "text"],
    [12, "COMMENT BLOCK", "comment"], [14, "BUILTINS", "type", "instre2"],
    [15, "DECORATOR", "attribute"], [20, "ATTRIBUTE", "attribute"], [16, "F STRING", "string"],
    [17, "F CHARACTER", "string"], [18, "F TRIPLE", "string"], [19, "F TRIPLEDOUBLE", "string"],
    ...userStyles(128)
  ]],
  ["rust", "Rust", [
    [32, "DEFAULT", "text"], [0, "WHITESPACE", "text"], [1, "BLOCK COMMENT", "comment"],
    [2, "LINE COMMENT", "comment"], [3, "BLOCK DOC COMMENT", "docComment"],
    [4, "LINE DOC COMMENT", "docComment"], [5, "NUMBER", "number"],
    [6, "KEYWORDS 1", "keyword", "instre1"], [7, "KEYWORDS 2", "keyword", "instre2"],
    [8, "KEYWORDS 3", "type", "type1"], [9, "KEYWORDS 4", "type", "type2"],
    [10, "KEYWORDS 5", "type", "type3"], [11, "KEYWORDS 6", "type", "type4"],
    [12, "KEYWORDS 7", "type", "type5"], [13, "REGULAR STRING", "string"],
    [14, "RAW STRING", "string"], [15, "CHARACTER", "constant"], [16, "OPERATOR", "operator"],
    [17, "IDENTIFIER", "text"], [18, "LIFETIME", "attribute"], [19, "MACRO", "preprocessor"],
    [20, "LEXICAL ERROR", "error"], [21, "BYTE STRING", "string"], [22, "RAW BYTE STRING", "string"],
    [23, "BYTE CHARACTER", "constant"], [24, "C STRING", "string"], [25, "RAW C STRING", "string"]
  ]],
  ["sql", "SQL", [
    [5, "KEYWORD", "keyword", "instre1"], [16, "USER1", "keyword", "instre2"],
    [19, "KEYWORD2", "type", "type3"], [4, "NUMBER", "number"], [6, "STRING", "string"],
    [7, "STRING2", "string"], [10, "OPERATOR", "operator"], [1, "COMMENT", "comment"],
    [2, "COMMENT LINE", "comment"], [3, "COMMENT DOC", "docComment"], [24, "Q OPERATOR", "string"]
  ]],
  ["typescript", "TypeScript", cStyles({ raw: "STRING RAW", extra: [19, "WINDOW INSTRUCTION", "type"] })],
  ["xml", "XML", [
    [12, "XML START", "keyword"], [13, "XML END", "keyword"], ...markupStyles,
    [1, "TAG", "type"], [22, "SGML COMMAND", "keyword", "instre1"],
    ...userStyles(192, 8, "USER ATTRIBUTES ", 1, "attribute")
  ]],
  ["yaml", "YAML", [
    [0, "DEFAULT", "text"], [2, "IDENTIFIER", "attribute"], [1, "COMMENT", "comment"],
    [3, "INSTRUCTION WORD", "constant", "instre1"], [4, "NUMBER", "number"],
    [5, "REFERENCE", "type"], [6, "DOCUMENT", "preprocessor"], [7, "TEXT", "string"], [8, "ERROR", "error"]
  ]],
  // Notepad++ expects its search-results lexer last.
  ["searchResult", "Search result", [
    [1, "Search Header", "heading"], [2, "File Header", "signal"], [3, "Line Number", "comment"],
    [4, "Hit Word", "heading"], [6, "Current line background colour", "text"]
  ]]
];

export function addAdditionalEditorThemes({ palette, add, solid, overlay, derived, heritage }) {
  const selection = composite(derived("textSelection"), solid("base"));
  const panelSelection = composite(derived("textSelection"), solid("panel"));
  const separator = composite(overlay("separator"), solid("base"));
  const syntax = {
    text: solid("text"), comment: solid("faintText"), docComment: solid("text"),
    keyword: solid("document"), type: heritage("blue"), number: solid("warning"),
    constant: solid("warning"), escape: heritage("magenta"), string: solid("accent"),
    signal: solid("accent"), added: solid("document"),
    operator: heritage("violet"), preprocessor: heritage("orange"),
    regex: heritage("orange"), function: solid("warm"), attribute: heritage("violet"),
    error: solid("error"), heading: solid("warm")
  };
  const attributes = values => Object.entries(values)
    .map(([key, value]) => `${key}="${xml(value)}"`).join(" ");
  const globalStyles = [
    ["Default Style", 32, solid("text"), solid("base")],
    ["Indent guideline style", 37, separator, solid("base")],
    ["Brace highlight style", 34, solid("accent"), solid("panel"), 1],
    ["Bad brace colour", 35, solid("error"), solid("base")],
    ["Current line background colour", 0, null, solid("panel")],
    ["Selected text colour", 0, solid("warm"), selection],
    ["Multi-selected text color", 0, null, selection],
    ["Caret colour", 0, solid("lightEdge")],
    ["Multi-edit carets color", 0, solid("accent")],
    ["Edge colour", 0, separator],
    ["Line number margin", 33, solid("faintText"), solid("panel")],
    ["Bookmark margin", 0, null, solid("panel")],
    ["Change History margin", 0, null, solid("panel")],
    ["Change History modified", 0, solid("warning"), solid("warning")],
    ["Change History revert modified", 0, heritage("orange"), heritage("orange")],
    ["Change History revert origin", 0, heritage("blue"), heritage("blue")],
    ["Change History saved", 0, solid("document"), solid("document")],
    ["Fold", 0, solid("panel"), solid("border")],
    ["Fold active", 0, solid("accent")],
    ["Fold margin", 0, solid("panel"), solid("panel")],
    ["White space symbol", 0, solid("border")],
    ["Smart Highlighting", 29, null, solid("accent")],
    ["Find Mark Style", 31, null, solid("warning")],
    ["Find status: Not found", 0, solid("error")],
    ["Find status: Message", 0, solid("accent")],
    ["Find status: Search end reached", 0, solid("warning")],
    ["Mark Style 1", 25, null, solid("accent")],
    ["Mark Style 2", 24, null, heritage("orange")],
    ["Mark Style 3", 23, null, solid("warning")],
    ["Mark Style 4", 22, null, heritage("violet")],
    ["Mark Style 5", 21, null, solid("document")],
    ["Incremental highlight all", 28, null, solid("accent")],
    ["Tags match highlighting", 27, null, solid("accent")],
    ["Tags attribute", 26, null, heritage("violet")],
    ["Active tab focused indicator", 0, solid("accent")],
    ["Active tab unfocused indicator", 0, solid("border")],
    ["Active tab text", 0, solid("warm")],
    ["Inactive tabs", 0, solid("faintText"), solid("panel")],
    ...["", "dark mode "].flatMap(mode =>
      [solid("warning"), solid("document"), heritage("blue"), heritage("orange"), heritage("magenta")]
        .map((color, index) => [`Tab color ${mode}${index + 1}`, 0, null, composite(`${color}26`, solid("panel"))])),
    ["URL hovered", 0, solid("accent")],
    ["Document map", 0, solid("accent"), solid("base")],
    ["EOL custom color", 0, solid("faintText")],
    ["Non-printing characters custom color", 0, solid("border")],
    ["Global override", 0, solid("text"), solid("base")]
  ];
  add("targets/notepad-plus-plus/DeepSeaFoam.xml", `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated from palette/deepseafoam.json. Notepad++ 8.9.8 native style names and IDs. -->
<NotepadPlus>
  <LexerStyles>
${lexers.map(([name, desc, styles]) => `    <LexerType ${attributes({ name, desc, ext: "" })}>
${styles.map(([styleID, styleName, role, keywordClass]) => {
    const background = name === "searchResult"
      ? (styleID === 4 ? panelSelection : solid("panel")) : solid("base");
    return `      <WordsStyle ${attributes({
      name: styleName, styleID, fgColor: syntax[role].slice(1), bgColor: background.slice(1),
      fontName: "", fontStyle: role === "comment" || role === "docComment" ? 2 : role === "heading" ? 1 : 0,
      fontSize: "", ...(keywordClass ? { keywordClass } : {})
    })} />`;
  }).join("\n")}
    </LexerType>`).join("\n")}
  </LexerStyles>
  <GlobalStyles>
${globalStyles.map(([name, styleID, foreground, background, fontStyle = 0]) =>
    `    <WidgetStyle ${attributes({
      name, styleID, ...(foreground ? { fgColor: foreground.slice(1) } : {}),
      ...(background ? { bgColor: background.slice(1) } : {}),
      ...([32, 33, 34, 35, 37].includes(styleID) || name === "Global override"
        ? { fontName: "", fontStyle, fontSize: "" } : {})
    })} />`).join("\n")}
  </GlobalStyles>
</NotepadPlus>
`);

  add("targets/notepad-plus-plus/README.md", `# ${palette.name} for Notepad++

Generated from the canonical palette, version **${palette.version}**. Do not edit
the generated files. [DeepSeaFoam.xml](DeepSeaFoam.xml) is a native **Style
Configurator theme**, not a User Defined Language or a replacement configuration.
The source-checked support baseline is **Notepad++ 8.9.8 on Windows**. Older
versions are not certified; 8.9+ supplies default foreground/background for
missing language styles rather than inserting the light model's colors.

## Install without replacing settings

If using the versioned release asset, save a copy as \`DeepSeaFoam.xml\` in a
new download directory first. The theme chooser uses the XML filename; the steps
below assume this canonical name. Back up any same-named installed theme.

1. Record your current theme, Dark Mode/tone, font choices and Global override
   checkboxes. Back up your current theme XML (or \`stylers.xml\`) and any existing
   \`DeepSeaFoam.xml\` before replacing that same-named file. Save documents before
   restarting; do not delete session or backup files.
2. Copy only \`DeepSeaFoam.xml\` into \`%APPDATA%\\Notepad++\\themes\\\`.
   For portable/local-configuration installs, use \`themes\\\` beside the executable.
   For Cloud or \`-settingsDir\` configurations, use that active configuration's
   \`themes\\\` directory. Create the directory if missing, but never overwrite
   \`config.xml\`, \`stylers.xml\`, \`langs.xml\` or an unrelated theme.
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
result**, including separate \`javascript.js\` (ordinary JS files) and
\`javascript\` (embedded scripts): Bash, Batch, C, C++, C#, CSS, diff, Go, HTML,
Java, JavaScript, JSON, Makefile, PowerShell, properties, Python, Rust, SQL,
TypeScript, XML and YAML. Plain text uses Global Styles / Default Style.
Unlisted built-in languages receive host fallbacks, not bespoke syntax mappings.
No fictitious Markdown lexer or invented style IDs are included.

| Role | Mapping |
| --- | --- |
| Editor / surrounding gutters | base \`${solid("base")}\` / panel \`${solid("panel")}\` |
| Ordinary / comment / emphasized text | \`${solid("text")}\` / \`${solid("faintText")}\` / \`${solid("warm")}\` |
| Keywords / strings | document \`${solid("document")}\` / accent \`${solid("accent")}\` |
| Numbers and literal constants | warning \`${solid("warning")}\` |
| Types / escapes and markup entities | heritage blue \`${heritage("blue")}\` / magenta \`${heritage("magenta")}\` |
| Operators and attributes / preprocessor and regex | heritage violet \`${heritage("violet")}\` / orange \`${heritage("orange")}\` |
| Selection / selected foreground | \`${selection}\` / \`${solid("warm")}\` |
| Caret / current line / indent and edge guide | \`${solid("lightEdge")}\` / \`${solid("panel")}\` / \`${separator}\` |
| Saved / modified / invalid or deleted | \`${solid("document")}\` / \`${solid("warning")}\` / \`${solid("error")}\` |

Syntax follows the repository's shared editor mappings: document-green keywords,
seafoam strings, warning-yellow numbers/constants, warm functions and blue types.
JSON escapes and HTML/XML entities stay magenta, separate from numeric literals.
JSON boolean/null keywords and YAML boolean keywords are literal constants.
True character/rune literals in C/C++/C#/Java/Go/Rust use the constant color;
single-quoted strings in JavaScript, Python, Bash and PowerShell remain strings.
Search-result file headers and diff command headers retain accent; diff additions
retain document green rather than borrowing the string color.

XML colors are six-digit **RRGGBB without #**, not RGBA. Selection composites
\`${derived("textSelection")}\` over base; search-result hits composite it over
panel (\`${panelSelection}\`). Indent/edge guides composite the canonical separator.
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
| Top / Main | \`${solid("panel")}\` |
| Active | \`${solid("base")}\` |
| Menu hot track | \`${panelSelection}\` |
| Error | \`${composite(derived("errorBackground"), solid("panel"))}\` |
| Text / Darker text / Disabled text | \`${solid("text")}\` / \`${solid("faintText")}\` / \`${solid("border")}\` |
| Link / Edge highlight | \`${solid("accent")}\` |
| Edge / Edge disabled | \`${solid("border")}\` / \`${composite(overlay("separator"), solid("panel"))}\` |

These are manual suggestions, not settings applied by the theme. Leave unrelated
preferences, document contents and media untouched.

## Remove / restore

Choose your former theme in Style Configurator. Restore any separately changed
Dark Mode/tone, font, override or Editing options to the values you recorded.
After closing all Notepad++ instances, remove only the installed DeepSeaFoam XML,
or restore its same-named backup. Never delete \`stylers.xml\` or reset all
preferences to uninstall this theme.

## Source contract and validation limits

Pinned Notepad++ **v8.9.8**, commit \`${nppCommit}\`:

- [Native lexer names, every emitted style ID/keyword class and global style names](${nppSource}/PowerEditor/src/stylers.model.xml).
- [Native JSON boolean/null and YAML boolean keyword lists](${nppSource}/PowerEditor/src/langs.model.xml).
- [XML loading and style attributes](${nppSource}/PowerEditor/src/Parameters.cpp#L4953-L4999)
  and [color/font parsing](${nppSource}/PowerEditor/src/Parameters.cpp#L5140-L5205).
- [Selections, caret, margins and change-history controls](${nppSource}/PowerEditor/src/ScintillaComponent/ScintillaEditView.cpp#L3164-L3340).
- [Indicator alpha and under-text rendering](${nppSource}/PowerEditor/src/ScintillaComponent/ScintillaEditView.cpp#L453-L473).
- Official manual, pinned at \`7d0f743be24802c15e8424833adb7ea619901692\`:
  [theme installation and model fallbacks](${nppManual}/themes.md),
  [Dark Mode and Style Configurator boundaries](${nppManual}/preferences.md#dark-mode).
  The published manual URL returned HTTP 403 during research; its official source
  was read instead.

Tests validate the complete emitted schema against pinned native-contract
fingerprints, mappings, palette propagation, determinism and nonmutation; an
independent XML parser checks well-formedness. **No Notepad++ runtime/visual
validation is claimed.** No application was installed or live settings modified.
The colors/design are original mappings with the separate
[Solarized syntax heritage](https://ethanschoonover.com/solarized/) retained.
Original theme files are MIT-licensed; retain the accompanying [LICENSE](LICENSE).
`);

  const godotColors = {
    symbol_color: heritage("violet"),
    keyword_color: solid("document"),
    control_flow_keyword_color: solid("document"),
    base_type_color: heritage("blue"),
    engine_type_color: heritage("blue"),
    user_type_color: heritage("blue"),
    comment_color: solid("faintText"),
    doc_comment_color: solid("text"),
    string_color: solid("accent"),
    string_placeholder_color: heritage("magenta"),
    background_color: solid("base"),
    completion_background_color: solid("panel"),
    completion_selected_color: derived("textSelection"),
    completion_existing_color: overlay("hover"),
    completion_scroll_color: solid("border"),
    completion_scroll_hovered_color: solid("accent"),
    completion_font_color: solid("text"),
    text_color: solid("text"),
    line_number_color: solid("faintText"),
    safe_line_number_color: solid("document"),
    caret_color: solid("lightEdge"),
    caret_background_color: solid("base"),
    text_selected_color: solid("warm"),
    selection_color: derived("textSelection"),
    brace_mismatch_color: solid("error"),
    current_line_color: solid("panel"),
    line_length_guideline_color: overlay("separator"),
    word_highlighted_color: overlay("hover"),
    number_color: solid("warning"),
    function_color: solid("warm"),
    member_variable_color: heritage("violet"),
    mark_color: derived("errorBackground"),
    warning_color: `${solid("warning")}26`,
    bookmark_color: solid("accent"),
    breakpoint_color: solid("error"),
    executing_line_color: solid("warning"),
    code_folding_color: solid("border"),
    folded_code_region_color: overlay("hover"),
    search_result_color: derived("textSelection"),
    search_result_border_color: overlay("guide"),
    "gdscript/function_definition_color": solid("warm"),
    "gdscript/global_function_color": heritage("blue"),
    "gdscript/node_path_color": solid("accent"),
    "gdscript/node_reference_color": solid("accent"),
    "gdscript/annotation_color": heritage("violet"),
    "gdscript/string_name_color": solid("accent"),
    "comment_markers/critical_color": solid("error"),
    "comment_markers/warning_color": solid("warning"),
    "comment_markers/notice_color": solid("document")
  };
  const sortedGodotColors = Object.entries(godotColors).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  add("targets/godot/DeepSeaFoam.tet", `; Generated from palette/deepseafoam.json. Godot 4.7.2 text-editor theme.
; Quoted HTML RGB/RGBA strings; alpha is last. Not an editor_settings resource.
[color_theme]
${sortedGodotColors.map(([key, value]) => `${key}="${value}"`).join("\n")}
`);
  add("targets/godot/README.md", `# ${palette.name} for Godot

Generated from the canonical palette, version **${palette.version}**. Do not edit
generated files. [DeepSeaFoam.tet](DeepSeaFoam.tet) is a native **text-editor
syntax theme** for Godot's built-in script editor, source-checked against
**Godot 4.7.2-stable**. It is not a game/runtime \`Theme.tres\`, editor plugin,
project asset or replacement \`editor_settings-*.tres\`. Godot 3.x is unsupported;
other 4.x versions have not been runtime-tested and may expose different controls.

## Install / native import

If using the versioned release asset, save a copy as \`DeepSeaFoam.tet\` in a
new download directory first. Godot derives the imported theme name from that
filename; the steps below assume the canonical name, not the release suffix.

1. Record **Editor -> Editor Settings -> Text Editor -> Theme -> Color Theme**
   (\`text_editor/theme/color_theme\`). In the **Script** workspace, use its
   **File -> Theme -> Save Theme As...** to back up the current syntax colors to a
   new, uniquely named \`.tet\`, especially if using Custom or modified colors.
   Saving inside the theme directory can select that backup's name; record the
   original selection first. Back up any pre-existing \`DeepSeaFoam.tet\` too:
   the native importer copies over a same-named theme.
2. In that Script workspace's File menu, select **Theme -> Import Theme...** and
   choose the downloaded \`DeepSeaFoam.tet\`. Import copies and immediately selects
   the theme. It changes only text-editor highlighting colors and the theme name,
   not shortcuts, fonts, layouts, project settings, scripts or media.
3. Verify **Editor Settings -> Text Editor -> Theme -> Color Theme** now says
   **DeepSeaFoam**. Some highlighting controls require **Advanced Settings**.
   Keep your preferred current-line, safe-line-number, whitespace, syntax
   highlighter and other display toggles; importing colors does not enable them.

Alternative: with Godot closed, copy only the \`.tet\` into
\`%APPDATA%\\Godot\\text_editor_themes\\\`, reopen the editor and choose DeepSeaFoam
in Color Theme. Self-contained/Steam installations use
\`editor_data\\text_editor_themes\\\` beside the executable instead. Native import
is preferable when your configuration directory differs. Do not copy this file
into a project or replace the full editor-settings resource.

## Exact format and mapping

The \`.tet\` is a Godot **ConfigFile**, with one \`[color_theme]\` section and
**49 recognized color keys**, not a resource header. Values are **quoted HTML hex
strings**, \`"#RRGGBB"\` or \`"#RRGGBBAA"\`. Godot validates HTML colors, calls
\`Color::html\`, and preserves last-byte alpha; no \`Color(...)\` constructors,
ARGB byte-swapping or opaque substitution is needed. Subkeys such as
\`gdscript/annotation_color\` remain keys in this same section, not new sections.
The loader prefixes each key with \`text_editor/theme/highlighting/\`, ignores
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

All keys below are relative to \`text_editor/theme/highlighting/\`:

| Native key | Generated color |
| --- | --- |
${sortedGodotColors.map(([key, value]) => `| \`${key}\` | \`${value}\` |`).join("\n")}

## Optional editor chrome (manual, not part of the import)

The \`.tet\` does **not** set dock, inspector, toolbar, 2D/3D viewport or game
colors. For a closer surrounding interface, record the old values and change
only these controls under **Editor Settings -> Interface -> Theme**:

| Godot 4.7 setting | Suggested value |
| --- | --- |
| Follow System Theme (\`interface/theme/follow_system_theme\`) | Off |
| Use System Accent Color (\`interface/theme/use_system_accent_color\`) | Off |
| Color Preset (\`interface/theme/color_preset\`) | Custom |
| Base Color (\`interface/theme/base_color\`) | panel \`${solid("panel")}\` |
| Accent Color (\`interface/theme/accent_color\`) | \`${solid("accent")}\` |
| Contrast (\`interface/theme/contrast\`) | 0.30 |
| Icon And Font Color (\`interface/theme/icon_and_font_color\`) | Light |

Set the system-follow options off before choosing Custom; otherwise system
settings can override the base/accent. **Light** means light ink/icons on this
dark background, not a light editor. Godot derives its other chrome colors from
these inputs, its selected Style and its own theme logic: they are **not a
pixel-exact mapping** of all eleven DeepSeaFoam solids. In 4.7 the setting is
\`color_preset\`, not the older \`preset\`. Leave Style, spacing, fonts and other
preferences alone. An existing custom editor theme resource may override some
colors; it is not removed or replaced by this export.

## Remove / restore

Choose the previous text-editor Color Theme, or import the uniquely named backup
\`.tet\` to restore your exact previous custom syntax colors. Restore the recorded
chrome values separately if you changed them. Close Godot and remove only the
installed \`DeepSeaFoam.tet\` (or restore its same-named backup). Do not reset
editor settings or delete project files. A backup saved under a new name restores
the colors but will display that backup's name as the selected theme.

## Sources and validation limits

Pinned Godot **4.7.2-stable**, commit \`${godotCommit}\`:

- [Native import, safe theme-name checks and save format](${godotSource}/editor/script/script_editor_plugin.cpp#L852-L916).
- [Actual loader: section, recognized-key checks and HTML parsing](${godotSource}/editor/themes/editor_theme_manager.cpp#L448-L479).
- [All 49 saved/registered highlighting colors](${godotSource}/editor/settings/editor_settings.cpp#L1867-L1919).
- [RGB/RGBA HTML parsing and validity](${godotSource}/core/math/color.cpp#L331-L393).
- [Theme directory and self-contained configuration](${godotSource}/editor/file_system/editor_paths.cpp).
- [Chrome settings and source-derived colors](${godotSource}/editor/themes/editor_theme_manager.cpp#L240-L383)
  and [official EditorSettings reference](${godotSource}/doc/classes/EditorSettings.xml).
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
`);
}
