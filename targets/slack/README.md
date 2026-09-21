# Slack

## Scope

`DeepSeaFoam.txt` is a **native, limited custom-color preset**, not a complete client theme or CSS modification. It contains four comma-separated `#RRGGBB` values and a final newline:

| Position | Slack role | Palette mapping |
| --- | --- | --- |
| 1 | System navigation | Panel `#001E26` |
| 2 | Selected items | Accent `#00A591` |
| 3 | Presence indication | Document `#45D072` |
| 4 | Notifications | Error `#E84A5F` |

Presence uses document green as a deliberate host-specific mapping. The string contains no legacy eight/ten-color fields, booleans or dark-mode flag.

## Install

1. Copy your previous custom theme with **Theme Colors > Share**, or record the selected built-in theme.
2. Open your profile menu, then **Preferences > Appearance**. Set **Color mode > Dark** separately.
3. Open **Custom theme**. Beside **Theme Colors**, choose **Import theme**.
4. Paste the contents of `DeepSeaFoam.txt` and select **Apply**; save if prompted. The current help labels this field **Paste your legacy theme colors**, even though this export uses the modern four-slot format.
5. For solid surfaces, disable **Window gradient** manually if desired. **Darker sidebars** is also a separate preference.

To share an applied theme, use **Share** beside Theme Colors and paste it into a conversation. Recipients can choose **Apply Slack theme**.

## Remove / restore

Import your saved previous string through Appearance, or select the previous built-in theme. Restore color mode, Window gradient and Darker sidebars separately. There is no plugin or CSS file to remove.

## Limitations and references

Slack derives/maps additional colors; exact hex rendering and a full-client recolor are not guaranteed. Chat text, message backgrounds, controls and borders are not independently specified by this string. Dark mode is device-specific.

Official documentation verifies the native workflow but does not publish a normative CSV schema. Four-slot order comes from current community generator code and distributed themes. No live-client import/share round-trip is claimed; generation changes no Slack settings.

- [Official theme controls, import, sharing and separate preferences](https://slack.com/help/articles/205166337-Change-your-Slack-theme?locale=en-US).
- [Official dark-mode instructions](https://slack.com/help/articles/360019434914-Use-dark-mode-in-Slack).
- [Community four-slot generator](https://github.com/michaelfromorg/more-slackthemes/blob/main/src/lib/theme-utils.ts#L97-L119) and [independent four-color artifact](https://github.com/codigrate/slack-themes/blob/HEAD/nature/everest-theme/everest-theme.txt).
