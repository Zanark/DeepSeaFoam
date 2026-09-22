import { composite } from "./colors.mjs";

const sources = {
  zsh: "https://github.com/zsh-users/zsh/blob/26ba0e39b9ccfebb4ad6aa288e2e7a2e6f48b915",
  omz: "https://github.com/ohmyzsh/ohmyzsh/blob/40bddc3c1a100feafccb01403f74c1d4e7380380",
  rofi: "https://github.com/davatorium/rofi/blob/7575b70967c6ea747ecdeb4e54dc88fbf3939e6d",
  xfce: "https://github.com/xfce-mirror/xfce4-terminal/blob/ee94e32f4c4a523c6a5bd699aa66e1c4bd483ca7",
  termux: "https://github.com/termux/termux-app/blob/084d709fbf23ea83b5cb85fd3d795c775be06676"
};

const ansiRoles = [
  "black", "red", "green", "yellow", "blue", "purple", "cyan", "white",
  "brightBlack", "brightRed", "brightGreen", "brightYellow",
  "brightBlue", "brightPurple", "brightCyan", "brightWhite"
];

const properties = values => Object.entries(values).map(([key, value]) => `${key}=${value}`).join("\n");
const rasiBlock = (selector, values) => `${selector} {\n${Object.entries(values)
  .map(([key, value]) => `    ${key}: ${value};`).join("\n")}\n}\n`;

