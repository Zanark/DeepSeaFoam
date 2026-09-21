# Windows Terminal

## Scope

`DeepSeaFoam.json` is one object for the `schemes` array in Windows Terminal's `settings.json`. The terminal background is near-black teal (`#000F13`), the cursor is pale pearl, and selection uses `#0D3B3B`: the recorded opaque composite of `#2AA1984D` over that base. The selection shares the text-selection overlay and retains readable ordinary foreground text.

ANSI blue, magenta, orange-related, and violet roles are an explicit Solarized heritage extension. Bright variants reuse approved colors rather than inventing a neon ramp.

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
