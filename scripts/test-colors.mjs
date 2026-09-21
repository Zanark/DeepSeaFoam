import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { rgb, hsl, oklch, pastelVariant, composite, contrast } from "./colors.mjs";

const palette = JSON.parse(await readFile(new URL("../palette/deepseafoam.json", import.meta.url), "utf8"));
const colors = Object.fromEntries(Object.entries(palette.solid).map(([name, entry]) => [name, entry.value]));

test("the four pastel roles reproduce their recorded hue-preserving conversion", () => {
  const { originals, lightness, chroma } = palette.pastelAdaptation;
  for (const [name, source] of Object.entries(originals)) {
    assert.equal(pastelVariant(source, lightness, chroma), colors[name]);
    const oldColor = oklch(source), newColor = oklch(colors[name]);
    assert.ok(newColor.l > oldColor.l);
    assert.ok(Math.abs(newColor.l - lightness) < .003);
    assert.ok(Math.abs(newColor.c - chroma) < .003);
    const hueDistance = Math.abs(newColor.h - oldColor.h);
    assert.ok(Math.min(hueDistance, 360 - hueDistance) < 2);
  }
});

test("the richer revision is darker and more chromatic than the rejected pale palette", () => {
  const pale = { accent: "#78C8C0", document: "#B2BF84", warning: "#CEB47C", error: "#E6A49C" };
  for (const [name, value] of Object.entries(pale)) {
    const previous = oklch(value), current = oklch(colors[name]);
    assert.ok(previous.l - current.l >= .04, `${name} must not return to the pale lightness`);
    assert.ok(current.c - previous.c >= .03, `${name} must retain its restored color intensity`);
  }
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
  assert.deepEqual(hsl(colors.accent), { h: 175.658, s: 65.517, l: 45.49 });
  assert.deepEqual(rgb(colors.error), [233, 137, 126]);
  assert.deepEqual(hsl("#000000"), { h: 0, s: 0, l: 0 });
  assert.deepEqual(hsl("#FFFFFF"), { h: 0, s: 0, l: 100 });
});

test("selection uses alpha-last compositing and retains ordinary text contrast", () => {
  const selection = palette.derived.textSelection.value;
  assert.equal(composite(selection, colors.base), "#06292B");
  assert.equal(composite(selection, colors.panel), "#06363B");
  for (const surface of [colors.base, colors.panel]) {
    assert.ok(contrast(colors.text, composite(selection, surface)) >= 4.5);
  }
  assert.equal(composite("#FFFFFF00", colors.base), colors.base);
  assert.equal(composite("#FFFFFFff", colors.base), "#FFFFFF");
});

test("pastel fills use dark ink while tinted error surfaces keep warm text", () => {
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

test("generated exports use the canonical pastel aliases and readable diagnostics", async () => {
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
