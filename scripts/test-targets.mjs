import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { addChatThemes } from "./chat-themes.mjs";
import { addDesktopThemes } from "./desktop-themes.mjs";
import { composite, contrast, rgb } from "./colors.mjs";

const root = new URL("../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const palette = JSON.parse(await read("palette/deepseafoam.json"));
const vscode = JSON.parse(await read("targets/vscode/themes/deepseafoam-color-theme.json"));
const solid = key => palette.solid[key].value;
const terminal = key => palette.terminal[key].value;
const opaque = /^#[0-9A-F]{6}$/;

function generate(source = palette) {
  const outputs = new Map();
  const context = {
    palette: source,
    syntaxRules: vscode.tokenColors,
    add: (file, content) => {
      assert.ok(!outputs.has(file), `Duplicate output: ${file}`);
      outputs.set(file, content);
    },
    json: value => `${JSON.stringify(value, null, 2)}\n`,
    ...Object.fromEntries(["solid", "overlay", "derived", "heritage", "terminal"]
      .map(group => [group, key => source[group][key].value]))
  };
  addChatThemes(context);
  addDesktopThemes(context);
  return outputs;
}

function parseTelegram(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith("//")) continue;
    const match = line.match(/^([A-Za-z]\w*): (#[0-9A-F]{6}(?:[0-9A-F]{2})?);$/);
    assert.ok(match, `Invalid generated Telegram statement: ${line}`);
    assert.ok(!Object.hasOwn(values, match[1]), `Duplicate Telegram key: ${match[1]}`);
    values[match[1]] = match[2];
  }
  return values;
}

function parseColorTables(text) {
  const sections = {};
  let current;
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith("#")) continue;
    const table = line.match(/^\[colors\.([a-z_.]+)\]$/);
    if (table) {
      assert.ok(!Object.hasOwn(sections, table[1]), `Duplicate color table: ${table[1]}`);
      current = sections[table[1]] = {};
      continue;
    }
    const value = line.match(/^([a-z_]+) = "(#[0-9A-F]{6})"$/);
    assert.ok(current && value, `Outside the generated TOML color-only subset: ${line}`);
    assert.ok(!Object.hasOwn(current, value[1]), `Duplicate color: ${value[1]}`);
    current[value[1]] = value[2];
  }
  return sections;
}

function readable(foreground, background, label) {
  assert.ok(contrast(foreground, background) >= 4.5, `${label}: ${foreground} on ${background}`);
}

test("additional emitters are deterministic, nonmutating and match every generated file", async () => {
  const before = structuredClone(palette);
  const outputs = generate();
  assert.equal(outputs.size, 9);
  assert.deepEqual(outputs, generate());
  assert.deepEqual(palette, before);
  for (const [file, content] of outputs) {
    assert.equal((await read(file)).replace(/\r\n/g, "\n"), content, file);
  }
});

test("each new target derives its colors and metadata from the supplied palette", () => {
  const alternate = structuredClone(palette);
  alternate.version = "9.9.9";
  alternate.solid.base.value = "#010E12";
  alternate.solid.accent.value = "#3CA599";
  const outputs = generate(alternate);
  const chromium = JSON.parse(outputs.get("targets/chromium/manifest.json"));
  assert.equal(chromium.version, alternate.version);
  assert.deepEqual(chromium.theme.colors.frame, rgb(alternate.solid.base.value));
  assert.ok(outputs.get("targets/discord/DeepSeaFoam.theme.css").includes("--control-primary-background-default: #3CA599"));
  assert.equal(parseTelegram(outputs.get("targets/telegram/DeepSeaFoam.tdesktop-theme")).windowBgActive, "#3CA599");
  assert.equal(outputs.get("targets/slack/DeepSeaFoam.txt").split(",")[1], "#3CA599");
  assert.equal(JSON.parse(outputs.get("targets/sublime-text/DeepSeaFoam.sublime-color-scheme")).globals.accent, "#3CA599");
  assert.equal(parseColorTables(outputs.get("targets/alacritty/DeepSeaFoam.toml")).primary.background, "#010E12");
  assert.equal(JSON.parse(outputs.get("targets/jetbrains/resources/DeepSeaFoam.theme.json")).ui["Component.focusColor"], "#3CA599");
  assert.ok(outputs.get("targets/jetbrains/resources/META-INF/plugin.xml").includes("<version>9.9.9</version>"));
});

