import assert from "node:assert/strict";
import test from "node:test";
import { WaterField, mountWater } from "../site/water.js";

const field = () => new WaterField(96, 80);
const advance = (water, count) => { for (let i = 0; i < count; i++) water.step(); };
const difference = (a, b) => a.reduce((peak, value, i) => Math.max(peak, Math.abs(value - b[i])), 0);

test("water allocation rejects invalid or oversized grids", () => {
  for (const size of [[0, 80], [8, 7], [NaN, 10], [9.5, 10], [300, 300]]) {
    assert.throws(() => new WaterField(...size), RangeError);
  }
  assert.equal(new WaterField(222, 162).current.length, 35964);
});

test("undisturbed water and stationary pointers stay perfectly still", () => {
  const water = field();
  water.wake(30, 40, 30, 40, .2);
  water.wake(30, 40, 35, 40, 0);
  advance(water, 100);
  assert.equal(water.activity, 0);
  assert.ok(water.current.every(value => value === 0));
  assert.throws(() => water.wake(1, 2, NaN, 4, .2), RangeError);
  assert.throws(() => water.wake(1, 2, 3, 4, -1), RangeError);
});

test("a directional stroke pushes water ahead and pulls it in behind", () => {
  const water = field();
  water.wake(32, 40, 48, 40, .12);
  water.step();
  assert.ok(water.current[40 * 96 + 51] > 0);
  assert.ok(water.current[40 * 96 + 29] < 0);
});

test("reversing motion mirrors the wake instead of reusing an identical ring", () => {
  const right = field(), left = field();
  right.wake(32, 40, 48, 40, .12);
  left.wake(63, 40, 47, 40, .12);
  advance(right, 35);
  advance(left, 35);
  let error = 0;
  for (let y = 0; y < 80; y++) {
    for (let x = 0; x < 96; x++) {
      error = Math.max(error, Math.abs(right.current[y * 96 + x] - left.current[y * 96 + 95 - x]));
    }
  }
  assert.ok(error < .00001, `mirror error ${error}`);
  assert.ok(difference(right.current, left.current) > .01);
});

test("stronger motion generates stronger but bounded disturbance", () => {
  const slow = field(), fast = field();
  slow.wake(35, 40, 39, 40, .02);
  fast.wake(35, 40, 39, 40, .08);
  assert.ok(difference(fast.previous, slow.previous.map(value => value * 4)) < .00001);
  const extreme = field();
  extreme.wake(20, 40, 70, 40, 1000);
  assert.ok(extreme.previous.every(value => Math.abs(value) <= .650001));
});

test("subdividing a stroke preserves its deposited pressure", () => {
  const continuous = field(), sampled = field();
  continuous.wake(24, 40, 40, 40, .08);
  for (let i = 0; i < 22; i++) {
    sampled.wake(24 + i * 16 / 22, 40, 24 + (i + 1) * 16 / 22, 40, .08);
  }
  assert.ok(difference(continuous.previous, sampled.previous) < .00001);
});

test("ripples propagate beyond the brush rather than fading in place", () => {
  const water = field();
  water.wake(43, 40, 48, 40, .1);
  assert.equal(water.previous[60 * 96 + 46], 0);
  advance(water, 45);
  assert.ok(Math.abs(water.current[60 * 96 + 46]) > .0001);
});

test("a tap displaces a symmetric depression and rim that propagate and settle", () => {
  const water = field();
  water.tap(48, 40, .28);
  water.step();
  assert.ok(water.current[40 * 96 + 48] < 0);
  assert.ok(water.current[40 * 96 + 53] > 0);
  for (let dy = -15; dy <= 15; dy++) {
    for (let dx = -15; dx <= 15; dx++) {
      assert.ok(Math.abs(water.current[(40 + dy) * 96 + 48 + dx] -
        water.current[(40 + dx) * 96 + 48 + dy]) < .00001);
    }
  }
  advance(water, 45);
  assert.ok(Math.abs(water.current[60 * 96 + 48]) > .0001);
  advance(water, 1200);
  assert.ok(water.activity < .0008);
});

test("tap input rejects invalid pressure and coordinates and bounds repeated impulses", () => {
  const water = field();
  for (const input of [[NaN, 40, .2], [48, Infinity, .2], [48, 40, -1]]) {
    assert.throws(() => water.tap(...input), RangeError);
  }
  water.tap(48, 40, 0);
  assert.ok(water.previous.every(value => value === 0));
  for (let i = 0; i < 100; i++) water.tap(48, 40, 1000);
  assert.ok(water.previous.every(value => Math.abs(value) <= .650001));
});

