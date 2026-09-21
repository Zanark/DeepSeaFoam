# Firefox

## Scope

The Firefox export is a static WebExtension theme. It themes browser-owned chrome: the frame, tabs, toolbar, address/search fields, popups, sidebar, and Firefox new-tab surface. It does not inject CSS into websites or recolor page content.

## Tab treatment

The tab strip uses the near-black teal recessed surface (`#000F13`) so inactive tabs visually merge into their background instead of appearing as separate cards. Inactive titles use the lower-emphasis text color. The selected tab rises into the blue-green panel surface with warm text and a vibrant pastel seafoam active line (`#28C0B5`).

Version 0.4.1 corrects 0.4.0's overly light accent with richer saturation and pastel softness, also applied to focused-field borders, attention icons, and highlighted popup text. Address/search-field text selection uses `#28C0B526` (unchanged 14.90% alpha). The dark surfaces, ordinary text, and warm emphasis remain unchanged.

## Preview

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on**.
3. Select this folder's `manifest.json`.

Temporary themes disappear when Firefox restarts.

## Install

The release ZIP is unsigned static-theme source. Permanent installation requires a signed Firefox add-on package or distribution through Mozilla Add-ons. Signing and publishing are intentionally outside this repository.

## Remove / restore

Disable or remove DeepSeaFoam under **Add-ons and themes > Themes**, then enable the previous theme.

## Limitations

Firefox controls which chrome properties static themes can style, and some operating-system title-bar surfaces may remain platform-defined. The export intentionally avoids `userChrome.css` and all website-content injection.
