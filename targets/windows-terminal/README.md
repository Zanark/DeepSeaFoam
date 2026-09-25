# Windows Terminal

## Scope

`DeepSeaFoam.json` is one object for the `schemes` array in Windows Terminal's `settings.json`. It combines the near-black teal base (<img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13`) with brighter <img src="swatches/9cc2c3.png" width="32" height="12" alt="Color swatch"> `#9CC2C3` text, an orange <img src="swatches/f34b00.png" width="32" height="12" alt="Color swatch"> `#F34B00` cursor, and <img src="swatches/003748.png" width="32" height="12" alt="Color swatch"> `#003748` selection.

The [19-color terminal extension](../../docs/PALETTE.md#higher-contrast-terminals) preserves the supplied **Solarized Dark Higher Contrast** scheme's colors except its background. Richer ANSI colors and distinct bright variants are shared with VS Code's integrated terminal and, since 0.5.0, Alacritty.

Version **0.4.2 uses four terminal entries as direct sources for slightly deeper, richer core signals**, but does not change this scheme's content: all 19 terminal colors and both terminals' <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` backgrounds are unchanged from 0.3.0, as they were in 0.4.0 and 0.4.1. The derived UI shades and selection adjustments remain separate from the actual terminal palette.

## Install

1. Open Windows Terminal settings and choose **Open JSON file**.
2. Back up `settings.json`.
3. Add the object from `DeepSeaFoam.json` to the top-level `schemes` array.
4. Set `"colorScheme": "DeepSeaFoam"` in a profile or under `profiles.defaults`.

Do not replace the complete settings file with this single scheme object.

## Remove / restore

Select the previous scheme and remove the `DeepSeaFoam` object from `schemes`. Restore the backup if manual JSON editing introduced an error.

## Limitations

Shell prompts and applications may emit fixed RGB colors that bypass the 16-color ANSI palette. Windows Terminal exposes a terminal surface, not separate working areas and application panels, so <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26` is not forced into the text buffer.
