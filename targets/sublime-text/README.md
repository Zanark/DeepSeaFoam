# Sublime Text

## Scope

`DeepSeaFoam.sublime-color-scheme` is a native **Sublime Text 4 color scheme** for editor text, syntax, selections, gutter, guides, search, diff indicators and minihtml popups. It uses near-black teal editing surfaces, seafoam interaction, warm emphasis and the same syntax-role palette as the other editors.

This is **not a complete `.sublime-theme` UI replacement**. Sidebar, tabs and buttons are controlled by the chosen UI theme. Pair the scheme with Sublime's built-in **Adaptive** theme for related chrome; its derived colors need not equal DeepSeaFoam's panel value exactly.

## Install

1. Open **Preferences > Browse Packages**.
2. Put the downloaded scheme in the **User** directory, named `DeepSeaFoam.sublime-color-scheme`.
3. Choose DeepSeaFoam from **Preferences > Select Color Scheme**, or merge this single setting into your existing preferences:

```json
"color_scheme": "DeepSeaFoam.sublime-color-scheme"
```

Optionally choose **Adaptive** from the UI-theme picker. Do not replace your complete settings file with this one property. The resource uses its filename, not a package-qualified path.

## Remove / restore

Choose the previous color scheme (and UI theme, if changed), then remove the file from User. Restore only the settings you changed.

## Limitations and references

Syntax coverage depends on the installed syntax definition's scopes. Some global colors only appear when the corresponding feature is enabled, such as line highlighting. Minihtml CSS does not modify stored files or apply arbitrary CSS across the whole application.

- [Official color-scheme format, RGBA values and globals](https://www.sublimetext.com/docs/color_schemes.html).
- [Scope naming and minimum coverage](https://www.sublimetext.com/docs/scope_naming.html#minimal-scope-coverage).
- [Selectors: commas mean alternatives, spaces mean ancestry](https://www.sublimetext.com/docs/selectors.html).
- [Separate UI theme format](https://www.sublimetext.com/docs/themes.html).

Export checks do not establish visual validation in every Sublime version or package combination.
