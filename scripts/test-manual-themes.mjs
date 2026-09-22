import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { addManualThemes } from "./manual-themes.mjs";

const palette = JSON.parse(await readFile(new URL("../palette/deepseafoam.json", import.meta.url), "utf8"));
function generate(source = palette) {
  const output = new Map();
  addManualThemes({
    palette: source, solid: key => source.solid[key].value,
    add: (file, content) => {
      assert.ok(!output.has(file));
      output.set(file, content);
    }
  });
  return output;
}

test("Nova emits an honest manual reference, never a fake native import", () => {
  const before = structuredClone(palette);
  const output = generate();
  assert.deepEqual([...output.keys()], [
    "targets/nova-launcher/DeepSeaFoam.txt", "targets/nova-launcher/README.md"
  ]);
  assert.deepEqual(generate(), output);
  assert.deepEqual(palette, before);
  const guide = output.get("targets/nova-launcher/README.md");
  for (const boundary of ["manual color preset", "not Panic", "not a native theme import",
    "third-party 2022 guide", "not been runtime-tested", "Remove / restore",
    "same-major-version", "Do not replace your layout", "not a license"]) {
    assert.ok(guide.includes(boundary), boundary);
  }
  assert.ok(output.get("targets/nova-launcher/DeepSeaFoam.txt").includes("NOT an import file"));
});

test("Nova references track the supplied palette without changing it", () => {
  const alternate = structuredClone(palette);
  alternate.version = "9.9.9";
  alternate.solid.text.value = "#A1B2C3";
  alternate.solid.base.value = "#010C13";
  const before = structuredClone(alternate);
  const output = generate(alternate);
  for (const content of output.values()) {
    assert.ok(content.includes("9.9.9"));
    assert.ok(content.includes("#A1B2C3"));
    assert.ok(content.includes("#010C13"));
    assert.ok(!content.includes("#93A1A1"));
  }
  assert.deepEqual(alternate, before);
});
