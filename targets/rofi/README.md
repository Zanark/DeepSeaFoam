# DeepSeaFoam for rofi

Generated from the canonical palette, version **0.7.0**.
Do not edit generated files by hand. These instructions are opt-in; generating
the export does not install applications or change installed settings.

Native **Rasi**, based explicitly on rofi's ordinary built-in `default`
theme. No geometry, font, mode, command, key binding or configuration block is
included. `@theme "default"` is intentional: `-theme` and `@theme` discard
the previous theme tree, so relying on an implicitly retained default layout
would be incorrect. This replaces another theme's layout with the host's default
layout; it is not a promise to preserve a custom theme's geometry.

Save a versioned release download as `DeepSeaFoam.rasi` in a new directory
before using the commands below. Back up a same-named installed theme separately.

## Try / install

From this directory in a graphical Linux session:

```sh
rofi -no-config -theme ./DeepSeaFoam.rasi -show run
```

Close with Escape without launching an entry. This one-shot preview does not
edit your configuration. A host-side parser check, if rofi is available, is:

```sh
rofi -rasi-validate ./DeepSeaFoam.rasi
```

For persistence, back up your current `${XDG_CONFIG_HOME:-$HOME/.config}/rofi/config.rasi`
(or record that it does not exist), its current `@theme` choice, and any
same-named target theme. Copy `DeepSeaFoam.rasi` into
`${XDG_CONFIG_HOME:-$HOME/.config}/rofi/themes/`. Manually change just the
theme directive in your existing configuration to:

```css
@theme "DeepSeaFoam"
```

Keep your existing `configuration { ... }` settings and other files.
Later theme overrides can change these colors. Do not replace `config.rasi`
with this file or run a theme-selector apply action just to preview it.

## Native mapping

- Window/normal rows: `solid.base`; input/message/alternate rows:
  `solid.panel`; ordinary text: `solid.text`.
- Native `element normal.normal`, `normal.active`, `normal.urgent`,
  `alternate.normal`, `alternate.active`, `alternate.urgent`,
  `selected.normal`, `selected.active`, `selected.urgent` selectors
  inherit their corresponding foreground/background references from default.
- Active text is seafoam; urgent text is rose. Selected active/urgent rows use
  seafoam/rose fills with dark base ink. Selected normal rows use warm text on
  `derived.textSelection` composited over base by the shared color helper.
  This deliberate opaque selection avoids dependence on stacked alpha surfaces.
- Rasi supports alpha-last `#RRGGBBAA`. `overlay.separator` is preserved
  unchanged for default separators; it is not interpreted as ARGB.
- Child element text/icons retain native transparent backgrounds and inherited
  text colors. Matching text uses bold without forcing a conflicting foreground.
  Placeholder/counts use faint text, prompt uses accent, entry text is warm,
  cursor uses light edge, and the scrollbar handle uses border.

No terminal ANSI palette, wallpaper, compositor opacity setting, icon recoloring
or global desktop theme is changed. Other custom widgets and rofi versions may
have additional surfaces outside the default layout contract.

## Remove / restore

Stop passing `-theme` for a one-shot preview. For persistent use, restore only
the prior `@theme` directive (remove the new directive if there was none) and
any theme override lines you independently changed. Remove only the copied
theme, or restore its previous file from backup. Keep unrelated configuration
edits; restoring the whole backup would also undo edits made since the backup.

## References

- [Native format, alpha, inheritance, import versus theme](https://github.com/davatorium/rofi/blob/7575b70967c6ea747ecdeb4e54dc88fbf3939e6d/doc/rofi-theme.5.markdown).
- [Default selectors, states and layout](https://github.com/davatorium/rofi/blob/7575b70967c6ea747ecdeb4e54dc88fbf3939e6d/doc/default_theme.rasi).
- [Theme reset/loading and Rasi validation](https://github.com/davatorium/rofi/blob/7575b70967c6ea747ecdeb4e54dc88fbf3939e6d/source/rofi.c).

Source contracts and deterministic Node format/mapping tests were checked.
Native application execution and visual validation were not performed on the
Windows generation host. No application installation or marketplace acceptance
is implied. Original theme files are MIT-licensed; retain the accompanying
[LICENSE](LICENSE).
