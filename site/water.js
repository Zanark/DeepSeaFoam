const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const STEP = 1000 / 60;

export class WaterField {
  constructor(width, height) {
    if (!Number.isInteger(width) || !Number.isInteger(height) ||
        width < 8 || height < 8 || width * height > 40000) {
      throw new RangeError("Water dimensions must be integers >= 8 with at most 40000 cells");
    }
    this.width = width;
    this.height = height;
    this.current = new Float32Array(width * height);
    this.previous = new Float32Array(width * height);
    this.loss = new Float32Array(width * height);
    this.activity = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const edge = Math.min(x, y, width - x - 1, height - y - 1);
        this.loss[y * width + x] = Math.max(0, 1 - edge / 10) ** 2;
      }
    }
  }

  wake(x0, y0, x1, y1, pressure) {
    if (![x0, y0, x1, y1, pressure].every(Number.isFinite) || pressure < 0) {
      throw new RangeError("Water strokes require finite coordinates and nonnegative pressure");
    }
    const dx = x1 - x0, dy = y1 - y0;
    const distance = Math.hypot(dx, dy);
    if (distance < .001 || pressure === 0) return;
    const count = Math.min(48, Math.ceil(distance / .75));
    const nx = dx / distance, ny = dy / distance;
    const strength = Math.min(pressure, .35) * Math.min(1.5, distance / count);
    for (let sample = 1; sample <= count; sample++) {
      const cx = x0 + dx * sample / count, cy = y0 + dy * sample / count;
      for (let y = Math.max(1, Math.ceil(cy - 7)); y <= Math.min(this.height - 2, cy + 7); y++) {
        for (let x = Math.max(1, Math.ceil(cx - 7)); x <= Math.min(this.width - 2, cx + 7); x++) {
          const falloff = 1 - ((x - cx) ** 2 + (y - cy) ** 2) / 49;
          if (falloff <= 0) continue;
          const along = (x - cx) * nx + (y - cy) * ny;
          const across = (y - cy) * nx - (x - cx) * ny;
          // A moving pressure dipole displaces water ahead and draws it in behind.
          const force = along / 2.2 * Math.exp(-along * along / 12 - across * across / 7) *
            falloff * falloff * strength;
          const i = y * this.width + x;
          this.previous[i] = this.current[i] -
            clamp(this.current[i] - this.previous[i] + force, -.65, .65);
        }
      }
    }
  }

  tap(cx, cy, pressure) {
    if (![cx, cy, pressure].every(Number.isFinite) || pressure < 0) {
      throw new RangeError("Water taps require finite coordinates and nonnegative pressure");
    }
    if (pressure === 0) return;
    for (let y = Math.max(1, Math.ceil(cy - 7)); y <= Math.min(this.height - 2, cy + 7); y++) {
      for (let x = Math.max(1, Math.ceil(cx - 7)); x <= Math.min(this.width - 2, cx + 7); x++) {
        const radius = ((x - cx) ** 2 + (y - cy) ** 2) / 49;
        if (radius >= 1) continue;
        // A smooth depression and displaced rim, with zero net volume in the continuous kernel.
        const force = (4 * radius - 1) * (1 - radius) ** 2 * Math.min(pressure, .35);
        const i = y * this.width + x;
        this.previous[i] = this.current[i] -
          clamp(this.current[i] - this.previous[i] + force, -.65, .65);
      }
    }
  }

  step() {
    const { width: w, height: h, current: a, previous: b, loss } = this;
    let activity = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x;
        // Nine-point spatial stencil avoids the diamond-shaped waves of a four-neighbor grid.
        const lap = (4 * (a[i - 1] + a[i + 1] + a[i - w] + a[i + w]) +
          a[i - w - 1] + a[i - w + 1] + a[i + w - 1] + a[i + w + 1] - 20 * a[i]) / 6;
        const velocity = (a[i] - b[i]) * (.982 - loss[i] * .22);
        const next = (a[i] + velocity + lap * .3) * (.999 - loss[i] * .06);
        b[i] = next;
        activity = Math.max(activity, Math.abs(next), Math.abs(velocity));
      }
    }
    this.previous = a;
    this.current = b;
    this.activity = activity;
    return activity;
  }

  clear() {
    this.current.fill(0);
    this.previous.fill(0);
    this.activity = 0;
  }
}

