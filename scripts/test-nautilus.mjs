import assert from "node:assert/strict";
import test from "node:test";
import { createDrift, driftPose, MAX_STEP_MS, mountNautilus, resizeDrift, stepDrift } from "../site/nautilus.js";

const dimensions = { width: 900, height: 210, fishWidth: 230, fishHeight: 155 };
const create = (seed = 42, size = dimensions) => createDrift({ ...size, seed });
const advance = (state, count, dt = 1000 / 60) => {
  for (let i = 0; i < count; i++) state = stepDrift(state, dt);
  return state;
};

test("model is deterministic, starts centered, and never mutates its inputs", () => {
  const start = create();
  const before = structuredClone(start);
  const first = advance(start, 900);
  assert.deepEqual(driftPose(start), { x: 0, y: 0, angle: 0, vx: 0, ax: 0 });
  assert.deepEqual(start, before);
  assert.deepEqual(first, advance(create(), 900));
  assert.notDeepEqual(first, advance(create(77), 900));
  assert.notEqual(driftPose(first).x, 0);
  assert.notEqual(driftPose(first).y, 0);
  assert.notEqual(driftPose(first).angle, 0);
});

test("random legs vary duration and speed, reverse, and can keep the same direction", () => {
  let state = create();
  const legs = [state.leg];
  let left = false, right = false;
  for (let i = 0; i < 30000; i++) {
    const next = stepDrift(state, 50);
    if (next.leg.id !== state.leg.id) legs.push(next.leg);
    left ||= driftPose(next).vx < -2;
    right ||= driftPose(next).vx > 2;
    state = next;
  }
  assert.ok(legs.length > 150);
  assert.ok(legs.some((leg, index) => index && leg.direction === legs[index - 1].direction));
  assert.ok(legs.some((leg, index) => index && leg.direction !== legs[index - 1].direction));
  assert.ok(new Set(legs.map(leg => leg.duration.toFixed(1))).size > 20);
  assert.ok(new Set(legs.map(leg => leg.speed.toFixed(1))).size > 20);
  assert.ok(left && right);
  assert.ok(legs.every(leg => leg.duration >= 4 && leg.duration <= 10 &&
    leg.speed >= 10 && leg.speed <= 28));
});

test("position, speed, and acceleration stay bounded with irregular frame intervals", () => {
  for (const size of [
    dimensions,
    { width: 320, height: 190, fishWidth: 200, fishHeight: 135 },
    { width: 1900, height: 400, fishWidth: 230, fishHeight: 155 },
    { width: 80, height: 54, fishWidth: 80, fishHeight: 54 }
  ]) {
    let state = create(2026, size);
    const intervals = [8, 16, 33, 50, 1, 2000, 0];
    for (let i = 0; i < 12000; i++) {
      const dt = intervals[i % intervals.length];
      const previous = driftPose(state);
      const next = stepDrift(state, dt);
      const pose = driftPose(next);
      for (const value of Object.values(pose)) assert.ok(Number.isFinite(value));
      assert.ok(Math.abs(pose.x) <= next.bounds.x);
      assert.ok(Math.abs(pose.y) <= next.bounds.y + 1e-10);
      assert.ok(Math.abs(pose.angle) <= next.bounds.angle + 1e-10);
      assert.ok(Math.abs(pose.vx) <= 28 + 1e-10);
      assert.ok(Math.abs(pose.ax) <= 36);
      const elapsed = Math.min(dt, MAX_STEP_MS) / 1000;
      assert.ok(Math.abs(pose.x - previous.x) <= 28 * elapsed + 1e-8);
      assert.ok(Math.abs(pose.vx - previous.vx) <= 36 * elapsed + 1e-8);
      const angle = Math.abs(pose.angle) * Math.PI / 180;
      const halfWidth = (size.fishWidth * Math.cos(angle) + size.fishHeight * Math.sin(angle)) / 2;
      const halfHeight = (size.fishHeight * Math.cos(angle) + size.fishWidth * Math.sin(angle)) / 2;
      assert.ok(Math.abs(pose.x) + halfWidth <= size.width / 2 + 1e-8);
      assert.ok(Math.abs(pose.y) + halfHeight <= size.height / 2 + 1e-8);
      state = next;
    }
  }
});

