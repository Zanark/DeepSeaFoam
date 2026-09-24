import { composite, contrast } from "./colors.mjs";

const kebab = (name) => name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export function lightTokens(light, dark) {
  const tokens = Object.fromEntries(["solid", "overlay"].flatMap(group =>
    Object.entries(light[group]).map(([name, entry]) => [name, entry.value])));
  for (const [name, source] of Object.entries(light.aliases)) {
    if (!light.solid[source]) throw new Error(`Unknown light alias: ${name}`);
    tokens[name] = light.solid[source].value;
  }
  for (const [name, { group, token }] of Object.entries(light.shared)) {
    if (!dark[group]?.[token]) throw new Error(`Unknown shared color: ${name}`);
    tokens[name] = dark[group][token].value;
  }
  return tokens;
}

export function validateLightPalette(light, dark) {
  if (Object.keys(light.solid).length !== 12 || Object.keys(light.overlay).length !== 4 ||
      new Set(Object.values(light.solid).map(entry => entry.value)).size !== 12) {
    throw new Error("Harbor Daylight requires twelve distinct solids and four overlays");
  }
  for (const [group, pattern] of [["solid", /^#[0-9A-F]{6}$/], ["overlay", /^#[0-9A-F]{8}$/]]) {
    for (const entry of Object.values(light[group])) {
      if (!pattern.test(entry.value)) throw new Error(`Invalid light ${group} color: ${entry.value}`);
    }
  }
  const t = lightTokens(light, dark);
  if (t.buttonText !== t.paper || t.separator !== `${t.border}66` ||
      t.hover !== `${t.border}1A` || t.selection !== `${t.accent}1F` || t.shadow !== "#00000014") {
    throw new Error("Light aliases and alpha-last derivations must preserve their source roles");
  }
  const pairs = [];
  for (const background of [t.background, t.surface, t.paper]) {
    for (const name of ["text", "muted", "heading", "accent", "accentHover", "document", "warning", "error"]) {
      pairs.push([name, t[name], background, 4.5]);
    }
    pairs.push(["border", t.border, background, 3]);
    for (const overlay of [t.selection, t.hover]) {
      pairs.push(["selected/hovered heading", t.heading, composite(overlay, background), 4.5]);
    }
  }
  pairs.push(["action", t.buttonText, t.accent, 4.5], ["action hover", t.buttonText, t.accentHover, 4.5]);
  for (const [name, foreground, background, minimum] of pairs) {
    if (contrast(foreground, background) < minimum) throw new Error(`Light ${name} contrast is below ${minimum}:1`);
  }
}

export function lightPaletteCss(light, dark) {
  const variables = Object.entries(lightTokens(light, dark))
    .map(([name, value]) => `  --${kebab(name)}: ${value};`).join("\n");
  return `/* Generated from palette/harbor-daylight.json and shared dark roles. */
.harbor-daylight {
  color-scheme: light;
${variables}
}
.harbor-daylight::selection,
.harbor-daylight ::selection { color: var(--heading); background: var(--selection); }
.harbor-daylight .daylight-action::selection,
.harbor-daylight .daylight-action *::selection { color: var(--button-text); background: var(--accent-hover); }
`;
}

export function lightPaletteGroups(light) {
  return [
    { id: "light-solid", title: "Harbor Daylight", description: "Twelve light solids. Warm paper, sea-glass structure, deep tidal ink.",
      colors: Object.entries(light.solid).map(([id, entry]) => ({ id, ...entry })) },
    { id: "light-overlay", title: "Daylight overlays", description: "Alpha-last RGBA, shown on sea glass. Selection and hover use heading ink.",
      colors: Object.entries(light.overlay).map(([id, entry]) => ({ id, ...entry })) }
  ];
}
