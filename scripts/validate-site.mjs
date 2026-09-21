import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const requiredFiles = [
  ".nojekyll",
  "index.html",
  "styles.css",
  "palette.css",
  "palette.json",
  "app.js",
  "ocean.css",
  "ocean.js",
  "kelp.svg",
  "water-light.svg",
  "mark.svg",
  "site.webmanifest"
];

for (const file of requiredFiles) {
  await access(path.join(site, file));
}

const [html, mainCss, oceanCss, paletteText, manifestText] = await Promise.all([
  readFile(path.join(site, "index.html"), "utf8"),
  readFile(path.join(site, "styles.css"), "utf8"),
  readFile(path.join(site, "ocean.css"), "utf8"),
  readFile(path.join(site, "palette.json"), "utf8"),
  readFile(path.join(site, "site.webmanifest"), "utf8")
]);
const css = `${mainCss}\n${oceanCss}`;

const palette = JSON.parse(paletteText);
JSON.parse(manifestText);

const colorCount = palette.groups.reduce((total, group) => total + group.colors.length, 0);
if (colorCount !== 27) {
  throw new Error(`The website must expose all 27 active colors; found ${colorCount}`);
}

for (const invariant of ["#000000", "#001E26", "#2AA198"]) {
  if (!paletteText.includes(invariant)) {
    throw new Error(`Website palette is missing ${invariant}`);
  }
}

for (const marker of [
  "<main id=\"main\">",
  "Skip to the theme",
  "prefers-reduced-motion",
  'id="motion-toggle"',
  'id="skip-dive"',
  '<details class="angler-discovery">',
  "https://github.com/Zanark/DeepSeaFoam/releases/latest"
]) {
  const source = marker === "prefers-reduced-motion" ? css : html;
  if (!source.includes(marker)) {
    throw new Error(`Website is missing required marker: ${marker}`);
  }
}

if (/@import\s|url\(\s*['"]?https?:/i.test(css)) {
  throw new Error("The website stylesheet must not load external assets");
}

if (/<(?:script|link)[^>]+(?:src|href)=["']https?:/i.test(html)) {
  throw new Error("The website must not load external scripts, stylesheets, or fonts");
}

const relativeReferences = [
  ...[...html.matchAll(/(?:src|href)=["']([^"'#]+)["']/g)].map((match) => match[1]),
  ...[...css.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1])
]
  .filter((reference) => !/^(?:https?:|mailto:)/.test(reference));

for (const reference of relativeReferences) {
  const target = path.join(site, reference.split("?")[0]);
  await access(target);
}

const totalBytes = (
  await Promise.all(requiredFiles.map(async (file) => (await stat(path.join(site, file))).size))
).reduce((total, size) => total + size, 0);

const budget = 100 * 1024;
if (totalBytes > budget) {
  throw new Error(`Website exceeds the 100 KiB source budget: ${totalBytes} bytes`);
}

console.log(`Validated static website: ${totalBytes} bytes across ${requiredFiles.length} files.`);