test("the continuous filter has consistent travel at different ordinary frame rates", () => {
  const a = advance(create(), 480, 1000 / 120);
  const b = advance(create(), 240, 1000 / 60);
  const c = advance(create(), 80, 50);
  for (const key of ["x", "y", "angle", "vx", "ax"]) {
    assert.ok(Math.abs(driftPose(a)[key] - driftPose(b)[key]) < 1e-8, key);
    assert.ok(Math.abs(driftPose(a)[key] - driftPose(c)[key]) < 1e-8, key);
  }
});

test("new random legs and soft-bound turns preserve velocity and acceleration continuity", () => {
  for (const position of [.4, 1.01, -1.01]) {
    const state = {
      ...advance(create(), 300), position, velocity: .12, acceleration: .04,
      remaining: 0, leg: { id: 4, direction: Math.sign(position), duration: 8, speed: 28 }
    };
    const before = driftPose(state);
    const next = stepDrift(state, .0001);
    const after = driftPose(next);
    assert.equal(next.leg.id, 5);
    assert.ok(Math.abs(after.x - before.x) < .00001);
    assert.ok(Math.abs(after.vx - before.vx) < .00001);
    assert.ok(Math.abs(after.ax - before.ax) < .00001);
    if (Math.abs(position) > 1) assert.equal(next.leg.direction, -Math.sign(position));
  }
});

test("long frames discard elapsed-time backlog rather than catching up later", () => {
  const initial = advance(create(), 100);
  let long = stepDrift(initial, 3600000);
  let short = stepDrift(initial, MAX_STEP_MS);
  assert.deepEqual(long, short);
  for (let i = 0; i < 100; i++) {
    long = stepDrift(long, 16);
    short = stepDrift(short, 16);
  }
  assert.deepEqual(long, short);
  assert.equal(stepDrift(initial, 0), initial);
});

test("invalid elapsed time throws without changing the drift state", () => {
  const state = advance(create(), 100);
  const before = structuredClone(state);
  for (const dt of [-1, -.001, NaN, Infinity, -Infinity, undefined, null, "16"]) {
    assert.throws(() => stepDrift(state, dt), {
      name: "RangeError", message: "Nautilus elapsed time must be finite and nonnegative"
    });
    assert.deepEqual(state, before);
  }
});

test("resizing preserves a fitting horizontal pose and constrains a smaller zone", () => {
  let state = advance(create(), 300);
  const before = structuredClone(state);
  const wider = resizeDrift(state, { ...dimensions, width: 1100 });
  assert.ok(Math.abs(driftPose(wider).x - driftPose(state).x) < 1e-8);
  assert.ok(Math.abs(driftPose(wider).vx - driftPose(state).vx) < 1e-8);
  assert.deepEqual(state, before);
  assert.equal(resizeDrift(state, dimensions), state);
  for (const width of [320, 1200, 240, 0, 600, 320]) {
    const size = { ...dimensions, width, fishWidth: Math.min(width, 200), fishHeight: 135 };
    state = resizeDrift(state, size);
    state = advance(state, 500);
    const pose = driftPose(state);
    assert.ok(Math.abs(pose.x) <= state.bounds.x);
    assert.ok(Number.isFinite(pose.vx) && Number.isFinite(pose.ax));
  }
  for (const width of [-1, NaN, Infinity]) {
    assert.throws(() => create(1, { ...dimensions, width }), RangeError);
  }
});

class Events {
  listeners = new Map();
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(callback);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  fire(type, event = {}) {
    for (const callback of this.listeners.get(type) ?? []) callback(event);
  }
  listenerCount() {
    return [...this.listeners.values()].reduce((sum, callbacks) => sum + callbacks.size, 0);
  }
}

