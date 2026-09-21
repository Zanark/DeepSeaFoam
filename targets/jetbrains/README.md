# JetBrains IDEs

## Scope

This is a resource-only UI-theme plugin for **JetBrains IDEs 2025.3 and newer** (platform build 253+). It inherits **Islands Dark**, overrides chrome colors, and includes an editor scheme with a Darcula fallback. It does not contain Java/Kotlin code, change fonts or modify project files.

Near-black teal is used for editing and recessed fields; blue-green panels surround them. Selection uses the core translucent seafoam composited over the relevant surface. Generic syntax follows DeepSeaFoam's core and Solarized heritage mappings. Selected native icon roles map deliberately to accent, error and document-green colors; arbitrary third-party artwork is not recolored.

The bundled editor scheme covers common language roles, diagnostics, gutters, guides and VCS indicators. Language plugins and unlisted UI controls can retain inherited styling. The IDE console gets terminal foreground/error colors, but this is not a claim that every embedded terminal or plugin implements the complete ANSI extension.

## Install

1. Download `DeepSeaFoam-JetBrains-<version>.jar` from the release.
2. Open **Settings > Plugins**, then the gear menu and **Install Plugin from Disk**.
3. Select the JAR and restart if prompted.
4. Choose **Appearance & Behavior > Appearance > Theme > DeepSeaFoam**.

If an independently selected editor scheme remains active, choose DeepSeaFoam under **Editor > Color Scheme** as well. Do not rename the JSON source to `.jar`: the release artifact is a ZIP-format JAR with the actual descriptor and resources at its root.

## Package layout

```text
META-INF/plugin.xml
DeepSeaFoam.theme.json
DeepSeaFoam.xml
```

`npm run package:release` creates this JAR from `resources`. The provider ID and plugin ID are stable; there is no Marketplace listing or signing claim.

## Remove / restore

Select the previous UI theme and editor scheme, then uninstall DeepSeaFoam through Plugins. Restart if requested.

## Format references

- [JetBrains theme structure](https://plugins.jetbrains.com/docs/intellij/theme-structure.html).
- [UI keys, named colors, alpha and icon palettes](https://plugins.jetbrains.com/docs/intellij/themes-customize.html).
- [Supporting Islands themes and the 2025.3 boundary](https://plugins.jetbrains.com/docs/intellij/supporting-islands-theme.html).
- [Theme extras, including editor schemes](https://plugins.jetbrains.com/docs/intellij/themes-extras.html).
- [Install a plugin from disk](https://www.jetbrains.com/help/idea/managing-plugins.html#install_plugin_from_disk).

These are declarative exports and an installable resource package, not proof of visual validation inside every JetBrains IDE or plugin combination.
