const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const radians = Math.PI / 180;
const RESPONSE = 1.1;
const MAX_SPEED = 28;
const MAX_RATE = .22;
export const MAX_STEP_MS = 50;

function boundsFor(width, height, fishWidth, fishHeight) {
  if (![width, height, fishWidth, fishHeight].every(value => Number.isFinite(value) && value >= 0)) {
    throw new RangeError("Nautilus dimensions must be finite and nonnegative");
  }
  const horizontal = Math.max(0, width - fishWidth - 12);
  const vertical = Math.max(0, height - fishHeight - 12);
  const angle = Math.min(3.5 * radians,
    Math.asin(clamp(horizontal / Math.max(1, fishHeight), 0, 1)),
    Math.asin(clamp(vertical / Math.max(1, fishWidth), 0, 1)));
  // Reserve the rotated rectangle, not just the unrotated SVG's dimensions.
  return {
    x: Math.max(0, (horizontal - fishHeight * Math.sin(angle)) / 2),
    y: Math.min(10, Math.max(0, (vertical - fishWidth * Math.sin(angle)) / 2)),
    angle: angle / radians,
    visible: width > 0 && height > 0 && fishWidth > 0 && fishHeight > 0
  };
}

function random(state) {
  let seed = state.seed;
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  state.seed = seed >>> 0;
  return state.seed / 4294967296;
}

function chooseLeg(state) {
  let direction = random(state) < .5 ? -1 : 1;
  if (Math.abs(state.position) > .85) direction = -Math.sign(state.position);
  const duration = 4 + random(state) * 6;
  const speed = 10 + random(state) * (MAX_SPEED - 10);
  state.leg = { id: state.leg.id + 1, direction, duration, speed };
  state.remaining = duration;
}

// All distances passed to the model are CSS pixels; step durations are milliseconds.
// The seed lives in the returned state, so neither stepping nor resizing mutates inputs.
export function createDrift({ width, height, fishWidth, fishHeight, seed = 1 }) {
  const state = {
    bounds: boundsFor(width, height, fishWidth, fishHeight),
    seed: (seed >>> 0) || 1,
    position: 0, velocity: 0, acceleration: 0, time: 0, remaining: 0,
    phase: 0, leg: { id: 0 }
  };
  state.phase = random(state) * Math.PI * 2;
  chooseLeg(state);
  return state;
}

export function stepDrift(state, elapsedMs) {
  if (!Number.isFinite(elapsedMs) || elapsedMs < 0) {
    throw new RangeError("Nautilus elapsed time must be finite and nonnegative");
  }
  // A zero-duration frame is a no-op, including the first frame after resuming.
  if (elapsedMs === 0) return state;
  const next = { ...state };
  let remaining = Math.min(elapsedMs, MAX_STEP_MS) / 1000;
  while (remaining > 1e-9) {
    if (next.remaining <= 1e-9 ||
        (Math.abs(next.position) > 1 && Math.sign(next.position) === next.leg.direction)) {
      chooseLeg(next);
    }
    const dt = Math.min(remaining, next.remaining);
    const target = next.leg.direction *
      Math.min(MAX_RATE, next.leg.speed / Math.max(110, next.bounds.x));
    // Exact critically damped velocity filter. A new target changes neither
    // velocity nor acceleration abruptly, including when the edge asks for a turn.
    const offset = next.velocity - target;
    const slope = next.acceleration + RESPONSE * offset;
    const decay = Math.exp(-RESPONSE * dt);
    next.position += target * dt + offset * (1 - decay) / RESPONSE +
      slope * (1 - decay * (1 + RESPONSE * dt)) / (RESPONSE * RESPONSE);
    next.velocity = target + (offset + slope * dt) * decay;
    next.acceleration = (next.acceleration - RESPONSE * slope * dt) * decay;
    next.time += dt;
    next.remaining -= dt;
    remaining -= dt;
  }
  return next;
}

export function driftPose(state) {
  const { bounds, time, phase, position, velocity, acceleration } = state;
  // Soft confinement avoids edge collisions, clamping, and position wrapping.
  const horizontal = Math.tanh(position);
  const scale = bounds.x * (1 - horizontal * horizontal);
  const t = Math.min(1, time / 4);
  const fade = t * t * t * (10 + t * (-15 + 6 * t));
  return {
    x: bounds.x * horizontal,
    y: bounds.y * fade * (.6 * Math.sin(time * .55 + phase) + .4 * Math.sin(time * .83)),
    angle: bounds.angle * fade *
      (.65 * Math.sin(time * .37 + phase) + .35 * Math.sin(time * .61)),
    vx: scale * velocity,
    ax: scale * (acceleration - 2 * horizontal * velocity * velocity)
  };
}

export function resizeDrift(state, { width, height, fishWidth, fishHeight }) {
  const bounds = boundsFor(width, height, fishWidth, fishHeight);
  if (Object.keys(bounds).every(key => bounds[key] === state.bounds[key])) return state;
  const pose = driftPose(state);
  const position = bounds.x ? Math.atanh(clamp(pose.x / bounds.x, -.95, .95)) : 0;
  const horizontal = Math.tanh(position);
  const scale = bounds.x * (1 - horizontal * horizontal);
  const velocity = scale ? clamp(pose.vx / scale, -MAX_RATE, MAX_RATE) : 0;
  const acceleration = scale ? clamp(pose.ax / scale +
    2 * horizontal * velocity * velocity, -.2, .2) : 0;
  return { ...state, bounds, position, velocity, acceleration };
}

const controllers = new WeakMap();

