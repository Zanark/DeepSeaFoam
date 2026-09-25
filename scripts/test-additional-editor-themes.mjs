import assert from "node:assert/strict";
import test from "node:test";
import { decorateMarkdown } from "./markdown-swatches.mjs";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { addAdditionalEditorThemes } from "./additional-editor-themes.mjs";
import { composite, contrast } from "./colors.mjs";

const root = new URL("../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const palette = JSON.parse(await read("palette/deepseafoam.json"));
const nppPath = "targets/notepad-plus-plus/DeepSeaFoam.xml";
const godotPath = "targets/godot/DeepSeaFoam.tet";
const paths = [nppPath, "targets/notepad-plus-plus/README.md", godotPath, "targets/godot/README.md"];
const hash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");

function freeze(value) {
  for (const child of Object.values(value)) if (child && typeof child === "object") freeze(child);
  return Object.freeze(value);
}

function generate(source = palette) {
  const outputs = new Map();
  addAdditionalEditorThemes({
    palette: source,
    add: (file, content) => {
      assert.ok(!outputs.has(file), `Duplicate output: ${file}`);
      assert.ok(paths.includes(file), `Outside owned scope: ${file}`);
      assert.equal(typeof content, "string");
      assert.ok(content.endsWith("\n"));
      assert.ok(!content.includes("\r"));
      outputs.set(file, content);
    },
    ...Object.fromEntries(["solid", "overlay", "derived", "heritage"]
      .map(group => [group, key => source[group][key].value]))
  });
  return outputs;
}

// A strict parser for the entire generated XML subset, not a claim to implement arbitrary XML.
function parseNotepad(text) {
  const lines = text.trimEnd().split("\n");
  assert.equal(lines.shift(), '<?xml version="1.0" encoding="UTF-8"?>');
  assert.match(lines.shift(), /^<!-- [^-]*(?:-(?!-)[^-]*)* -->$/);
  const stack = [];
  const result = { lexers: [], globals: [] };
  let lexer;
  const structuralTags = [];
  for (const line of lines) {
    const tag = line.trim();
    const closing = tag.match(/^<\/(\w+)>$/);
    if (closing) {
      assert.equal(stack.pop(), closing[1]);
      continue;
    }
    const opening = tag.match(/^<(\w+)((?: \w+="[^"<]*")*)( ?\/)?>$/);
    assert.ok(opening, `Invalid XML line: ${line}`);
    const [, name, raw, selfClosing] = opening;
    const attributes = {};
    for (const [, key, encoded] of raw.matchAll(/ (\w+)="([^"<]*)"/g)) {
      assert.ok(!Object.hasOwn(attributes, key), `Duplicate XML attribute ${key}`);
      assert.doesNotMatch(encoded, /&(?!amp;|lt;|gt;|quot;|apos;)/);
      attributes[key] = encoded.replace(/&(amp|lt|gt|quot|apos);/g,
        (_, entity) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" })[entity]);
    }
    const parent = stack.at(-1);
    if (name === "NotepadPlus" || name === "LexerStyles" || name === "GlobalStyles") {
      assert.equal(parent, name === "NotepadPlus" ? undefined : "NotepadPlus");
      assert.deepEqual(attributes, {});
      assert.ok(!selfClosing);
      structuralTags.push(name);
    } else if (name === "LexerType") {
      assert.equal(parent, "LexerStyles");
      assert.ok(!selfClosing);
      assert.deepEqual(Object.keys(attributes), ["name", "desc", "ext"]);
      assert.equal(attributes.ext, "");
      assert.ok(!result.lexers.some(item => item.name === attributes.name));
      lexer = { ...attributes, styles: [] };
      result.lexers.push(lexer);
    } else {
      assert.ok(name === "WordsStyle" || name === "WidgetStyle", `Unknown element: ${name}`);
      assert.equal(parent, name === "WordsStyle" ? "LexerType" : "GlobalStyles");
      assert.ok(selfClosing);
      assert.match(attributes.styleID, /^(?:0|[1-9]\d*)$/);
      assert.ok(attributes.name);
      const allowed = ["name", "styleID", "fgColor", "bgColor", "fontName", "fontStyle", "fontSize",
        ...(name === "WordsStyle" ? ["keywordClass"] : [])];
      for (const [key, value] of Object.entries(attributes)) {
        assert.ok(allowed.includes(key), `Unknown style attribute ${key}`);
        if (key === "fgColor" || key === "bgColor") assert.match(value, /^[0-9A-F]{6}$/);
        if (key === "fontName" || key === "fontSize") assert.equal(value, "");
        if (key === "fontStyle") assert.match(value, /^[012]$/);
        if (key === "keywordClass") assert.match(value, /^(?:instre[12]|type[1-5]|substyle[1-8])$/);
      }
      if (name === "WordsStyle") {
        assert.ok(attributes.fgColor && attributes.bgColor);
        assert.ok(!lexer.styles.some(style => style.styleID === attributes.styleID));
        lexer.styles.push(attributes);
      } else {
        assert.ok(!result.globals.some(style => style.name === attributes.name));
        result.globals.push(attributes);
      }
    }
    if (!selfClosing) stack.push(name);
  }
  assert.deepEqual(stack, []);
  assert.deepEqual(structuralTags, ["NotepadPlus", "LexerStyles", "GlobalStyles"]);
  return result;
}

function parseGodot(text) {
  const result = {};
  let section = false;
  for (const line of text.split("\n")) {
    if (!line || line.startsWith(";")) continue;
    if (line === "[color_theme]") {
      assert.equal(section, false, "Duplicate section");
      section = true;
      continue;
    }
    const match = line.match(/^([a-z_]+(?:\/[a-z_]+)?)="(#[0-9A-F]{6}(?:[0-9A-F]{2})?)"$/);
    assert.ok(section && match, `Invalid Godot ConfigFile color string: ${line}`);
    assert.ok(!Object.hasOwn(result, match[1]), `Duplicate Godot key ${match[1]}`);
    result[match[1]] = match[2];
  }
  assert.ok(section);
  return result;
}

// Independently extracted from upstream stylers.model.xml at 40f896e6f6c49a29b6ca3f559696dd786f40152d.
// Each digest covers sorted [numeric styleID, exact style name, keywordClass or ""] tuples.
const lexerContracts = {
  bash: ["Bash", 22, "d52cd24b31f5acb0ad3ad9acfb422d7db8665c128851fb526885cfe738b69632"],
  batch: ["Batch", 9, "eef0f18222f99022eb827e8a8b51e52b19c3a66117527fe6437daa5d21a1ceee"],
  c: ["C", 26, "f6e1521db1ce8bc9d2d76ab39da9bd7b19e320f5de30647deb1879a58a080957"],
  cpp: ["C++", 27, "f2540eaf187b93757082b4008eb01da6ed879917d1716a92d8affe362234560c"],
  cs: ["C#", 26, "f6e1521db1ce8bc9d2d76ab39da9bd7b19e320f5de30647deb1879a58a080957"],
  css: ["CSS", 20, "5fa4a9b0c1d4ef0d33fba264c6967df9170609fd14d38f0cfc5f89948795c352"],
  diff: ["diff file", 7, "c8dc1307bd27b99241cb15153f73a6cdc16503119d8306238dbef4497bec6024"],
  go: ["Go", 28, "e97bcfe932db5b576c4e665f73b66e1b12756ed54aaef2d8f0dc9832253c9b05"],
  html: ["HTML", 27, "29b4c7a7340510f3722676a15778385e424be6599b313600ba7b5dcc72aa54e7"],
  java: ["Java", 23, "01ce1f468bc42c54ac89961604da87afe2dd09c0fa2b94680287630f4fc38ec3"],
  javascript: ["JavaScript (embedded)", 21, "479edf4a1d6cb0f565970301351c54bb06fa9e2f8f869d54b10a5151d69a1ca8"],
  "javascript.js": ["JavaScript", 25, "aa8d733fbc69b72781fbcdd63ab27f6aafc84f3c4937ee0b8862da6e46d01240"],
  json: ["JSON", 14, "5638e18b20ed321e337fdb6b122ece794e9fcb002aaa60f60d23089acf5091ff"],
  makefile: ["Makefile", 7, "b98663dbed7765c7eae2adc630e8bc32b5874f0d6d8f18efc4cddf191ea707dd"],
  powershell: ["PowerShell", 17, "f86508e6312c1619b215aefbf1b30f4721dac2fcd82f66e5e04e80886abd4658"],
  props: ["Properties file", 6, "d8fe86fe8426be9b94aa8ce9deb864f6fe5473928695cc366776fa495bb96f27"],
  python: ["Python", 28, "ed5ee20db929c1aa7e4174ff96cdec30d226c9d67dc6d1345e92ca14a45a96ee"],
  rust: ["Rust", 27, "00f94abe13f5fe3f02d7a773871a2cd381e9604fb6e36f6748cbb2eed4e74c23"],
  sql: ["SQL", 11, "ed96998de4664f10f7f6c68e4e60e6c82c037a00913e6913ff7d85bac6c13bb9"],
  typescript: ["TypeScript", 25, "1e041dee68b9c0c1edbae595cd1a8c0c73901dd8b3279c667d5ba101a4696145"],
  xml: ["XML", 28, "11554b6f52aaa6c5c3e654186c2ae7c2f01df8df157672ad059dbe81935cf430"],
  yaml: ["YAML", 9, "cc4f76c508ac48d270707174d5c5f7b9a557cb3a786e71d77de7a9d587ff6951"],
  searchResult: ["Search result", 5, "eec5608349b94a8a6627a535749cf8c0133906fe42588d884647d0063c444ba6"]
};

function expectedGodot(source) {
  const result = {};
  const roles = {
    solid: {
      base: "background_color caret_background_color",
      panel: "completion_background_color current_line_color",
      text: "text_color doc_comment_color completion_font_color",
      faintText: "comment_color line_number_color",
      warm: "text_selected_color function_color gdscript/function_definition_color",
      accent: "string_color gdscript/node_path_color gdscript/string_name_color completion_scroll_hovered_color bookmark_color gdscript/node_reference_color",
      document: "keyword_color control_flow_keyword_color safe_line_number_color comment_markers/notice_color",
      lightEdge: "caret_color",
      border: "completion_scroll_color code_folding_color",
      error: "brace_mismatch_color breakpoint_color comment_markers/critical_color",
      warning: "number_color executing_line_color comment_markers/warning_color"
    },
    heritage: {
      blue: "base_type_color engine_type_color user_type_color gdscript/global_function_color",
      violet: "symbol_color member_variable_color gdscript/annotation_color",
      magenta: "string_placeholder_color"
    },
    overlay: {
      hover: "completion_existing_color word_highlighted_color folded_code_region_color",
      separator: "line_length_guideline_color",
      guide: "search_result_border_color"
    },
    derived: {
      textSelection: "completion_selected_color selection_color search_result_color",
      errorBackground: "mark_color"
    }
  };
  for (const [group, entries] of Object.entries(roles)) for (const [role, keys] of Object.entries(entries)) {
    for (const key of keys.split(" ")) {
      assert.ok(!Object.hasOwn(result, key));
      result[key] = source[group][role].value;
    }
  }
  result.warning_color = `${source.solid.warning.value}26`;
  return result;
}

function alternatePalette() {
  const source = structuredClone(palette);
  source.name = "Alternate Palette";
  source.version = "9.9.9";
  let index = 1;
  for (const group of ["solid", "heritage", "overlay", "derived"]) {
    for (const entry of Object.values(source[group])) {
      const color = `#${(0x120000 + index++ * 0x102).toString(16).toUpperCase()}`;
      entry.value = color + (entry.value.length === 9 ? "73" : "");
    }
  }
  return source;
}

test("editor ports emit exactly four deterministic, current, nonmutating artifacts", async () => {
  const source = freeze(structuredClone(palette));
  const before = structuredClone(source);
  const outputs = generate(source);
  assert.deepEqual([...outputs.keys()], paths);
  assert.deepEqual(outputs, generate(source));
  assert.deepEqual(source, before);
  for (const [file, content] of outputs) {
    assert.equal((await read(file)).replace(/\r\n/g, "\n"),
      file.endsWith(".md") ? decorateMarkdown(content, file).content : content, file);
  }
});

test("Notepad++ XML recognizes every lexer, style ID, keyword class and global entry", () => {
  const parsed = parseNotepad(generate().get(nppPath));
  assert.deepEqual(parsed.lexers.map(lexer => lexer.name), Object.keys(lexerContracts));
  for (const lexer of parsed.lexers) {
    const [description, count, digest] = lexerContracts[lexer.name];
    assert.equal(lexer.desc, description);
    assert.equal(lexer.styles.length, count);
    const contract = lexer.styles.map(style => [+style.styleID, style.name, style.keywordClass ?? ""])
      .sort((a, b) => a[0] - b[0]);
    assert.equal(hash(contract), digest, `${lexer.name}: pinned source contract`);
  }
  assert.equal(parsed.lexers.reduce((count, lexer) => count + lexer.styles.length, 0), 438);
  assert.equal(parsed.lexers.at(-1).name, "searchResult");
  assert.equal(parsed.globals.length, 53);
  assert.equal(hash(parsed.globals.map(style => [style.name, +style.styleID,
    Object.hasOwn(style, "fgColor"), Object.hasOwn(style, "bgColor")])),
  "5ab824c76cea2fd4f5200a5ff0cc767b543cce764f630629f3387aed5be273a1");
});

test("Notepad++ maps selection, caret, line, marker, gutter and syntax roles deliberately", () => {
  const parsed = parseNotepad(generate().get(nppPath));
  const globals = Object.fromEntries(parsed.globals.map(style => [style.name, style]));
  const s = key => palette.solid[key].value.slice(1);
  const h = key => palette.heritage[key].value.slice(1);
  const selected = composite(palette.derived.textSelection.value, palette.solid.base.value).slice(1);
  assert.equal(globals["Default Style"].bgColor, s("base"));
  assert.equal(globals["Default Style"].fgColor, s("text"));
  assert.equal(globals["Selected text colour"].bgColor, selected);
  assert.equal(globals["Multi-selected text color"].bgColor, selected);
  assert.equal(globals["Selected text colour"].fgColor, s("warm"));
  assert.equal(globals["Caret colour"].fgColor, s("lightEdge"));
  assert.equal(globals["Multi-edit carets color"].fgColor, s("accent"));
  assert.equal(globals["Current line background colour"].bgColor, s("panel"));
  assert.equal(globals["Indent guideline style"].fgColor,
    composite(palette.overlay.separator.value, palette.solid.base.value).slice(1));
  for (const name of ["Bookmark margin", "Line number margin", "Change History margin", "Fold margin"]) {
    assert.equal(globals[name].bgColor, s("panel"));
  }
  assert.equal(globals["Change History modified"].bgColor, s("warning"));
  assert.equal(globals["Change History saved"].bgColor, s("document"));
  assert.equal(globals["Bad brace colour"].fgColor, s("error"));
  assert.equal(globals["Smart Highlighting"].bgColor, s("accent"));
  assert.equal(globals["Find Mark Style"].bgColor, s("warning"));
  const markerColors = [s("accent"), h("orange"), s("warning"), h("violet"), s("document")];
  markerColors.forEach((color, index) => assert.equal(globals[`Mark Style ${index + 1}`].bgColor, color));
  const word = (lexer, id) => parsed.lexers.find(item => item.name === lexer).styles.find(style => +style.styleID === id);
  for (const [lexer, id, color] of [
    ["cpp", 5, s("document")], ["cpp", 6, s("accent")], ["cpp", 4, s("warning")],
    ["cpp", 9, h("orange")], ["cpp", 10, h("violet")], ["cpp", 16, h("blue")],
    ["javascript.js", 5, s("document")], ["javascript", 47, s("document")],
    ["python", 9, s("warm")], ["powershell", 9, s("warm")], ["json", 13, s("error")],
    ["rust", 20, s("error")], ["yaml", 8, s("error")], ["diff", 5, s("error")],
    ["diff", 6, s("document")], ["diff", 2, s("accent")], ["searchResult", 2, s("accent")],
    ["html", 1, h("blue")], ["xml", 3, h("violet")], ["json", 5, h("magenta")],
    ["html", 10, h("magenta")], ["xml", 10, h("magenta")],
    ["json", 11, s("warning")], ["json", 12, s("document")], ["yaml", 3, s("warning")],
    ...["c", "cpp", "cs", "java", "go"].map(lexer => [lexer, 7, s("warning")]),
    ["rust", 15, s("warning")], ["rust", 23, s("warning")],
    ["javascript.js", 7, s("accent")], ["typescript", 7, s("accent")],
    ["python", 4, s("accent")], ["bash", 6, s("accent")], ["powershell", 3, s("accent")]
  ]) assert.equal(word(lexer, id).fgColor, color, `${lexer} style ${id}`);
  assert.equal(word("searchResult", 4).bgColor,
    composite(palette.derived.textSelection.value, palette.solid.panel.value).slice(1));
  for (const lexer of parsed.lexers.filter(item => item.name !== "searchResult")) {
    for (const style of lexer.styles) {
      assert.equal(style.bgColor, s("base"));
      if (style.name === "NUMBER") assert.equal(style.fgColor, s("warning"));
    }
  }
});

test("native syntax aligns with established editor rules while escapes and status roles stay distinct", async () => {
  const vscode = JSON.parse(await read("targets/vscode/themes/deepseafoam-color-theme.json"));
  const syntax = Object.fromEntries(vscode.tokenColors.map(rule => [rule.name, rule.settings.foreground]));
  const outputs = generate();
  const npp = parseNotepad(outputs.get(nppPath));
  const cpp = npp.lexers.find(lexer => lexer.name === "cpp");
  const godot = parseGodot(outputs.get(godotPath));
  for (const [name, id, key, role] of [
    ["Numbers and constants", 4, "number_color", "warning"],
    ["Keywords and storage", 5, "keyword_color", "document"],
    ["Strings", 6, "string_color", "accent"]
  ]) {
    assert.equal(syntax[name], palette.solid[role].value);
    assert.equal(`#${cpp.styles.find(style => +style.styleID === id).fgColor}`, syntax[name]);
    assert.equal(godot[key], syntax[name]);
  }
  assert.equal(godot.function_color, syntax.Functions);
  assert.equal(godot.base_type_color, syntax["Types and classes"]);
  assert.equal(godot.control_flow_keyword_color, syntax["Keywords and storage"]);
  for (const key of ["gdscript/node_path_color", "gdscript/string_name_color"]) {
    assert.equal(godot[key], syntax.Strings);
  }
  assert.equal(godot.string_placeholder_color, palette.heritage.magenta.value);
  assert.notEqual(godot.string_placeholder_color, godot.number_color);
  assert.equal(godot.safe_line_number_color, palette.solid.document.value);
  assert.equal(godot["comment_markers/notice_color"], palette.solid.document.value);
  assert.equal(godot.executing_line_color, palette.solid.warning.value);
  assert.equal(godot.bookmark_color, palette.solid.accent.value);
  assert.equal(godot.breakpoint_color, palette.solid.error.value);
});

test("Godot exports all 49 native keys as HTML RGB/RGBA strings in one ConfigFile section", () => {
  const text = generate().get(godotPath);
  const colors = parseGodot(text);
  const keys = Object.keys(colors);
  assert.deepEqual(keys, [...keys].sort());
  assert.equal(keys.length, 49);
  // Independently extracted from EditorSettings::get_godot2_text_editor_theme at ed1daf0bf001b61586d9930840f2f1394092c079.
  assert.equal(hash(keys), "626a2510d2ffff6c0e67bbbe918c69e7a9b5244a99781cae79e2d64eb5a9ba00");
  assert.deepEqual(colors, expectedGodot(palette));
  assert.doesNotMatch(text, /\[gd_resource\]|Color\(|interface\/|text_editor\/theme\/highlighting\/|font_size|shortcut/);
});

test("Godot overlays retain alpha last while Notepad++ explicitly composites opaque selections", () => {
  const outputs = generate();
  const colors = parseGodot(outputs.get(godotPath));
  assert.equal(colors.selection_color, "#00A59126");
  assert.equal(colors.line_length_guideline_color, "#586E7566");
  assert.equal(colors.word_highlighted_color, "#586E7533");
  assert.equal(colors.search_result_border_color, "#00A59188");
  assert.equal(colors.mark_color, "#E84A5F26");
  assert.equal(colors.warning_color, "#EBE56526");
  const bytes = colors.selection_color.slice(1).match(/../g).map(value => parseInt(value, 16));
  assert.deepEqual(bytes, [0, 165, 145, 38]);
  const selected = parseNotepad(outputs.get(nppPath)).globals.find(style => style.name === "Selected text colour");
  assert.equal(`#${selected.bgColor}`, composite(colors.selection_color, colors.background_color));
  for (const [foreground, background] of [
    [colors.text_color, colors.background_color],
    [colors.comment_color, colors.background_color],
    [colors.text_selected_color, composite(colors.selection_color, colors.background_color)],
    [colors.completion_font_color, colors.completion_background_color]
  ]) assert.ok(contrast(foreground, background) >= 4.5, `${foreground} on ${background}`);
});

test("every emitted color propagates a modified supplied palette, including composites, without mutation", () => {
  const source = freeze(alternatePalette());
  const before = structuredClone(source);
  const original = generate();
  const outputs = generate(source);
  assert.deepEqual(parseGodot(outputs.get(godotPath)), expectedGodot(source));
  const replacements = new Map();
  for (const group of ["solid", "heritage"]) for (const key of Object.keys(palette[group])) {
    replacements.set(palette[group][key].value.slice(1), source[group][key].value.slice(1));
  }
  for (const [group, role, background] of [
    ["derived", "textSelection", "base"], ["derived", "textSelection", "panel"],
    ["overlay", "separator", "base"]
  ]) replacements.set(
    composite(palette[group][role].value, palette.solid[background].value).slice(1),
    composite(source[group][role].value, source.solid[background].value).slice(1));
  for (const [group, role] of [
    ["solid", "warning"], ["solid", "document"], ["heritage", "blue"],
    ["heritage", "orange"], ["heritage", "magenta"]
  ]) replacements.set(
    composite(`${palette[group][role].value}26`, palette.solid.panel.value).slice(1),
    composite(`${source[group][role].value}26`, source.solid.panel.value).slice(1));
  const expected = original.get(nppPath).replace(/((?:fgColor|bgColor)=")([0-9A-F]{6})"/g, (_, prefix, value) => {
    assert.ok(replacements.has(value), `Untracked native color ${value}`);
    return `${prefix}${replacements.get(value)}"`;
  });
  assert.equal(outputs.get(nppPath), expected);
  parseNotepad(outputs.get(nppPath));
  for (const file of paths.filter(file => file.endsWith("README.md"))) {
    assert.ok(outputs.get(file).startsWith("# Alternate Palette"));
    assert.ok(outputs.get(file).includes("**9.9.9**"));
    for (const role of ["base", "panel", "accent", "text", "faintText", "warm", "lightEdge", "border", "document", "warning", "error"]) {
      assert.ok(outputs.get(file).includes(source.solid[role].value), `${file}: ${role}`);
    }
  }
  assert.deepEqual(source, before);
  assert.deepEqual(outputs, generate(source));
});

test("unused terminal, preview and inactive heritage colors cannot leak into editor ports", () => {
  const source = structuredClone(palette);
  for (const group of ["terminal", "preview"]) for (const entry of Object.values(source[group])) entry.value = "#010203";
  for (const key of ["base03", "base02", "base00"]) source.heritage[key].value = "#040506";
  assert.deepEqual(generate(source), generate());
});

test("guides provide native install, reversible scope, pinned evidence and honest limitations", () => {
  const outputs = generate();
  const npp = outputs.get(paths[1]);
  const godot = outputs.get(paths[3]);
  for (const text of [npp, godot]) {
    assert.match(text, /## Remove \/ restore/);
    assert.match(text, /Back up|back up/);
    assert.match(text, /No .*runtime\/visual|No Godot engine import or visual/);
    assert.match(text, /Solarized/);
    assert.match(text, /LICENSE/);
  }
  assert.ok(npp.includes("%APPDATA%\\Notepad++\\themes\\"));
  assert.ok(npp.includes("8.9.8"));
  assert.ok(npp.includes("40f896e6f6c49a29b6ca3f559696dd786f40152d"));
  assert.ok(npp.includes("does not recolor all Notepad++ chrome"));
  assert.ok(npp.includes("Apply custom color to selected text"));
  assert.ok(npp.includes("Global override"));
  assert.ok(godot.includes("File -> Theme -> Save Theme As..."));
  assert.ok(godot.includes("Theme -> Import Theme..."));
  assert.ok(godot.includes("%APPDATA%\\Godot\\text_editor_themes\\"));
  assert.ok(godot.includes("4.7.2"));
  assert.ok(godot.includes("ed1daf0bf001b61586d9930840f2f1394092c079"));
  assert.ok(godot.includes("interface/theme/color_preset"));
  assert.ok(godot.includes("not a game/runtime"));
  assert.ok(godot.includes("not a\npixel-exact mapping"));
});

test("format checks reject malformed XML and unsafe or duplicate ConfigFile values", () => {
  const outputs = generate();
  const npp = outputs.get(nppPath);
  const godot = outputs.get(godotPath);
  assert.throws(() => parseNotepad(npp.replace('fgColor="93A1A1"', 'fgColor="#93A1A1"')));
  assert.throws(() => parseNotepad(npp.replace("</LexerStyles>", "</GlobalStyles>")));
  assert.throws(() => parseNotepad(npp.replace('name="bash"', 'name="bash" name="Other"')));
  assert.throws(() => parseGodot(`${godot}selection_color="#123456"\n`));
  assert.throws(() => parseGodot(godot.replace('selection_color="#00A59126"', "selection_color=Color(0, 1, 0, 0.15)")));
  assert.throws(() => parseGodot(`${godot}[interface]\n`));
});
