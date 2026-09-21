import { rgb, composite } from "./colors.mjs";

export function addDesktopThemes({ palette, add, json, solid, overlay, derived, heritage, terminal, syntaxRules }) {
  const selection = composite(derived("textSelection"), solid("base"));
  const panelSelection = composite(derived("textSelection"), solid("panel"));
  const separator = composite(overlay("separator"), solid("panel"));

  add("targets/chromium/manifest.json", json({
    manifest_version: 3,
    name: palette.name,
    version: palette.version,
    description: palette.description,
    theme: {
      colors: Object.fromEntries(Object.entries({
        frame: solid("base"),
        frame_inactive: solid("base"),
        background_tab: solid("base"),
        background_tab_inactive: solid("base"),
        toolbar: solid("panel"),
        toolbar_text: solid("text"),
        tab_text: solid("warm"),
        tab_background_text: solid("faintText"),
        tab_background_text_inactive: solid("faintText"),
        bookmark_text: solid("text"),
        ntp_background: solid("base"),
        ntp_text: solid("text"),
        ntp_link: solid("accent"),
        ntp_header: solid("border"),
        button_background: solid("base"),
        omnibox_background: solid("base"),
        omnibox_text: solid("text"),
        toolbar_button_icon: solid("text")
      }).map(([name, value]) => [name, rgb(value)]))
    }
  }));

  add("targets/sublime-text/DeepSeaFoam.sublime-color-scheme", json({
    name: palette.name,
    author: "Zanark",
    globals: {
      background: solid("base"),
      foreground: solid("text"),
      caret: solid("lightEdge"),
      block_caret: solid("lightEdge"),
      line_highlight: solid("panel"),
      invisibles: solid("border"),
      selection: derived("textSelection"),
      selection_foreground: solid("warm"),
      selection_border: solid("accent"),
      inactive_selection: overlay("hover"),
      inactive_selection_foreground: solid("text"),
      inactive_selection_border: solid("border"),
      gutter: solid("base"),
      gutter_foreground: solid("faintText"),
      gutter_foreground_highlight: solid("text"),
      guide: overlay("separator"),
      active_guide: solid("accent"),
      stack_guide: solid("border"),
      rulers: separator,
      find_highlight: composite(`${solid("warning")}26`, solid("base")),
      find_highlight_foreground: solid("warm"),
      brackets_foreground: solid("accent"),
      brackets_options: "underline",
      bracket_contents_foreground: solid("accent"),
      bracket_contents_options: "underline",
      tags_foreground: solid("accent"),
      tags_options: "underline",
      accent: solid("accent"),
      line_diff_added: solid("document"),
      line_diff_modified: solid("warning"),
      line_diff_deleted: solid("error"),
      misspelling: solid("error"),
      fold_marker: solid("border"),
      minimap_border: solid("border"),
      popup_css: `html { background-color: ${solid("panel")}; color: ${solid("text")}; }`,
      phantom_css: `html { background-color: ${solid("panel")}; color: ${solid("text")}; }`
    },
    rules: [
      { name: "Semantic defaults", scope: "entity.name, constant, support", foreground: solid("text") },
      ...syntaxRules.map(({ name, scope, settings }) => ({
        name,
        scope: scope.filter(value => !value.startsWith("meta.")).join(", "),
        foreground: settings.foreground,
        ...(settings.background ? { background: settings.background } : {}),
        ...(settings.fontStyle ? { font_style: settings.fontStyle } : {})
      })),
      { name: "Inherited classes", scope: "entity.other.inherited-class", foreground: heritage("blue") },
      { name: "Function variables", scope: "variable.function", foreground: solid("warm") },
      { name: "Operators", scope: "keyword.operator", foreground: heritage("violet") },
      { name: "Escapes", scope: "constant.character.escape", foreground: heritage("magenta") },
      { name: "Markup bold", scope: "markup.bold", font_style: "bold" },
      { name: "Markup italic", scope: "markup.italic", font_style: "italic" }
    ]
  }));

  const ansi = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
  const ansiKey = (name, bright) => {
    const key = name === "magenta" ? "purple" : name;
    return bright ? `bright${key[0].toUpperCase()}${key.slice(1)}` : key;
  };
  const alacritty = {
    primary: { background: solid("base"), foreground: terminal("foreground") },
    cursor: { text: solid("base"), cursor: terminal("cursorColor") },
    vi_mode_cursor: { text: solid("base"), cursor: terminal("cursorColor") },
    selection: { text: terminal("foreground"), background: terminal("selectionBackground") },
    "search.matches": { foreground: solid("base"), background: terminal("yellow") },
    "search.focused_match": { foreground: solid("base"), background: terminal("brightYellow") },
    "hints.start": { foreground: solid("base"), background: terminal("yellow") },
    "hints.end": { foreground: solid("base"), background: terminal("cyan") },
    line_indicator: { foreground: terminal("foreground"), background: solid("panel") },
    footer_bar: { foreground: terminal("foreground"), background: solid("panel") },
    normal: Object.fromEntries(ansi.map(name => [name, terminal(ansiKey(name, false))])),
    bright: Object.fromEntries(ansi.map(name => [name, terminal(ansiKey(name, true))]))
  };
  add("targets/alacritty/DeepSeaFoam.toml",
    `# Generated from palette/deepseafoam.json. Import this color fragment; keep your existing configuration.\n\n` +
    Object.entries(alacritty).map(([section, values]) =>
      `[colors.${section}]\n${Object.entries(values).map(([name, value]) => `${name} = "${value}"`).join("\n")}\n`
    ).join("\n"));

  add("targets/jetbrains/resources/META-INF/plugin.xml", `<?xml version="1.0" encoding="UTF-8"?>
<idea-plugin>
  <id>io.github.zanark.deepseafoam</id>
  <name>DeepSeaFoam</name>
  <version>${palette.version}</version>
  <vendor url="https://github.com/Zanark/DeepSeaFoam">Zanark</vendor>
  <description>DeepSeaFoam dark UI theme and editor color scheme. Theme resources only; no application code.</description>
  <idea-version since-build="253"/>
  <depends>com.intellij.modules.platform</depends>
  <extensions defaultExtensionNs="com.intellij">
    <themeProvider id="e78984a4-848f-477c-b0b3-fb331c8b144c" path="/DeepSeaFoam.theme.json"/>
  </extensions>
</idea-plugin>
`);

  add("targets/jetbrains/resources/DeepSeaFoam.theme.json", json({
    name: palette.name,
    dark: true,
    parentTheme: "Islands Dark",
    author: "Zanark",
    editorScheme: "/DeepSeaFoam.xml",
    ui: {
      "*": {
        background: solid("panel"),
        foreground: solid("text"),
        selectionBackground: panelSelection,
        selectionForeground: solid("warm"),
        disabledForeground: solid("faintText"),
        borderColor: solid("border")
      },
      "Panel.background": solid("panel"),
      "MainWindow.background": solid("base"),
      "MainToolbar.background": solid("panel"),
      "MainToolbar.borderColor": overlay("separator"),
      "ToolWindow.background": solid("panel"),
      "ToolWindow.Header.background": solid("panel"),
      "ToolWindow.Header.inactiveBackground": solid("panel"),
      "Island.borderColor": solid("panel"),
      "EditorTabs.background": solid("panel"),
      "EditorTabs.underlinedTabBackground": solid("base"),
      "EditorTabs.inactiveUnderlinedTabBackground": solid("base"),
      "EditorTabs.underlinedBorderColor": solid("accent"),
      "EditorTabs.inactiveUnderlinedTabBorderColor": solid("border"),
      "TextField.background": solid("base"),
      "TextField.foreground": solid("text"),
      "TextField.selectionBackground": selection,
      "TextField.selectionForeground": solid("warm"),
      "TextArea.background": solid("base"),
      "TextArea.foreground": solid("text"),
      "TextPane.background": solid("base"),
      "EditorPane.background": solid("base"),
      "List.background": solid("panel"),
      "Tree.background": solid("panel"),
      "Table.background": solid("base"),
      "PopupMenu.background": solid("panel"),
      "ToolTip.background": solid("panel"),
      "ToolTip.foreground": solid("warm"),
      "Label.foreground": solid("text"),
      "Link.activeForeground": solid("accent"),
      "Link.hoverForeground": solid("warm"),
      "Component.focusColor": solid("accent"),
      "Component.errorFocusColor": solid("error"),
      "Component.warningFocusColor": solid("warning"),
      "Component.borderColor": solid("border"),
      "Button.background": solid("base"),
      "Button.foreground": solid("text"),
      "Button.startBackground": solid("base"),
      "Button.endBackground": solid("base"),
      "Button.startBorderColor": solid("border"),
      "Button.endBorderColor": solid("border"),
      "Button.default.startBackground": solid("accent"),
      "Button.default.endBackground": solid("accent"),
      "Button.default.foreground": solid("base"),
      "Button.default.startBorderColor": solid("accent"),
      "Button.default.endBorderColor": solid("accent"),
      "Separator.foreground": separator,
      "ActionButton.hoverBackground": overlay("hover"),
      "ActionButton.pressedBackground": derived("textSelection"),
      "ProgressBar.progressColor": solid("accent"),
      "ProgressBar.trackColor": solid("base"),
      "MainMenu.selectionBackground": selection,
      "Menu.borderColor": solid("border"),
      "Notification.background": solid("panel"),
      "Notification.foreground": solid("text"),
      "Notification.borderColor": solid("border"),
      "ToolTip.borderColor": solid("border")
    },
    icons: {
      ColorPalette: {
        "Actions.Blue": solid("accent"),
        "Actions.Red": solid("error"),
        "Objects.Green": solid("document")
      }
    }
  }));

  const editorColors = {
    CARET_COLOR: solid("lightEdge"),
    CARET_ROW_COLOR: solid("panel"),
    SELECTION_BACKGROUND: selection,
    SELECTION_FOREGROUND: solid("warm"),
    GUTTER_BACKGROUND: solid("base"),
    LINE_NUMBERS_COLOR: solid("border"),
    LINE_NUMBER_ON_CARET_ROW_COLOR: solid("text"),
    INDENT_GUIDE: separator,
    SELECTED_INDENT_GUIDE: solid("accent"),
    RIGHT_MARGIN_COLOR: separator,
    CONSOLE_BACKGROUND_KEY: solid("base"),
    ADDED_LINES_COLOR: solid("document"),
    MODIFIED_LINES_COLOR: solid("warning"),
    DELETED_LINES_COLOR: solid("error")
  };
  const editorAttributes = {
    TEXT: { FOREGROUND: solid("text"), BACKGROUND: solid("base") },
    DEFAULT_IDENTIFIER: { FOREGROUND: solid("text") },
    DEFAULT_LINE_COMMENT: { FOREGROUND: solid("border"), FONT_TYPE: "2" },
    DEFAULT_BLOCK_COMMENT: { FOREGROUND: solid("border"), FONT_TYPE: "2" },
    DEFAULT_DOC_COMMENT: { FOREGROUND: solid("border"), FONT_TYPE: "2" },
    DEFAULT_STRING: { FOREGROUND: solid("accent") },
    DEFAULT_NUMBER: { FOREGROUND: solid("warning") },
    DEFAULT_KEYWORD: { FOREGROUND: solid("document") },
    DEFAULT_OPERATION_SIGN: { FOREGROUND: heritage("violet") },
    DEFAULT_CLASS_NAME: { FOREGROUND: heritage("blue") },
    DEFAULT_INTERFACE_NAME: { FOREGROUND: heritage("blue") },
    DEFAULT_FUNCTION_DECLARATION: { FOREGROUND: solid("warm") },
    DEFAULT_FUNCTION_CALL: { FOREGROUND: solid("warm") },
    DEFAULT_INSTANCE_METHOD: { FOREGROUND: solid("warm") },
    DEFAULT_STATIC_METHOD: { FOREGROUND: solid("warm") },
    DEFAULT_INSTANCE_FIELD: { FOREGROUND: heritage("violet") },
    DEFAULT_STATIC_FIELD: { FOREGROUND: heritage("violet") },
    DEFAULT_LOCAL_VARIABLE: { FOREGROUND: solid("text") },
    DEFAULT_PARAMETER: { FOREGROUND: solid("text") },
    DEFAULT_CONSTANT: { FOREGROUND: heritage("magenta") },
    DEFAULT_VALID_STRING_ESCAPE: { FOREGROUND: heritage("magenta") },
    DEFAULT_INVALID_STRING_ESCAPE: { FOREGROUND: solid("error") },
    DEFAULT_METADATA: { FOREGROUND: heritage("orange") },
    DEFAULT_TAG: { FOREGROUND: heritage("blue") },
    DEFAULT_ATTRIBUTE: { FOREGROUND: heritage("violet") },
    ERRORS_ATTRIBUTES: { EFFECT_COLOR: solid("error"), EFFECT_TYPE: "2" },
    WARNING_ATTRIBUTES: { EFFECT_COLOR: solid("warning"), EFFECT_TYPE: "2" },
    CONSOLE_NORMAL_OUTPUT: { FOREGROUND: terminal("foreground") },
    CONSOLE_ERROR_OUTPUT: { FOREGROUND: terminal("red") }
  };
  const xmlOption = (name, value, indent) =>
    `${" ".repeat(indent)}<option name="${name}" value="${value.startsWith("#") ? value.slice(1) : value}" />`;
  add("targets/jetbrains/resources/DeepSeaFoam.xml", `<?xml version="1.0" encoding="UTF-8"?>
<scheme name="DeepSeaFoam" version="142" parent_scheme="Darcula">
  <colors>
${Object.entries(editorColors).map(([name, value]) => xmlOption(name, value, 4)).join("\n")}
  </colors>
  <attributes>
${Object.entries(editorAttributes).map(([name, options]) =>
    `    <option name="${name}">\n      <value>\n` +
    Object.entries(options).map(([key, value]) => xmlOption(key, value, 8)).join("\n") +
    `\n      </value>\n    </option>`).join("\n")}
  </attributes>
</scheme>
`);
}
