import assert from "node:assert/strict";
import test from "node:test";
import { decorateMarkdown } from "./markdown-swatches.mjs";
import { readFile } from "node:fs/promises";
import { addLinuxThemes } from "./linux-themes.mjs";
import { composite, contrast } from "./colors.mjs";

const root = new URL("../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const palette = JSON.parse(await read("palette/deepseafoam.json"));
const opaque = /^#[0-9A-F]{6}$/;
const ansi = [
  "black", "red", "green", "yellow", "blue", "purple", "cyan", "white",
  "brightBlack", "brightRed", "brightGreen", "brightYellow",
  "brightBlue", "brightPurple", "brightCyan", "brightWhite"
];
const files = [
  "targets/zsh/DeepSeaFoam.zsh-theme", "targets/zsh/README.md",
  "targets/rofi/DeepSeaFoam.rasi", "targets/rofi/README.md",
  "targets/xfce4-terminal/DeepSeaFoam.theme", "targets/xfce4-terminal/README.md",
  "targets/termux/colors.properties", "targets/termux/README.md"
];

function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}

function generate(source = palette) {
  const outputs = new Map();
  addLinuxThemes({
    palette: source,
    add: (file, content) => {
      assert.ok(!outputs.has(file), `Duplicate output: ${file}`);
      assert.equal(typeof content, "string");
      assert.ok(content.endsWith("\n"), `Missing final newline: ${file}`);
      assert.ok(!content.includes("\r"), `Noncanonical newline: ${file}`);
      outputs.set(file, content);
    },
    ...Object.fromEntries(["solid", "overlay", "derived", "terminal"]
      .map(group => [group, key => source[group][key].value]))
  });
  return outputs;
}

// These parsers check only the deliberately restricted emitted subsets, not native execution.
function parseProperties(text, section) {
  const values = {};
  let sections = 0;
  for (const line of text.split("\n")) {
    if (!line || line.startsWith("#")) continue;
    if (line.startsWith("[")) {
      assert.equal(line, `[${section}]`);
      sections++;
      continue;
    }
    assert.equal(sections, section ? 1 : 0);
    const match = line.match(/^([A-Za-z][A-Za-z0-9]*)=(.+)$/);
    assert.ok(match, `Invalid property line: ${line}`);
    assert.ok(!Object.hasOwn(values, match[1]), `Duplicate key: ${match[1]}`);
    values[match[1]] = match[2];
  }
  assert.equal(sections, section ? 1 : 0);
  return values;
}

