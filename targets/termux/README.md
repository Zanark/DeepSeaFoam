# DeepSeaFoam for Termux

Generated from the canonical palette, version **0.7.0**.
Do not edit generated files by hand. These instructions are opt-in; generating
the export does not install applications or change installed settings.

Native **colors.properties** for the terminal buffer in the upstream Termux
Android app. No Termux:Styling add-on, root access or shell plugin is required.
This is not `termux.properties` and must not replace that broader settings file.

## Back up / install

1. Transfer `colors.properties` to a location accessible **inside Termux**.
   Do not assume an Android Downloads path is accessible without storage
   permission; this guide does not request or change permissions.
2. Before replacement, copy your existing `~/.termux/colors.properties`
   to a new backup filename, or record that it did not exist. Back up a symlink
   and its target appropriately rather than inadvertently overwriting a shared
   theme. Keep the backup outside the new theme file.
3. Copy only this `colors.properties` to `~/.termux/colors.properties`
   (create `~/.termux` if needed). Leave `termux.properties`, `font.ttf`,
   shell startup files and all other configuration untouched.
4. In Termux run `termux-reload-settings`. If unavailable, close all sessions
   safely and restart the app. Termux:Styling or another theme manager may
   subsequently replace this file, so avoid applying another preset concurrently.

## Native mapping and unsupported roles

- `background` is `solid.base`; `foreground` and `cursor` are the
  unchanged terminal-group foreground and cursor.
- `color0` through `color15` reuse the sixteen ANSI values unchanged:
  black, red, green, yellow, blue, magenta, cyan, white, then bright variants.
  Canonical `purple` maps to ANSI magenta. Colors 16-255 keep native defaults.
- **No selection key is supported.** The renderer reverses text/background
  for selection. The nineteenth terminal value, `selectionBackground`, is
  therefore intentionally unsupported, not replaced with a core color or
  disguised as another key. This export maps eighteen of nineteen non-background
  terminal values. Unknown properties can reject a native scheme.
- App dialogs/drawer/toolbar, Android system bars, keyboard, extra-key styling
  and other chrome have no independent roles in this export. Some host surfaces
  may follow the terminal background, but this is not a complete app/Android
  theme. Separate app appearance settings are not modified.
- RGB hex is opaque; alpha, wallpaper and fonts are not exported. Applications
  can still request explicit truecolor/256-color output or OSC color overrides.

## Remove / restore

Put the backed-up `colors.properties` (or prior symlink) back, then run
`termux-reload-settings` again. If no file existed before installation, remove
only the newly installed `~/.termux/colors.properties` and reload to restore
native colors. Do not delete `~/.termux` or reset the app. Unrelated settings
are never part of the exported file.

## References

- [Recognized property keys and index handling](https://github.com/termux/termux-app/blob/084d709fbf23ea83b5cb85fd3d795c775be06676/terminal-emulator/src/main/java/com/termux/terminal/TerminalColorScheme.java).
- [RGB parsing](https://github.com/termux/termux-app/blob/084d709fbf23ea83b5cb85fd3d795c775be06676/terminal-emulator/src/main/java/com/termux/terminal/TerminalColors.java).
- [Native selection inversion](https://github.com/termux/termux-app/blob/084d709fbf23ea83b5cb85fd3d795c775be06676/terminal-view/src/main/java/com/termux/view/TerminalRenderer.java).
- [colors.properties path](https://github.com/termux/termux-app/blob/084d709fbf23ea83b5cb85fd3d795c775be06676/termux-shared/src/main/java/com/termux/shared/termux/TermuxConstants.java).
- [File loading and default-color restoration](https://github.com/termux/termux-app/blob/084d709fbf23ea83b5cb85fd3d795c775be06676/app/src/main/java/com/termux/app/terminal/TermuxTerminalSessionActivityClient.java).
- [Reload command and separate application preferences](https://wiki.termux.com/wiki/Terminal_Settings).

Source contracts and deterministic Node format/mapping tests were checked.
Native application execution and visual validation were not performed on the
Windows generation host. No application installation or marketplace acceptance
is implied. Original theme files are MIT-licensed; retain the accompanying
[LICENSE](LICENSE).
