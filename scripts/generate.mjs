import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const palette = JSON.parse(await readFile(path.join(root, "palette", "deepseafoam.json"), "utf8"));
const checkOnly = process.argv.includes("--check");
const outputs = new Map();

const color = (group, name) => palette[group][name].value.toUpperCase();
const solid = (name) => color("solid", name);
const overlay = (name) => color("overlay", name);
const heritage = (name) => color("heritage", name);
const terminal = (name) => color("terminal", name);
const derived = (name) => color("derived", name);
const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
const add = (relativePath, content) => outputs.set(relativePath, content.replace(/\r\n/g, "\n"));
const ansiNames = {
  black: "Black", red: "Red", green: "Green", yellow: "Yellow",
  blue: "Blue", purple: "Magenta", cyan: "Cyan", white: "White",
  brightBlack: "BrightBlack", brightRed: "BrightRed", brightGreen: "BrightGreen", brightYellow: "BrightYellow",
  brightBlue: "BrightBlue", brightPurple: "BrightMagenta", brightCyan: "BrightCyan", brightWhite: "BrightWhite"
};

function argb(value) {
  const hex = value.slice(1).toUpperCase();
  return hex.length === 8 ? `${hex.slice(6)}${hex.slice(0, 6)}` : `FF${hex}`;
}

function rgba(value) {
  const hex = value.slice(1);
  const alpha = parseInt(hex.slice(6), 16) / 255;
  return {
    rgb: `#${hex.slice(0, 6).toUpperCase()}`,
    opacity: Number(alpha.toFixed(4))
  };
}

function composite(value, background) {
  const alpha = parseInt(value.slice(7, 9), 16) / 255;
  const channels = [1, 3, 5].map((start) => {
    const foreground = parseInt(value.slice(start, start + 2), 16);
    const behind = parseInt(background.slice(start, start + 2), 16);
    return Math.round(foreground * alpha + behind * (1 - alpha)).toString(16).padStart(2, "0");
  });
  return `#${channels.join("").toUpperCase()}`;
}

const vscodePackage = {
  name: "deepseafoam-theme",
  displayName: "DeepSeaFoam",
  description: palette.description,
  version: palette.version,
  publisher: "zanark",
  license: "UNLICENSED",
  repository: {
    type: "git",
    url: "https://github.com/Zanark/DeepSeaFoam.git"
  },
  files: ["themes/**", "README.md"],
  engines: { vscode: "^1.90.0" },
  categories: ["Themes"],
  extensionKind: ["ui"],
  contributes: {
    themes: [
      {
        label: "DeepSeaFoam",
        uiTheme: "vs-dark",
        path: "./themes/deepseafoam-color-theme.json"
      }
    ]
  }
};

