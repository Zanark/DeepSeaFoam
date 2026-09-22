# DeepSeaFoam for Monkeytype

Generated from the canonical palette, version **0.6.0**. Do not edit
these generated files by hand. This is a native **colors-only custom theme**,
not a full-settings import, browser extension, custom CSS or built-in preset.
Upstream submission/acceptance is tracked separately in
[publication status](https://github.com/Zanark/DeepSeaFoam/blob/main/docs/PUBLISHING.md).

## Install

1. Note your current preset and whether custom themes are enabled. Before
   replacing any existing custom colors, back them up through Monkeytype's native
   **Settings -> theme -> custom -> share** control and keep its copied link.
   A native settings export can additionally back up your complete configuration.
2. [Apply DeepSeaFoam using the native share link](https://monkeytype.com?customTheme=eyJjIjpbIiMwMDBGMTMiLCIjMDBBNTkxIiwiIzAwQTU5MSIsIiM4Mzk0OTYiLCIjMDAxRTI2IiwiI0VFRThENSIsIiNFODRBNUYiLCIjRTg0QTVGIiwiI0U4NEE1RiIsIiNFODRBNUYiXX0%3D).
   Alternatively, open the single URL from [DeepSeaFoam.txt](DeepSeaFoam.txt).
   Opening this link applies the colors and enables the custom theme; it requires
   **no account login**. Account-saved custom presets are optional.
3. Use **Settings -> theme -> custom** to inspect the native color pickers.
   There is no pasted-array/JSON importer in that UI. Do not import
   [DeepSeaFoam.json](DeepSeaFoam.json) through the full-settings importer.

The JSON file is the share payload object `{c: [ten colors]}`. The URL uses
ordinary Base64 JSON with percent-encoding, **not a naked array**. It changes
only `customThemeColors` and the enabled `customTheme` state. A tiny settings
file such as `{customTheme: true, customThemeColors: [...]}` is **not** a safe
colors-only install: importing it resets unrelated omitted settings.

The link contains no background-image, size or filter fields (`i`, `s`,
`f`). Existing background settings and separately configured custom CSS remain
unchanged and may affect the exact appearance. Fonts, test settings, flip and
colorful modes are not reset. This export does not change installed settings
until you choose to apply it.

## Native roles

The array order is fixed by Monkeytype, not by the order of its color pickers.
All ten slots use existing canonical colors; no new palette values are invented.

| Index | Native slot | Canonical role | Value |
| --- | --- | --- | --- |
| 0 | `bg` | `solid.base` | `#000F13` |
| 1 | `main` | `solid.accent` | `#00A591` |
| 2 | `caret` | `solid.accent` | `#00A591` |
| 3 | `sub` | `solid.faintText` | `#839496` |
| 4 | `subAlt` | `solid.panel` | `#001E26` |
| 5 | `text` | `solid.warm` | `#EEE8D5` |
| 6 | `error` | `solid.error` | `#E84A5F` |
| 7 | `errorExtra` | `solid.error` | `#E84A5F` |
| 8 | `colorfulError` | `solid.error` | `#E84A5F` |
| 9 | `colorfulErrorExtra` | `solid.error` | `#E84A5F` |

Warm ivory is deliberately the normal typed text: it meets upstream's
near-white/black text guidance. Untyped text and secondary UI use the readable
faint-text gray. Native slots overlap UI roles: main also supplies active UI,
sub supplies secondary UI, and subAlt supplies supporting surfaces/buttons.

| Flip | Colorful | Correctly typed | Untyped |
| --- | --- | --- | --- |
| Off | Off | text (warm) | sub (gray) |
| On | Off | sub (gray) | text (warm) |
| Off | On | main (seafoam) | sub (gray) |
| On | On | sub (gray) | main (seafoam) |

The base background stays the same in all four combinations. Error, extra-error
and both colorful-error slots deliberately share the canonical rose.
Document, warning, border and light-edge roles have no separate native slots;
not every one of the eleven core solids needs to be used by every host.

## Remove / restore

Select **Settings -> theme -> preset** to disable the custom theme, then select
your former preset if needed. To restore earlier custom colors, open their
backed-up native share link (or choose your previously saved account preset).
The DeepSeaFoam link never deletes account presets. Restore separate
background/CSS settings only if you independently changed them.

## References

Native contract reviewed at Monkeytype commit
`91bd24bb8513785c7364cbea29296ff7adafac41`:

- [Theme contribution format](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/docs/THEMES.md): the current built-in
  format uses the theme registry and schema enum, not `_list.json`; this
  colors-only theme needs no CSS.
- [Contribution/theme guidelines](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/docs/CONTRIBUTING.md#theme-guidelines).
- [Array conversion and native slot order](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/ts/controllers/theme-controller.ts#L25-L52).
- [Share payload validation and colors-only URL handling](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/ts/controllers/url-handler.tsx#L83-L140).
- [Ten-color schema](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/packages/schemas/src/configs.ts#L272-L290).
- [Native share controls](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/ts/components/pages/settings/custom-setting/Theme.tsx#L126-L166).
- [Normal typing and error styles](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/styles/test.scss#L115-L176)
  and [flip/colorful styles](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/frontend/src/styles/test.scss#L278-L302).

Original theme files are MIT-licensed; retain the accompanying [LICENSE](LICENSE).
Generation and format tests are not a claim of upstream acceptance or validation
in every Monkeytype/browser version.
