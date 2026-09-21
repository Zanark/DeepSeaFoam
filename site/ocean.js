const body = document.body;
const world = document.querySelector(".ocean-world");
const bubbleField = document.querySelector(".bubble-field");
const controls = document.querySelector(".dive-controls");
const motionToggle = document.querySelector("#motion-toggle");
const motionLabel = motionToggle.querySelector(".motion-label");
const skip = document.querySelector("#skip-dive");
const replay = document.querySelector("#replay-dive");
const depthValue = document.querySelector("#depth-value");
const depthZone = document.querySelector("#depth-zone");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
let userPaused = false;
let diveTimer;
let frame = 0;
let pointerX = 0;
let pointerY = 0;
let scrollBubbles = false;
let nextBubbleTime = 0;

const isStill = () => userPaused || reducedMotion.matches;

function clearBubbles() {
  scrollBubbles = false;
  nextBubbleTime = 0;
  bubbleField.replaceChildren();
}

function bubblesAt(x, y, count, replace = false) {
  if (isStill() || document.hidden) return;
  for (let i = 0; i < count; i++) {
    if (bubbleField.childElementCount >= 64) {
      if (!replace) break;
      bubbleField.firstElementChild.remove();
    }
    const bubble = document.createElement("i");
    bubble.style.cssText = `left:${x}px;top:${y}px;width:${8 + Math.random() * 18}px;
      --drift:${Math.random() * 120 - 60}px;--rise:${-y - 48}px;
      --flight:${Math.max(1, (y + 48) / (170 + Math.random() * 100))}s`;
    bubbleField.append(bubble);
  }
}

for (const type of ["animationend", "animationcancel"]) {
  bubbleField.addEventListener(type, ({ target }) => {
    if (target.parentElement === bubbleField) target.remove();
  });
}

function finishDive() {
  clearTimeout(diveTimer);
  body.classList.remove("is-diving");
  if (document.activeElement === skip) motionToggle.focus({ preventScroll: true });
  skip.hidden = true;
}

function dive() {
  finishDive();
  if (isStill()) return;
  body.classList.add("is-diving");
  skip.hidden = false;
  diveTimer = setTimeout(finishDive, 2850);
}

function updateScene(now = 0) {
  frame = 0;
  if (scrollBubbles && now >= nextBubbleTime) {
    bubblesAt(Math.random() * innerWidth, innerHeight + 18, 3);
    nextBubbleTime = now + 160;
  }
  scrollBubbles = false;
  const distance = document.documentElement.scrollHeight - innerHeight;
  const progress = Math.max(0, Math.min(1, distance > 0 ? scrollY / distance : 0));
  body.style.setProperty("--depth-progress", progress.toFixed(3));
  // These are narrative depths, not physical measurements.
  depthValue.firstChild.textContent = `${String(Math.round(progress * 3800)).padStart(4, "0")} `;
  depthZone.textContent = progress < .22 ? "THE SUNLIT ZONE" : progress < .65 ? "THE TWILIGHT ZONE" : "THE MIDNIGHT ZONE";
  world.style.setProperty("--water-light", (1 - progress * .85).toFixed(3));
  world.style.setProperty("--descent", progress.toFixed(3));
  world.style.setProperty("--look-x", `${isStill() ? 0 : pointerX}px`);
  world.style.setProperty("--look-y", `${isStill() ? 0 : pointerY}px`);
}

function requestUpdate() {
  if (!frame) frame = requestAnimationFrame(updateScene);
}

function queueBubbles() {
  scrollBubbles = !isStill() && !document.hidden;
  requestUpdate();
}

function syncMotion() {
  const still = isStill();
  body.classList.toggle("motion-paused", still);
  motionToggle.setAttribute("aria-pressed", String(still));
  motionToggle.disabled = reducedMotion.matches;
  motionLabel.textContent = reducedMotion.matches ? "Reduced motion" : userPaused ? "Resume motion" : "Pause motion";
  replay.textContent = still ? "Back to the surface." : "Back to the surface. Dive again.";
  if (still) {
    finishDive();
    clearBubbles();
  }
  requestUpdate();
}

skip.addEventListener("click", finishDive);
motionToggle.addEventListener("click", () => {
  userPaused = !userPaused;
  syncMotion();
});
replay.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "instant" });
  document.querySelector(".brand").focus({ preventScroll: true });
  dive();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Tab") finishDive();
});
// Navigation or scrolling should never wait for an opening sequence.
document.addEventListener("click", (event) => {
  if (event.target instanceof Element && event.target.closest("a")) finishDive();
  if (event.detail > 0) bubblesAt(event.clientX, event.clientY, 7, true);
});
window.addEventListener("wheel", () => {
  finishDive();
  queueBubbles();
}, { passive: true });
window.addEventListener("touchstart", finishDive, { passive: true });
window.addEventListener("touchmove", queueBubbles, { passive: true });
window.addEventListener("scroll", () => {
  if (scrollY > 10) finishDive();
  queueBubbles();
}, { passive: true });
window.addEventListener("resize", requestUpdate);
window.addEventListener("pointermove", (event) => {
  if (isStill() || !finePointer.matches) return;
  pointerX = (event.clientX / innerWidth - .5) * 18;
  pointerY = (event.clientY / innerHeight - .5) * 10;
  requestUpdate();
}, { passive: true });
document.addEventListener("pointerleave", () => {
  pointerX = pointerY = 0;
  requestUpdate();
});
document.addEventListener("visibilitychange", () => {
  body.classList.toggle("page-hidden", document.hidden);
  if (document.hidden) {
    finishDive();
    clearBubbles();
  }
});
window.addEventListener("pagehide", () => {
  finishDive();
  clearBubbles();
});
window.addEventListener("pageshow", requestUpdate);
reducedMotion.addEventListener("change", syncMotion);
// The palette loads independently and changes the document's scroll range.
new ResizeObserver(requestUpdate).observe(document.body);

controls.hidden = false;
replay.hidden = false;
body.classList.add("ocean-ready");
syncMotion();
updateScene();
if (!location.hash && scrollY < 10) dive();