const vscodeTheme = {
  name: "DeepSeaFoam",
  type: "dark",
  semanticHighlighting: true,
  colors: {
    foreground: solid("text"),
    focusBorder: solid("accent"),
    contrastBorder: overlay("separator"),
    disabledForeground: `${solid("faintText")}80`,
    "widget.shadow": overlay("shadowStrong"),
    "selection.background": derived("textSelection"),
    "descriptionForeground": solid("faintText"),
    errorForeground: solid("warm"),
    "icon.foreground": solid("text"),
    "window.activeBorder": solid("accent"),
    "window.inactiveBorder": overlay("separator"),
    "textLink.foreground": solid("accent"),
    "textLink.activeForeground": solid("warm"),
    "textBlockQuote.background": solid("panel"),
    "textBlockQuote.border": solid("border"),
    "textCodeBlock.background": solid("base"),
    "button.background": solid("accent"),
    "button.foreground": solid("base"),
    "button.hoverBackground": solid("text"),
    "button.secondaryBackground": solid("base"),
    "button.secondaryForeground": solid("text"),
    "button.secondaryHoverBackground": overlay("hover"),
    "checkbox.background": solid("base"),
    "checkbox.border": solid("border"),
    "dropdown.background": solid("base"),
    "dropdown.border": solid("border"),
    "dropdown.foreground": solid("text"),
    "input.background": solid("base"),
    "input.border": solid("border"),
    "input.foreground": solid("text"),
    "input.placeholderForeground": solid("faintText"),
    "inputOption.activeBackground": solid("base"),
    "inputOption.activeBorder": solid("accent"),
    "inputOption.activeForeground": solid("accent"),
    "inputValidation.errorBackground": solid("base"),
    "inputValidation.errorBorder": solid("error"),
    "inputValidation.errorForeground": solid("warm"),
    "inputValidation.warningBackground": solid("base"),
    "inputValidation.warningBorder": solid("warning"),
    "scrollbar.shadow": overlay("shadowSoft"),
    "scrollbarSlider.background": overlay("separator"),
    "scrollbarSlider.hoverBackground": solid("border"),
    "scrollbarSlider.activeBackground": solid("accent"),
    "badge.background": solid("accent"),
    "badge.foreground": solid("base"),
    "progressBar.background": solid("accent"),
    "list.activeSelectionBackground": solid("base"),
    "list.activeSelectionForeground": solid("accent"),
    "list.activeSelectionIconForeground": solid("accent"),
    "list.inactiveSelectionBackground": overlay("hover"),
    "list.inactiveSelectionForeground": solid("text"),
    "list.hoverBackground": overlay("hover"),
    "list.hoverForeground": solid("warm"),
    "list.focusOutline": solid("accent"),
    "list.warningForeground": solid("warning"),
    "list.errorForeground": solid("warm"),
    "activityBar.background": solid("panel"),
    "activityBar.foreground": solid("text"),
    "activityBar.inactiveForeground": solid("faintText"),
    "activityBar.border": overlay("separator"),
    "activityBar.activeBorder": solid("accent"),
    "activityBarBadge.background": solid("accent"),
    "activityBarBadge.foreground": solid("base"),
    "sideBar.background": solid("panel"),
    "sideBar.foreground": solid("text"),
    "sideBar.border": overlay("separator"),
    "sideBarTitle.foreground": solid("warm"),
    "sideBarSectionHeader.background": solid("panel"),
    "sideBarSectionHeader.foreground": solid("text"),
    "sideBarSectionHeader.border": overlay("separator"),
    "minimap.background": solid("base"),
    "minimap.selectionHighlight": derived("textSelection"),
    "minimap.errorHighlight": solid("error"),
    "minimap.warningHighlight": solid("warning"),
    "editorGroup.border": overlay("separator"),
    "editorGroupHeader.tabsBackground": solid("panel"),
    "editorGroupHeader.tabsBorder": overlay("separator"),
    "tab.activeBackground": solid("base"),
    "tab.activeForeground": solid("warm"),
    "tab.activeBorderTop": solid("accent"),
    "tab.inactiveBackground": solid("panel"),
    "tab.inactiveForeground": solid("text"),
    "tab.hoverBackground": overlay("hover"),
    "tab.border": overlay("separator"),
    "editor.background": solid("base"),
    "editor.foreground": solid("text"),
    "editorLineNumber.foreground": solid("border"),
    "editorLineNumber.activeForeground": solid("text"),
    "editorCursor.foreground": solid("lightEdge"),
    "editor.selectionBackground": derived("textSelection"),
    "editor.inactiveSelectionBackground": overlay("hover"),
    "editor.selectionHighlightBackground": `${solid("accent")}33`,
    "editor.wordHighlightBackground": `${solid("border")}33`,
    "editor.wordHighlightStrongBackground": `${solid("accent")}33`,
    "editor.findMatchBackground": `${solid("warning")}66`,
    "editor.findMatchBorder": solid("warning"),
    "editor.findMatchHighlightBackground": `${solid("warning")}33`,
    "editor.hoverHighlightBackground": overlay("hover"),
    "editor.lineHighlightBackground": `${solid("panel")}80`,
    "editor.lineHighlightBorder": overlay("separator"),
    "editorWhitespace.foreground": solid("border"),
    "editorIndentGuide.background1": overlay("separator"),
    "editorIndentGuide.activeBackground1": solid("accent"),
    "editorRuler.foreground": overlay("separator"),
    "editorCodeLens.foreground": solid("faintText"),
    "editorBracketMatch.background": solid("base"),
    "editorBracketMatch.border": solid("accent"),
    "editorError.foreground": solid("error"),
    "editorWarning.foreground": solid("warning"),
    "editorInfo.foreground": solid("accent"),
    "editorHint.foreground": solid("document"),
    "editorGutter.background": solid("base"),
    "editorGutter.modifiedBackground": solid("warning"),
    "editorGutter.addedBackground": solid("document"),
    "editorGutter.deletedBackground": solid("error"),
    "editorOverviewRuler.border": overlay("separator"),
    "editorWidget.background": solid("panel"),
    "editorWidget.foreground": solid("text"),
    "editorWidget.border": solid("border"),
    "editorSuggestWidget.background": solid("panel"),
    "editorSuggestWidget.border": solid("border"),
    "editorSuggestWidget.foreground": solid("text"),
    "editorSuggestWidget.selectedBackground": solid("base"),
    "editorSuggestWidget.highlightForeground": solid("accent"),
    "peekView.border": solid("accent"),
    "peekViewEditor.background": solid("base"),
    "peekViewResult.background": solid("panel"),
    "peekViewResult.selectionBackground": solid("base"),
    "peekViewResult.selectionForeground": solid("accent"),
    "peekViewTitle.background": solid("panel"),
    "peekViewTitleLabel.foreground": solid("warm"),
    "panel.background": solid("panel"),
    "panel.border": overlay("separator"),
    "panelTitle.activeBorder": solid("accent"),
    "panelTitle.activeForeground": solid("warm"),
    "panelTitle.inactiveForeground": solid("faintText"),
    "statusBar.background": solid("base"),
    "statusBar.foreground": solid("text"),
    "statusBar.border": overlay("separator"),
    "statusBar.debuggingBackground": solid("warning"),
    "statusBar.debuggingForeground": solid("base"),
    "statusBar.noFolderBackground": solid("panel"),
    "titleBar.activeBackground": solid("panel"),
    "titleBar.activeForeground": solid("text"),
    "titleBar.inactiveBackground": solid("panel"),
    "titleBar.inactiveForeground": solid("faintText"),
    "titleBar.border": overlay("separator"),
    "menu.background": solid("panel"),
    "menu.foreground": solid("text"),
    "menu.selectionBackground": solid("base"),
    "menu.selectionForeground": solid("accent"),
    "menu.separatorBackground": overlay("separator"),
    "commandCenter.background": solid("base"),
    "commandCenter.foreground": solid("text"),
    "commandCenter.border": solid("border"),
    "notificationCenterHeader.background": solid("panel"),
    "notifications.background": solid("panel"),
    "notifications.foreground": solid("text"),
    "notifications.border": solid("border"),
    "notificationsErrorIcon.foreground": solid("error"),
    "notificationsWarningIcon.foreground": solid("warning"),
    "notificationsInfoIcon.foreground": solid("accent"),
    "problemsErrorIcon.foreground": solid("error"),
    "problemsWarningIcon.foreground": solid("warning"),
    "problemsInfoIcon.foreground": solid("accent"),
    "terminal.background": solid("base"),
    "terminal.foreground": terminal("foreground"),
    "terminal.selectionBackground": terminal("selectionBackground"),
    "terminalCursor.foreground": terminal("cursorColor"),
    ...Object.fromEntries(Object.entries(ansiNames).map(
      ([name, suffix]) => [`terminal.ansi${suffix}`, terminal(name)]
    )),
    "gitDecoration.addedResourceForeground": solid("document"),
    "gitDecoration.modifiedResourceForeground": solid("warning"),
    "gitDecoration.deletedResourceForeground": solid("error"),
    "gitDecoration.untrackedResourceForeground": solid("accent"),
    "gitDecoration.ignoredResourceForeground": solid("faintText")
  },
  tokenColors: [
    {
      name: "Comments",
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: solid("border"), fontStyle: "italic" }
    },
    {
      name: "Strings",
      scope: ["string", "constant.other.symbol"],
      settings: { foreground: solid("accent") }
    },
    {
      name: "Numbers and constants",
      scope: ["constant.numeric", "constant.language", "constant.character"],
      settings: { foreground: solid("warning") }
    },
    {
      name: "Keywords and storage",
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: { foreground: solid("document") }
    },
    {
      name: "Functions",
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: solid("warm") }
    },
    {
      name: "Types and classes",
      scope: ["entity.name.type", "entity.name.class", "support.type", "support.class"],
      settings: { foreground: heritage("blue") }
    },
    {
      name: "Variables and identifiers",
      scope: ["variable", "identifier"],
      settings: { foreground: solid("text") }
    },
    {
      name: "Language variables and special constants",
      scope: ["variable.language", "constant.other"],
      settings: { foreground: heritage("magenta") }
    },
    {
      name: "Tags",
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: heritage("blue") }
    },
    {
      name: "Attributes and properties",
      scope: ["entity.other.attribute-name", "support.type.property-name", "variable.other.property"],
      settings: { foreground: heritage("violet") }
    },
    {
      name: "Invalid",
      scope: ["invalid", "invalid.illegal"],
      settings: { foreground: solid("warm"), background: solid("error") }
    },
    {
      name: "Markup headings",
      scope: ["markup.heading", "entity.name.section"],
      settings: { foreground: solid("warm"), fontStyle: "bold" }
    },
    {
      name: "Markup links",
      scope: ["markup.underline.link", "string.other.link"],
      settings: { foreground: solid("accent"), fontStyle: "underline" }
    },
    {
      name: "Diff",
      scope: ["markup.inserted"],
      settings: { foreground: solid("document") }
    },
    {
      name: "Diff removed",
      scope: ["markup.deleted"],
      settings: { foreground: solid("error") }
    }
  ],
  semanticTokenColors: {
    comment: { foreground: solid("border"), italic: true },
    string: solid("accent"),
    number: solid("warning"),
    keyword: solid("document"),
    function: solid("warm"),
    method: solid("warm"),
    type: heritage("blue"),
    class: heritage("blue"),
    interface: heritage("blue"),
    enum: heritage("blue"),
    property: heritage("violet"),
    variable: solid("text"),
    parameter: solid("text"),
    enumMember: heritage("magenta"),
    regexp: heritage("orange"),
    decorator: heritage("violet")
  }
};

