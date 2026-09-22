import assert from "node:assert/strict";
import test from "node:test";
import { mountMusic } from "../site/music.js";

class Events {
  listeners = new Map();
  addEventListener(type, callback) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(callback);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  fire(type) { for (const callback of this.listeners.get(type) ?? []) callback(); }
  get listenerCount() { return [...this.listeners.values()].reduce((sum, set) => sum + set.size, 0); }
}

function fixture() {
  const doc = Object.assign(new Events(), { hidden: false });
  const win = new Events();
  const attributes = new Map();
  const requests = [];
  const audio = Object.assign(new Events(), {
    ownerDocument: doc, dataset: { src: "audio/deepseafoam-music.mp3" },
    paused: true, volume: 1, currentTime: 0, error: null, loadCalls: 0, pauseCalls: 0,
    getAttribute: name => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
    play() {
      this.paused = false;
      return new Promise((resolve, reject) => requests.push({ resolve, reject }));
    },
    pause() {
      const playing = !this.paused;
      this.paused = true;
      this.pauseCalls++;
      if (playing) this.fire("pause");
    },
    load() { this.loadCalls++; this.error = null; }
  });
  doc.defaultView = win;
  const button = Object.assign(new Events(), {
    dataset: {}, attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; }
  });
  const controls = { hidden: true }, label = { textContent: "" }, status = { textContent: "", hidden: false };
  const controller = mountMusic({ audio, controls, button, label, status });
  return {
    audio, controls, button, label, status, controller, doc, win, requests,
    click: () => button.fire("click"),
    finish(index = requests.length - 1) {
      audio.paused = false;
      audio.fire("playing");
      requests[index].resolve();
    }
  };
}

const settle = () => new Promise(resolve => setImmediate(resolve));

test("music is opt-in and mounting never assigns a source, loads or plays", () => {
  const f = fixture();
  assert.equal(f.audio.getAttribute("src"), null);
  assert.equal(f.requests.length, 0);
  assert.equal(f.audio.loadCalls, 0);
  assert.equal(f.audio.volume, 0.35);
  assert.equal(f.controls.hidden, false);
  assert.equal(f.label.textContent, "Play music");
  assert.equal(f.status.hidden, false);
  assert.equal(f.status.textContent, "");
});

test("a press loads music, reports loading, and reflects actual playing and buffering", async () => {
  const f = fixture();
  f.click();
  assert.equal(f.audio.getAttribute("src"), f.audio.dataset.src);
  assert.equal(f.label.textContent, "Cancel music");
  assert.equal(f.button.attributes["aria-busy"], "true");
  assert.match(f.status.textContent, /Loading/);
  f.finish();
  await settle();
  assert.equal(f.label.textContent, "Pause music");
  assert.equal(f.status.textContent, "");
  f.audio.fire("waiting");
  assert.equal(f.label.textContent, "Cancel music");
  assert.match(f.status.textContent, /Buffering/);
  f.audio.fire("playing");
  assert.equal(f.label.textContent, "Pause music");
});

test("pause and resume preserve position without reloading or changing motion", async () => {
  const f = fixture();
  f.click(); f.finish(); await settle();
  f.audio.currentTime = 37;
  f.click();
  assert.equal(f.audio.paused, true);
  assert.equal(f.label.textContent, "Play music");
  f.click(); f.finish(); await settle();
  assert.equal(f.audio.currentTime, 37);
  assert.equal(f.audio.loadCalls, 0);
  assert.equal(f.requests.length, 2);
  assert.equal(f.win.listenerCount, 1);
});

test("cancelling a pending play suppresses its expected rejection", async t => {
  const warning = t.mock.method(console, "warn", () => {});
  const f = fixture();
  f.click(); f.click();
  f.requests[0].reject(new DOMException("Cancelled", "AbortError"));
  await settle();
  assert.equal(f.label.textContent, "Play music");
  assert.equal(f.audio.paused, true);
  assert.equal(warning.mock.callCount(), 0);
});

