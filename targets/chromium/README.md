# Chrome / Edge

## Scope

`manifest.json` is a native, color-only Manifest V3 Chromium theme. It uses the near-black teal frame, inactive tabs and address field; blue-green toolbar/active tab; mist text; and warm active-tab text. It contains no scripts, website CSS, permissions, remote images or background wallpaper.

Chrome supports a finite color table, not every browser surface. Edge shares the Chromium foundation, but its sidebar, vertical tabs, New Tab Page and other Edge-specific surfaces are not promised to match. Incognito-specific colors are left to the browser. This is an unpacked source theme, not a signed store listing.

## Install

1. Download and extract `DeepSeaFoam-Chromium-<version>.zip`, or use this target directory.
2. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
3. Enable **Developer mode**.
4. Select **Load unpacked**, then the directory containing `manifest.json`.

Keep that directory in place while using the unpacked theme. The ZIP is not itself the folder to select. Enterprise policy may prohibit unpacked extensions; do not bypass your organization's policy.

## Remove / restore

Switch back to the previous theme, or remove DeepSeaFoam through the browser's extension/theme management and reset the appearance to its default.

## Format references

- [Chrome themes: native MV3 manifest and RGB arrays](https://developer.chrome.com/docs/extensions/develop/ui/themes).
- [Chrome: load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked).
- [Microsoft: sideload an Edge extension](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading).
- [Chromium's actual writable color table and parser](https://github.com/chromium/chromium/blob/main/chrome/browser/themes/browser_theme_pack.cc).

The generated arrays are opaque RGB values. Firefox-only keys are not copied into this manifest. Format and package checks are not a claim of visual validation in every Chrome or Edge version.
