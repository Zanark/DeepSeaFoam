import { access, readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
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
  "water.js",
  "kelp.svg",
  "water-light.svg",
  "mark.svg",
  "site.webmanifest",
  "icons/NOTICE.txt"
];

for (const file of requiredFiles) {
  await access(path.join(site, file));
}

const [html, mainCss, oceanCss, paletteText, manifestText, logo] = await Promise.all([
  readFile(path.join(site, "index.html"), "utf8"),
  readFile(path.join(site, "styles.css"), "utf8"),
  readFile(path.join(site, "ocean.css"), "utf8"),
  readFile(path.join(site, "palette.json"), "utf8"),
  readFile(path.join(site, "site.webmanifest"), "utf8"),
  readFile(path.join(site, "mark.svg"), "utf8")
]);
const css = `${mainCss}\n${oceanCss}`;
if (/\.control-row\s*>\s*span\s*\{[^}]*\bcolor\s*:/.test(css)) {
  throw new Error("Interaction-study label colors must not override the demo controls");
}

const palette = JSON.parse(paletteText);
const canonical = JSON.parse(await readFile(path.join(root, "palette", "deepseafoam.json"), "utf8"));
const manifest = JSON.parse(manifestText);
const { icons } = JSON.parse(await readFile(path.join(root, "docs", "application-icons.json"), "utf8"));
const appIds = ["vscode", "visual-studio", "obsidian", "terminal", "firefox"];
if (icons.length !== appIds.length || icons.some((icon, index) => icon.id !== appIds[index])) {
  throw new Error("Application icon provenance must cover all five cards exactly once");
}
for (const icon of icons) {
  if (!/^[a-z-]+\.svg$/.test(icon.file)) throw new Error(`Invalid icon filename: ${icon.file}`);
  const bytes = await readFile(path.join(site, "icons", icon.file));
  if (createHash("sha256").update(bytes).digest("hex") !== icon.sha256) {
    throw new Error(`Application artwork differs from its recorded upstream SVG: ${icon.file}`);
  }
  const svg = bytes.toString("utf8");
  const references = [
    ...[...svg.matchAll(/\bhref=["']([^"']+)["']/g)].map((match) => match[1]),
    ...[...svg.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((match) => match[1])
  ];
  if (!svg.includes("<svg") || /<(?:script|foreignObject)\b|\son\w+\s*=/i.test(svg) ||
      references.some((reference) => !reference.startsWith("#"))) {
    throw new Error(`Application icon must be a self-contained, passive SVG: ${icon.file}`);
  }
  const card = html.match(new RegExp(`<a class="app-card app-${icon.id}"[^>]*>[\\s\\S]*?</a>`))?.[0];
  if (!card?.includes(`src="icons/${icon.file}"`) || !card.includes('loading="lazy" alt=""')) {
    throw new Error(`Application card must use its local decorative SVG: ${icon.id}`);
  }
  if (icon.license) await access(path.join(site, "icons", icon.license));
}
const logoUrl = "mark.svg?v=seaweed-foam-vivid";
if (!html.includes(`rel="icon" href="${logoUrl}"`) ||
    [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].filter((match) => match[1] === logoUrl).length !== 3 ||
    !manifest.icons.some((icon) => icon.src === logoUrl && icon.type === "image/svg+xml") ||
    manifest.background_color !== "#000F13") {
  throw new Error("Website branding, favicon and web-app icon must share the current logo and dark-teal base");
}
if (!logo.includes('id="seaweed"') || !logo.includes('id="foam"') ||
    logo.indexOf('id="seaweed"') > logo.indexOf('id="foam"') ||
    !logo.includes(`id="seaweed" fill="${canonical.solid.accent.value}"`)) {
  throw new Error("The logo must draw canonical seafoam seaweed behind its foam bubbles");
}

const colorCount = palette.groups.reduce((total, group) => total + group.colors.length, 0);
if (colorCount !== 27) {
  throw new Error(`The website must expose all 27 active colors; found ${colorCount}`);
}

for (const id of ["base", "panel", "accent", "document", "warning", "error"]) {
  const invariant = canonical.solid[id].value;
  if (palette.groups.find((group) => group.id === "solid")?.colors.find((color) => color.id === id)?.value !== invariant) {
    throw new Error(`Website palette is missing ${invariant}`);
  }
}
if (!html.includes(`<code>${canonical.solid.accent.value}</code>`)) {
  throw new Error("The interaction-study example must show the current accent");
}
if (html.includes("#000000") || !html.includes("#000F13") || !html.includes('class="surface-card surface-base"')) {
  throw new Error("Website workspace examples must use the current dark-teal base");
}

for (const marker of [
  "<main id=\"main\">",
  "Skip to the theme",
  "prefers-reduced-motion",
  'id="motion-toggle"',
  'id="skip-dive"',
  '<div class="bubble-field" aria-hidden="true">',
  '<canvas class="water-surface" aria-hidden="true"></canvas>',
  '<script src="water.js" type="module"></script>',
  'class="nautilus-zone"',
  'class="blobfish-zone"',
  'class="angler-zone"',
  'type="checkbox" id="angler-awake"',
  "https://github.com/Zanark/DeepSeaFoam/releases/latest"
]) {
  const source = marker === "prefers-reduced-motion" ? css : html;
  if (!source.includes(marker)) {
    throw new Error(`Website is missing required marker: ${marker}`);
  }
}

const depthOrder = ['class="nautilus-zone"', 'id="identity"', 'id="palette"', 'class="blobfish-zone"', 'id="applications"', 'class="angler-zone"']
  .map((marker) => html.indexOf(marker));
if (depthOrder.some((position, index) => position < 0 || (index > 0 && position <= depthOrder[index - 1])) ||
    /<(?:details|summary)\b/.test(html)) {
  throw new Error("Creature encounters must be separated along the descent, without collapsible sections");
}

for (const [depth, minimum] of [["far", 6], ["middle", 4], ["near", 2]]) {
  const bed = html.match(new RegExp(`<div class="kelp-bed kelp-${depth}">([\\s\\S]*?)</div>`))?.[1] ?? "";
  const plants = [...bed.matchAll(/<img\b[^>]*src="kelp\.svg"[^>]*>/g)];
  if (plants.length < minimum || plants.some(([plant]) => !plant.includes('alt=""'))) {
    throw new Error(`The ${depth} kelp bed needs at least ${minimum} decorative local plants`);
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

async function listAssets(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listAssets(target));
    else if (entry.isFile()) files.push(target);
    else throw new Error(`Unsupported website asset: ${target}`);
  }
  return files;
}

const assets = await listAssets(site);
const totalBytes = (await Promise.all(assets.map(async (file) => (await stat(file)).size)))
  .reduce((total, size) => total + size, 0);

// Count the water simulation, unmodified product SVGs, and their notices too.
const budget = 144 * 1024;
if (totalBytes > budget) {
  throw new Error(`Website exceeds the 144 KiB asset budget: ${totalBytes} bytes`);
}

console.log(`Validated static website: ${totalBytes} bytes across ${assets.length} files.`);
