# Discord / BetterDiscord

## Scope

`DeepSeaFoam.theme.css` is **unofficial, optional CSS for existing modified desktop clients**, not a native Discord import. It recolors semantic backgrounds, text, controls and interaction states using refreshed and legacy variables. There are no remote resources, scripts, hashed component selectors, media filters or wallpaper.

This is the **BetterDiscord theme** requested for the collection; no second palette
or duplicate target is needed. The release's `DeepSeaFoam-BetterDiscord-<version>.theme.css`
and `DeepSeaFoam-Discord-<version>.theme.css` are byte-identical alternatives.
Install **one**, not both; the in-client theme name is DeepSeaFoam.

BetterDiscord and Vencord are third-party client modifications. Their use may violate [Discord's terms](https://discord.com/terms) and is **not account-risk-free**. Neither Discord endorsement nor BetterDiscord marketplace approval is claimed. BetterDiscord's listing guidelines exclude automatically generated themes and simple variable-only recolors.

## Official option: manual approximation

1. Open **User Settings > Appearance** and record your previous theme.
2. With Nitro, choose **Color Themes > Custom Theme**, then the dark palette.
3. Try one color: panel `#001E26`, or base `#000F13`. Prefer a uniform background rather than decorative gradient stops. Adjust intensity as needed and select **Apply**.

Discord derives the result; this does not reproduce every DeepSeaFoam surface or foreground. Without Nitro, a built-in dark theme is only an approximation. Native theme sharing uses Discord's **Share** control; this repository does not provide a native share URL or import file.

## Optional install: an existing modified client

Back up existing custom CSS, choose a dark appearance, and disable competing recolor themes while evaluating this file.

- **BetterDiscord:** open **Themes**, open the themes folder, copy the file there, and enable it. The usual Windows folder is `%APPDATA%\BetterDiscord\themes`.
- **Vencord desktop:** open **Themes > Local Themes > Open Themes Folder**, copy the file there, choose **Load missing Themes** if needed, and enable it.

These instructions do not install a modification. Stock Discord cannot load this CSS file.

## Remove / restore

Disable DeepSeaFoam in the same theme settings, then remove only its copied file. Re-enable the previous theme/custom CSS and restore the previous Appearance settings. For the official manual option, simply choose the previous built-in or custom theme.

## Limitations

Discord's selectors and variables are internal and can change. Individual components and user-authored profile/role colors can remain independently styled. Green presence/success indicators deliberately reuse `solid.document`; this does not redefine the canonical document role. Warm links remain readable on tinted surfaces. Important semantic-variable overrides take precedence over the client defaults; disable conflicting themes instead of stacking recolors.

This is a source-informed export, not live-client QA. Generating it changes no installed Discord settings.

## References

- [Official appearance, Nitro customization and sharing](https://support.discord.com/hc/en-us/articles/207260127).
- [BetterDiscord structure](https://docs.betterdiscord.app/themes/introduction/structure), [local theme folder](https://docs.betterdiscord.app/themes/introduction/quick-start), and [listing guidelines](https://docs.betterdiscord.app/themes/publishing/guidelines).
- [Pinned BetterDiscord theme loader](https://github.com/BetterDiscord/BetterDiscord/blob/94526616ef5d8ff21f56bb08020c78eb77621bbc/src/betterdiscord/modules/thememanager.ts) recognizes `.theme.css` files; the source carries name, author, description, version and website metadata.
- [Vencord local-theme implementation](https://github.com/Vendicated/Vencord/blob/main/src/components/settings/tabs/themes/LocalThemesTab.tsx) and [metadata parser](https://github.com/Vendicated/Vencord/blob/main/src/main/themes/index.ts).
- [Refreshed/legacy variable implementation](https://github.com/AvengeMedia/DankMaterialShell/blob/master/quickshell/matugen/templates/vesktop.css) and [Onyx/midnight selectors](https://github.com/LuckFire/amoled-cord/blob/HEAD/src/amoled-cord.css). These are community evidence, not an official styling API.
