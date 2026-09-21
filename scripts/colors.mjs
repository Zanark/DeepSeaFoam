export function rgb(value) {
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`Expected opaque RGB hex: ${value}`);
  return value.slice(1).match(/../g).map((channel) => parseInt(channel, 16));
}

const linear = (channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
const encoded = (channel) => channel <= .0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - .055;
const hex = (channels) => `#${channels.map((channel) =>
  Math.round(channel).toString(16).padStart(2, "0")).join("").toUpperCase()}`;

export function oklch(value) {
  const [r, g, b] = rgb(value).map((channel) => linear(channel / 255));
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
  const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
  const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + .4505937099 * s;
  const labB = .0259040371 * l + .7827717662 * m - .808675766 * s;
  return {
    l: .2104542553 * l + .793617785 * m - .0040720468 * s,
    c: Math.hypot(a, labB),
    h: (Math.atan2(labB, a) * 180 / Math.PI + 360) % 360
  };
}

export function pastelVariant(source, lightness, chroma) {
  if (!Number.isFinite(lightness) || lightness < 0 || lightness > 1 ||
      !Number.isFinite(chroma) || chroma < 0) throw new Error("Invalid OKLCH pastel parameters");
  const original = oklch(source);
  if (original.c < .000001 && chroma > 0) throw new Error("A neutral source has no hue to preserve");
  const hue = original.h * Math.PI / 180;
  const a = chroma * Math.cos(hue), b = chroma * Math.sin(hue);
  const l = (lightness + .3963377774 * a + .2158037573 * b) ** 3;
  const m = (lightness - .1055613458 * a - .0638541728 * b) ** 3;
  const s = (lightness - .0894841775 * a - 1.291485548 * b) ** 3;
  const channels = [
    4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
    -.0041960863 * l - .7034186147 * m + 1.707614701 * s
  ].map(encoded);
  if (channels.some((channel) => channel < -.000001 || channel > 1.000001)) {
    throw new Error("The requested pastel is outside sRGB; do not silently clip its hue");
  }
  return hex(channels.map((channel) => Math.max(0, Math.min(1, channel)) * 255));
}

export function hsl(value) {
  const [r, g, b] = rgb(value).map((channel) => channel / 255);
  const high = Math.max(r, g, b), low = Math.min(r, g, b), delta = high - low;
  const lightness = (high + low) / 2;
  let hue = 0;
  if (delta) {
    hue = high === r ? (g - b) / delta : high === g ? (b - r) / delta + 2 : (r - g) / delta + 4;
    hue = (hue * 60 + 360) % 360;
  }
  const round = (number) => Number(number.toFixed(3));
  return { h: round(hue), s: round(delta ? delta / (1 - Math.abs(2 * lightness - 1)) * 100 : 0), l: round(lightness * 100) };
}

export function shadeColor(value, scale) {
  if (!Number.isFinite(scale) || scale <= 0 || scale > 1) {
    throw new Error("Shade scale must be greater than zero and at most one");
  }
  const original = oklch(value);
  const chroma = original.c < .000001 ? 0 : original.c * scale;
  // Scaling all OKLab coordinates preserves chromaticity rather than adding white or gray.
  return pastelVariant(value, original.l * scale, chroma);
}

export function composite(value, background) {
  if (!/^#[0-9a-f]{8}$/i.test(value)) throw new Error(`Expected alpha-last RGBA hex: ${value}`);
  const alpha = parseInt(value.slice(7), 16) / 255;
  const behind = rgb(background);
  return hex(rgb(value.slice(0, 7)).map((channel, index) => channel * alpha + behind[index] * (1 - alpha)));
}

export function contrast(foreground, background) {
  const luminance = (value) => rgb(value).map((channel) => linear(channel / 255))
    .reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
  const first = luminance(foreground), second = luminance(background);
  return (Math.max(first, second) + .05) / (Math.min(first, second) + .05);
}