add("targets/vscode/package.json", json(vscodePackage));
add("targets/vscode/themes/deepseafoam-color-theme.json", json(vscodeTheme));

const obsidianManifest = {
  name: "DeepSeaFoam",
  version: palette.version,
  minAppVersion: "1.10.6",
  author: "Zanark",
  authorUrl: "https://github.com/Zanark/DeepSeaFoam"
};

const obsidianCss = `/*
 * Generated from palette/deepseafoam.json.
 * DeepSeaFoam themes application chrome and note presentation; it does not alter stored note content.
 */

body {
  --accent-h: 176;
  --accent-s: 59%;
  --accent-l: 40%;
  --background-primary: ${solid("base")};
  --background-primary-alt: ${solid("base")};
  --background-secondary: ${solid("panel")};
  --background-secondary-alt: ${solid("panel")};
  --background-modifier-border: ${solid("border")};
  --background-modifier-border-hover: ${solid("accent")};
  --background-modifier-border-focus: ${solid("accent")};
  --background-modifier-hover: ${overlay("hover")};
  --background-modifier-active-hover: ${overlay("hover")};
  --background-modifier-form-field: ${solid("base")};
  --background-modifier-form-field-highlighted: ${solid("panel")};
  --background-modifier-box-shadow: ${overlay("shadowSoft")};
  --background-modifier-cover: ${overlay("backdrop")};
  --text-normal: ${solid("text")};
  --text-muted: ${solid("text")};
  --text-faint: ${solid("faintText")};
  --text-on-accent: ${solid("base")};
  --text-on-accent-inverted: ${solid("base")};
  --text-error: ${solid("warm")};
  --text-warning: ${solid("warning")};
  --text-success: ${solid("document")};
  --text-accent: ${solid("accent")};
  --text-accent-hover: ${solid("warm")};
  --interactive-normal: ${solid("base")};
  --interactive-hover: ${solid("text")};
  --interactive-accent: ${solid("accent")};
  --interactive-accent-hover: ${solid("text")};
  --interactive-accent-hsl: 176, 59%, 40%;
  --interactive-success: ${solid("document")};
  --background-modifier-error: ${solid("error")};
  --background-modifier-error-hover: ${solid("error")};
  --background-modifier-error-rgb: 220, 50, 47;
  --scrollbar-bg: transparent;
  --scrollbar-thumb-bg: ${overlay("separator")};
  --scrollbar-active-thumb-bg: ${solid("border")};
  --tab-container-background: ${solid("panel")};
  --tab-text-color: ${solid("text")};
  --tab-text-color-focused-active: ${solid("warm")};
  --tab-text-color-focused-active-current: ${solid("warm")};
  --tab-outline-color: ${solid("accent")};
  --titlebar-background: ${solid("panel")};
  --titlebar-background-focused: ${solid("panel")};
  --titlebar-text-color: ${solid("text")};
  --titlebar-text-color-focused: ${solid("warm")};
  --divider-color: ${overlay("separator")};
  --divider-color-hover: ${solid("accent")};
  --nav-item-color: ${solid("text")};
  --nav-item-color-hover: ${solid("warm")};
  --nav-item-color-active: ${solid("accent")};
  --nav-item-background-hover: ${overlay("hover")};
  --nav-item-background-active: ${solid("base")};
  --nav-indentation-guide-color: ${overlay("separator")};
  --link-color: ${solid("accent")};
  --link-color-hover: ${solid("warm")};
  --link-external-color: ${heritage("blue")};
  --link-unresolved-color: ${solid("warning")};
  --tag-color: ${solid("accent")};
  --tag-background: ${solid("base")};
  --tag-background-hover: ${overlay("hover")};
  --code-normal: ${solid("text")};
  --code-background: ${solid("base")};
  --code-comment: ${solid("border")};
  --code-function: ${solid("warm")};
  --code-important: ${solid("error")};
  --code-keyword: ${solid("document")};
  --code-operator: ${heritage("violet")};
  --code-property: ${heritage("blue")};
  --code-punctuation: ${solid("faintText")};
  --code-string: ${solid("accent")};
  --code-tag: ${heritage("blue")};
  --code-value: ${solid("warning")};
  --blockquote-border-color: ${solid("border")};
  --blockquote-color: ${solid("text")};
  --heading-color: ${solid("warm")};
  --h1-color: ${solid("warm")};
  --h2-color: ${solid("warm")};
  --h3-color: ${solid("text")};
  --h4-color: ${solid("text")};
  --h5-color: ${solid("faintText")};
  --h6-color: ${solid("faintText")};
  --checkbox-color: ${solid("accent")};
  --checkbox-color-hover: ${solid("text")};
  --checkbox-border-color: ${solid("border")};
  --checkbox-border-color-hover: ${solid("accent")};
  --graph-line: ${solid("border")};
  --graph-node: ${solid("text")};
  --graph-node-focused: ${solid("lightEdge")};
  --graph-node-tag: ${solid("accent")};
  --graph-node-attachment: ${solid("warning")};
  --graph-node-unresolved: ${solid("error")};
  --graph-node-fill: ${solid("panel")};
  --graph-node-fill-highlight: ${solid("accent")};
  --graph-node-fill-unresolved: ${solid("error")};
}

.theme-dark {
  color-scheme: dark;
}

::selection {
  background: ${derived("textSelection")};
  color: ${solid("warm")};
}

.workspace-tab-header.is-active {
  color: ${solid("warm")};
}

.workspace-tab-header.is-active::after {
  background-color: ${solid("accent")};
}

.workspace-leaf-content,
.markdown-source-view,
.markdown-reading-view {
  background-color: ${solid("base")};
}

.workspace-split.mod-left-split,
.workspace-split.mod-right-split,
.workspace-ribbon,
.status-bar,
.prompt,
.menu {
  background-color: ${solid("panel")};
}

input:focus-visible,
button:focus-visible,
.clickable-icon:focus-visible {
  outline: 2px solid ${solid("accent")};
  outline-offset: 2px;
}

img,
video,
canvas {
  filter: none;
}
`;

