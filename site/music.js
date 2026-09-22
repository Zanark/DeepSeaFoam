export function mountMusic({ audio, controls, button, label, status, doc = audio?.ownerDocument, win = doc?.defaultView }) {
  if (!audio || typeof audio.play !== "function" || typeof audio.pause !== "function" ||
      !controls || !button || !label || !status || !doc || !win || !audio.dataset.src) {
    throw new TypeError("Music needs an audio source, controls and a document");
  }

  let wanted = false;
  let disposed = false;
  let generation = 0;
  let state = "paused";
  const listeners = [];

  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    listeners.push(() => target.removeEventListener(type, handler));
  }

  function render(next, message = "") {
    state = next;
    button.dataset.state = next;
    button.setAttribute("aria-busy", String(next === "loading"));
    label.textContent = { paused: "Play music", blocked: "Play music", loading: "Cancel music", playing: "Pause music", error: "Retry music" }[next];
    status.textContent = message;
  }

  function pause() {
    wanted = false;
    generation++;
    audio.pause();
    render("paused");
  }

  function fail(error, automatic = false) {
    wanted = false;
    generation++;
    audio.pause();
    const blocked = automatic && error?.name === "NotAllowedError";
    const message = blocked
      ? "Your browser requires a tap. Press Play music."
      : error?.name === "NotAllowedError"
        ? "Your browser blocked the music. Press Retry music to try again."
        : "Music could not play. Check your connection and press Retry music.";
    render(blocked ? "blocked" : "error", message);
    if (!blocked) console.warn("DeepSeaFoam background music could not play.", error);
  }

  async function play(automatic = false) {
    if (doc.hidden || disposed) return;
    wanted = true;
    const ticket = ++generation;
    render("loading", "Loading music. Press Cancel music to stop.");
    if (!audio.getAttribute("src")) audio.setAttribute("src", audio.dataset.src);
    else if (audio.error) audio.load();
    try {
      await audio.play();
    } catch (error) {
      if (!disposed && ticket === generation && wanted) fail(error, automatic);
      return;
    }
    // An old play promise must neither restart paused music nor cancel a newer play.
    if (disposed || !wanted || doc.hidden) {
      audio.pause();
      return;
    }
    if (ticket === generation && !audio.paused) render("playing");
  }

  listen(button, "click", () => {
    if (wanted) pause();
    else void play();
  });
  listen(audio, "playing", () => {
    if (!wanted || doc.hidden) {
      pause();
      return;
    }
    if (!audio.paused) render("playing");
  });
  listen(audio, "waiting", () => {
    if (wanted) render("loading", "Buffering music. Press Cancel music to stop.");
  });
  listen(audio, "pause", () => {
    if (!audio.paused || state === "error" || state === "blocked") return;
    wanted = false;
    generation++;
    render("paused");
  });
  listen(audio, "ended", pause);
  listen(audio, "error", () => {
    if (wanted && audio.error) fail(audio.error);
  });
  listen(doc, "visibilitychange", () => {
    if (doc.hidden) pause();
  });
  listen(win, "pagehide", pause);

  // Browsers may require a user gesture; iOS may retain hardware volume control.
  audio.volume = 0.35;
  status.hidden = false;
  render("paused");
  controls.hidden = false;
  // History restoration must not undo the lifecycle pause, even without bfcache.
  if (win.performance?.getEntriesByType("navigation")[0]?.type !== "back_forward") void play(true);

  return {
    destroy() {
      if (disposed) return;
      disposed = true;
      wanted = false;
      generation++;
      for (const remove of listeners) remove();
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      controls.hidden = true;
      status.hidden = true;
      status.textContent = "";
    }
  };
}

if (typeof document !== "undefined") {
  const audio = document.querySelector("#background-music");
  const controls = document.querySelector(".music-controls");
  const button = document.querySelector("#music-toggle");
  const label = document.querySelector(".music-label");
  const status = document.querySelector("#music-status");
  if (audio && controls && button && label && status) mountMusic({ audio, controls, button, label, status });
  else console.warn("DeepSeaFoam background music controls are unavailable.");
}
