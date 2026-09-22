export function addManualThemes({ palette, add, solid }) {
  const roles = [
    ["Workspace / drawer", "base"], ["Panels / search surfaces", "panel"],
    ["Accent / focus", "accent"], ["App-label text", "text"],
    ["Optional lower-emphasis text", "faintText"], ["Optional emphasis", "warm"]
  ];
  const reference = roles.map(([label, key]) => `${label}: ${solid(key)}`).join("\n");
  add("targets/nova-launcher/DeepSeaFoam.txt", `DeepSeaFoam ${palette.version} - Nova Launcher MANUAL color reference

NOT an import file, Nova backup, APK or icon pack.
Canonical six-digit RGB values; use your installed color picker's supported input.
Current Nova picker alpha syntax is not verified. These are opaque RGB references.

${reference}

Start with the two documented label controls:
Nova Settings > Style > Home Screen > Text
Nova Settings > Style > App Drawer > Text
Use ${solid("text")} for both. See README.md for optional version-dependent controls.

Back up first. Preserve your wallpaper, layout, icons, widgets, gestures and accounts.
Restore your saved colors to undo; a full Nova backup can also restore unrelated settings.
`);
  add("targets/nova-launcher/README.md", `# Nova Launcher - manual color preset

DeepSeaFoam **${palette.version}** for the Android launcher by Nova/TeslaCoil,
**not Panic's Nova editor**. This is a manual recipe with a downloadable
[\`DeepSeaFoam.txt\`](DeepSeaFoam.txt) reference, not a native theme import.
No documented safe colors-only import contract was found. No speculative
\`.novabackup\`, JSON importer, APK or icon pack is included.

## Before changing colors

Use Nova's built-in backup facility and record the existing colors you intend
to change. Keep backups within the same Nova major version: the official FAQ
warns against mixing Nova 7 and Nova 8 backups. Backup/restore is verified,
but exact current submenu wording can differ by version.

Do not replace your layout, wallpaper, widgets, gestures, accounts or icons.
Leave icon packs, icon themes, themed icons and custom icon-color controls alone:
they can replace or recolor third-party app artwork.

## Documented text controls

The current [official FAQ](https://novalauncher.com/faq/) documents:

| Path, starting in Nova Settings | Color |
| --- | --- |
| Style (bottom-right icon) > Home Screen > Text | \`${solid("text")}\` |
| Style > App Drawer > Text | \`${solid("text")}\` |

Use the installed picker's supported input. The supplied values are six-digit
**RGB references**, not a verified current Nova parser grammar. If your picker
accepts hex, enter the matching RGB value and keep opacity at 100%. Do not assume
an eight-digit field is RGBA or ARGB without checking its own labels.

## Optional controls - older documented labels

The paths below are documented by a **third-party 2022 guide**, not verified
current Nova menus. Apply a row **only if your installed version exposes the
matching color control**; otherwise skip it rather than changing another setting.

| Historical path, starting in Nova Settings | DeepSeaFoam color |
| --- | --- |
| Home Screen > Search Bar Style > Bar Color > Advanced | \`${solid("panel")}\` |
| Home Screen > Indicator Color > Advanced | \`${solid("accent")}\` |
| Home Screen > Dock > Dock Background > Advanced | \`${solid("panel")}\` |
| App Drawer > Background Color > Advanced | \`${solid("base")}\` |
| App Drawer > Scroll Accent Color > Advanced | \`${solid("accent")}\` |
| Folders > Window Style > Background Color > Advanced | \`${solid("panel")}\` |
| Search > Background Color > Advanced | \`${solid("panel")}\` |
| Search > Drawer Search Bar > Bar Color > Advanced | \`${solid("panel")}\` |

If Material You or automatic colors override an edited surface, select that
surface's explicit custom-color option when available. Do not disable unrelated
system features to force a match. Additional reference colors
\`${solid("faintText")}\` (lower emphasis) and \`${solid("warm")}\` (warm emphasis)
are not assigned to invented controls.

## Remove / restore

Restore the individual colors you recorded. A personal same-major-version Nova
backup is a broader alternative, but may also replace your layout and other
settings; review that consequence before restoring it. This package itself is
never an input to Nova's backup-restore screen.

## Scope and evidence

This recipe has **not been runtime-tested in Nova**. It does not theme Android
system UI, Google Discover, installed apps or widgets. Nova Prime badges are
outside the preset; no purchase is required by this guide.

The official website's older changelog is not evidence for today's latest store
version. Menu and picker support must be checked on the user's installed build.
No Nova logo is redistributed: an official asset URL alone is not a license.

- [Current official FAQ: text controls, limitations and backup compatibility](https://novalauncher.com/faq/)
- [Official Play listing: custom colors, themes and backup/restore](https://play.google.com/store/apps/details?id=com.teslacoilsw.launcher)
- [Historical third-party control paths, pinned 2022 source](https://github.com/dracula/nova-launcher/blob/57eccf90a1577eca4458e940eafbc565fff044b5/INSTALL.md#L30-L83)
- [Original developer's icon-theme example](https://github.com/teslacoil/Example_NovaTheme/tree/c909b8fd77e14ab134c9a579252e7c32fb57189e): an Android application/icon format, **not** a colors-only importer.
`);
}
