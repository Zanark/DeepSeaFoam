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
    children = [];
    parentElement = null;
    get childElementCount() { return this.children.length; }
    get firstElementChild() { return this.children[0]; }
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
    append(child) { child.parentElement = this; this.children.push(child); }
    remove() {
      if (this.parentElement) {
        this.parentElement.children = this.parentElement.children.filter(child => child !== this);
        this.parentElement = null;
      }
    }
    replaceChildren() {
      for (const child of this.children) child.parentElement = null;
      this.children = [];
    }
  }
  const elements = new Map([
    ".ocean-world", ".bubble-field", ".dive-controls", "#motion-toggle", ".motion-label",
    "#skip-dive", "#replay-dive", "#depth-value", "#depth-zone", ".brand"
  ].map(selector => [selector, new Element()]));
  document.body = new Element();
  document.documentElement = { scrollHeight: 5000 };
  document.querySelector = selector => elements.get(selector);
  document.createElement = () => new Element();
  document.hidden = false;
  const media = Object.assign(new Events(), { matches: reduced });
  const fine = Object.assign(new Events(), { matches: true });
  const window = new Events();
  const timers = new Map();
  const frames = new Map();
  let id = 0;
  let now = 0;
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
  const flush = (elapsed = 160) => {
    now += elapsed;
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback(now);
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

test("pointer clicks emit at their viewport coordinates, not keyboard activation", () => {
  const s = scene({ hash: "#main" });
  const field = s.el(".bubble-field");
  s.document.fire("click", { detail: 1, clientX: 230, clientY: 410 });
  assert.equal(field.childElementCount, 7);
  for (const bubble of field.children) {
    assert.match(bubble.style.cssText, /left:230px;top:410px;/);
    assert.match(bubble.style.cssText, /--rise:-458px/);
  }
  s.document.fire("click", { detail: 0, clientX: 0, clientY: 0 });
  assert.equal(field.childElementCount, 7);
});

test("wheel, touch and scroll coalesce into bounded upward bursts, including page edges", () => {
  const s = scene({ hash: "#main" });
  s.flush();
  const field = s.el(".bubble-field");
  for (const type of ["wheel", "touchmove", "scroll"]) s.window.fire(type);
  assert.equal(s.frames.size, 1);
  s.flush(16);
  assert.equal(field.childElementCount, 3);
  assert.match(field.firstElementChild.style.cssText, /top:1018px;/);
  assert.match(field.firstElementChild.style.cssText, /--rise:-1066px/);
  s.window.fire("scroll");
  s.flush(16);
  assert.equal(field.childElementCount, 3, "continuous input is rate-limited");
  for (const scroll of [1000, 500, 4000]) {
    s.globals.scrollY = scroll;
    s.window.fire("scroll");
    s.flush();
  }
  assert.equal(field.childElementCount, 12, "both scroll directions emit");
  s.window.fire("wheel");
  s.flush();
  assert.equal(field.childElementCount, 15, "wheel input at the bottom still emits");
  assert.equal(s.frames.size, 0);
});

test("bubble population is capped and clicks still respond when the pool is full", () => {
  const s = scene({ hash: "#main" });
  const field = s.el(".bubble-field");
  for (let i = 0; i < 100; i++) {
    s.document.fire("click", { detail: 1, clientX: i, clientY: 500 });
    assert.ok(field.childElementCount <= 64);
  }
  assert.equal(field.childElementCount, 64);
  assert.match(field.children.at(-1).style.cssText, /left:99px;/);
  const oldest = field.firstElementChild;
  s.window.fire("scroll");
  s.flush();
  assert.equal(field.firstElementChild, oldest, "scroll leaves existing bubbles free to rise");
  assert.equal(field.childElementCount, 64);
  assert.equal(s.timers.size, 0);
});

test("finished and cancelled bubble animations remove only their own particles", () => {
  const s = scene({ hash: "#main" });
  const field = s.el(".bubble-field");
  s.document.fire("click", { detail: 1, clientX: 100, clientY: 200 });
  for (const type of ["animationend", "animationcancel"]) {
    const bubble = field.firstElementChild;
    field.fire(type, { target: bubble });
    assert.equal(bubble.parentElement, null);
  }
  assert.equal(field.childElementCount, 5);
  field.fire("animationend", { target: field });
  assert.equal(field.childElementCount, 5);
});

test("pause and reduced motion clear particles and suppress new emissions", () => {
  const s = scene({ hash: "#main" });
  const field = s.el(".bubble-field");
  const click = () => s.document.fire("click", { detail: 1, clientX: 100, clientY: 200 });
  click();
  s.window.fire("scroll");
  s.el("#motion-toggle").fire("click");
  s.flush();
  assert.equal(field.childElementCount, 0);
  click();
  s.window.fire("wheel");
  s.flush();
  assert.equal(field.childElementCount, 0);
  s.el("#motion-toggle").fire("click");
  click();
  assert.equal(field.childElementCount, 7);
  s.media.matches = true;
  s.media.fire("change");
  click();
  s.window.fire("touchmove");
  s.flush();
  assert.equal(field.childElementCount, 0);
});

test("hidden pages and page departure discard particles without a return backlog", () => {
  const s = scene({ hash: "#main" });
  const field = s.el(".bubble-field");
  const click = () => s.document.fire("click", { detail: 1, clientX: 100, clientY: 200 });
  click();
  s.window.fire("scroll");
  s.document.hidden = true;
  s.document.fire("visibilitychange");
  click();
  s.window.fire("wheel");
  s.document.hidden = false;
  s.document.fire("visibilitychange");
  s.flush();
  assert.equal(field.childElementCount, 0);
  click();
  s.window.fire("scroll");
  s.window.fire("pagehide");
  s.window.fire("pageshow");
  s.flush();
  assert.equal(field.childElementCount, 0);
});