function scene({ reduced = false, ready = true, onscreen = true, observers = true, focused = true } = {}) {
  const win = new Events(), doc = new Events(), media = new Events();
  const frames = new Map();
  const mutations = [], intersections = [], resizes = [];
  let id = 0, now = 0, rectangleReads = 0;
  const classes = new Set(ready ? ["ocean-ready"] : []);
  const body = { classList: { contains: name => classes.has(name) } };
  const fish = {
    clientWidth: 230, clientHeight: 155,
    style: { transform: "", removeProperty(name) { this[name] = ""; } }
  };
  const attributes = new Map();
  const rect = { top: onscreen ? 100 : 1000, left: 0, width: 900, height: 210 };
  const zone = {
    ownerDocument: doc, clientWidth: 900, clientHeight: 210,
    querySelector: selector => selector === "svg.nautilus" ? fish : null,
    getAttribute: name => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
    getBoundingClientRect() {
      rectangleReads++;
      return { ...rect, bottom: rect.top + rect.height, right: rect.left + rect.width };
    }
  };
  Object.assign(doc, { body, defaultView: win, hidden: false, visibilityState: "visible", hasFocus: () => focused });
  Object.assign(media, { matches: reduced });
  Object.assign(win, {
    innerWidth: 1000, innerHeight: 800, matchMedia: () => media,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: key => frames.delete(key)
  });
  function observerType(collection) {
    return class {
      disconnected = false;
      observed = new Set();
      constructor(callback) { this.callback = callback; collection.push(this); }
      observe(target) { this.observed.add(target); }
      disconnect() { this.disconnected = true; this.observed.clear(); }
      fire(entries) { if (!this.disconnected) this.callback(entries); }
    };
  }
  win.MutationObserver = observerType(mutations);
  if (observers) {
    win.IntersectionObserver = observerType(intersections);
    win.ResizeObserver = observerType(resizes);
  }
  const controller = mountNautilus(zone);
  return {
    win, doc, media, fish, zone, frames, controller, rect, mutations, intersections, resizes,
    get rectangleReads() { return rectangleReads; },
    get state() { return zone.getAttribute("data-nautilus-state"); },
    setClass(name, on) {
      if (on) classes.add(name);
      else classes.delete(name);
      for (const observer of mutations) observer.fire([]);
    },
    intersect(on) {
      rect.top = on ? 100 : 1000;
      for (const observer of intersections) {
        observer.fire([{ target: zone, isIntersecting: on, intersectionRatio: on ? 1 : 0 }]);
      }
    },
    flush(elapsed = 16) {
      now += elapsed;
      const pending = [...frames.values()];
      frames.clear();
      for (const callback of pending) callback(now);
    }
  };
}

test("mounting rejects invalid zone inputs explicitly", () => {
  for (const zone of [null, undefined, false, 1, {}, { querySelector() {} }]) {
    assert.throws(() => mountNautilus(zone), {
      name: "TypeError", message: "Nautilus mounting requires a zone element"
    });
  }
});

test("missing SVG warns and preserves the static fallback without allocating a controller", context => {
  const warn = context.mock.method(console, "warn", () => {});
  const s = scene();
  s.controller.destroy();
  s.zone.querySelector = () => null;
  assert.equal(mountNautilus(s.zone), undefined);
  assert.equal(warn.mock.callCount(), 1);
  assert.match(warn.mock.calls[0].arguments[0], /missing svg\.nautilus.*static fallback/);
  assert.equal(s.fish.style.transform, "");
  assert.equal(s.state, null);
  assert.equal(s.frames.size, 0);
  assert.equal(s.win.listenerCount() + s.doc.listenerCount() + s.media.listenerCount(), 0);
  assert.equal(s.mutations.length, 1);
});

