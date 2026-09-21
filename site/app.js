const paletteRoot = document.querySelector("#palette-groups");
const toast = document.querySelector("#copy-toast");
let toastTimer;

const humanize = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());

async function copyValue(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.setAttribute("readonly", "");
    input.className = "visually-hidden";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  toast.textContent = `${value} copied`;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}

function createSwatch(groupId, entry) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `color-swatch ${groupId === "overlay" ? "overlay" : ""}`;
  button.style.setProperty("--swatch-color", entry.value);
  button.setAttribute("aria-label", `Copy ${entry.value}, ${entry.role}`);

  const preview = document.createElement("span");
  preview.className = "swatch-preview";
  preview.setAttribute("aria-hidden", "true");

  const info = document.createElement("span");
  info.className = "swatch-info";

  const name = document.createElement("strong");
  name.textContent = humanize(entry.id);

  const value = document.createElement("code");
  value.textContent = entry.value.toUpperCase();

  const role = document.createElement("small");
  role.textContent = entry.role;
  role.title = entry.role;

  info.append(name, value, role);
  button.append(preview, info);
  button.addEventListener("click", () => copyValue(entry.value.toUpperCase()));
  return button;
}

function renderPalette(data) {
  const fragment = document.createDocumentFragment();

  for (const group of data.groups) {
    const section = document.createElement("section");
    section.className = "palette-group";
    section.setAttribute("aria-labelledby", `palette-${group.id}`);

    const header = document.createElement("div");
    header.className = "palette-group-header";

    const title = document.createElement("h3");
    title.id = `palette-${group.id}`;
    title.textContent = `${group.title} · ${group.colors.length}`;

    const description = document.createElement("p");
    description.textContent = group.description;
    header.append(title, description);

    const grid = document.createElement("div");
    grid.className = "swatch-grid";
    for (const entry of group.colors) {
      grid.append(createSwatch(group.id, entry));
    }

    section.append(header, grid);
    fragment.append(section);
  }

  paletteRoot.replaceChildren(fragment);
}

async function loadPalette() {
  try {
    const response = await fetch("palette.json");
    if (!response.ok) {
      throw new Error(`Palette request failed with ${response.status}`);
    }
    renderPalette(await response.json());
  } catch (error) {
    const message = document.createElement("p");
    message.className = "noscript-note";
    message.textContent = "The interactive palette could not be loaded. The complete palette remains available in the repository README.";
    paletteRoot.replaceChildren(message);
    console.error(error);
  }
}

loadPalette();