test("Discord CSS is self-contained, dark-scoped and explicitly unofficial", async () => {
  const css = await read("targets/discord/DeepSeaFoam.theme.css");
  assert.ok(css.startsWith("/**"));
  for (const name of ["name", "author", "description", "version"]) assert.match(css, new RegExp(`\\* @${name} .+`));
  assert.ok(css.includes(`@version ${palette.version}`));
  for (const selector of [".theme-dark", ".theme-darker", ".theme-midnight", ".visual-refresh.theme-dark", ".visual-refresh .theme-dark"]) {
    assert.ok(css.includes(selector));
  }
  for (const key of ["--background-base-low", "--background-primary", "--text-default",
    "--control-primary-background-default", "--control-primary-text-default"]) assert.ok(css.includes(`${key}:`));
  assert.match(css, /Not a native Discord import/);
  assert.match(css, /may violate Discord's terms/);
  assert.doesNotMatch(css, /@import\b|url\s*\(|\bfilter\s*:|--(?:white|black)\s*:|\.theme-light/);
  const values = Object.fromEntries([...css.matchAll(/^\s*(--[\w-]+): (#[0-9A-F]{6}(?:[0-9A-F]{2})?) !important;$/gm)]
    .map(([, key, value]) => [key, value]));
  for (const state of ["default", "hover", "active"]) {
    readable(values[`--control-primary-text-${state}`], values[`--control-primary-background-${state}`], `Discord primary ${state}`);
  }
  readable(values["--button-danger-text"], values["--button-danger-background"], "Discord danger button");
});

test("Telegram has explicit dark core surfaces, readable bubbles and alpha-last shadows", async () => {
  const colors = parseTelegram(await read("targets/telegram/DeepSeaFoam.tdesktop-theme"));
  assert.ok(Object.keys(colors).length >= 200);
  assert.equal(colors.windowBg, solid("base"));
  assert.equal(colors.menuBg, solid("panel"));
  assert.equal(colors.msgServiceFg, solid("warm"));
  assert.equal(colors.msgOutBg, composite(palette.derived.textSelection.value, solid("panel")));
  assert.equal(colors.msgInShadow, palette.overlay.shadowSoft.value);
  for (const direction of ["In", "Out"]) for (const suffix of ["", "Selected"]) {
    for (const field of [`historyText${direction}Fg`, `historyLink${direction}Fg`, `historyFileName${direction}Fg`,
      `msg${direction}DateFg`, `msg${direction}ServiceFg`, `msg${direction}MonoFg`]) {
      readable(colors[`${field}${suffix}`], colors[`msg${direction}Bg${suffix}`], `${field}${suffix}`);
    }
  }
  for (const [fg, bg] of [["windowFg", "windowBg"], ["activeButtonFg", "activeButtonBg"],
    ["activeButtonFgOver", "activeButtonBgOver"], ["msgServiceFg", "msgServiceBg"],
    ["msgServiceFg", "msgServiceBgSelected"], ["dialogsUnreadFg", "dialogsUnreadBg"],
    ["dialogsUnreadFg", "dialogsUnreadBgMuted"], ["sideBarBadgeFg", "sideBarBadgeBgMuted"],
    ["historyComposeAreaFg", "historyComposeAreaBg"], ["toastFg", "toastBg"]]) {
    readable(colors[fg], colors[bg], `Telegram ${fg}`);
  }
});

test("Slack is exactly the modern four-slot preset, with no hidden flags", async () => {
  const csv = (await read("targets/slack/DeepSeaFoam.txt")).replace(/\r\n/g, "\n");
  assert.match(csv, /^(#[0-9A-F]{6},){3}#[0-9A-F]{6}\n$/);
  assert.equal(csv, ["panel", "accent", "document", "error"].map(solid).join(",") + "\n");
});

test("Chromium uses only supported RGB theme keys and no active extension capabilities", async () => {
  const theme = JSON.parse(await read("targets/chromium/manifest.json"));
  assert.deepEqual(Object.keys(theme).sort(), ["description", "manifest_version", "name", "theme", "version"]);
  assert.equal(theme.manifest_version, 3);
  assert.equal(theme.version, palette.version);
  const supported = new Set(["frame", "frame_inactive", "frame_incognito", "frame_incognito_inactive",
    "background_tab", "background_tab_inactive", "background_tab_incognito", "background_tab_incognito_inactive",
    "tab_background_text", "tab_background_text_inactive", "tab_background_text_incognito", "tab_background_text_incognito_inactive",
    "tab_text", "toolbar", "toolbar_text", "toolbar_button_icon", "bookmark_text", "button_background",
    "omnibox_background", "omnibox_text", "ntp_background", "ntp_header", "ntp_link", "ntp_text"]);
  for (const [key, color] of Object.entries(theme.theme.colors)) {
    assert.ok(supported.has(key), key);
    assert.equal(color.length, 3);
    assert.ok(color.every(channel => Number.isInteger(channel) && channel >= 0 && channel <= 255));
  }
  assert.deepEqual(theme.theme.colors.toolbar, rgb(solid("panel")));
  assert.deepEqual(theme.theme.colors.omnibox_background, rgb(solid("base")));
});

test("JetBrains descriptor resolves actual resources and maintains the Islands compatibility boundary", async () => {
  const folder = "targets/jetbrains/resources";
  const descriptor = await read(`${folder}/META-INF/plugin.xml`);
  assert.ok(descriptor.includes(`<version>${palette.version}</version>`));
  assert.match(descriptor, /since-build="253"/);
  assert.match(descriptor, /<depends>com\.intellij\.modules\.platform<\/depends>/);
  assert.doesNotMatch(descriptor, /implementationClass|serviceImplementation|startupActivity/);
  const resource = descriptor.match(/<themeProvider\b[^>]*path="\/([^"]+)"/)?.[1];
  assert.ok(resource);
  const theme = JSON.parse(await read(`${folder}/${resource}`));
  assert.equal(theme.parentTheme, "Islands Dark");
  assert.equal(theme.dark, true);
  const scheme = await read(`${folder}${theme.editorScheme}`);
  assert.match(scheme, /<scheme name="DeepSeaFoam" version="142" parent_scheme="Darcula">/);
  assert.ok(scheme.includes(`<option name="BACKGROUND" value="${solid("base").slice(1)}"`));
  assert.ok(scheme.includes('name="DEFAULT_TAG"'));
  assert.ok(scheme.includes('name="DEFAULT_ATTRIBUTE"'));
  assert.doesNotMatch(scheme, /DEFAULT_MARKUP_TAG|DEFAULT_MARKUP_ATTRIBUTE|DEFAULT_TEXT|FONT_SIZE|FONT_NAME/);
  for (const [key, value] of Object.entries(theme.ui)) {
    for (const color of typeof value === "string" ? [value] : Object.values(value)) {
      assert.match(color, /^#[0-9A-F]{6}(?:[0-9A-F]{2})?$/, key);
    }
  }
  readable(theme.ui["Button.default.foreground"], theme.ui["Button.default.startBackground"], "JetBrains default button");
});

test("Sublime shares syntax roles with target refinements and native RGBA selections", async () => {
  const scheme = JSON.parse(await read("targets/sublime-text/DeepSeaFoam.sublime-color-scheme"));
  assert.equal(scheme.globals.background, solid("base"));
  assert.equal(scheme.globals.selection, palette.derived.textSelection.value);
  assert.equal(scheme.globals.accent, solid("accent"));
  assert.ok(scheme.rules.some(rule => rule.scope.includes("variable.function")));
  assert.ok(scheme.rules.some(rule => rule.scope.includes("constant.character.escape")));
  for (const rule of scheme.rules) {
    assert.ok(rule.scope && !rule.scope.includes("meta."), rule.name);
    for (const field of ["foreground", "background"]) if (rule[field]) assert.match(rule[field], opaque);
    if (rule.font_style) assert.match(rule.font_style, /^(bold|italic|underline)$/);
  }
  readable(scheme.globals.selection_foreground, composite(scheme.globals.selection, solid("base")), "Sublime selection");
});

test("Alacritty is colors-only and preserves every terminal-extension value", async () => {
  const colors = parseColorTables(await read("targets/alacritty/DeepSeaFoam.toml"));
  assert.equal(Object.keys(colors).length, 12);
  assert.deepEqual(colors.primary, { background: solid("base"), foreground: terminal("foreground") });
  assert.equal(colors.cursor.cursor, terminal("cursorColor"));
  assert.equal(colors.selection.background, terminal("selectionBackground"));
  for (const key of ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"]) {
    const source = key === "magenta" ? "purple" : key;
    assert.equal(colors.normal[key], terminal(source));
    assert.equal(colors.bright[key], terminal(`bright${source[0].toUpperCase()}${source.slice(1)}`));
  }
  for (const name of ["search.matches", "search.focused_match", "hints.start", "hints.end", "line_indicator", "footer_bar"]) {
    readable(colors[name].foreground, colors[name].background, `Alacritty ${name}`);
  }
});

test("all target guides document restoration and packaging source mirrors stay identical", async () => {
  for (const target of ["discord", "telegram", "slack", "chromium", "jetbrains", "sublime-text", "alacritty"]) {
    const guide = await read(`targets/${target}/README.md`);
    assert.match(guide, /## Install|## Optional install/);
    assert.match(guide, /## Remove \/ restore/);
    assert.match(guide, /https:\/\//);
  }
  const source = await read("scripts/package-release.ps1");
  assert.equal(await read("scripts/package-release.txt"), source);
});

test("all theme distributions carry the approved MIT license without relicensing showcase artwork", async () => {
  const license = (await read("licenses/MIT.txt")).replace(/\r\n/g, "\n");
  assert.match(license, /^MIT License/);
  for (const target of ["vscode", "visual-studio", "obsidian", "windows-terminal", "firefox", "discord", "telegram", "slack", "chromium", "jetbrains", "sublime-text", "alacritty"]) {
    assert.equal((await read(`targets/${target}/LICENSE`)).replace(/\r\n/g, "\n"), license, target);
  }
  assert.equal((await read("targets/jetbrains/resources/META-INF/LICENSE")).replace(/\r\n/g, "\n"), license);
  const manifest = JSON.parse(await read("targets/vscode/package.json"));
  assert.equal(manifest.license, "MIT");
  assert.ok(manifest.files.includes("LICENSE"));
  assert.equal(manifest.icon, "icon.png");
  const icon = await readFile(new URL("targets/vscode/icon.png", root));
  assert.equal(icon.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(icon.readUInt32BE(16), 128);
  assert.equal(icon.readUInt32BE(20), 128);
  assert.match(await read("LICENSE"), /does not relicense third-party material/);
});
