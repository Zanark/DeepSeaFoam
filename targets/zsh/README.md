# DeepSeaFoam for Zsh

Generated from the canonical palette, version **0.7.0**.
Do not edit generated files by hand. These instructions are opt-in; generating
the export does not install applications or change installed settings.

This is a dependency-free **prompt theme**, not a terminal-emulator scheme.
Only `PROMPT` is assigned. Native prompt escapes render user, short hostname,
last directory component (with home abbreviation), a privilege-aware `%`/`#`
marker, and the last nonzero exit status. The directory/success marker use
`solid.accent`, the user uses `solid.warm`, the hostname uses
`solid.faintText`, and the failure marker uses `solid.error`.

## Try / install

Run these commands in **Zsh**, from this directory. For an isolated preview,
start `zsh -f`, then source the file; `exit` returns to the original shell.
A system-wide zshenv can still run with `-f`.

```zsh
source ./DeepSeaFoam.zsh-theme
```

The default `PROMPT_PERCENT` option must be enabled. This file does not change
shell options (including `PROMPT_SUBST`), `RPROMPT`, history, completions,
key bindings or existing hooks. Exact RGB needs a truecolor-capable terminal
and Zsh's hexadecimal `%F{#RRGGBB}` support. There is no bundled nearcolor
fallback, color-module loading, command substitution, external command,
startup output or hook. Other prompt managers/hooks can override this prompt.

To try it in your current shell instead, first save the existing value in a
previously unused variable: `deepseafoam_saved_prompt=$PROMPT`. Source the file.
Restore with `PROMPT=$deepseafoam_saved_prompt`, then
`unset deepseafoam_saved_prompt`.

For persistence, first copy your actual `${ZDOTDIR:-$HOME}/.zshrc` to a
new backup filename (or record that it did not exist). Keep this theme at a
stable path and manually add a single `source /absolute/path/DeepSeaFoam.zsh-theme`
line after your existing prompt setup. Do not replace the rest of `.zshrc`.

### Optional Oh My Zsh

Oh My Zsh is not required. If already installed, back up `.zshrc`, note the
old `ZSH_THEME`, and copy the file into your existing
`${ZSH_CUSTOM:-$ZSH/custom}/themes/` directory. Back up a same-named file
before replacing it. Set `ZSH_THEME="DeepSeaFoam"` **before** the existing
`source "$ZSH/oh-my-zsh.sh"` line, then start a new shell. Do not both
load it through Oh My Zsh and add a separate source line.

## Remove / restore

For a child-shell preview, just exit it. For a persistent install, remove the
added source line or restore the previous `ZSH_THEME` selection; open a new
shell so prior prompt hooks can initialize normally. Restore a replaced theme
file from its backup, or remove only the new theme file. A full `.zshrc`
backup is a last-resort restore and would also undo later unrelated edits.

## Boundary and references

Zsh does **not** own the terminal background, cursor, selection, ANSI palette,
application output or window chrome. Pair this prompt with a DeepSeaFoam
terminal-emulator export for those supported roles. Prompt colors deliberately
use the core UI roles; they do not replace or redefine the separate 19-value
terminal palette. No syntax-highlighting plugin is installed.

- [Native percent escapes and conditional status](https://github.com/zsh-users/zsh/blob/26ba0e39b9ccfebb4ad6aa288e2e7a2e6f48b915/Doc/Zsh/prompt.yo).
- [Hexadecimal color and terminal requirements](https://github.com/zsh-users/zsh/blob/26ba0e39b9ccfebb4ad6aa288e2e7a2e6f48b915/Doc/Zsh/zle.yo).
- [Oh My Zsh theme search/loading](https://github.com/ohmyzsh/ohmyzsh/blob/40bddc3c1a100feafccb01403f74c1d4e7380380/oh-my-zsh.sh).

Source contracts and deterministic Node format/mapping tests were checked.
Native application execution and visual validation were not performed on the
Windows generation host. No application installation or marketplace acceptance
is implied. Original theme files are MIT-licensed; retain the accompanying
[LICENSE](LICENSE).
