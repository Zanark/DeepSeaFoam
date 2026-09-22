# DeepSeaFoam for Xfce4 Terminal

Generated from the canonical palette, version **0.7.0**.
Do not edit generated files by hand. These instructions are opt-in; generating
the export does not install applications or change installed settings.

Native **[Scheme] color preset**, not an application configuration or GTK theme.
The loader scans `xfce4/terminal/colorschemes/*`; it does not require a
particular suffix. Upstream built-ins use `.desktop` after translation;
the portable `DeepSeaFoam.theme` filename is also accepted by that loader.

## Back up / install

1. Before applying anything, note your previous color preset and record **all**
   controls in Preferences -> Colors, including custom cursor/selection/bold
   colors, default-color toggles, background variation, bold-is-bright and tab
   activity color. Screenshots plus the actual color values provide a color-only
   restoration reference. A preset name alone cannot recover custom changes.
2. Current Xfconf-based builds can additionally capture a read-only settings
   inventory with `xfconf-query -c xfce4-terminal -lv` and save its output.
   Older builds use `${XDG_CONFIG_HOME:-$HOME/.config}/xfce4/terminal/terminalrc`;
   back up that file when applicable. Do not assume current builds still store
   their settings there. An inventory is a reference, not an importable scheme.
3. Back up an existing same-named preset, then copy `DeepSeaFoam.theme` into
   `${XDG_CONFIG_HOME:-$HOME/.config}/xfce4/terminal/colorschemes/`.
   Creating/copying the preset alone does not apply it. Do not overwrite
   `terminalrc`, an Xfconf XML file, or any broader configuration with it.
4. Reopen Preferences -> Colors and select **DeepSeaFoam** in Presets.
   This opt-in selection changes saved color settings and may affect open tabs.

**Native caveat:** selecting any preset resets omitted color properties to
Xfce's defaults; it is not an overlay/merge. This includes omitted bold color,
bold-is-bright, background variation and tab activity color. Non-color settings
such as fonts, geometry, shell, shortcuts and scrollback are not in this preset.
Background image/transparency preferences remain separate and can affect the
appearance; record any independent adjustments before changing them.

## Native mapping

The background is `solid.base`. **All nineteen terminal-group values are
reused unchanged**: foreground, cursor, selection background and the sixteen
ANSI colors. `ColorSelection` is selected **text**, not its background;
it reuses terminal foreground. `ColorSelectionBackground` is the dedicated
terminal selection value. Cursor text uses base. Explicit
`ColorCursorUseDefault=FALSE`, `ColorSelectionUseDefault=FALSE` and
`ColorUseTheme=FALSE` make the custom buffer colors effective.

`ColorPalette` has exactly sixteen semicolon-separated RGB values, no trailing
separator: black, red, green, yellow, blue, magenta, cyan, white, then their
eight bright counterparts. Canonical `purple` maps to ANSI magenta. No core
signal is substituted for an ANSI color. Window decorations, menus and other
GTK chrome remain the desktop theme's responsibility.

## Remove / restore

Select your former preset, then reapply the recorded custom color values and
toggles (or restore them manually if there was no prior named preset).
Restore any independently changed appearance options separately. Remove only
the new preset file, or put its same-named backup back. Removing the file alone
does **not** undo saved colors. Avoid full-settings rollback if unrelated
settings changed since your backup; do not copy legacy terminalrc over a current
Xfconf configuration and expect restoration.

## References

- [Official Preferences guide and preset reset behavior](https://docs.xfce.org/apps/xfce4-terminal/preferences).
- [Native [Scheme] example and ANSI order](https://github.com/xfce-mirror/xfce4-terminal/blob/ee94e32f4c4a523c6a5bd699aa66e1c4bd483ca7/colorschemes/solarized-dark.desktop.in).
- [Preset search and omitted-color reset](https://github.com/xfce-mirror/xfce4-terminal/blob/ee94e32f4c4a523c6a5bd699aa66e1c4bd483ca7/terminal/terminal-preferences-dialog.c).
- [Recognized properties and Xfconf storage](https://github.com/xfce-mirror/xfce4-terminal/blob/ee94e32f4c4a523c6a5bd699aa66e1c4bd483ca7/terminal/terminal-preferences.c).
- [VTE cursor/selection/palette application](https://github.com/xfce-mirror/xfce4-terminal/blob/ee94e32f4c4a523c6a5bd699aa66e1c4bd483ca7/terminal/terminal-screen.c).

Source contracts and deterministic Node format/mapping tests were checked.
Native application execution and visual validation were not performed on the
Windows generation host. No application installation or marketplace acceptance
is implied. Original theme files are MIT-licensed; retain the accompanying
[LICENSE](LICENSE).
