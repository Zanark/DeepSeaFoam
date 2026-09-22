import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { addWebTheme } from "./web-theme.mjs";
import { composite } from "./colors.mjs";

const palette = JSON.parse(await readFile(new URL("../palette/deepseafoam.json", import.meta.url), "utf8"));
function generate(source = palette) {
  const output = new Map();
  addWebTheme({
    palette: source,
    add: (file, content) => {
      assert.ok(!output.has(file));
      output.set(file, content);
    },
    ...Object.fromEntries(["solid", "overlay", "derived", "heritage"]
      .map(group => [group, key => source[group][key].value]))
  });
  return output;
}

test("web starter is deterministic, nonmutating and self-contained", () => {
  const before = structuredClone(palette);
  const output = generate();
  assert.equal(output.size, 6);
  assert.deepEqual(output, generate());
  assert.deepEqual(palette, before);
  assert.equal(output.get("targets/github-pages/.nojekyll"), "");
  const html = output.get("targets/github-pages/index.html");
  const css = output.get("targets/github-pages/assets/css/deepseafoam.css");
  assert.ok(html.includes('class="deepseafoam"'));
  assert.ok(html.includes('href="assets/css/deepseafoam.css"'));
  assert.ok(html.includes('href="#content"') && html.includes('id="content"'));
  assert.doesNotMatch(html, /<script|(?:src|href)="https?:/i);
  assert.doesNotMatch(css, /@import|url\(|filter:|animation:|gradient\(/);
  assert.ok(css.includes(".deepseafoam :focus-visible"));
  assert.ok(css.includes("max-width: 100%; height: auto"));
  assert.ok(css.includes("color-scheme: dark"));
});

test("web colors and metadata use only the supplied palette", () => {
  const alternate = structuredClone(palette);
  alternate.name = 'Test <&" theme';
  alternate.version = "9.9.9";
  alternate.solid.base.value = "#020F14";
  alternate.solid.accent.value = "#30A999";
  alternate.heritage.orange.value = "#D18540";
  const output = generate(alternate);
  const css = output.get("targets/github-pages/assets/css/deepseafoam.css");
  assert.ok(css.includes("--dsf-base: #020F14"));
  assert.ok(css.includes("--dsf-accent: #30A999"));
  assert.ok(css.includes("#D18540"));
  assert.ok(css.includes(composite(alternate.overlay.hover.value, alternate.solid.panel.value)));
  const html = output.get("targets/github-pages/index.html");
  assert.ok(html.includes("Test &lt;&amp;&quot; theme"));
  assert.ok(html.includes("9.9.9"));
  assert.doesNotMatch(html, /Test <&"/);
});

test("Jekyll integration preserves project subpaths and does not overwrite configuration", () => {
  const output = generate();
  const layout = output.get("targets/github-pages/_layouts/deepseafoam.html");
  assert.ok(layout.includes("'/assets/css/deepseafoam.css' | relative_url"));
  assert.ok(layout.includes("item.url | relative_url | escape"));
  assert.ok(layout.includes("{{ content }}"));
  assert.ok(layout.includes("page.title | default: site.title | escape"));
  assert.ok(output.has("targets/github-pages/_config.example.yml"));
  assert.ok(!output.has("targets/github-pages/_config.yml"));
  const guide = output.get("targets/github-pages/README.md");
  for (const phrase of ["Remove / restore", "not github.com", "Do not copy", "not a Jekyll runtime test"]) {
    assert.ok(guide.includes(phrase), phrase);
  }
});
