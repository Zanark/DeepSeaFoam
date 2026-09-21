import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { rgb, hsl, oklch, pastelVariant, shadeColor, composite, contrast } from "./colors.mjs";

const palette = JSON.parse(await readFile(new URL("../palette/deepseafoam.json", import.meta.url), "utf8"));
const colors = Object.fromEntries(Object.entries(palette.solid).map(([name, entry]) => [name, entry.value]));

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