function parseRasi(text) {
  text = text.replace(/\/\*[\s\S]*?\*\//g, "").trim();
  assert.ok(text.startsWith('@theme "default"\n'));
  text = text.slice('@theme "default"\n'.length).trim();
  const blocks = {};
  while (text) {
    const match = text.match(/^([\w*, -]+) \{\n([^{}]*)\}\s*/);
    assert.ok(match, `Outside generated Rasi subset: ${text}`);
    const selector = match[1];
    assert.ok(!Object.hasOwn(blocks, selector), `Duplicate selector: ${selector}`);
    const values = blocks[selector] = {};
    for (const line of match[2].trim().split("\n")) {
      const property = line.trim().match(/^([\w-]+): (#[0-9A-F]{6}(?:[0-9A-F]{2})?|@[\w-]+|bold);$/);
      assert.ok(property, `Invalid Rasi property: ${line}`);
      assert.ok(!Object.hasOwn(values, property[1]));
      values[property[1]] = property[2];
    }
    text = text.slice(match[0].length).trim();
  }
  for (const values of Object.values(blocks)) {
    for (const value of Object.values(values)) {
      if (value.startsWith("@")) assert.ok(Object.hasOwn(blocks["*"], value.slice(1)));
    }
  }
  return blocks;
}

function expectedScheme(source) {
  const terminal = key => source.terminal[key].value;
  return {
    Name: source.name,
    ColorForeground: terminal("foreground"),
    ColorBackground: source.solid.base.value,
    ColorCursor: terminal("cursorColor"),
    ColorCursorForeground: source.solid.base.value,
    ColorCursorUseDefault: "FALSE",
    ColorSelection: terminal("foreground"),
    ColorSelectionBackground: terminal("selectionBackground"),
    ColorSelectionUseDefault: "FALSE",
    ColorPalette: ansi.map(terminal).join(";"),
    ColorUseTheme: "FALSE"
  };
}

function expectedTermux(source) {
  return {
    background: source.solid.base.value,
    foreground: source.terminal.foreground.value,
    cursor: source.terminal.cursorColor.value,
    ...Object.fromEntries(ansi.map((role, index) => [`color${index}`, source.terminal[role].value]))
  };
}

function expectedRasi(source) {
  const solid = key => source.solid[key].value;
  const base = solid("base"), panel = solid("panel"), text = solid("text");
  const accent = solid("accent"), error = solid("error"), warm = solid("warm");
  const colors = {
    background: base, foreground: text, "border-color": solid("border"),
    separatorcolor: source.overlay.separator.value
  };
  for (const [state, background] of [["normal", base], ["alternate", panel]]) {
    for (const [kind, foreground] of [["normal", text], ["active", accent], ["urgent", error]]) {
      const prefix = state === "normal" ? kind : `${state}-${kind}`;
      colors[`${prefix}-background`] = background;
      colors[`${prefix}-foreground`] = foreground;
    }
  }
  for (const [kind, background, foreground] of [
    ["normal", composite(source.derived.textSelection.value, base), warm],
    ["active", accent, base], ["urgent", error, base]
  ]) {
    colors[`selected-${kind}-background`] = background;
    colors[`selected-${kind}-foreground`] = foreground;
  }
  return {
    "*": colors,
    window: { "background-color": "@background" },
    "inputbar, message": { "background-color": panel },
    prompt: { "text-color": accent },
    entry: { "text-color": warm, "placeholder-color": solid("faintText"), "cursor-color": solid("lightEdge") },
    "num-filtered-rows, num-rows, textbox-num-sep": { "text-color": solid("faintText") },
    overlay: { "background-color": accent, "text-color": base },
    "element-text": { highlight: "bold" },
    scrollbar: { "handle-color": solid("border") }
  };
}

test("Linux emitter has exactly eight deterministic, nonmutating, fresh outputs", async () => {
  const source = freeze(structuredClone(palette));
  const before = structuredClone(source);
  const output = generate(source);
  assert.deepEqual([...output.keys()], files);
  assert.deepEqual(output, generate(source));
  assert.deepEqual(source, before);
  for (const [file, content] of output) {
    assert.equal((await read(file)).replace(/\r\n/g, "\n"),
      file.endsWith(".md") ? decorateMarkdown(content, file).content : content, file);
  }
});

test("Zsh is one literal PROMPT assignment, with native status, width-aware colors and no side effects", () => {
  const content = generate().get(files[0]);
  const lines = content.split("\n").filter(line => line && !line.startsWith("#"));
  assert.equal(lines.length, 1);
  const solid = key => palette.solid[key].value;
  assert.equal(lines[0],
    `PROMPT='%F{${solid("warm")}}%n%f@%F{${solid("faintText")}}%m%f %F{${solid("accent")}}%1~%f %(?.%F{${solid("accent")}}.%F{${solid("error")}}[%?] )%#%f '`);
  assert.doesNotMatch(lines[0], /[$`\\!;\r\n]/);
  assert.doesNotMatch(content, /\b(?:RPROMPT|setopt|unsetopt|autoload|zmodload|precmd|preexec|zstyle|LS_COLORS|eval)\s*=/);
  assert.ok(!content.includes("\x1b"), "No raw terminal-control output");
});

test("rofi retains default layout and maps all nine normal/active/urgent selection states", () => {
  const content = generate().get(files[2]);
  const actual = parseRasi(content);
  assert.deepEqual(actual, expectedRasi(palette));
  assert.equal(Object.keys(actual["*"]).length, 22);
  assert.doesNotMatch(content, /\b(?:configuration|font|width|height|padding|margin|children|location|modi|run-command)\s*[:{]/);
  assert.equal(actual["*"].separatorcolor, palette.overlay.separator.value);
  assert.match(actual["*"]["selected-normal-background"], opaque);
  for (const prefix of [
    "normal", "active", "urgent", "alternate-normal", "alternate-active",
    "alternate-urgent", "selected-normal", "selected-active", "selected-urgent"
  ]) {
    const colors = actual["*"];
    assert.ok(contrast(colors[`${prefix}-foreground`], colors[`${prefix}-background`]) >= 4.5, prefix);
  }
});

test("Xfce uses one native Scheme, all nineteen terminal values and exact ANSI slot order", () => {
  const scheme = parseProperties(generate().get(files[4]), "Scheme");
  assert.deepEqual(scheme, expectedScheme(palette));
  assert.equal(scheme.ColorPalette.split(";").length, 16);
  assert.equal(scheme.ColorPalette.endsWith(";"), false);
  for (const color of scheme.ColorPalette.split(";")) assert.match(color, opaque);
  for (const { value } of Object.values(palette.terminal)) {
    assert.ok(Object.values(scheme).some(property => property.split(";").includes(value)), value);
  }
  assert.equal(scheme.ColorSelection, palette.terminal.foreground.value);
  assert.equal(scheme.ColorSelectionBackground, palette.terminal.selectionBackground.value);
  assert.ok(!Object.hasOwn(scheme, "FontName"));
});

test("Termux emits only recognized foreground/background/cursor and color0-15 keys", () => {
  const properties = parseProperties(generate().get(files[6]));
  assert.deepEqual(properties, expectedTermux(palette));
  assert.deepEqual(Object.keys(properties), ["background", "foreground", "cursor", ...ansi.map((_, index) => `color${index}`)]);
  assert.equal(Object.keys(properties).length, 19, "Background plus eighteen supported terminal values");
  Object.values(properties).forEach(value => assert.match(value, opaque));
  assert.ok(!Object.values(properties).includes(palette.terminal.selectionBackground.value));
  assert.ok(!Object.keys(properties).some(key => /selection|font|chrome|shortcut/.test(key)));
});

test("all emitted colors and metadata propagate an alternate supplied palette without hidden reads", async () => {
  const alternate = structuredClone(palette);
  alternate.name = "Alternate Foam";
  alternate.version = "9.8.7";
  let index = 1;
  for (const group of ["solid", "overlay", "derived", "terminal"]) {
    for (const entry of Object.values(alternate[group])) {
      const color = `#${(0x123400 + index++ * 71).toString(16).toUpperCase()}`;
      entry.value = entry.value.length === 9 ? `${color}7D` : color;
    }
  }
  const before = structuredClone(alternate);
  const output = generate(freeze(alternate));
  assert.deepEqual(alternate, before);
  assert.deepEqual(parseProperties(output.get(files[4]), "Scheme"), expectedScheme(alternate));
  assert.deepEqual(parseProperties(output.get(files[6])), expectedTermux(alternate));
  assert.deepEqual(parseRasi(output.get(files[2])), expectedRasi(alternate));
  const promptColors = [...output.get(files[0]).matchAll(/%F\{(#[0-9A-F]{6})\}/g)].map(match => match[1]);
  assert.deepEqual(promptColors, ["warm", "faintText", "accent", "accent", "error"].map(key => alternate.solid[key].value));
  for (const file of files.filter(file => file.endsWith("README.md"))) {
    assert.ok(output.get(file).includes("# Alternate Foam for "));
    assert.ok(output.get(file).includes("**9.8.7**"));
  }
  const module = await read("scripts/linux-themes.mjs");
  assert.doesNotMatch(module, /(?:from\s*["']node:|readFile|writeFile|fetch\(|process\.|import\s*\()/);
  assert.deepEqual([...module.matchAll(/^import .+ from "(.+)";$/gm)].map(match => match[1]), ["./colors.mjs"]);
});

test("guides disclose native limits, safe restoration and official pinned references", () => {
  const output = generate();
  for (const file of files.filter(file => file.endsWith("README.md"))) {
    const guide = output.get(file);
    assert.match(guide, /## (?:Back up \/ install|Try \/ install)/);
    assert.match(guide, /## Remove \/ restore/);
    assert.match(guide, /Native application execution and visual validation were not performed/);
    assert.match(guide, /github\.com\/[^/]+\/[^/]+\/blob\/[a-f0-9]{40}\//);
  }
  assert.match(output.get(files[1]), /Zsh does \*\*not\*\* own the terminal background/);
  assert.match(output.get(files[3]), /discard[\s\S]*previous theme tree/);
  assert.match(output.get(files[5]), /resets omitted color properties/);
  assert.match(output.get(files[5]), /Xfconf/);
  assert.match(output.get(files[7]), /No selection key is supported/);
  assert.match(output.get(files[7]), /must not replace that broader settings file/);
});
