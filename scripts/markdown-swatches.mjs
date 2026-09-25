import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { deflateSync } from "node:zlib";
import { rgb } from "./colors.mjs";

const hexPattern = /#[\da-f]{8}\b|#[\da-f]{6}\b|#[\da-f]{4}\b|#[\da-f]{3}\b/gi;
const excludedDirectories = new Set([".git", ".agent-context", "node_modules", "dist"]);
const legendPattern = /\n<!-- color-swatches:start -->\n[\s\S]*?\n<!-- color-swatches:end -->\n/g;
const defaults = { checkerLight: "#D0D1C9", checkerDark: "#B2B5AE", border: "#586E75" };
const escapeXml = text => text.replace(/[&<>"']/g, char =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);

export function normalizeColor(value) {
  if (!/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) {
    throw new Error(`Invalid Markdown color: ${value}`);
  }
  const hex = value.slice(1);
  return `#${hex.length <= 4 ? [...hex].map(char => char + char).join("") : hex}`.toUpperCase();
}

export function swatchSvg(value, title, options = defaults) {
  value = normalizeColor(value);
  const start = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="24" viewBox="0 0 64 24" role="img" aria-labelledby="title"><title id="title">${escapeXml(title)}</title>`;
  const rectangle = `x=".5" y=".5" width="63" height="23" rx="2"`;
  if (value.length === 9) {
    const opacity = Number((parseInt(value.slice(7), 16) / 255).toFixed(4));
    return `${start}<defs><pattern id="checker" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${options.checkerLight}"/><path d="M0 0h4v4H0zM4 4h4v4H4z" fill="${options.checkerDark}"/></pattern></defs><rect ${rectangle} fill="url(#checker)" stroke="${options.border}"/><rect ${rectangle} fill="${value.slice(0, 7)}" fill-opacity="${opacity}" stroke="${options.border}"/></svg>\n`;
  }
  return `${start}<rect ${rectangle} fill="${value}" stroke="${options.border}"/></svg>\n`;
}

function pngChunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data]);
  let crc = 0xffffffff;
  for (const byte of body) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  const size = Buffer.alloc(4), checksum = Buffer.alloc(4);
  size.writeUInt32BE(data.length);
  checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([size, body, checksum]);
}

