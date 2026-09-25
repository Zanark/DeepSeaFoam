import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { decorateMarkdown, markdownFiles, normalizeColor, swatchPng, swatchSvg } from "./markdown-swatches.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = async file => (await readFile(path.join(root, file), "utf8")).replace(/\r\n/g, "\n");

test("prose, tables, repeated mentions and light composites each receive adjacent swatches", () => {
  const source = "Selected `#C7DDD7`; hovered #D7E1DC. Again `#C7DDD7`.\n| Ink | `#355451` / `#173D3A` |\n";
  const result = decorateMarkdown(source, "docs/HARBOR-DAYLIGHT.md");
  assert.equal((result.content.match(/<img /g) ?? []).length, 5);
  assert.match(result.content, /src="color-swatches\/c7ddd7.svg"[^>]+> `#C7DDD7`/);
  assert.match(result.content, /src="color-swatches\/d7e1dc.svg"[^>]+> #D7E1DC/);
  assert.equal(decorateMarkdown(result.content, "docs/HARBOR-DAYLIGHT.md").content, result.content);
  assert.equal(result.colors.size, 4);
});

test("existing matching table images are retained without duplicate swatches", () => {
  const source = "| Text | ![Mist](docs/swatches/93a1a1.svg) `#93A1A1` |\n";
  assert.equal(decorateMarkdown(source, "README.md").content, source);
  const wrong = "| Text | ![Mist](docs/swatches/001e26.svg) `#93A1A1` |\n";
  assert.match(decorateMarkdown(wrong, "README.md").content, /<img [^>]+> `#93A1A1`/);
});

test("regeneration replaces an outdated inline swatch rather than keeping the wrong color", () => {
  const original = decorateMarkdown("`#C7DDD7`", "docs/example.md").content;
  const changed = decorateMarkdown(original.replace("`#C7DDD7`", "`#D7E1DC`"), "docs/example.md").content;
  assert.equal((changed.match(/<img /g) ?? []).length, 1);
  assert.match(changed, /d7e1dc\.svg/);
  assert.ok(!changed.includes("c7ddd7.svg"));
});

test("generated guide assets are target-local PNGs and ARGB is converted honestly", () => {
  const source = "Selection `#00A59126`, written as ARGB `2600A591`.\n";
  const result = decorateMarkdown(source, "targets/visual-studio/README.md");
  assert.equal((result.content.match(/src="swatches\/00a59126.png"/g) ?? []).length, 2);
  assert.equal(result.colors.get("#00A59126"), "targets/visual-studio/swatches/00a59126.png");
  assert.equal(decorateMarkdown(result.content, "targets/visual-studio/README.md").content, result.content);
});

test("short hex, mixed case and alpha keep copyable notation", () => {
  const source = "`#abc` and `#0a58` and `#e84a5F2e`";
  const result = decorateMarkdown(source, "docs/example.md");
  assert.ok(result.content.includes("`#abc`") && result.content.includes("`#0a58`"));
  assert.deepEqual([...result.colors.keys()], ["#AABBCC", "#00AA5588", "#E84A5F2E"]);
  assert.throws(() => normalizeColor("#12345"), /Invalid/);
});

test("fenced code and Mermaid stay byte-identical, with an adjacent per-example key", () => {
  for (const fence of ["```", "~~~~"]) {
    const example = `${fence}css\nbody { color: #93A1A1; background: #000F13; }\n${fence}`;
    const source = `${example}\nNext paragraph.\n`;
    const result = decorateMarkdown(source, "docs/example.md");
    assert.ok(result.content.startsWith(example + "\n<!-- color-swatches:start -->"));
    assert.ok(result.content.includes('Colors in this example: <img'));
    assert.ok(result.content.endsWith("\nNext paragraph.\n"));
    assert.equal(decorateMarkdown(result.content, "docs/example.md").content, result.content);
    assert.equal(decorateMarkdown(source.replace(/\n/g, "\r\n"), "docs/example.md").content, result.content);
  }
  assert.throws(() => decorateMarkdown("```css\ncolor: #FFF;", "docs/example.md"), /Unclosed color/);
});

test("links, images, attributes, PR numbers and placeholder formats are not color values", () => {
  const source = '[PR #8421](https://example.com/#C7DDD7) ![asset](color.svg "#C7DDD7") <img src="x" title="#C7DDD7"> `#RRGGBBAA` PR #115 `https://example.com/#C7DDD7`\n';
  assert.equal(decorateMarkdown(source, "docs/example.md").content, source);
  const label = decorateMarkdown("[`#C7DDD7`](https://example.com/#C7DDD7)", "docs/example.md").content;
  assert.match(label, /^\[<img [^>]+> `#C7DDD7`\]\(https:\/\/example.com\/#C7DDD7\)$/);
});

test("SVG swatches preserve exact RGB, alpha-last opacity, borders and escaped titles", () => {
  const svg = swatchSvg("#006F631F", 'Selection <&"');
  assert.ok(svg.includes('fill="#006F63" fill-opacity="0.1216"'));
  assert.ok(svg.includes('fill="#D0D1C9"') && svg.includes('fill="#B2B5AE"'));
  assert.ok(svg.includes("Selection &lt;&amp;&quot;"));
  assert.ok(swatchSvg("#C7DDD7", "Panel").includes('fill="#C7DDD7"'));
});

function decodeSwatch(png) {
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = [];
  let position = 8, header;
  while (position < png.length) {
    const length = png.readUInt32BE(position);
    const type = png.toString("ascii", position + 4, position + 8);
    const data = png.subarray(position + 8, position + 8 + length);
    if (type === "IHDR") header = data;
    if (type === "IDAT") chunks.push(data);
    position += length + 12;
  }
  assert.equal(header.readUInt32BE(0), 64);
  assert.equal(header.readUInt32BE(4), 24);
  assert.equal(header[8], 8);
  assert.equal(header[9], 2);
  const pixels = inflateSync(Buffer.concat(chunks));
  assert.equal(pixels.length, 24 * 193);
  for (let y = 0; y < 24; y++) assert.equal(pixels[y * 193], 0);
  return (x, y) => [...pixels.subarray(y * 193 + 1 + x * 3, y * 193 + 4 + x * 3)];
}

test("offline PNGs contain exact opaque centers and correctly composited alpha checker tiles", () => {
  assert.deepEqual(swatchPng("#C7DDD7"), swatchPng("#C7DDD7"));
  assert.deepEqual(decodeSwatch(swatchPng("#C7DDD7"))(32, 12), [199, 221, 215]);
  const transparent = decodeSwatch(swatchPng("#00000000"));
  assert.deepEqual(transparent(2, 2), [178, 181, 174]);
  assert.deepEqual(transparent(6, 2), [208, 209, 201]);
  const selection = decodeSwatch(swatchPng("#006F631F"));
  assert.deepEqual(selection(2, 2), [156, 172, 165]);
  assert.deepEqual(selection(6, 2), [183, 197, 189]);
  assert.deepEqual(selection(0, 0), [88, 110, 117]);
});

test("every maintained Markdown color mention is covered and every local swatch exists", async () => {
  const files = await markdownFiles(root);
  assert.ok(files.includes("README.md") && files.includes("docs/HARBOR-DAYLIGHT.md"));
  assert.ok(!files.some(file => /(?:^|\/)(?:dist|node_modules|\.agent-context|\.git)\//.test(file)));
  let count = 0;
  for (const file of files) {
    const source = await read(file);
    const result = decorateMarkdown(source, file);
    assert.equal(result.content, source, `${file} contains unpaired colors or stale example swatches`);
    for (const [value, asset] of result.colors) {
      const bytes = await readFile(path.join(root, asset));
      if (asset.endsWith(".png")) {
        assert.ok(bytes.includes(Buffer.from(value)), `${asset}: missing exact source metadata`);
        decodeSwatch(bytes);
        assert.ok(asset.startsWith(file.split("/").slice(0, 2).join("/") + "/"), "Target assets must be local");
      } else assert.ok(bytes.toString().includes(value), `${asset}: wrong color`);
      count++;
    }
    // Independent adjacency check, not just formatter idempotence.
    let inside = false;
    for (const line of source.split("\n")) {
      if (/^\s*(`{3,}|~{3,})/.test(line)) { inside = !inside; continue; }
      if (inside) continue;
      for (const match of line.matchAll(/`(#[\da-f]{6}(?:[\da-f]{2})?)`/gi)) {
        const prefix = line.slice(0, match.index);
        assert.match(prefix, /(?:<img\b[^>]+>|!\[[^\]]*\]\([^)]+\))\s*$/, `${file}: ${match[0]} needs an adjacent image`);
      }
    }
  }
  assert.ok(count > 100, "Exercise actual guides, history, dark/light and derived colors");
});
