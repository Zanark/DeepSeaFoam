# Windows Terminal

## Scope

`DeepSeaFoam.json` is one object for the `schemes` array in Windows Terminal's `settings.json`. It combines the near-black teal base (`#000F13`) with brighter `#9CC2C3` text, an orange `#F34B00` cursor, and `#003748` selection.

The [19-color terminal extension](../../README.md#higher-contrast-terminals) preserves the supplied **Solarized Dark Higher Contrast** scheme's colors except its background. Richer ANSI colors and distinct bright variants are shared with VS Code's integrated terminal; they do not alter the core UI palette.

The **0.4.1 vibrant-pastel correction does not change this scheme's content**, just as 0.4.0 left it untouched: all 19 terminal colors and both terminals' `#000F13` backgrounds are unchanged from 0.3.0. Core-signal and UI-selection adjustments apply outside this separate terminal palette.

## Install

1. Open Windows Terminal settings and choose **Open JSON file**.
2. Back up `settings.json`.
3. Add the object from `DeepSeaFoam.json` to the top-level `schemes` array.
4. Set `"colorScheme": "DeepSeaFoam"` in a profile or under `profiles.defaults`.

Do not replace the complete settings file with this single scheme object.

## Remove / restore

Select the previous scheme and remove the `DeepSeaFoam` object from `schemes`. Restore the backup if manual JSON editing introduced an error.

## Limitations

Shell prompts and applications may emit fixed RGB colors that bypass the 16-color ANSI palette. Windows Terminal exposes a terminal surface, not separate working areas and application panels, so `#001E26` is not forced into the text buffer.