export function addLinuxThemes({ palette, add, solid, overlay, derived, terminal }) {
  const base = solid("base");
  const panel = solid("panel");
  const accent = solid("accent");
  const text = solid("text");
  const warm = solid("warm");
  const faint = solid("faintText");
  const error = solid("error");
  const selection = composite(derived("textSelection"), base);
  const ansi = ansiRoles.map(terminal);
  const introduction = `Generated from the canonical palette, version **${palette.version}**.
Do not edit generated files by hand. These instructions are opt-in; generating
the export does not install applications or change installed settings.`;
  const validation = `Source contracts and deterministic Node format/mapping tests were checked.
Native application execution and visual validation were not performed on the
Windows generation host. No application installation or marketplace acceptance
is implied. Original theme files are MIT-licensed; retain the accompanying
[LICENSE](LICENSE).`;

  add("targets/zsh/DeepSeaFoam.zsh-theme", `# Generated from palette/deepseafoam.json. Source in Zsh; no framework required.
# Only PROMPT changes. PROMPT_PERCENT (Zsh default) and a truecolor terminal are required.
PROMPT='%F{${warm}}%n%f@%F{${faint}}%m%f %F{${accent}}%1~%f %(?.%F{${accent}}.%F{${error}}[%?] )%#%f '
`);
  add("targets/zsh/README.md", `# ${palette.name} for Zsh

${introduction}

This is a dependency-free **prompt theme**, not a terminal-emulator scheme.
Only \`PROMPT\` is assigned. Native prompt escapes render user, short hostname,
last directory component (with home abbreviation), a privilege-aware \`%\`/\`#\`
marker, and the last nonzero exit status. The directory/success marker use
\`solid.accent\`, the user uses \`solid.warm\`, the hostname uses
\`solid.faintText\`, and the failure marker uses \`solid.error\`.

## Try / install

Run these commands in **Zsh**, from this directory. For an isolated preview,
start \`zsh -f\`, then source the file; \`exit\` returns to the original shell.
A system-wide zshenv can still run with \`-f\`.

\`\`\`zsh
source ./DeepSeaFoam.zsh-theme
\`\`\`

The default \`PROMPT_PERCENT\` option must be enabled. This file does not change
shell options (including \`PROMPT_SUBST\`), \`RPROMPT\`, history, completions,
key bindings or existing hooks. Exact RGB needs a truecolor-capable terminal
and Zsh's hexadecimal \`%F{#RRGGBB}\` support. There is no bundled nearcolor
fallback, color-module loading, command substitution, external command,
startup output or hook. Other prompt managers/hooks can override this prompt.

To try it in your current shell instead, first save the existing value in a
previously unused variable: \`deepseafoam_saved_prompt=$PROMPT\`. Source the file.
Restore with \`PROMPT=$deepseafoam_saved_prompt\`, then
\`unset deepseafoam_saved_prompt\`.

For persistence, first copy your actual \`\${ZDOTDIR:-$HOME}/.zshrc\` to a
new backup filename (or record that it did not exist). Keep this theme at a
stable path and manually add a single \`source /absolute/path/DeepSeaFoam.zsh-theme\`
line after your existing prompt setup. Do not replace the rest of \`.zshrc\`.

### Optional Oh My Zsh

Oh My Zsh is not required. If already installed, back up \`.zshrc\`, note the
old \`ZSH_THEME\`, and copy the file into your existing
\`\${ZSH_CUSTOM:-$ZSH/custom}/themes/\` directory. Back up a same-named file
before replacing it. Set \`ZSH_THEME="DeepSeaFoam"\` **before** the existing
\`source "$ZSH/oh-my-zsh.sh"\` line, then start a new shell. Do not both
load it through Oh My Zsh and add a separate source line.

## Remove / restore

For a child-shell preview, just exit it. For a persistent install, remove the
added source line or restore the previous \`ZSH_THEME\` selection; open a new
shell so prior prompt hooks can initialize normally. Restore a replaced theme
file from its backup, or remove only the new theme file. A full \`.zshrc\`
backup is a last-resort restore and would also undo later unrelated edits.

## Boundary and references

Zsh does **not** own the terminal background, cursor, selection, ANSI palette,
application output or window chrome. Pair this prompt with a DeepSeaFoam
terminal-emulator export for those supported roles. Prompt colors deliberately
use the core UI roles; they do not replace or redefine the separate 19-value
terminal palette. No syntax-highlighting plugin is installed.

- [Native percent escapes and conditional status](${sources.zsh}/Doc/Zsh/prompt.yo).
- [Hexadecimal color and terminal requirements](${sources.zsh}/Doc/Zsh/zle.yo).
- [Oh My Zsh theme search/loading](${sources.omz}/oh-my-zsh.sh).

${validation}
`);

  const rofiColors = {
    background: base,
    foreground: text,
    "border-color": solid("border"),
    separatorcolor: overlay("separator"),
    "normal-background": base,
    "normal-foreground": text,
    "active-background": base,
    "active-foreground": accent,
    "urgent-background": base,
    "urgent-foreground": error,
    "alternate-normal-background": panel,
    "alternate-normal-foreground": text,
    "alternate-active-background": panel,
    "alternate-active-foreground": accent,
    "alternate-urgent-background": panel,
    "alternate-urgent-foreground": error,
    "selected-normal-background": selection,
    "selected-normal-foreground": warm,
    "selected-active-background": accent,
    "selected-active-foreground": base,
    "selected-urgent-background": error,
    "selected-urgent-foreground": base
  };
  add("targets/rofi/DeepSeaFoam.rasi",
    `/* Generated from palette/deepseafoam.json. Default layout, colors only. */\n` +
    `@theme "default"\n\n` +
    rasiBlock("*", rofiColors) + "\n" +
    rasiBlock("window", { "background-color": "@background" }) + "\n" +
    rasiBlock("inputbar, message", { "background-color": panel }) + "\n" +
    rasiBlock("prompt", { "text-color": accent }) + "\n" +
    rasiBlock("entry", { "text-color": warm, "placeholder-color": faint, "cursor-color": solid("lightEdge") }) + "\n" +
    rasiBlock("num-filtered-rows, num-rows, textbox-num-sep", { "text-color": faint }) + "\n" +
    rasiBlock("overlay", { "background-color": accent, "text-color": base }) + "\n" +
    rasiBlock("element-text", { highlight: "bold" }) + "\n" +
    rasiBlock("scrollbar", { "handle-color": solid("border") }));
  add("targets/rofi/README.md", `# ${palette.name} for rofi

${introduction}

Native **Rasi**, based explicitly on rofi's ordinary built-in \`default\`
theme. No geometry, font, mode, command, key binding or configuration block is
included. \`@theme "default"\` is intentional: \`-theme\` and \`@theme\` discard
the previous theme tree, so relying on an implicitly retained default layout
would be incorrect. This replaces another theme's layout with the host's default
layout; it is not a promise to preserve a custom theme's geometry.

Save a versioned release download as \`DeepSeaFoam.rasi\` in a new directory
before using the commands below. Back up a same-named installed theme separately.

## Try / install

From this directory in a graphical Linux session:

\`\`\`sh
rofi -no-config -theme ./DeepSeaFoam.rasi -show run
\`\`\`

Close with Escape without launching an entry. This one-shot preview does not
edit your configuration. A host-side parser check, if rofi is available, is:

\`\`\`sh
rofi -rasi-validate ./DeepSeaFoam.rasi
\`\`\`

For persistence, back up your current \`\${XDG_CONFIG_HOME:-$HOME/.config}/rofi/config.rasi\`
(or record that it does not exist), its current \`@theme\` choice, and any
same-named target theme. Copy \`DeepSeaFoam.rasi\` into
\`\${XDG_CONFIG_HOME:-$HOME/.config}/rofi/themes/\`. Manually change just the
theme directive in your existing configuration to:

\`\`\`css
@theme "DeepSeaFoam"
\`\`\`

Keep your existing \`configuration { ... }\` settings and other files.
Later theme overrides can change these colors. Do not replace \`config.rasi\`
with this file or run a theme-selector apply action just to preview it.

## Native mapping

- Window/normal rows: \`solid.base\`; input/message/alternate rows:
  \`solid.panel\`; ordinary text: \`solid.text\`.
- Native \`element normal.normal\`, \`normal.active\`, \`normal.urgent\`,
  \`alternate.normal\`, \`alternate.active\`, \`alternate.urgent\`,
  \`selected.normal\`, \`selected.active\`, \`selected.urgent\` selectors
  inherit their corresponding foreground/background references from default.
- Active text is seafoam; urgent text is rose. Selected active/urgent rows use
  seafoam/rose fills with dark base ink. Selected normal rows use warm text on
  \`derived.textSelection\` composited over base by the shared color helper.
  This deliberate opaque selection avoids dependence on stacked alpha surfaces.
- Rasi supports alpha-last \`#RRGGBBAA\`. \`overlay.separator\` is preserved
  unchanged for default separators; it is not interpreted as ARGB.
- Child element text/icons retain native transparent backgrounds and inherited
  text colors. Matching text uses bold without forcing a conflicting foreground.
  Placeholder/counts use faint text, prompt uses accent, entry text is warm,
  cursor uses light edge, and the scrollbar handle uses border.

No terminal ANSI palette, wallpaper, compositor opacity setting, icon recoloring
or global desktop theme is changed. Other custom widgets and rofi versions may
have additional surfaces outside the default layout contract.

## Remove / restore

Stop passing \`-theme\` for a one-shot preview. For persistent use, restore only
the prior \`@theme\` directive (remove the new directive if there was none) and
any theme override lines you independently changed. Remove only the copied
theme, or restore its previous file from backup. Keep unrelated configuration
edits; restoring the whole backup would also undo edits made since the backup.

## References

- [Native format, alpha, inheritance, import versus theme](${sources.rofi}/doc/rofi-theme.5.markdown).
- [Default selectors, states and layout](${sources.rofi}/doc/default_theme.rasi).
- [Theme reset/loading and Rasi validation](${sources.rofi}/source/rofi.c).

${validation}
`);

  add("targets/xfce4-terminal/DeepSeaFoam.theme",
    `# Generated from palette/deepseafoam.json. Native color preset, not terminalrc.\n[Scheme]\n` +
    properties({
      Name: palette.name,
      ColorForeground: terminal("foreground"),
      ColorBackground: base,
      ColorCursor: terminal("cursorColor"),
      ColorCursorForeground: base,
      ColorCursorUseDefault: "FALSE",
      ColorSelection: terminal("foreground"),
      ColorSelectionBackground: terminal("selectionBackground"),
      ColorSelectionUseDefault: "FALSE",
      ColorPalette: ansi.join(";"),
      ColorUseTheme: "FALSE"
    }) + "\n");
  add("targets/xfce4-terminal/README.md", `# ${palette.name} for Xfce4 Terminal

${introduction}

Native **[Scheme] color preset**, not an application configuration or GTK theme.
The loader scans \`xfce4/terminal/colorschemes/*\`; it does not require a
particular suffix. Upstream built-ins use \`.desktop\` after translation;
the portable \`DeepSeaFoam.theme\` filename is also accepted by that loader.

## Back up / install

1. Before applying anything, note your previous color preset and record **all**
   controls in Preferences -> Colors, including custom cursor/selection/bold
   colors, default-color toggles, background variation, bold-is-bright and tab
   activity color. Screenshots plus the actual color values provide a color-only
   restoration reference. A preset name alone cannot recover custom changes.
2. Current Xfconf-based builds can additionally capture a read-only settings
   inventory with \`xfconf-query -c xfce4-terminal -lv\` and save its output.
   Older builds use \`\${XDG_CONFIG_HOME:-$HOME/.config}/xfce4/terminal/terminalrc\`;
   back up that file when applicable. Do not assume current builds still store
   their settings there. An inventory is a reference, not an importable scheme.
3. Back up an existing same-named preset, then copy \`DeepSeaFoam.theme\` into
   \`\${XDG_CONFIG_HOME:-$HOME/.config}/xfce4/terminal/colorschemes/\`.
   Creating/copying the preset alone does not apply it. Do not overwrite
   \`terminalrc\`, an Xfconf XML file, or any broader configuration with it.
4. Reopen Preferences -> Colors and select **${palette.name}** in Presets.
   This opt-in selection changes saved color settings and may affect open tabs.

**Native caveat:** selecting any preset resets omitted color properties to
Xfce's defaults; it is not an overlay/merge. This includes omitted bold color,
bold-is-bright, background variation and tab activity color. Non-color settings
such as fonts, geometry, shell, shortcuts and scrollback are not in this preset.
Background image/transparency preferences remain separate and can affect the
appearance; record any independent adjustments before changing them.

## Native mapping

The background is \`solid.base\`. **All nineteen terminal-group values are
reused unchanged**: foreground, cursor, selection background and the sixteen
ANSI colors. \`ColorSelection\` is selected **text**, not its background;
it reuses terminal foreground. \`ColorSelectionBackground\` is the dedicated
terminal selection value. Cursor text uses base. Explicit
\`ColorCursorUseDefault=FALSE\`, \`ColorSelectionUseDefault=FALSE\` and
\`ColorUseTheme=FALSE\` make the custom buffer colors effective.

\`ColorPalette\` has exactly sixteen semicolon-separated RGB values, no trailing
separator: black, red, green, yellow, blue, magenta, cyan, white, then their
eight bright counterparts. Canonical \`purple\` maps to ANSI magenta. No core
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
- [Native [Scheme] example and ANSI order](${sources.xfce}/colorschemes/solarized-dark.desktop.in).
- [Preset search and omitted-color reset](${sources.xfce}/terminal/terminal-preferences-dialog.c).
- [Recognized properties and Xfconf storage](${sources.xfce}/terminal/terminal-preferences.c).
- [VTE cursor/selection/palette application](${sources.xfce}/terminal/terminal-screen.c).

${validation}
`);

  add("targets/termux/colors.properties",
    `# Generated from palette/deepseafoam.json. Terminal colors only.\n` +
    properties({
      background: base,
      foreground: terminal("foreground"),
      cursor: terminal("cursorColor"),
      ...Object.fromEntries(ansi.map((color, index) => [`color${index}`, color]))
    }) + "\n");
  add("targets/termux/README.md", `# ${palette.name} for Termux

${introduction}

Native **colors.properties** for the terminal buffer in the upstream Termux
Android app. No Termux:Styling add-on, root access or shell plugin is required.
This is not \`termux.properties\` and must not replace that broader settings file.

## Back up / install

1. Transfer \`colors.properties\` to a location accessible **inside Termux**.
   Do not assume an Android Downloads path is accessible without storage
   permission; this guide does not request or change permissions.
2. Before replacement, copy your existing \`~/.termux/colors.properties\`
   to a new backup filename, or record that it did not exist. Back up a symlink
   and its target appropriately rather than inadvertently overwriting a shared
   theme. Keep the backup outside the new theme file.
3. Copy only this \`colors.properties\` to \`~/.termux/colors.properties\`
   (create \`~/.termux\` if needed). Leave \`termux.properties\`, \`font.ttf\`,
   shell startup files and all other configuration untouched.
4. In Termux run \`termux-reload-settings\`. If unavailable, close all sessions
   safely and restart the app. Termux:Styling or another theme manager may
   subsequently replace this file, so avoid applying another preset concurrently.

## Native mapping and unsupported roles

- \`background\` is \`solid.base\`; \`foreground\` and \`cursor\` are the
  unchanged terminal-group foreground and cursor.
- \`color0\` through \`color15\` reuse the sixteen ANSI values unchanged:
  black, red, green, yellow, blue, magenta, cyan, white, then bright variants.
  Canonical \`purple\` maps to ANSI magenta. Colors 16-255 keep native defaults.
- **No selection key is supported.** The renderer reverses text/background
  for selection. The nineteenth terminal value, \`selectionBackground\`, is
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

Put the backed-up \`colors.properties\` (or prior symlink) back, then run
\`termux-reload-settings\` again. If no file existed before installation, remove
only the newly installed \`~/.termux/colors.properties\` and reload to restore
native colors. Do not delete \`~/.termux\` or reset the app. Unrelated settings
are never part of the exported file.

## References

- [Recognized property keys and index handling](${sources.termux}/terminal-emulator/src/main/java/com/termux/terminal/TerminalColorScheme.java).
- [RGB parsing](${sources.termux}/terminal-emulator/src/main/java/com/termux/terminal/TerminalColors.java).
- [Native selection inversion](${sources.termux}/terminal-view/src/main/java/com/termux/view/TerminalRenderer.java).
- [colors.properties path](${sources.termux}/termux-shared/src/main/java/com/termux/shared/termux/TermuxConstants.java).
- [File loading and default-color restoration](${sources.termux}/app/src/main/java/com/termux/app/terminal/TermuxTerminalSessionActivityClient.java).
- [Reload command and separate application preferences](https://wiki.termux.com/wiki/Terminal_Settings).

${validation}
`);
}