test("waves superpose and interfere in the same field", () => {
  const a = field(), b = field(), combined = field();
  a.wake(24, 34, 29, 34, .035);
  b.wake(70, 46, 65, 46, .035);
  combined.wake(24, 34, 29, 34, .035);
  combined.wake(70, 46, 65, 46, .035);
  for (const water of [a, b, combined]) advance(water, 50);
  assert.ok(difference(combined.current, a.current.map((value, i) => value + b.current[i])) < .00001);
});

test("the edge sponge absorbs energy instead of preserving rectangular echoes", () => {
  const absorbed = field(), reflected = field();
  reflected.loss.fill(0);
  for (const water of [absorbed, reflected]) {
    water.wake(66, 40, 78, 40, .18);
    advance(water, 240);
  }
  const energy = water => water.current.reduce((sum, value, i) =>
    sum + value * value + (value - water.previous[i]) ** 2, 0);
  assert.ok(energy(absorbed) < energy(reflected) * .5);
  assert.ok(absorbed.current.slice(0, 96).every(value => value === 0));
});

test("sustained motion remains finite and settles below the idle threshold", () => {
  const water = field();
  let peak = 0;
  for (let i = 0; i < 600; i++) {
    water.wake(48 + 24 * Math.sin(i * .3), 40 + 15 * Math.cos(i * .27),
      48 + 24 * Math.sin((i + 1) * .3), 40 + 15 * Math.cos((i + 1) * .27), .32);
    peak = Math.max(peak, water.step());
  }
  assert.ok(water.current.every(Number.isFinite));
  assert.ok(peak < 8, `peak displacement ${peak}`);
  advance(water, 1200);
  assert.ok(water.activity < .0008, `residual activity ${water.activity}`);
  water.clear();
  assert.equal(water.activity, 0);
  assert.ok(water.current.every(value => value === 0));
  assert.ok(water.previous.every(value => value === 0));
});

class Events {
  listeners = new Map();
  addEventListener(type, callback, options) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Map());
    this.listeners.get(type).set(callback, options);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  fire(type, event = {}) {
    for (const callback of this.listeners.get(type)?.keys() ?? []) callback(event);
  }
}

