# Nova Launcher - manual color preset

DeepSeaFoam **0.7.0** for the Android launcher by Nova/TeslaCoil,
**not Panic's Nova editor**. This is a manual recipe with a downloadable
[`DeepSeaFoam.txt`](DeepSeaFoam.txt) reference, not a native theme import.
No documented safe colors-only import contract was found. No speculative
`.novabackup`, JSON importer, APK or icon pack is included.

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
| Style (bottom-right icon) > Home Screen > Text | <img src="swatches/93a1a1.png" width="32" height="12" alt="Color swatch"> `#93A1A1` |
| Style > App Drawer > Text | <img src="swatches/93a1a1.png" width="32" height="12" alt="Color swatch"> `#93A1A1` |

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
| Home Screen > Search Bar Style > Bar Color > Advanced | <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |
| Home Screen > Indicator Color > Advanced | <img src="swatches/00a591.png" width="32" height="12" alt="Color swatch"> `#00A591` |
| Home Screen > Dock > Dock Background > Advanced | <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |
| App Drawer > Background Color > Advanced | <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` |
| App Drawer > Scroll Accent Color > Advanced | <img src="swatches/00a591.png" width="32" height="12" alt="Color swatch"> `#00A591` |
| Folders > Window Style > Background Color > Advanced | <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |
| Search > Background Color > Advanced | <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |
| Search > Drawer Search Bar > Bar Color > Advanced | <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` |

If Material You or automatic colors override an edited surface, select that
surface's explicit custom-color option when available. Do not disable unrelated
system features to force a match. Additional reference colors
<img src="swatches/839496.png" width="32" height="12" alt="Color swatch"> `#839496` (lower emphasis) and <img src="swatches/eee8d5.png" width="32" height="12" alt="Color swatch"> `#EEE8D5` (warm emphasis)
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