test("late play completion cannot restart cancelled music or cancel a newer play", async () => {
  const cancelled = fixture();
  cancelled.click(); cancelled.click(); cancelled.finish();
  await settle();
  assert.equal(cancelled.audio.paused, true);
  assert.equal(cancelled.label.textContent, "Play music");

  const replayed = fixture();
  replayed.click(); replayed.click(); replayed.click();
  replayed.finish(0);
  await settle();
  assert.equal(replayed.audio.paused, false);
  replayed.finish(1);
  await settle();
  assert.equal(replayed.label.textContent, "Pause music");
  replayed.audio.fire("pause");
  assert.equal(replayed.label.textContent, "Pause music", "ignore queued pause events when media is no longer paused");
});

test("rejected playback is visible, announced, logged and retryable", async t => {
  const warning = t.mock.method(console, "warn", () => {});
  const f = fixture();
  f.click();
  f.requests[0].reject(new DOMException("Gesture required", "NotAllowedError"));
  await settle();
  assert.equal(f.label.textContent, "Retry music");
  assert.match(f.status.textContent, /browser blocked/);
  assert.equal(warning.mock.callCount(), 1);
  f.audio.fire("pause");
  assert.equal(f.label.textContent, "Retry music");
  f.click(); f.finish(); await settle();
  assert.equal(f.label.textContent, "Pause music");
});

test("media failures retry the resource and ignore stale error events after reset", async t => {
  t.mock.method(console, "warn", () => {});
  const f = fixture();
  f.click();
  f.audio.error = { code: 2 };
  f.audio.fire("error");
  assert.equal(f.label.textContent, "Retry music");
  assert.match(f.status.textContent, /could not play/);
  f.click();
  assert.equal(f.audio.loadCalls, 1);
  f.audio.fire("error");
  assert.equal(f.label.textContent, "Cancel music");
  f.requests[0].reject(new Error("Old resource failed"));
  f.finish(1); await settle();
  assert.equal(f.label.textContent, "Pause music");
});

test("hidden pages and navigation pause music without automatic resume", async () => {
  const f = fixture();
  f.click(); f.finish(); await settle();
  f.doc.hidden = true;
  f.doc.fire("visibilitychange");
  assert.equal(f.audio.paused, true);
  f.doc.hidden = false;
  f.doc.fire("visibilitychange");
  f.win.fire("pageshow");
  assert.equal(f.requests.length, 1);
  assert.equal(f.label.textContent, "Play music");
  f.click();
  f.win.fire("pagehide");
  f.finish(); await settle();
  assert.equal(f.audio.paused, true);
  assert.equal(f.label.textContent, "Play music");
});

test("native pause/end events update the control and hidden clicks do not play", async () => {
  const f = fixture();
  f.doc.hidden = true; f.click();
  assert.equal(f.requests.length, 0);
  f.doc.hidden = false; f.click(); f.finish(); await settle();
  f.audio.pause();
  assert.equal(f.label.textContent, "Play music");
  f.click(); f.finish(); await settle();
  f.audio.fire("ended");
  assert.equal(f.audio.paused, true);
  assert.equal(f.label.textContent, "Play music");
});

test("teardown releases media and listeners, including pending play completion", async () => {
  const f = fixture();
  f.click();
  f.controller.destroy();
  f.controller.destroy();
  assert.equal(f.audio.getAttribute("src"), null);
  assert.equal(f.audio.loadCalls, 1);
  assert.equal(f.controls.hidden, true);
  for (const target of [f.audio, f.button, f.doc, f.win]) assert.equal(target.listenerCount, 0);
  f.finish(); await settle();
  assert.equal(f.audio.paused, true);
});

test("invalid mounting inputs fail explicitly", () => {
  assert.throws(() => mountMusic({}), { name: "TypeError", message: "Music needs an audio source, controls and a document" });
});