add("targets/obsidian/manifest.json", json(obsidianManifest));
add("targets/obsidian/theme.css", obsidianCss);

const terminalScheme = {
  name: "DeepSeaFoam",
  background: solid("base"),
  ...Object.fromEntries(Object.keys(palette.terminal).map((name) => [name, terminal(name)]))
};

add("targets/windows-terminal/DeepSeaFoam.json", json(terminalScheme));

const firefoxManifest = {
  manifest_version: 3,
  name: "DeepSeaFoam",
  version: palette.version,
  description: palette.description,
  browser_specific_settings: {
    gecko: {
      id: "deepseafoam@zanark.github.io",
      strict_min_version: "109.0"
    }
  },
  theme: {
    colors: {
      frame: solid("base"),
      frame_inactive: solid("base"),
      tab_background_text: solid("faintText"),
      tab_text: solid("warm"),
      tab_selected: solid("panel"),
      tab_line: solid("accent"),
      tab_loading: solid("accent"),
      toolbar: solid("panel"),
      toolbar_text: solid("text"),
      toolbar_field: solid("base"),
      toolbar_field_text: solid("text"),
      toolbar_field_border: solid("border"),
      toolbar_field_focus: solid("base"),
      toolbar_field_text_focus: solid("warm"),
      toolbar_field_border_focus: solid("accent"),
      toolbar_field_highlight: derived("textSelection"),
      toolbar_field_highlight_text: solid("warm"),
      toolbar_top_separator: overlay("separator"),
      toolbar_bottom_separator: overlay("separator"),
      icons: solid("text"),
      icons_attention: solid("accent"),
      button_background_hover: overlay("hover"),
      button_background_active: solid("base"),
      popup: solid("panel"),
      popup_text: solid("text"),
      popup_border: solid("border"),
      popup_highlight: solid("base"),
      popup_highlight_text: solid("accent"),
      sidebar: solid("panel"),
      sidebar_text: solid("text"),
      sidebar_border: overlay("separator"),
      ntp_background: solid("base"),
      ntp_text: solid("text")
    }
  }
};