// CSS contract: a positioned zone and an absolutely positioned SVG at left/top
// 50%, with transform: translate(-50%, -50%), transform-origin: 50% 50%, and a
// responsive size that fits the zone. No transform animation/transition on the
// SVG or .nautilus-float. JS owns only the SVG's transform and the zone's
// data-nautilus-state (running, paused, static). Reduced motion uses the fallback.
export function mountNautilus(zone) {
  if (!zone || typeof zone.querySelector !== "function" || !zone.ownerDocument) {
    throw new TypeError("Nautilus mounting requires a zone element");
  }
  if (controllers.has(zone)) return controllers.get(zone);
  const fish = zone.querySelector("svg.nautilus");
  const doc = zone.ownerDocument;
  const win = doc.defaultView;
  if (!fish) {
    console.warn("Nautilus motion unavailable: missing svg.nautilus. Using the static fallback.");
    return;
  }
  if (typeof win?.requestAnimationFrame !== "function" ||
      typeof win.cancelAnimationFrame !== "function" || typeof win.matchMedia !== "function") {
    console.warn("Nautilus motion unavailable: unsupported animation APIs. Using the static fallback.");
    return;
  }
  const body = doc.body;
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)");
  const originalTransform = fish.style.transform;
  const originalState = zone.getAttribute("data-nautilus-state");
  const seed = Math.floor(Math.random() * 4294967296) || 1;
  const dimensions = () => ({
    width: zone.clientWidth, height: zone.clientHeight,
    fishWidth: fish.clientWidth, fishHeight: fish.clientHeight
  });
  let model = createDrift({ ...dimensions(), seed });
  let frame = null, lastTime = null, suspended = false, destroyed = false;
  let focused = typeof doc.hasFocus !== "function" || doc.hasFocus();
  let wasReduced = false;
  const cleanups = [];

  function inViewport() {
    const rect = zone.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 &&
      rect.top < win.innerHeight && rect.left < win.innerWidth;
  }

  let visible = inViewport();
  const blocked = () => destroyed || suspended || !focused || !visible || reduced.matches ||
    doc.hidden || (doc.visibilityState && doc.visibilityState !== "visible") ||
    !body.classList.contains("ocean-ready") || body.classList.contains("motion-paused") ||
    body.classList.contains("page-hidden") || !model.bounds.visible ||
    !(model.bounds.x || model.bounds.y || model.bounds.angle);

  function stop() {
    if (frame !== null) win.cancelAnimationFrame(frame);
    frame = lastTime = null;
  }

  function render() {
    const pose = driftPose(model);
    fish.style.transform = `translate(-50%, -50%) translate3d(${pose.x.toFixed(3)}px, ` +
      `${pose.y.toFixed(3)}px, 0) rotate(${pose.angle.toFixed(3)}deg)`;
  }

  function sync() {
    if (destroyed) return;
    if (reduced.matches) {
      stop();
      if (!wasReduced) model = createDrift({ ...dimensions(), seed });
      wasReduced = true;
      fish.style.removeProperty("transform");
      zone.setAttribute("data-nautilus-state", "static");
    } else {
      wasReduced = false;
      if (blocked()) {
        stop();
        zone.setAttribute("data-nautilus-state", "paused");
      } else {
        zone.setAttribute("data-nautilus-state", "running");
        if (frame === null) {
          lastTime = null;
          frame = win.requestAnimationFrame(tick);
        }
      }
    }
  }

  function tick(now) {
    frame = null;
    if (blocked()) { sync(); return; }
    if (lastTime !== null) model = stepDrift(model, now - lastTime);
    lastTime = now;
    render();
    frame = win.requestAnimationFrame(tick);
  }

  function resize() {
    if (destroyed) return;
    model = resizeDrift(model, dimensions());
    visible = inViewport();
    if (!reduced.matches) render();
    sync();
  }

  function checkVisibility() {
    if (destroyed) return;
    visible = inViewport();
    sync();
  }

  function listen(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    cleanups.push(() => target.removeEventListener(type, callback, options));
  }

  listen(win, "resize", resize);
  listen(win, "blur", () => { focused = false; sync(); });
  listen(win, "focus", () => { focused = true; checkVisibility(); });
  listen(doc, "visibilitychange", checkVisibility);
  listen(win, "pagehide", event => {
    suspended = true;
    sync();
    if (!event.persisted) controller.destroy();
  });
  listen(win, "pageshow", () => {
    suspended = false;
    focused = typeof doc.hasFocus !== "function" || doc.hasFocus();
    lastTime = null;
    resize();
  });
  if (typeof reduced.addEventListener === "function") listen(reduced, "change", sync);
  else {
    reduced.addListener(sync);
    cleanups.push(() => reduced.removeListener(sync));
  }
  if (win.MutationObserver) {
    const observer = new win.MutationObserver(sync);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    cleanups.push(() => observer.disconnect());
  }
  if (win.IntersectionObserver) {
    const observer = new win.IntersectionObserver(entries => {
      if (destroyed) return;
      for (const entry of entries) {
        if (entry.target === zone) visible = entry.isIntersecting && entry.intersectionRatio > 0;
      }
      sync();
    });
    observer.observe(zone);
    cleanups.push(() => observer.disconnect());
  } else {
    listen(win, "scroll", checkVisibility, { passive: true });
  }
  if (win.ResizeObserver) {
    const observer = new win.ResizeObserver(resize);
    observer.observe(zone);
    observer.observe(fish);
    cleanups.push(() => observer.disconnect());
  }

  const controller = {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stop();
      for (const cleanup of cleanups) cleanup();
      fish.style.transform = originalTransform;
      if (originalState === null) zone.removeAttribute("data-nautilus-state");
      else zone.setAttribute("data-nautilus-state", originalState);
      controllers.delete(zone);
    }
  };
  controllers.set(zone, controller);
  sync();
  return controller;
}

if (typeof document !== "undefined") {
  for (const zone of document.querySelectorAll(".nautilus-zone")) mountNautilus(zone);
}
