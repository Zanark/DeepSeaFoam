import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { rgb, hsl, oklch, pastelVariant, shadeColor, composite, contrast } from "./colors.mjs";
import { lightTokens, validateLightPalette, lightPaletteCss, lightPaletteGroups } from "./light-palette.mjs";

const palette = JSON.parse(await readFile(new URL("../palette/deepseafoam.json", import.meta.url), "utf8"));
const colors = Object.fromEntries(Object.entries(palette.solid).map(([name, entry]) => [name, entry.value]));
const light = JSON.parse(await readFile(new URL("../palette/harbor-daylight.json", import.meta.url), "utf8"));

test("Harbor Daylight preserves the twelve supplied solids and four alpha-last overlays", () => {
  assert.deepEqual(Object.fromEntries(Object.entries(light.solid).map(([name, entry]) => [name, entry.value])), {
    background: "#F3F2E9", surface: "#E3ECE7", paper: "#FCFAF2", text: "#355451",
    muted: "#536B66", heading: "#173D3A", border: "#6B857E", accent: "#006F63",
    accentHover: "#00594F", document: "#247449", warning: "#77600E", error: "#AD3E55"
  });
  assert.deepEqual(Object.fromEntries(Object.entries(light.overlay).map(([name, entry]) => [name, entry.value])), {
    separator: "#6B857E66", hover: "#6B857E1A", selection: "#006F631F", shadow: "#00000014"
  });
  validateLightPalette(light, palette);
});

test("light aliases share source colors without mutation or inventing extra solids", () => {
  const before = JSON.stringify([light, palette]);
  const tokens = lightTokens(light, palette);
  assert.equal(tokens.buttonText, tokens.paper);
  assert.equal(tokens.safetyFill, colors.warning);
  assert.equal(tokens.safetyInk, colors.base);
  assert.equal(tokens.sunset, palette.heritage.orange.value);
  assert.equal(tokens.pearl, colors.lightEdge);
  assert.equal(lightPaletteCss(light, palette), lightPaletteCss(light, palette));
  assert.equal(JSON.stringify([light, palette]), before);
  const changed = structuredClone(light);
  changed.solid.paper.value = "#FAFAF0";
  assert.equal(lightTokens(changed, palette).buttonText, "#FAFAF0");
  changed.aliases.buttonText = "missing";
  assert.throws(() => lightTokens(changed, palette), /Unknown light alias/);
  changed.aliases.buttonText = "paper";
  changed.shared.pearl.token = "missing";
  assert.throws(() => lightTokens(changed, palette), /Unknown shared color/);
});

test("daylight selection and hover deliberately replace unsafe inherited ink", () => {
  const t = lightTokens(light, palette);
  assert.deepEqual([t.background, t.surface, t.paper].map(surface => composite(t.selection, surface)),
    ["#D5E2D9", "#C7DDD7", "#DDE9E1"]);
  assert.equal(composite(t.hover, t.surface), "#D7E1DC");
  for (const overlay of [t.selection, t.hover]) {
    const background = composite(overlay, t.surface);
    assert.ok(contrast(t.heading, background) >= 4.5);
    assert.ok(contrast(t.muted, background) < 4.5);
  }
  assert.ok(contrast(t.border, composite(t.hover, t.surface)) < 3);
  assert.ok(contrast(t.accent, t.surface) >= 4.5);
  assert.ok(contrast(colors.accent, t.surface) < 3);
  const css = lightPaletteCss(light, palette);
  assert.match(css, /\.harbor-daylight ::selection \{ color: var\(--heading\); background: var\(--selection\); \}/);
  assert.match(css, /\.daylight-action \*::selection \{ color: var\(--button-text\); background: var\(--accent-hover\); \}/);
  assert.ok(contrast(t.buttonText, t.accentHover) >= 4.5);
});

test("light generation rejects invalid alpha and insufficient-contrast candidates", () => {
  for (const [group, name, value] of [
    ["solid", "border", "#78928C"], ["solid", "accent", "#00A591"],
    ["overlay", "shadow", "#00000020"], ["overlay", "hover", "#6B857E33"]
  ]) {
    const changed = structuredClone(light);
    changed[group][name].value = value;
    assert.throws(() => validateLightPalette(changed, palette));
  }
});

test("generated light site data, reusable CSS and visible references stay aligned", async () => {
  const read = async file => (await readFile(new URL(`../${file}`, import.meta.url), "utf8")).replace(/\r\n/g, "\n");
  const site = JSON.parse(await read("site/palette.json"));
  assert.deepEqual(site.light, lightPaletteGroups(light));
  const css = lightPaletteCss(light, palette);
  assert.equal(await read("palette/harbor-daylight.css"), css);
  assert.ok((await read("site/palette.css")).endsWith(css));
  const readme = await read("README.md");
  const reference = await read("docs/PALETTE.md");
  for (const group of ["solid", "overlay"]) {
    for (const entry of Object.values(light[group])) {
      const file = `light-swatches/${entry.value.slice(1).toLowerCase()}.svg`;
      assert.ok(reference.includes(file));
      assert.ok((await read(`docs/${file}`)).includes(entry.value));
      if (group === "solid") assert.ok(readme.includes(file) && readme.includes(entry.value));
    }
  }
});

