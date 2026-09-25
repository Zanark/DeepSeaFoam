# Telegram Desktop

## Scope

`DeepSeaFoam.tdesktop-theme` is a **native, plain-text, colors-only Telegram Desktop theme**, including the Windows desktop client. It covers core windows, menus/forms, chat lists, folder navigation, message bubbles/metadata, the composer and Telegram-rendered notifications.

Workspace and panel surfaces remain <img src="swatches/000f13.png" width="32" height="12" alt="Color swatch"> `#000F13` and <img src="swatches/001e26.png" width="32" height="12" alt="Color swatch"> `#001E26`. UI selection and outgoing bubbles use opaque composites of `derived.textSelection` over those surfaces, not terminal-only colors. Selected outgoing messages receive another selection layer. Warm links/selected text and brighter outgoing timestamps preserve readability on these fills.

Green presence, delivery and success indicators intentionally reuse `solid.document` as a host-specific mapping, not a new canonical role. Service messages explicitly use warm text rather than the dark foreground used on accent-filled buttons.

## Install

1. Record your previous built-in theme, or retain the original file for a custom theme. Record wallpaper settings separately.
2. Open **Settings > Chat Settings > Chat wallpaper > Choose from file**.
3. Select `DeepSeaFoam.tdesktop-theme`.
4. Select **Keep changes** before the confirmation countdown expires.

The wallpaper picker also accepts native theme files. Do not rename the export to `.txt` or use a mobile Telegram theme importer.

## Remove / restore

Select the previous built-in theme in Chat Settings, or import your previous custom theme through the same file picker. During initial application, choose **Revert** or let the countdown expire. Deleting the downloaded file alone does not reset an applied theme.

## Format and limitations

The file uses `key: #RRGGBB;` and alpha-last `#RRGGBBAA` values. ZIP packaging, metadata manifests and wallpaper images are not required. Unspecified keys use compiled fallback relationships/defaults, not automatic inheritance from a complete dark theme.

Existing or default wallpaper can override the apparent chat canvas; this file does not replace or transform it. Telegram may adapt service-background and history-scrollbar colors to that wallpaper. Media is not filtered or transformed.

Full calls, stories, premium and specialized media screens are not claimed. `notificationBg` styles Telegram custom notifications, not Windows-owned toast chrome. Format checks are not live-client visual QA; no installed settings are changed by generation.

## Pinned upstream references

- [Palette keys and fallback declarations](https://github.com/desktop-app/lib_ui/blob/ae492d4015ce35daf697053776c79786ea7d9282/ui/colors.palette). Upstream `| fallback` notation is build-time syntax, not imported-theme syntax.
- [Color/alias parser](https://github.com/telegramdesktop/tdesktop/blob/4d4da471fbee771c10e173a83c003ba1728989f1/Telegram/SourceFiles/window/themes/window_theme.cpp#L121-L231) and [ZIP/plain-text loading](https://github.com/telegramdesktop/tdesktop/blob/4d4da471fbee771c10e173a83c003ba1728989f1/Telegram/SourceFiles/window/themes/window_theme.cpp#L277-L367).
- [Native picker routing](https://github.com/telegramdesktop/tdesktop/blob/4d4da471fbee771c10e173a83c003ba1728989f1/Telegram/SourceFiles/settings/sections/settings_chat.cpp#L682-L705) and [wallpaper behavior](https://github.com/telegramdesktop/tdesktop/blob/4d4da471fbee771c10e173a83c003ba1728989f1/Telegram/SourceFiles/window/themes/window_theme.cpp#L1073-L1101).
