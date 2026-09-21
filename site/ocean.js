const body = document.body;
const world = document.querySelector(".ocean-world");
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

const isStill = () => userPaused || reducedMotion.matches;

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

function updateScene() {
  frame = 0;
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

function syncMotion() {
  const still = isStill();
  body.classList.toggle("motion-paused", still);
  motionToggle.setAttribute("aria-pressed", String(still));
  motionToggle.disabled = reducedMotion.matches;
  motionLabel.textContent = reducedMotion.matches ? "Reduced motion" : userPaused ? "Resume motion" : "Pause motion";
  replay.textContent = still ? "Back to the surface." : "Back to the surface. Dive again.";
  if (still) finishDive();
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
});
window.addEventListener("wheel", finishDive, { passive: true });
window.addEventListener("touchstart", finishDive, { passive: true });
window.addEventListener("scroll", () => {
  if (scrollY > 10) finishDive();
  requestUpdate();
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
  if (document.hidden) finishDive();
});
window.addEventListener("pagehide", finishDive);
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