export function mountWater(canvas) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) {
    console.warn("Interactive water is unavailable: this browser has no 2D canvas context.");
    return;
  }
  const body = document.body;
  const fine = matchMedia("(any-hover: hover) and (any-pointer: fine)");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const texture = new Image();
  let textureReady = false, field, light, paint;
  let frame = 0, lastTime = 0, accumulated = 0, quietSteps = 0;
  let cursor = null, touchCursor = null, touchId = null, suspended = false;
  const strokes = [];
  const blocked = () => suspended || document.hidden || reduced.matches ||
    !body.classList.contains("ocean-ready") || body.classList.contains("motion-paused") ||
    body.classList.contains("is-diving");

  function clear() {
    cancelAnimationFrame(frame);
    frame = lastTime = accumulated = quietSteps = 0;
    cursor = null;
    touchCursor = touchId = null;
    strokes.length = 0;
    field?.clear();
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function clearWake() {
    const activeTouch = touchId;
    clear();
    touchId = activeTouch;
  }

  function resize() {
    // Mobile browser chrome can resize the viewport during a native scroll gesture.
    clearWake();
    field = light = paint = undefined;
    canvas.width = canvas.height = 1;
  }

  function prepare() {
    if (field) return;
    const cell = Math.max(8, innerWidth / 220, innerHeight / 160);
    const width = clamp(Math.ceil(innerWidth / cell) + 2, 8, 222);
    const height = clamp(Math.ceil(innerHeight / cell) + 2, 8, 162);
    canvas.width = width;
    canvas.height = height;
    paint = context.createImageData(width, height);
    const source = document.createElement("canvas");
    source.width = width;
    source.height = height;
    const sourceContext = source.getContext("2d", { willReadFrequently: true });
    if (!sourceContext) throw new Error("Cannot sample the local water-light texture");
    sourceContext.drawImage(texture, 0, 0, width, height);
    const pixels = sourceContext.getImageData(0, 0, width, height).data;
    light = Float32Array.from({ length: width * height }, (_, i) =>
      (pixels[i * 4 + 1] + pixels[i * 4 + 2]) / 510);
    field = new WaterField(width, height);
  }

  function sampleLight(x, y) {
    x = clamp(x, 0, field.width - 1.001);
    y = clamp(y, 0, field.height - 1.001);
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy, i = iy * field.width + ix;
    return (light[i] * (1 - fx) + light[i + 1] * fx) * (1 - fy) +
      (light[i + field.width] * (1 - fx) + light[i + field.width + 1] * fx) * fy;
  }

  function render() {
    const { width: w, height: h, current: a } = field;
    const pixels = paint.data;
    let peakAlpha = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = y * w + x, p = i * 4;
        const dx = a[i - 1] - a[i + 1], dy = a[i - w] - a[i + w];
        const bentLight = sampleLight(x + dx * 5, y + dy * 5) - light[i];
        const shade = (dx * .45 + dy * .8) * .52 + bentLight * .9;
        const bright = shade > 0;
        pixels[p] = bright ? 165 : 0;
        pixels[p + 1] = bright ? 206 : 8;
        pixels[p + 2] = bright ? 195 : 14;
        pixels[p + 3] = Math.round(.18 * (1 - Math.exp(-Math.abs(shade) * 7)) * 255);
        peakAlpha = Math.max(peakAlpha, pixels[p + 3]);
      }
    }
    context.putImageData(paint, 0, 0);
    return peakAlpha;
  }

  function tick(now) {
    frame = 0;
    if (blocked()) { clear(); return; }
    for (const stroke of strokes) {
      const sx = (field.width - 2) / innerWidth, sy = (field.height - 2) / innerHeight;
      if (stroke.from) {
        field.wake(stroke.from.x * sx + 1, stroke.from.y * sy + 1,
          stroke.to.x * sx + 1, stroke.to.y * sy + 1, stroke.pressure);
      } else {
        field.tap(stroke.to.x * sx + 1, stroke.to.y * sy + 1, stroke.pressure);
      }
    }
    if (strokes.length) quietSteps = 0;
    strokes.length = 0;
    accumulated += Math.min(50, lastTime ? now - lastTime : STEP);
    lastTime = now;
    let steps = 0;
    while (accumulated >= STEP) {
      field.step();
      accumulated -= STEP;
      steps++;
    }
    if (steps) quietSteps = render() <= 1 ? quietSteps + steps : 0;
    if (quietSteps >= 12) { clearWake(); return; }
    frame = requestAnimationFrame(tick);
  }

  const inViewport = point => point.x >= 0 && point.y >= 0 && point.x <= innerWidth && point.y <= innerHeight;

  function queue(from, to, pressure) {
    prepare();
    if (strokes.length === 24) strokes.shift();
    strokes.push({ from, to, pressure });
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function stroke(previous, point) {
    if (!previous || previous.id !== point.id || point.time - previous.time > 160) return;
    const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
    if (distance < .5) return;
    const speed = distance / Math.max(1, point.time - previous.time);
    queue(previous, point, Math.min(.32, .16 * Math.sqrt(speed)));
  }

  function move(event) {
    if (blocked() || !textureReady || !fine.matches || event.isPrimary === false ||
        (event.pointerType !== "mouse" && event.pointerType !== "pen")) return;
    const point = { x: event.clientX, y: event.clientY, time: event.timeStamp, id: event.pointerId };
    const previous = cursor;
    cursor = inViewport(point) ? point : null;
    if (cursor) stroke(previous, cursor);
  }

  const touchPoint = (touch, time) => ({ x: touch.clientX, y: touch.clientY, id: touch.identifier, time });
  const endTouch = () => { touchCursor = touchId = null; };
  function startTouch(event) {
    endTouch();
    cursor = null;
    if (blocked() || !textureReady || event.touches.length !== 1) return;
    const point = touchPoint(event.touches[0], event.timeStamp);
    if (!inViewport(point)) return;
    touchCursor = point;
    touchId = point.id;
    queue(null, point, .28);
  }

  function moveTouch(event) {
    if (blocked() || event.touches.length !== 1) { endTouch(); return; }
    const point = touchPoint(event.touches[0], event.timeStamp);
    if (point.id !== touchId) return;
    const previous = touchCursor;
    touchCursor = inViewport(point) ? point : null;
    if (touchCursor) stroke(previous, touchCursor);
  }

  const sync = () => { if (blocked()) clear(); };
  const leave = () => { cursor = null; };
  const hide = () => { suspended = true; clear(); };
  const show = () => { suspended = false; clear(); };
  const observer = new MutationObserver(sync);
  observer.observe(body, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("pointermove", move, { passive: true });
  // Touch events continue after pointercancel hands a pan to the browser; never capture/prevent it.
  window.addEventListener("touchstart", startTouch, { passive: true });
  window.addEventListener("touchmove", moveTouch, { passive: true });
  window.addEventListener("touchend", endTouch, { passive: true });
  window.addEventListener("touchcancel", endTouch, { passive: true });
  document.addEventListener("pointerleave", leave);
  window.addEventListener("blur", clear);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", clear);
  window.addEventListener("pagehide", hide);
  window.addEventListener("pageshow", show);
  fine.addEventListener("change", clear);
  reduced.addEventListener("change", clear);
  texture.onload = () => { textureReady = true; };
  texture.onerror = () => {
    console.warn("Interactive water could not load its local light texture; the static scene remains available.");
    clear();
  };
  texture.src = new URL("water-light.svg", import.meta.url).href;
  resize();
  return {
    destroy() {
      clear();
      observer.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("touchstart", startTouch);
      window.removeEventListener("touchmove", moveTouch);
      window.removeEventListener("touchend", endTouch);
      window.removeEventListener("touchcancel", endTouch);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", clear);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", clear);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
      fine.removeEventListener("change", clear);
      reduced.removeEventListener("change", clear);
      texture.onload = texture.onerror = null;
    }
  };
}

if (typeof document !== "undefined") {
  const canvas = document.querySelector(".water-surface");
  if (!canvas) throw new Error("Interactive water canvas is missing");
  mountWater(canvas);
}
