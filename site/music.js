export function mountMusic({ audio, controls, button, label, status, doc = audio?.ownerDocument, win = doc?.defaultView }) {
  if (!audio || typeof audio.play !== "function" || typeof audio.pause !== "function" ||
      !controls || !button || !label || !status || !doc || !win || !audio.dataset.src) {
    throw new TypeError("Music needs an audio source, controls and a document");
  }

  let wanted = false;
  let disposed = false;
  let generation = 0;
  let state = "paused";
  let automaticPending = !doc.hidden &&
    win.performance?.getEntriesByType("navigation")[0]?.type !== "back_forward";
  const listeners = [];

  function listen(target, type, handler) {
    target.addEventListener(type, handler);
    listeners.push(() => target.removeEventListener(type, handler));
  }

  function render(next, message = "") {
    state = next;
    button.dataset.state = next;
    button.setAttribute("aria-busy", String(next === "loading"));
    label.textContent = { paused: "Play music", blocked: "Play music", queued: "Cancel music", loading: "Cancel music", playing: "Pause music", error: "Retry music" }[next];
    status.textContent = message;
  }

  function pause() {
    automaticPending = false;
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
    automaticPending = blocked;
    const message = blocked
      ? "Sound is ready. Tap anywhere or press a key to start."
      : error?.name === "NotAllowedError"
        ? "Your browser blocked the music. Press Retry music to try again."
        : "Music could not play. Check your connection and press Retry music.";
    render(blocked ? "blocked" : "error", message);
    if (!blocked) console.warn("DeepSeaFoam background music could not play.", error);
  }

  async function play(automatic = false) {
    if (doc.hidden || disposed) return;
    if (!automatic) automaticPending = false;
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
    if (ticket === generation && !audio.paused) {
      automaticPending = false;
      render("playing");
    }
  }

  function startAutomatic() {
    if (automaticPending && !wanted && doc.body?.dataset.diveState === "complete") void play(true);
  }
  function interact(event) {
    if (!automaticPending || !event.isTrusted || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (button.contains(event.target)) {
      // Let the control's click cancel queued music or explicitly start blocked music.
      if (event.type !== "keydown" || event.key === " " || event.key === "Enter") automaticPending = false;
      return;
    }
    startAutomatic();
  }
  listen(doc, "deepseafoam:dive-complete", startAutomatic);
  for (const type of ["pointerdown", "pointerup", "touchend", "keydown", "click"]) {
    doc.addEventListener(type, interact, { capture: true, passive: true });
    listeners.push(() => doc.removeEventListener(type, interact, true));
  }
  listen(button, "click", () => {
    if (wanted || state === "queued") pause();
    else void play();
  });
  listen(audio, "playing", () => {
    if (!wanted || doc.hidden) {
      pause();
      return;
    }
    if (!audio.paused) {
      automaticPending = false;
      render("playing");
    }
  });
  listen(audio, "waiting", () => {
    if (wanted) render("loading", "Buffering music. Press Cancel music to stop.");
  });
  listen(audio, "pause", () => {
    if (!audio.paused || state === "error" || state === "blocked") return;
    wanted = false;
    automaticPending = false;
    generation++;
    render("paused");
  });
  listen(audio, "ended", pause);
  listen(audio, "error", () => {
    if ((wanted || automaticPending) && audio.error) fail(audio.error);
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
  if (automaticPending) {
    audio.preload = "auto";
    audio.setAttribute("src", audio.dataset.src);
    render("queued", "Music starts after the dive. Cancel music to stay quiet.");
    startAutomatic();
  }

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