function surface(t, { fine = false, loaded = true } = {}) {
  const window = new Events(), document = new Events();
  const reduced = Object.assign(new Events(), { matches: false });
  const pointer = Object.assign(new Events(), { matches: fine });
  const classes = new Set(["ocean-ready"]);
  document.hidden = false;
  document.body = { classList: { contains: name => classes.has(name) } };
  let pixels = new Uint8ClampedArray(4), observer, time = 1000, id = 0;
  const frames = new Map();
  const context = {
    createImageData: (width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
    clearRect: () => pixels.fill(0),
    putImageData: image => { pixels = image.data.slice(); }
  };
  const canvas = { width: 1, height: 1, getContext: () => context };
  document.createElement = () => ({ getContext: () => ({
    drawImage() {},
    getImageData: (_, __, width, height) => ({ data: new Uint8ClampedArray(width * height * 4).fill(128) })
  }) });
  const globals = {
    document, window, innerWidth: 390, innerHeight: 844,
    matchMedia: query => query.includes("reduced-motion") ? reduced : pointer,
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    cancelAnimationFrame: key => frames.delete(key),
    Image: class { set src(value) { if (loaded) this.onload(); } },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; observer = this; }
      observe() {}
      disconnect() { this.disconnected = true; }
    }
  };
  const originals = Object.fromEntries(Object.keys(globals).map(key =>
    [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) {
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
  }
  let controller;
  t.after(() => {
    controller?.destroy();
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  controller = mountWater(canvas);
  return {
    window, document, reduced, pointer, classes, frames, canvas, controller,
    mutate: () => observer.callback(),
    disconnected: () => observer.disconnected,
    alpha: () => pixels.reduce((total, value, index) => total + (index % 4 === 3 ? value : 0), 0),
    touch(type, touches) { time += 16; window.fire(type, { touches, timeStamp: time }); },
    flush(count = 1) {
      for (let i = 0; i < count; i++) {
        time += 1000 / 60;
        const pending = [...frames.values()];
        frames.clear();
        for (const callback of pending) callback(time);
      }
    }
  };
}

const finger = (x = 195, y = 420, identifier = 1) => ({ clientX: x, clientY: y, identifier });

test("coarse touch taps and native pans produce water without taking over gestures", t => {
  const s = surface(t);
  s.touch("touchstart", [finger()]);
  assert.equal(s.frames.size, 1);
  s.flush(3);
  assert.ok(s.alpha() > 0);
  s.window.fire("pointercancel");
  s.document.fire("pointerleave");
  const before = s.alpha();
  s.touch("touchmove", [finger(210, 385)]);
  s.touch("touchmove", [finger(230, 350)]);
  s.flush(3);
  assert.notEqual(s.alpha(), before);
  assert.ok(s.canvas.width * s.canvas.height <= 35964);
  for (const type of ["touchstart", "touchmove", "touchend", "touchcancel"]) {
    assert.ok([...s.window.listeners.get(type).values()].every(options => options.passive));
  }
  s.touch("touchend", []);
  s.flush(1200);
  assert.equal(s.alpha(), 0);
  assert.equal(s.frames.size, 0);
});

test("pinch and cancelled gestures never invent single-finger wakes", t => {
  const s = surface(t);
  s.touch("touchstart", [finger(), finger(240, 420, 2)]);
  s.touch("touchmove", [finger(100, 420), finger(280, 420, 2)]);
  s.touch("touchend", [finger()]);
  s.touch("touchmove", [finger(210, 420)]);
  assert.equal(s.frames.size, 0);
  s.touch("touchstart", [finger()]);
  s.touch("touchcancel", []);
  s.flush(1200);
  s.touch("touchmove", [finger(240, 420)]);
  assert.equal(s.frames.size, 0);
});

test("mobile viewport resizing reanchors an ongoing touch without jumping", t => {
  const s = surface(t);
  s.touch("touchstart", [finger()]);
  s.flush(2);
  globalThis.innerHeight = 740;
  s.window.fire("resize");
  assert.equal(s.alpha(), 0);
  s.touch("touchmove", [finger(195, 360)]);
  assert.equal(s.frames.size, 0, "the first post-resize point is only an anchor");
  s.touch("touchmove", [finger(205, 330)]);
  s.flush(2);
  assert.ok(s.alpha() > 0);
});

test("a held finger can resume moving after its earlier wake has settled", t => {
  const s = surface(t);
  s.touch("touchstart", [finger()]);
  s.flush(1200);
  assert.equal(s.alpha(), 0);
  assert.equal(s.frames.size, 0);
  s.touch("touchmove", [finger(200, 380)]);
  assert.equal(s.frames.size, 0);
  s.touch("touchmove", [finger(210, 350)]);
  s.flush(2);
  assert.ok(s.alpha() > 0);
});

test("touch water honors motion, visibility and navigation state without a backlog", t => {
  const s = surface(t);
  for (const state of ["motion-paused", "is-diving"]) {
    s.classes.add(state);
    s.mutate();
    s.touch("touchstart", [finger()]);
    assert.equal(s.frames.size, 0);
    s.classes.delete(state);
  }
  s.touch("touchstart", [finger()]);
  s.flush(2);
  s.reduced.matches = true;
  s.reduced.fire("change");
  assert.equal(s.alpha(), 0);
  s.touch("touchstart", [finger()]);
  assert.equal(s.frames.size, 0);
  s.reduced.matches = false;
  s.reduced.fire("change");
  s.touch("touchstart", [finger()]);
  s.document.hidden = true;
  s.document.fire("visibilitychange");
  s.touch("touchstart", [finger()]);
  assert.equal(s.frames.size, 0);
  s.document.hidden = false;
  s.document.fire("visibilitychange");
  s.touch("touchstart", [finger()]);
  s.window.fire("pagehide");
  s.touch("touchstart", [finger()]);
  assert.equal(s.frames.size, 0);
  s.window.fire("pageshow");
  s.touch("touchmove", [finger(240, 420)]);
  assert.equal(s.frames.size, 0);
});

test("touch water stays lazy until its texture loads and releases its listeners", t => {
  const s = surface(t, { loaded: false });
  s.touch("touchstart", [finger()]);
  assert.equal(s.canvas.width, 1);
  assert.equal(s.frames.size, 0);
  s.controller.destroy();
  assert.equal(s.disconnected(), true);
  for (const target of [s.window, s.document, s.reduced, s.pointer]) {
    assert.ok([...target.listeners.values()].every(listeners => listeners.size === 0));
  }
});