test("unsupported animation APIs warn without hiding or changing the static fish", context => {
  const warn = context.mock.method(console, "warn", () => {});
  for (const api of ["requestAnimationFrame", "cancelAnimationFrame", "matchMedia", "defaultView"]) {
    const s = scene();
    s.controller.destroy();
    if (api === "defaultView") s.doc.defaultView = null;
    else s.win[api] = undefined;
    assert.equal(mountNautilus(s.zone), undefined);
    assert.equal(s.fish.style.transform, "");
    assert.equal(s.state, null);
    assert.equal(s.frames.size, 0);
    assert.equal(s.win.listenerCount() + s.doc.listenerCount() + s.media.listenerCount(), 0);
    assert.equal(s.mutations.length, 1);
  }
  assert.equal(warn.mock.callCount(), 4);
  for (const call of warn.mock.calls) {
    assert.match(call.arguments[0], /unsupported animation APIs.*static fallback/);
  }
});

test("controller waits for ocean-ready, runs one RAF, and does no per-frame geometry reads", () => {
  const s = scene({ ready: false });
  assert.equal(s.frames.size, 0);
  assert.equal(s.fish.style.transform, "");
  s.setClass("ocean-ready", true);
  assert.equal(s.frames.size, 1);
  const reads = s.rectangleReads;
  for (let i = 0; i < 300; i++) s.flush();
  assert.equal(s.frames.size, 1);
  assert.equal(s.rectangleReads, reads);
  assert.equal(s.state, "running");
  assert.match(s.fish.style.transform, /^translate\(-50%, -50%\) translate3d\(.+\) rotate\(.+deg\)$/);
  assert.ok(!s.fish.style.transform.includes("scale"));
  assert.equal(mountNautilus(s.zone), s.controller);
  assert.equal(s.mutations.length, 1);
  s.controller.destroy();
});

test("user pause freezes the current pose and resume consumes no suspended time", () => {
  const s = scene();
  for (let i = 0; i < 200; i++) s.flush();
  const pose = s.fish.style.transform;
  s.setClass("motion-paused", true);
  assert.equal(s.frames.size, 0);
  assert.equal(s.state, "paused");
  s.flush(3600000);
  assert.equal(s.fish.style.transform, pose);
  s.setClass("motion-paused", false);
  s.flush(3600000);
  assert.equal(s.fish.style.transform, pose);
  s.flush();
  assert.notEqual(s.fish.style.transform, pose);
  s.controller.destroy();
});

test("reduced motion is a centered static fallback and reacts while paused", () => {
  const s = scene({ reduced: true });
  assert.equal(s.frames.size, 0);
  assert.equal(s.state, "static");
  assert.equal(s.fish.style.transform, "");
  s.media.matches = false;
  s.media.fire("change");
  for (let i = 0; i < 200; i++) s.flush();
  s.setClass("motion-paused", true);
  s.media.matches = true;
  s.media.fire("change");
  assert.equal(s.frames.size, 0);
  assert.equal(s.state, "static");
  assert.equal(s.fish.style.transform, "");
  s.media.matches = false;
  s.media.fire("change");
  assert.equal(s.frames.size, 0);
  s.setClass("motion-paused", false);
  s.flush(3600000);
  assert.match(s.fish.style.transform, /translate3d\(0\.000px, 0\.000px, 0\) rotate\(0\.000deg\)/);
  s.controller.destroy();
});