test("interface signals reproduce their recorded terminal shade references", () => {
  assert.equal(palette.signalAdaptation.sourceGroup, "terminal");
  for (const [name, { source: role, scale }] of Object.entries(palette.signalAdaptation.roles)) {
    const source = palette.terminal[role].value;
    assert.equal(shadeColor(source, scale), colors[name]);
    const oldColor = oklch(source), newColor = oklch(colors[name]);
    assert.ok(newColor.l < oldColor.l);
    assert.ok(Math.abs(newColor.l - oldColor.l * scale) < .003);
    assert.ok(Math.abs(newColor.c - oldColor.c * scale) < .003);
    assert.ok(newColor.c >= oldColor.c * .87, `${name} must retain terminal-like color strength`);
    const hueDistance = Math.abs(newColor.h - oldColor.h);
    assert.ok(Math.min(hueDistance, 360 - hueDistance) < 2);
  }
});

test("shading retains saturated channels and handles neutral colors without tinting", () => {
  assert.equal(rgb(colors.accent)[0], 0);
  assert.equal(shadeColor("#00B39E", 1), "#00B39E");
  const [r, g, b] = rgb(shadeColor("#808080", .94));
  assert.equal(r, g);
  assert.equal(g, b);
  assert.ok(r < 128);
  assert.throws(() => shadeColor("#00B39E", 0), /Shade scale/);
  assert.throws(() => shadeColor("#00B39E", 1.1), /Shade scale/);
  assert.throws(() => shadeColor("#00B39E", NaN), /Shade scale/);
});

test("warning stays distinctly bright instead of forcing equal lightness across roles", () => {
  const warning = oklch(colors.warning);
  for (const name of ["accent", "document", "error"]) {
    assert.ok(warning.l - oklch(colors[name]).l >= .12);
  }
  assert.ok(warning.l > .88);
  assert.equal(palette.signalAdaptation.roles.warning.source, "brightYellow");
});

test("color conversions reject ambiguous input and out-of-gamut pastels", () => {
  assert.throws(() => rgb("#abc"), /opaque RGB/);
  assert.throws(() => contrast("#FFFFFF80", "#000000"), /opaque RGB/);
  assert.throws(() => composite("#FFFFFF", "#000000"), /alpha-last/);
  assert.throws(() => pastelVariant("#808080", .78, .08), /no hue/);
  assert.throws(() => pastelVariant("#DC322F", .78, .8), /outside sRGB/);
  assert.throws(() => pastelVariant("#DC322F", NaN, .08), /parameters/);
});

test("opaque colors round-trip through OKLCH without a hue shift", () => {
  for (const value of ["#2AA198", "#859900", "#B58900", "#DC322F", ...Object.values(colors)]) {
    const { l, c } = oklch(value);
    assert.equal(pastelVariant(value, l, c), value);
  }
});

test("HSL and RGB aliases follow the new canonical colors", () => {
  assert.deepEqual(hsl(colors.accent), { h: 172.727, s: 100, l: 32.353 });
  assert.deepEqual(rgb(colors.error), [232, 74, 95]);
  assert.deepEqual(hsl("#000000"), { h: 0, s: 0, l: 0 });
  assert.deepEqual(hsl("#FFFFFF"), { h: 0, s: 0, l: 100 });
});

test("selection uses alpha-last compositing and retains ordinary text contrast", () => {
  const selection = palette.derived.textSelection.value;
  assert.equal(composite(selection, colors.base), "#002526");
  assert.equal(composite(selection, colors.panel), "#003236");
  for (const surface of [colors.base, colors.panel]) {
    assert.ok(contrast(colors.text, composite(selection, surface)) >= 4.5);
  }
  assert.equal(composite("#FFFFFF00", colors.base), colors.base);
  assert.equal(composite("#FFFFFFff", colors.base), "#FFFFFF");
});

test("signal fills use dark ink while tinted error surfaces keep warm text", () => {
  for (const name of ["accent", "document", "warning", "error"]) {
    assert.ok(contrast(colors.base, colors[name]) >= 4.5);
    assert.ok(contrast(colors[name], colors.panel) >= 4.5);
  }
  for (const role of ["errorBackground", "errorBackgroundHover"]) {
    for (const surface of [colors.base, colors.panel]) {
      const background = composite(palette.derived[role].value, surface);
      assert.ok(contrast(colors.warm, background) >= 4.5);
      assert.ok(contrast(colors.text, background) >= 4.5);
    }
  }
});

test("generated exports use the canonical signal aliases and readable diagnostics", async () => {
  const theme = JSON.parse(await readFile(new URL("../targets/vscode/themes/deepseafoam-color-theme.json", import.meta.url), "utf8"));
  const invalid = theme.tokenColors.find((entry) => entry.name === "Invalid").settings;
  assert.deepEqual(invalid, { foreground: colors.base, background: colors.error });
  const obsidian = await readFile(new URL("../targets/obsidian/theme.css", import.meta.url), "utf8");
  const accent = hsl(colors.accent);
  assert.ok(obsidian.includes(`--interactive-accent-hsl: ${accent.h}, ${accent.s}%, ${accent.l}%;`));
  assert.ok(obsidian.includes(`--background-modifier-error-rgb: ${rgb(colors.error).join(", ")};`));
  assert.ok(obsidian.includes(`--background-modifier-error: ${palette.derived.errorBackground.value};`));
  const terminal = JSON.parse(await readFile(new URL("../targets/windows-terminal/DeepSeaFoam.json", import.meta.url), "utf8"));
  for (const [name, entry] of Object.entries(palette.terminal)) assert.equal(terminal[name], entry.value);
  assert.equal(terminal.background, colors.base);
  assert.equal(theme.colors["terminal.foreground"], terminal.foreground);
  assert.equal(theme.colors["terminalCursor.foreground"], terminal.cursorColor);
});
