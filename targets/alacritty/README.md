# Alacritty

## Scope

`DeepSeaFoam.toml` is a colors-only fragment for current TOML-based Alacritty. It shares the same **19 terminal-extension colors** as Windows Terminal and VS Code: <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` background, <img src="swatches/9cc2c3.png" width="32" height="12" alt="Color swatch"> `#9CC2C3` foreground, <img src="swatches/f34b00.png" width="32" height="12" alt="Color swatch"> `#F34B00` cursor, <img src="swatches/003748.png" width="32" height="12" alt="Color swatch"> `#003748` selection and all 16 ANSI values. The palette's `purple` names map to Alacritty's `magenta` keys.

Search and hint highlights reuse terminal colors with dark text; the footer and line indicator use the surrounding panel color. Cursor glyphs use dark ink and selected text uses the terminal foreground. Fonts, padding, opacity, keybindings, shell and window preferences remain yours.

## Install

1. Save the downloaded file as `DeepSeaFoam.toml` in a `themes` directory beside your existing Alacritty configuration.
2. Back up your existing configuration.
3. Merge the import into its **existing** `[general]` table:

```toml
[general]
import = ['themes\DeepSeaFoam.toml']
```

The example is for Windows, where the configuration normally lives at `%APPDATA%\alacritty\alacritty.toml`. TOML single quotes preserve literal backslashes. On Unix, use `themes/DeepSeaFoam.toml` relative to the configuration, normally under `~/.config/alacritty`.

Do not create duplicate `[general]` tables or overwrite an existing import list. Append the theme path to that list. Imported files load in order; settings in the main configuration load last and can override these colors. Older YAML-based versions need an upgrade or a separately designed port.

## Remove / restore

Remove this path from `general.import`, retaining all other imports. Delete the theme file only after it is no longer referenced, or restore your previous configuration backup.

## Limitations and references

Alacritty's color values are opaque RGB, not RGBA. User-configured opacity can change the apparent background. Applications emitting fixed 24-bit RGB colors bypass the ANSI table; dim variants are host-derived.

- [Official configuration manual: locations, imports and colors](https://alacritty.org/config-alacritty.html).
- [Versioned upstream configuration reference](https://github.com/alacritty/alacritty/blob/v0.17.0/extra/man/alacritty.5.scd).
- [Upstream color types and parsing](https://github.com/alacritty/alacritty/blob/v0.17.0/alacritty/src/config/color.rs).

This export does not replace your entire configuration or claim a visual audit of your terminal applications.