test("intersection, visibility, shared page-hidden, and focus suspend without polling", () => {
  const s = scene({ onscreen: false });
  assert.equal(s.frames.size, 0);
  s.intersect(true);
  for (let i = 0; i < 200; i++) s.flush();
  const pose = s.fish.style.transform;
  const pairs = [
    [() => s.intersect(false), () => s.intersect(true)],
    [() => { s.doc.hidden = true; s.doc.fire("visibilitychange"); },
      () => { s.doc.hidden = false; s.doc.fire("visibilitychange"); }],
    [() => { s.doc.visibilityState = "hidden"; s.doc.fire("visibilitychange"); },
      () => { s.doc.visibilityState = "visible"; s.doc.fire("visibilitychange"); }],
    [() => s.setClass("page-hidden", true), () => s.setClass("page-hidden", false)],
    [() => s.win.fire("blur"), () => s.win.fire("focus")]
  ];
  for (const [hide, show] of pairs) {
    hide();
    assert.equal(s.frames.size, 0);
    const reads = s.rectangleReads;
    s.flush(3600000);
    assert.equal(s.rectangleReads, reads);
    assert.equal(s.fish.style.transform, pose);
    show();
    assert.equal(s.frames.size, 1);
    s.flush(3600000);
    assert.equal(s.fish.style.transform, pose);
  }
  s.controller.destroy();
  const unfocused = scene({ focused: false });
  assert.equal(unfocused.frames.size, 0);
  unfocused.win.fire("focus");
  assert.equal(unfocused.frames.size, 1);
  unfocused.controller.destroy();
});

test("without intersection or resize observers, scroll and resize are event-driven", () => {
  const s = scene({ observers: false, onscreen: false });
  assert.equal(s.frames.size, 0);
  s.rect.top = 100;
  s.win.fire("scroll");
  assert.equal(s.frames.size, 1);
  for (let i = 0; i < 100; i++) s.flush();
  s.zone.clientWidth = 320;
  s.win.fire("resize");
  assert.equal(s.frames.size, 1);
  s.rect.top = -500;
  s.win.fire("scroll");
  assert.equal(s.frames.size, 0);
  const pose = s.fish.style.transform;
  s.flush(3600000);
  assert.equal(s.fish.style.transform, pose);
  s.controller.destroy();
});

test("bfcache restoration retains one controller and cleanup releases every listener", () => {
  const s = scene();
  for (let i = 0; i < 100; i++) s.flush();
  const pose = s.fish.style.transform;
  const count = s.win.listenerCount() + s.doc.listenerCount() + s.media.listenerCount();
  for (let i = 0; i < 10; i++) {
    s.win.fire("pagehide", { persisted: true });
    assert.equal(s.frames.size, 0);
    s.flush(3600000);
    s.win.fire("pageshow", { persisted: true });
    s.flush(3600000);
    assert.equal(s.fish.style.transform, pose);
    assert.equal(s.frames.size, 1);
    assert.equal(s.win.listenerCount() + s.doc.listenerCount() + s.media.listenerCount(), count);
  }
  assert.equal(s.mutations.length, 1);
  assert.equal(s.intersections.length, 1);
  assert.equal(s.resizes.length, 1);
  s.win.fire("pagehide", { persisted: false });
  assert.equal(s.frames.size, 0);
  assert.equal(s.win.listenerCount() + s.doc.listenerCount() + s.media.listenerCount(), 0);
  assert.ok([...s.mutations, ...s.intersections, ...s.resizes].every(observer => observer.disconnected));
  assert.equal(s.fish.style.transform, "");
  assert.equal(s.state, null);
  s.controller.destroy();
  s.win.fire("pageshow");
  assert.equal(s.frames.size, 0);
});

test("resize observers constrain the pose without a second loop and collapsed zones sleep", () => {
  const s = scene();
  for (let i = 0; i < 300; i++) s.flush();
  s.zone.clientWidth = 320;
  s.resizes[0].fire([]);
  assert.equal(s.frames.size, 1);
  const match = s.fish.style.transform.match(/translate3d\(([-\d.]+)px/);
  assert.ok(Math.abs(Number(match[1])) < (320 - 230) / 2);
  s.zone.clientWidth = 0;
  s.resizes[0].fire([]);
  assert.equal(s.frames.size, 0);
  s.zone.clientWidth = 900;
  s.resizes[0].fire([]);
  assert.equal(s.frames.size, 1);
  s.controller.destroy();
});