add("targets/firefox/manifest.json", json(firefoxManifest));

const vsTheme = `<?xml version="1.0" encoding="utf-8"?>
<Themes>
  <Theme Name="DeepSeaFoam" GUID="{4D8266A8-620C-4AC7-AB64-DC1C36E5F5AD}" FallbackId="{1ded0138-47ce-435e-84ef-9ec1f439b749}">
    <Category Name="Shell" GUID="{73708ded-2d56-4aad-b8eb-73b20d3f4bff}">
      <Color Name="AccentFillDefault"><Background Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="AccentFillSecondary"><Background Type="CT_RAW" Source="${argb(overlay("guide"))}" /></Color>
      <Color Name="AccentFillTertiary"><Background Type="CT_RAW" Source="${argb(derived("textSelection"))}" /></Color>
      <Color Name="SolidBackgroundFillTertiary"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /></Color>
      <Color Name="SolidBackgroundFillQuaternary"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /></Color>
      <Color Name="SurfaceBackgroundFillDefault"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /></Color>
      <Color Name="TextFillSecondary"><Background Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
    </Category>
    <Category Name="ShellInternal" GUID="{5af241b7-5627-4d12-bfb1-2b67d11127d7}">
      <Color Name="EnvironmentBackground"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /></Color>
      <Color Name="EnvironmentBorder"><Background Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="EnvironmentIndicator"><Background Type="CT_RAW" Source="${argb(overlay("separator"))}" /></Color>
      <Color Name="EnvironmentLogo"><Background Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="EnvironmentLayeredBackground"><Background Type="CT_RAW" Source="${argb(overlay("shadowSoft"))}" /></Color>
    </Category>
    <Category Name="Environment" GUID="{624ed9c3-bdfd-41fa-96c3-7c824ea32e3d}">
      <Color Name="Window"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="ToolWindowBackground"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="BrandedUIBackground"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /></Color>
      <Color Name="ScrollBarBackground"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /></Color>
    </Category>
    <Category Name="TreeView" GUID="{92ecf08e-8b13-4cf4-99e9-ae2692382185}">
      <Color Name="Background"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
    </Category>
    <Category Name="Header" GUID="{4997f547-1379-456e-b985-2f413cdfa536}">
      <Color Name="Default"><Background Type="CT_RAW" Source="${argb(solid("panel"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("warm"))}" /></Color>
    </Category>
    <Category Name="Output Window" GUID="{9973efdf-317d-431c-8bc1-5e88cbfd4f7f}">
      <Color Name="Plain Text"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
    </Category>
    <Category Name="Find Results" GUID="{5c48b2cb-0366-4fbf-9786-0bb37e945687}">
      <Color Name="Plain Text"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
    </Category>
    <Category Name="Immediate Window" GUID="{6bb65c5a-2f31-4bde-9f48-8a38dc0c63e7}">
      <Color Name="Plain Text"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
    </Category>
    <Category Name="Command Window" GUID="{ee1be240-4e81-4beb-8eea-54322b6b1bf5}">
      <Color Name="Plain Text"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
    </Category>
    <Category Name="Text Editor Text Manager Items" GUID="{58e96763-1d3b-4e05-b6ba-ff7115fd0b7b}">
      <Color Name="Plain Text"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="Selected Text"><Background Type="CT_RAW" Source="${argb(derived("textSelection"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("warm"))}" /></Color>
      <Color Name="Inactive Selected Text"><Background Type="CT_RAW" Source="${argb(overlay("hover"))}" /><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="Line Number"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="Selected Line Number"><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="Visible Whitespace"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="Indicator Margin"><Background Type="CT_RAW" Source="${argb(solid("base"))}" /></Color>
    </Category>
    <Category Name="Text Editor Language Service Items" GUID="{e0187991-b458-4f7e-8ca9-42c9a573b56c}">
      <Color Name="Identifier"><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="Comment"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="Keyword"><Foreground Type="CT_RAW" Source="${argb(solid("document"))}" /></Color>
      <Color Name="Preprocessor Keyword"><Foreground Type="CT_RAW" Source="${argb(heritage("orange"))}" /></Color>
      <Color Name="Operator"><Foreground Type="CT_RAW" Source="${argb(heritage("violet"))}" /></Color>
      <Color Name="String"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="String(C# @ Verbatim)"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="Number"><Foreground Type="CT_RAW" Source="${argb(solid("warning"))}" /></Color>
      <Color Name="Literal"><Foreground Type="CT_RAW" Source="${argb(solid("warning"))}" /></Color>
      <Color Name="Text"><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="User Types"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="User Types(Value types)"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="User Types(Interfaces)"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="User Types(Delegates)"><Foreground Type="CT_RAW" Source="${argb(heritage("violet"))}" /></Color>
      <Color Name="User Types(Enums)"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="User Types(Type parameters)"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="XML Text"><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="XML Keyword"><Foreground Type="CT_RAW" Source="${argb(solid("document"))}" /></Color>
      <Color Name="XML Delimiter"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="XML Name"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="XML Attribute"><Foreground Type="CT_RAW" Source="${argb(heritage("violet"))}" /></Color>
      <Color Name="XML Attribute Value"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="XML Comment"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="XAML Text"><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="XAML Keyword"><Foreground Type="CT_RAW" Source="${argb(solid("document"))}" /></Color>
      <Color Name="XAML Name"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="XAML Attribute"><Foreground Type="CT_RAW" Source="${argb(heritage("violet"))}" /></Color>
      <Color Name="XAML Attribute Value"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="HTML Element Name"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="HTML Attribute Name"><Foreground Type="CT_RAW" Source="${argb(heritage("violet"))}" /></Color>
      <Color Name="HTML Attribute Value"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="HTML Comment"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="CSS Keyword"><Foreground Type="CT_RAW" Source="${argb(solid("document"))}" /></Color>
      <Color Name="CSS Comment"><Foreground Type="CT_RAW" Source="${argb(solid("border"))}" /></Color>
      <Color Name="CSS Selector"><Foreground Type="CT_RAW" Source="${argb(solid("warning"))}" /></Color>
      <Color Name="CSS Property Name"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="CSS Property Value"><Foreground Type="CT_RAW" Source="${argb(solid("text"))}" /></Color>
      <Color Name="CSS String Value"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
    </Category>
    <Category Name="Text Editor MEF Items" GUID="{75a05685-00a8-4ded-bae5-e7a50bfa929a}">
      <Color Name="string - escape character"><Foreground Type="CT_RAW" Source="${argb(heritage("magenta"))}" /></Color>
      <Color Name="brace pair level one"><Foreground Type="CT_RAW" Source="${argb(heritage("blue"))}" /></Color>
      <Color Name="brace pair level two"><Foreground Type="CT_RAW" Source="${argb(solid("accent"))}" /></Color>
      <Color Name="brace pair level three"><Foreground Type="CT_RAW" Source="${argb(solid("warning"))}" /></Color>
      <Color Name="mismatched brace"><Foreground Type="CT_RAW" Source="${argb(solid("error"))}" /></Color>
    </Category>
  </Theme>
</Themes>
`;

