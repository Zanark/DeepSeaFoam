const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const radians = Math.PI / 180;
const RESPONSE = 1.1;
export const SPEED_MULTIPLIER = 3;
const MIN_SPEED = 10 * SPEED_MULTIPLIER;
const MAX_SPEED = 28 * SPEED_MULTIPLIER;
const MAX_RATE = .22 * SPEED_MULTIPLIER;
const AXES = ["x", "y"];
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
    y: Math.max(0, (vertical - fishWidth * Math.sin(angle)) / 2),
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
  const heading = random(state) * Math.PI * 2;
  const direction = { x: Math.cos(heading), y: Math.sin(heading) };
  for (const axis of AXES) {
    if (Math.abs(state[axis].position) > .85) {
      direction[axis] = -Math.sign(state[axis].position) * Math.abs(direction[axis]);
    }
  }
  const duration = 4 + random(state) * 6;
  const speed = MIN_SPEED + random(state) * (MAX_SPEED - MIN_SPEED);
  state.leg = { id: state.leg.id + 1, direction, duration, speed };
  state.remaining = duration;
}

// All distances passed to the model are CSS pixels; step durations are milliseconds.
// The seed lives in the returned state, so neither stepping nor resizing mutates inputs.
export function createDrift({ width, height, fishWidth, fishHeight, seed = 1 }) {
  const state = {
    bounds: boundsFor(width, height, fishWidth, fishHeight),
    seed: (seed >>> 0) || 1,
    x: { position: 0, velocity: 0, acceleration: 0 },
    y: { position: 0, velocity: 0, acceleration: 0 },
    time: 0, remaining: 0,
    phase: 0, leg: { id: 0 }
  };
  state.phase = random(state) * Math.PI * 2;
  chooseLeg(state);
  return state;
}

function advanceAxis(axis, target, dt) {
  // Exact critically damped velocity filter; turns preserve velocity and acceleration.
  const offset = axis.velocity - target;
  const slope = axis.acceleration + RESPONSE * offset;
  const decay = Math.exp(-RESPONSE * dt);
  return {
    position: axis.position + target * dt + offset * (1 - decay) / RESPONSE +
      slope * (1 - decay * (1 + RESPONSE * dt)) / (RESPONSE * RESPONSE),
    velocity: target + (offset + slope * dt) * decay,
    acceleration: (axis.acceleration - RESPONSE * slope * dt) * decay
  };
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
        AXES.some(axis => Math.abs(next[axis].position) > 1 &&
          next[axis].position * next.leg.direction[axis] > 0)) {
      chooseLeg(next);
    }
    const dt = Math.min(remaining, next.remaining);
    for (const axis of AXES) {
      const target = next.leg.direction[axis] *
        Math.min(MAX_RATE, next.leg.speed / Math.max(110, next.bounds[axis]));
      next[axis] = advanceAxis(next[axis], target, dt);
    }
    next.time += dt;
    next.remaining -= dt;
    remaining -= dt;
  }
  return next;
}

function axisPose(axis, bound) {
  const position = Math.tanh(axis.position);
  const scale = bound * (1 - position * position);
  return {
    position: bound * position,
    velocity: scale * axis.velocity,
    acceleration: scale * (axis.acceleration - 2 * position * axis.velocity * axis.velocity)
  };
}

export function driftPose(state) {
  const { bounds, time, phase } = state;
  // Both axes use soft confinement, rather than wrapping or bouncing at the screen edges.
  const x = axisPose(state.x, bounds.x), y = axisPose(state.y, bounds.y);
  const t = Math.min(1, time / 4);
  const fade = t * t * t * (10 + t * (-15 + 6 * t));
  return {
    x: x.position,
    y: y.position,
    angle: bounds.angle * fade *
      (.65 * Math.sin(time * .37 + phase) + .35 * Math.sin(time * .61)),
    vx: x.velocity, vy: y.velocity,
    ax: x.acceleration, ay: y.acceleration
  };
}

export function resizeDrift(state, { width, height, fishWidth, fishHeight }) {
  const bounds = boundsFor(width, height, fishWidth, fishHeight);
  if (Object.keys(bounds).every(key => bounds[key] === state.bounds[key])) return state;
  const next = { ...state, bounds };
  for (const axis of AXES) {
    const pose = axisPose(state[axis], state.bounds[axis]);
    const position = bounds[axis] ? Math.atanh(clamp(pose.position / bounds[axis], -.95, .95)) : 0;
    const normalized = Math.tanh(position);
    const scale = bounds[axis] * (1 - normalized * normalized);
    const velocity = scale ? clamp(pose.velocity / scale, -MAX_RATE, MAX_RATE) : 0;
    const acceleration = scale ? clamp(pose.acceleration / scale +
      2 * normalized * velocity * velocity, -.2 * SPEED_MULTIPLIER, .2 * SPEED_MULTIPLIER) : 0;
    next[axis] = { position, velocity, acceleration };
  }
  return next;
}

const controllers = new WeakMap();

// CSS contract: a fixed scene layer above the ocean but below main/footer content,
// and an absolutely positioned SVG at left/top 50%, with transform:
// translate(-50%, -50%), transform-origin: 50% 50%, and a responsive size that
// fits the zone. No transform animation/transition on the SVG or .nautilus-float.
// JS owns only the SVG's transform and the zone's data-nautilus-state (running,
// paused, static). Reduced motion uses the fallback.
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
  const viewport = win.visualViewport;
  const originalViewport = Object.fromEntries(["left", "top", "width", "height"]
    .map(name => [name, zone.style[name]]));
  function fitViewport() {
    if (!viewport) return;
    for (const [name, value] of Object.entries({
      left: viewport.offsetLeft, top: viewport.offsetTop, width: viewport.width, height: viewport.height
    })) {
      if (zone.style[name] !== `${value}px`) zone.style[name] = `${value}px`;
    }
  }
  const seed = Math.floor(Math.random() * 4294967296) || 1;
  const dimensions = () => ({
    width: zone.clientWidth, height: zone.clientHeight,
    fishWidth: fish.clientWidth, fishHeight: fish.clientHeight
  });
  fitViewport();
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
    body.classList.contains("page-hidden") || body.classList.contains("is-diving") || !model.bounds.visible ||
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
    fitViewport();
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
  if (viewport) {
    listen(viewport, "resize", resize);
    listen(viewport, "scroll", resize);
  }
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
      for (const [name, value] of Object.entries(originalViewport)) zone.style[name] = value;
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
