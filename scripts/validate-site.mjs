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
  "nautilus.js",
  "blobfish.webp",
  "artwork-NOTICE.txt",
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
const appIds = ["vscode", "visual-studio", "obsidian", "terminal", "firefox",
  "discord", "telegram", "slack", "chrome", "jetbrains", "sublime-text", "alacritty"];
if (icons.length !== appIds.length || icons.some((icon, index) => icon.id !== appIds[index])) {
  throw new Error("Application icon provenance must cover all twelve cards exactly once");
}
if ((html.match(/class="app-card app-/g) ?? []).length !== appIds.length ||
    !html.includes(`<dt>${appIds.length}</dt><dd>app targets</dd>`)) {
  throw new Error("The application cards and displayed target count must agree");
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
const logoUrl = "mark.svg?v=seaweed-foam-cluster";
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
const foam = logo.match(/<g id="foam"[^>]*>([\s\S]*?)<\/g>/)?.[1] ?? "";
const bubbles = [...foam.matchAll(/<circle\b[^>]*cx="([\d.]+)"[^>]*cy="([\d.]+)"[^>]*r="([\d.]+)"/g)];
if (bubbles.length < 14 || bubbles.some(([, , y, radius]) => Number(y) - Number(radius) < 32) ||
    !logo.includes('id="foam-reflections"')) {
  throw new Error("The foam logo needs a dense lower-half bubble cluster and reflected larger bubbles");
}

const { blobfish, photographicInspiration } = JSON.parse(await readFile(path.join(root, "docs", "showcase-artwork.json"), "utf8"));
const fishBytes = await readFile(path.join(site, "blobfish.webp"));
if (blobfish.file !== "blobfish.webp" || createHash("sha256").update(fishBytes).digest("hex") !== blobfish.sha256 ||
    fishBytes.length !== blobfish.bytes || fishBytes.toString("ascii", 0, 4) !== "RIFF" ||
    fishBytes.toString("ascii", 8, 16) !== "WEBPVP8X" || !(fishBytes[20] & 0x10) ||
    fishBytes.readUIntLE(24, 3) + 1 !== blobfish.width || fishBytes.readUIntLE(27, 3) + 1 !== blobfish.height) {
  throw new Error("The supplied blobfish derivative must retain its recorded size, alpha and artwork hash");
}
for (const key of ["page", "photographerPage", "original"]) {
  if (!html.includes(`href="${photographicInspiration[key]}"`)) {
    throw new Error(`Missing photographic inspiration reference: ${key}`);
  }
}
if (!html.includes(`${photographicInspiration.width} &times; ${photographicInspiration.height}`) ||
    /<(?:img|source)\b[^>]+(?:src|srcset)=["']https?:/i.test(html)) {
  throw new Error("Credit the original photo dimensions without automatically loading external images");
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
  '<script src="ocean.js?v=touch-water" type="module"></script>',
  '<script src="water.js?v=touch-water" type="module"></script>',
  '<script src="nautilus.js?v=nautilus-behind-content" type="module"></script>',
  'class="nautilus-zone"',
  'class="blobfish-zone"',
  'class="angler-zone"',
  'type="checkbox" id="angler-awake"',
  'type="checkbox" id="blobfish-awake"',
  'class="button button-applications" href="#applications"',
  'class="hero-lede hero-poem"',
  "https://github.com/Zanark/DeepSeaFoam/releases/latest"
]) {
  const source = marker === "prefers-reduced-motion" ? css : html;
  if (!source.includes(marker)) {
    throw new Error(`Website is missing required marker: ${marker}`);
  }
}

const depthOrder = ['id="identity"', 'id="palette"', 'id="applications"', 'class="angler-zone"', '<footer>', 'class="blobfish-zone"']
  .map((marker) => html.indexOf(marker));
if (depthOrder.some((position, index) => position < 0 || (index > 0 && position <= depthOrder[index - 1])) ||
    /<(?:details|summary)\b/.test(html)) {
  throw new Error("Creature encounters must be separated along the descent, without collapsible sections");
}
if (!/<section class="palette-section"[\s\S]*?<\/section>\s*<section class="applications"/.test(html) ||
    !/\.button-applications\s*\{[^}]*background:\s*var\(--dsf-solid-document\)/.test(css)) {
  throw new Error("Applications must follow the palette directly and use a document-green hero link");
}
for (const retired of ["Beneath the everyday", 'class="principle-grid"', 'class="extension-note"', 'class="signal accent"']) {
  if (html.includes(retired)) throw new Error(`Retired showcase content remains: ${retired}`);
}
if (css.includes("nautilus-pass") || css.includes("nautilus-bob")) {
  throw new Error("Nautilus drift must not compete with the retired fixed-loop animations");
}
if (html.indexOf('class="nautilus-zone"') > html.indexOf("<main") ||
    !html.includes('class="nautilus-zone" aria-hidden="true"') ||
    !/main,\s*footer\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*2/.test(css) ||
    !/\.nautilus-zone\s*\{[^}]*position:\s*fixed;[^}]*z-index:\s*1;[^}]*pointer-events:\s*none/.test(css) ||
    !html.includes('href="ocean.css?v=nautilus-behind-content"')) {
  throw new Error("Nautilus must roam in a pointer-transparent root layer below readable content");
}
const hideout = html.match(/<section class="blobfish-zone"[\s\S]*?<\/section>/)?.[0] ?? "";
if (!hideout.includes('src="blobfish.webp"') || (hideout.match(/class="cover-kelp"/g)?.length ?? 0) < 20 ||
    !hideout.includes('for="blobfish-awake"')) {
  throw new Error("The bottom hideout needs the supplied artwork, dense kelp and a native reveal control");
}
for (const source of ["ethanschoonover.com/solarized/#features", "mgn-357-night-time-lookout", "10.1080/00140139.2013.790485", "WCAG22/Understanding/contrast-minimum.html"]) {
  if (!html.includes(source)) throw new Error(`Missing design-evidence citation: ${source}`);
}
if (!html.includes("None of these sources tests DeepSeaFoam")) {
  throw new Error("Research context must not imply this palette has been clinically validated");
}
for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!html.includes(`id="${target}"`)) throw new Error(`Broken page navigation: #${target}`);
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

// Include the transparent supplied illustration, drift module, product SVGs and all notices.
const budget = 256 * 1024;
if (totalBytes > budget) {
  throw new Error(`Website exceeds the 256 KiB asset budget: ${totalBytes} bytes`);
}

console.log(`Validated static website: ${totalBytes} bytes across ${assets.length} files.`);