// A tiny RGB PNG keeps target guides self-contained and compatible with VS Code's SVG restrictions.
export function swatchPng(value, options = defaults) {
  value = normalizeColor(value);
  const foreground = rgb(value.slice(0, 7));
  const alpha = value.length === 9 ? parseInt(value.slice(7), 16) / 255 : 1;
  const light = rgb(options.checkerLight), dark = rgb(options.checkerDark), border = rgb(options.border);
  const width = 64, height = 24, stride = 1 + width * 3;
  const pixels = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const background = (Math.floor(x / 4) + Math.floor(y / 4)) % 2 ? light : dark;
      const color = x === 0 || y === 0 || x === width - 1 || y === height - 1
        ? border : foreground.map((channel, i) => Math.round(channel * alpha + background[i] * (1 - alpha)));
      pixels.set(color, y * stride + 1 + x * 3);
    }
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("tEXt", Buffer.from(`Description\0${value}${alpha < 1 ? "; alpha-last RGBA over a neutral checkerboard" : ""}`)),
    pngChunk("IDAT", deflateSync(pixels, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

export async function markdownFiles(root, directory = "") {
  const files = [];
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = path.posix.join(directory, entry.name);
    if (entry.isDirectory() && !excludedDirectories.has(entry.name)) files.push(...await markdownFiles(root, relative));
    else if (entry.isFile() && /\.md$/i.test(entry.name)) files.push(relative);
  }
  return files;
}

export function decorateMarkdown(source, file, knownSwatches = new Map()) {
  const colors = new Map();
  const existingSwatches = new Map();
  for (const match of source.matchAll(/(?:src="|!\[[^\]]*\]\()([^")\s]+\/([\da-f]{6}(?:[\da-f]{2})?)\.(?:svg|png))/gi)) {
    existingSwatches.set(`#${match[2].toUpperCase()}`, path.posix.normalize(path.posix.join(path.posix.dirname(file), match[1])));
  }
  const target = file.startsWith("targets/") ? file.split("/").slice(0, 2).join("/") : null;
  const assetFor = color => target ? `${target}/swatches/${color.slice(1).toLowerCase()}.png`
    : knownSwatches.get(color) ?? existingSwatches.get(color) ?? `docs/color-swatches/${color.slice(1).toLowerCase()}.svg`;
  const image = (value, prefix = "") => {
    const color = normalizeColor(value);
    const previous = prefix.match(/(?:!\[[^\]]*\]\(([^)\s]+)\)|<img\b[^>]*src="([^"]+)"[^>]*>)\s*$/);
    if (previous) {
      const src = previous[1] ?? previous[2];
      const name = path.posix.basename(src).match(/^([\da-f]{6}(?:[\da-f]{2})?)\.(?:svg|png)$/i);
      if (name && normalizeColor(`#${name[1]}`) === color) {
        colors.set(color, path.posix.normalize(path.posix.join(path.posix.dirname(file), src)));
        return "";
      }
    }
    const asset = assetFor(color);
    colors.set(color, asset);
    const src = path.posix.relative(path.posix.dirname(file), asset);
    const alt = color.length === 9 ? "Color swatch (alpha over checkerboard)" : "Color swatch";
    return `<img src="${src}" width="32" height="12" alt="${alt}"> `;
  };
  const inline = input => {
    const line = input.replace(/<img src="[^"]+" width="32" height="12" alt="Color swatch(?: \(alpha over checkerboard\))?"> /g, "");
    // Keep destinations, attributes and complete code spans intact; decorate their visible neighbors.
    const tokens = /!\[[^\]]*\]\([^)]+\)|<[^>]+>|\[[^\]]*\]\([^)]+\)|(`+)([\s\S]*?)\1|#[\da-f]{8}\b|#[\da-f]{6}\b/gi;
    return line.replace(tokens, (token, ticks, code, offset) => {
      const prefix = line.slice(0, offset);
      if (ticks) {
        if (/^https?:\/\//i.test(code)) return token;
        const values = [...code.matchAll(hexPattern)].map(match => match[0]);
        if (!values.length && /^[\da-f]{8}$/i.test(code)
            && /\b(?:ARGB|AARRGGBB)\s*$/.test(prefix.replace(/<img\b[^>]*>/g, ""))) {
          values.push(`#${code.slice(2)}${code.slice(0, 2)}`);
        }
        return [...new Set(values)].map(value => image(value, prefix)).join("") + token;
      }
      if (token.startsWith("#")) return image(token, prefix) + token;
      if (token.startsWith("[") && !token.startsWith("!")) {
        const end = token.indexOf("](");
        return `[${inline(token.slice(1, end))}${token.slice(end)}`;
      }
      return token;
    });
  };
  const lines = source.replace(/\r\n/g, "\n").replace(legendPattern, "\n").split("\n");
  const output = [];
  let fence = null, example = [];
  for (const line of lines) {
    const marker = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
    if (fence) {
      output.push(line);
      if (marker && marker[2][0] === fence.char && marker[2].length >= fence.length && !marker[3].trim()) {
        const values = [...new Set(example.join("\n").match(hexPattern) ?? [])];
        if (values.length) {
          output.push("<!-- color-swatches:start -->",
            `${fence.indent}Colors in this example: ${values.map(value => `${image(value)}\`${value}\``).join(" · ")}.`,
            "<!-- color-swatches:end -->");
        }
        fence = null;
        example = [];
      } else example.push(line);
    } else if (marker) {
      fence = { char: marker[2][0], length: marker[2].length, indent: marker[1] };
      output.push(line);
    } else output.push(inline(line));
  }
  if (fence && example.join("\n").match(hexPattern)) throw new Error(`Unclosed color example in ${file}`);
  return { content: output.join("\n"), colors };
}

export async function addMarkdownSwatches(root, outputs, options = defaults) {
  const known = new Map();
  for (const file of outputs.keys()) {
    const match = file.match(/^docs\/[^/]*swatches\/([\da-f]{6}(?:[\da-f]{2})?)\.svg$/i);
    if (match) known.set(`#${match[1].toUpperCase()}`, file);
  }
  const files = new Set([...await markdownFiles(root), ...[...outputs.keys()].filter(file => /\.md$/i.test(file))]);
  for (const file of [...files].sort()) {
    const source = outputs.get(file) ?? await readFile(path.join(root, file), "utf8");
    const { content, colors } = decorateMarkdown(source, file, known);
    outputs.set(file, content);
    for (const [value, asset] of colors) {
      if (!outputs.has(asset)) outputs.set(asset, asset.endsWith(".png") ? swatchPng(value, options)
        : swatchSvg(value, `${value}${value.length === 9 ? " over a neutral checkerboard" : ""}`, options));
    }
  }
  return files.size;
}
