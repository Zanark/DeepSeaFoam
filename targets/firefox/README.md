# Firefox

## Scope

The Firefox export is a static WebExtension theme. It themes browser-owned chrome: the frame, tabs, toolbar, address/search fields, popups, sidebar, and Firefox new-tab surface. It does not inject CSS into websites or recolor page content.

## Tab treatment

The tab strip uses the black recessed surface so inactive tabs visually merge into their background instead of appearing as separate cards. Inactive titles use the lower-emphasis text color. The selected tab rises into the blue-green panel surface with warm text and a restrained seafoam active line.

## Preview

1. Open `about:debugging#/runtime/this-firefox`.
2. Choose **Load Temporary Add-on**.
3. Select this folder's `manifest.json`.

Temporary themes disappear when Firefox restarts.

## Install

Permanent installation requires a signed Firefox add-on package or distribution through Mozilla Add-ons. Signing and publishing are intentionally outside this repository.

## Remove / restore

Disable or remove DeepSeaFoam under **Add-ons and themes > Themes**, then enable the previous theme.

## Limitations

Firefox controls which chrome properties static themes can style, and some operating-system title-bar surfaces may remain platform-defined. The export intentionally avoids `userChrome.css` and all website-content injection.
