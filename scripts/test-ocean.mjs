import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const source = await readFile(new URL("../site/ocean.js", import.meta.url), "utf8");

class Events {
  listeners = new Map();
  addEventListener(type, callback) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(callback);
    this.listeners.set(type, listeners);
  }
  fire(type, event = {}) {
    for (const callback of this.listeners.get(type) ?? []) callback(event);
  }
}

function scene({ reduced = false, hash = "", scroll = 0 } = {}) {
  const document = new Events();
  class Element extends Events {
    hidden = true;
    disabled = false;
    attributes = new Map();
    classes = new Set();
    properties = new Map();
    firstChild = { textContent: "" };
    style = { setProperty: (name, value) => this.properties.set(name, value) };
    classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name),
      contains: name => this.classes.has(name),
      toggle: (name, on) => on ? this.classes.add(name) : this.classes.delete(name)
    };
    setAttribute(name, value) { this.attributes.set(name, value); }
    querySelector(selector) { return elements.get(selector); }
    closest(selector) { return selector === "a" && this.isLink ? this : null; }
    focus() { document.activeElement = this; }
  }
  const elements = new Map([
    ".ocean-world", ".dive-controls", "#motion-toggle", ".motion-label",
    "#skip-dive", "#replay-dive", "#depth-value", "#depth-zone", ".brand"
  ].map(selector => [selector, new Element()]));
  document.body = new Element();
  document.documentElement = { scrollHeight: 5000 };
  document.querySelector = selector => elements.get(selector);
  document.hidden = false;
  const media = Object.assign(new Events(), { matches: reduced });
  const fine = Object.assign(new Events(), { matches: true });
  const window = new Events();
  const timers = new Map();
  const frames = new Map();
  let id = 0;
  const globals = {
    document, window, Element, location: { hash }, innerHeight: 1000, innerWidth: 1000, scrollY: scroll,
    matchMedia: query => query.includes("reduced-motion") ? media : fine,
    setTimeout: (callback, delay) => { timers.set(++id, { callback, delay }); return id; },
    clearTimeout: key => timers.delete(key),
    requestAnimationFrame: callback => { frames.set(++id, callback); return id; },
    ResizeObserver: class { observe() {} }
  };
  window.scrollTo = ({ top }) => { globals.scrollY = top; };
  vm.runInNewContext(source, globals, { filename: "ocean.js" });
  const flush = () => {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback();
  };
  return { document, window, media, fine, timers, frames, globals, flush, el: selector => elements.get(selector) };
}

test("opening descent is bounded and progressively reveals controls", () => {
  const s = scene();
  assert.equal(s.document.body.classList.contains("is-diving"), true);
  assert.equal(s.el(".dive-controls").hidden, false);
  assert.equal(s.el("#skip-dive").hidden, false);
  const [timer] = s.timers.values();
  assert.equal(timer.delay, 2850);
  timer.callback();
  assert.equal(s.document.body.classList.contains("is-diving"), false);
  assert.equal(s.el("#skip-dive").hidden, true);
});

test("reduced motion skips the dive and reacts to preference changes", () => {
  const s = scene({ reduced: true });
  assert.equal(s.timers.size, 0);
  assert.equal(s.document.body.classList.contains("motion-paused"), true);
  assert.equal(s.el("#motion-toggle").disabled, true);
  s.media.matches = false;
  s.media.fire("change");
  assert.equal(s.el("#motion-toggle").disabled, false);
  assert.equal(s.document.body.classList.contains("motion-paused"), false);
  assert.equal(s.timers.size, 0);
});

test("pause stops an in-flight descent; resume does not replay it", () => {
  const s = scene();
  s.el("#motion-toggle").fire("click");
  assert.equal(s.timers.size, 0);
  assert.equal(s.el("#motion-toggle").attributes.get("aria-pressed"), "true");
  assert.equal(s.document.body.classList.contains("is-diving"), false);
  s.el("#motion-toggle").fire("click");
  assert.equal(s.el("#motion-toggle").attributes.get("aria-pressed"), "false");
  assert.equal(s.timers.size, 0);
});

test("deep links and restored scroll positions bypass the opening", () => {
  for (const options of [{ hash: "#palette" }, { scroll: 900 }]) {
    const s = scene(options);
    assert.equal(s.document.body.classList.contains("is-diving"), false);
    assert.equal(s.timers.size, 0);
  }
});

test("skipping does not strand keyboard focus on a hidden button", () => {
  const s = scene();
  s.el("#skip-dive").focus();
  s.el("#skip-dive").fire("click");
  assert.equal(s.document.activeElement, s.el("#motion-toggle"));
  for (const key of ["Escape", "Tab"]) {
    const keyboard = scene();
    keyboard.document.fire("keydown", { key });
    assert.equal(keyboard.document.body.classList.contains("is-diving"), false);
  }
});

test("scrolling ends the dive and updates bounded narrative depth", () => {
  const s = scene();
  s.globals.scrollY = 5000;
  s.window.fire("scroll");
  s.flush();
  assert.equal(s.document.body.classList.contains("is-diving"), false);
  assert.equal(s.el("#depth-value").firstChild.textContent, "3800 ");
  assert.equal(s.el("#depth-zone").textContent, "THE MIDNIGHT ZONE");
  assert.equal(s.el(".ocean-world").properties.get("--water-light"), "0.150");
  assert.equal(s.frames.size, 0);
});

test("hidden pages pause their scenery and finish any opening", () => {
  const s = scene();
  s.document.hidden = true;
  s.document.fire("visibilitychange");
  assert.equal(s.document.body.classList.contains("page-hidden"), true);
  assert.equal(s.timers.size, 0);
  s.document.hidden = false;
  s.document.fire("visibilitychange");
  assert.equal(s.document.body.classList.contains("page-hidden"), false);
});

test("parallax is event-driven, coalesced, and disabled for still scenes", () => {
  const s = scene();
  s.flush();
  s.window.fire("pointermove", { clientX: 1000, clientY: 500 });
  s.window.fire("pointermove", { clientX: 1000, clientY: 1000 });
  assert.equal(s.frames.size, 1);
  s.flush();
  assert.equal(s.el(".ocean-world").properties.get("--look-x"), "9px");
  assert.equal(s.frames.size, 0);
  s.el("#motion-toggle").fire("click");
  s.flush();
  assert.equal(s.el(".ocean-world").properties.get("--look-x"), "0px");
  s.window.fire("pointermove", { clientX: 0, clientY: 0 });
  assert.equal(s.frames.size, 0);
});

test("replay returns to the top and respects paused motion", () => {
  const s = scene({ scroll: 2000 });
  s.el("#replay-dive").fire("click");
  assert.equal(s.globals.scrollY, 0);
  assert.equal(s.document.activeElement, s.el(".brand"));
  assert.equal(s.document.body.classList.contains("is-diving"), true);
  s.el("#motion-toggle").fire("click");
  s.el("#replay-dive").fire("click");
  assert.equal(s.document.body.classList.contains("is-diving"), false);
});