add("targets/visual-studio/DeepSeaFoam.vstheme", vsTheme);

const activeGroups = ["solid", "overlay", "preview"];
const swatchGroups = [...activeGroups, "terminal"];
const swatchDirectory = (group) => group === "terminal" ? "docs/terminal-swatches" : "docs/swatches";
for (const group of swatchGroups) {
  for (const entry of Object.values(palette[group])) {
    const value = entry.value.toUpperCase();
    const fileName = `${value.slice(1).toLowerCase()}.svg`;
    const title = `${entry.role}: ${value}`;
    if (value.length === 9) {
      const { rgb, opacity } = rgba(value);
      add(
        `${swatchDirectory(group)}/${fileName}`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="24" viewBox="0 0 64 24" role="img" aria-labelledby="title"><title id="title">${title}</title><defs><pattern id="checker" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${color("preview", "checkerLight")}"/><path d="M0 0h4v4H0zM4 4h4v4H4z" fill="${color("preview", "checkerDark")}"/></pattern></defs><rect x=".5" y=".5" width="63" height="23" rx="2" fill="url(#checker)" stroke="#586E75"/><rect x=".5" y=".5" width="63" height="23" rx="2" fill="${rgb}" fill-opacity="${opacity}" stroke="#586E75"/></svg>\n`
      );
    } else {
      add(
        `${swatchDirectory(group)}/${fileName}`,
        `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="24" viewBox="0 0 64 24" role="img" aria-labelledby="title"><title id="title">${title}</title><rect x=".5" y=".5" width="63" height="23" rx="2" fill="${value}" stroke="#586E75"/></svg>\n`
      );
    }
  }
}

const sitePalette = {
  name: palette.name,
  version: palette.version,
  groups: [
    {
      id: "solid",
      title: "Core interface colors",
      description: "The eleven solid colors that define DeepSeaFoam application chrome.",
      colors: Object.entries(palette.solid).map(([id, entry]) => ({ id, ...entry }))
    },
    {
      id: "overlay",
      title: "Transparent overlays",
      description: "RGBA overlays shown over their intended surfaces rather than flattened into opaque substitutes.",
      colors: Object.entries(palette.overlay).map(([id, entry]) => ({ id, ...entry }))
    },
    {
      id: "preview",
      title: "Preview-only neutrals",
      description: "Neutral materials for images, thumbnails, and transparency previews—not alternate chrome.",
      colors: Object.entries(palette.preview).map(([id, entry]) => ({ id, ...entry }))
    }
  ]
};

const cssVariableGroups = ["solid", "overlay", "preview", "heritage", "derived"];
const cssVariable = (group, name, value) =>
  `  --dsf-${group}-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value};`;
const siteVariables = cssVariableGroups.flatMap((group) =>
  Object.entries(palette[group]).map(
    ([name, entry]) => cssVariable(group, name, entry.value)
  )
);
for (const name of ["foreground", "cursorColor", "selectionBackground", "green", "cyan", "white"]) {
  siteVariables.push(cssVariable("terminal", name, terminal(name)));
}
add(
  "site/palette.css",
  `/* Generated from palette/deepseafoam.json. */\n:root {\n${siteVariables.join("\n")}\n}\n`
);
add("site/palette.json", `${JSON.stringify(sitePalette)}\n`);

function validateSource() {
  const expectedCounts = { solid: 11, overlay: 8, preview: 8, terminal: 19 };
  for (const [group, count] of Object.entries(expectedCounts)) {
    const actual = Object.keys(palette[group]).length;
    if (actual !== count) {
      throw new Error(`${group} must contain ${count} colors; found ${actual}`);
    }
  }

  if (solid("base") !== "#000F13" || solid("panel") !== "#001E26" || solid("accent") !== "#2AA198") {
    throw new Error("Defining DeepSeaFoam surface or accent invariant changed");
  }

  for (const name of ["foreground", "cursorColor", "selectionBackground", ...Object.keys(ansiNames)]) {
    if (!/^#[0-9A-F]{6}$/.test(terminal(name))) {
      throw new Error(`Terminal role ${name} must be an opaque RGB color`);
    }
  }
  for (const [name, value] of Object.entries({ shadowSoft: "#00000066", shadowStrong: "#000000CC", backdrop: "#000000B8" })) {
    if (overlay(name) !== value) throw new Error(`${name} must remain transparent black`);
  }

  const activeValues = activeGroups.flatMap((group) =>
    Object.values(palette[group]).map((entry) => entry.value.toUpperCase())
  );
  if (activeValues.length !== 27 || new Set(activeValues).size !== 27) {
    throw new Error("The active inventory must contain 27 distinct values");
  }

  for (const value of activeValues) {
    if (!/^#[0-9A-F]{6}([0-9A-F]{2})?$/.test(value)) {
      throw new Error(`Invalid color value: ${value}`);
    }
  }

  const relativeLuminance = (value) => {
    const channels = value
      .slice(1, 7)
      .match(/../g)
      .map((channel) => parseInt(channel, 16) / 255)
      .map((channel) =>
        channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
      );
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const contrast = (foreground, background) => {
    const first = relativeLuminance(foreground);
    const second = relativeLuminance(background);
    return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
  };
  const contrastPairs = [
    ["primary text on workspace", solid("text"), solid("base"), 4.5],
    ["primary text on panel", solid("text"), solid("panel"), 4.5],
    ["faint text on workspace", solid("faintText"), solid("base"), 4.5],
    ["faint text on panel", solid("faintText"), solid("panel"), 4.5],
    ["base-colored text on accent", solid("base"), solid("accent"), 4.5],
    ["primary text on selection", solid("text"), composite(derived("textSelection"), solid("base")), 4.5],
    ["warm emphasis on workspace", solid("warm"), solid("base"), 4.5],
    ["terminal text on workspace", terminal("foreground"), solid("base"), 4.5],
    ["terminal text on selection", terminal("foreground"), terminal("selectionBackground"), 4.5],
    ["terminal cursor on workspace", terminal("cursorColor"), solid("base"), 3]
  ];
  for (const [name, foreground, background, minimum] of contrastPairs) {
    const ratio = contrast(foreground, background);
    if (ratio < minimum) {
      throw new Error(`${name} contrast ${ratio.toFixed(2)} is below ${minimum}:1`);
    }
  }
}

validateSource();

const mismatches = [];
for (const [relativePath, content] of outputs) {
  const absolutePath = path.join(root, relativePath);
  if (checkOnly) {
    let existing;
    try {
      existing = (await readFile(absolutePath, "utf8")).replace(/\r\n/g, "\n");
    } catch {
      mismatches.push(`${relativePath} is missing`);
      continue;
    }
    if (existing !== content) {
      mismatches.push(`${relativePath} is out of date`);
    }
  } else {
    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, content, "utf8");
  }
}

if (checkOnly) {
  if (mismatches.length) {
    throw new Error(mismatches.join("\n"));
  }

  for (const relativePath of [
    "targets/vscode/package.json",
    "targets/vscode/themes/deepseafoam-color-theme.json",
    "targets/obsidian/manifest.json",
    "targets/windows-terminal/DeepSeaFoam.json",
    "targets/firefox/manifest.json"
  ]) {
    JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  }

  const visualStudio = await readFile(
    path.join(root, "targets", "visual-studio", "DeepSeaFoam.vstheme"),
    "utf8"
  );
  for (const marker of ["<Themes>", 'FallbackId="{1ded0138-47ce-435e-84ef-9ec1f439b749}"', 'Name="Shell"', 'Name="Text Editor Text Manager Items"']) {
    if (!visualStudio.includes(marker)) {
      throw new Error(`Visual Studio export is missing ${marker}`);
    }
  }

  const readme = await readFile(path.join(root, "README.md"), "utf8");
  for (const group of swatchGroups) {
    for (const entry of Object.values(palette[group])) {
      const swatchPath = `${swatchDirectory(group)}/${entry.value.slice(1).toLowerCase()}.svg`;
      if (!readme.includes(swatchPath)) {
        throw new Error(`README is missing visible swatch ${swatchPath}`);
      }
    }
  }

  console.log(`Validated ${outputs.size} generated files, 27 core values and 19 terminal-extension colors.`);
} else {
  console.log(`Generated ${outputs.size} files from palette/deepseafoam.json.`);
}
