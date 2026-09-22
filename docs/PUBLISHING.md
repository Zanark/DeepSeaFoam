# Theme publication

GitHub releases provide downloadable exports. They do not establish marketplace
approval. This page distinguishes actual stores, community directories and
native sharing, based on publisher documentation reviewed on 2026-09-22.

Original theme files and generator code are [MIT-licensed](../licenses/MIT.txt).
[License scope](../LICENSE) excludes third-party artwork and marks. The same
license choice cannot be assumed valid for every store's listing-license menu.

## Current routes

| Target | Route | Current boundary |
| --- | --- | --- |
| VS Code | [Live Marketplace listing](https://marketplace.visualstudio.com/items?itemName=zanark.deepseafoam-theme) | **0.5.1 is public.** Owner uploaded through the browser without a PAT; verification completed and the public listing resolves. |
| Visual Studio | [Visual Studio Marketplace](https://learn.microsoft.com/en-us/visualstudio/extensibility/walkthrough-publishing-a-visual-studio-extension) | `.vstheme` is source, not an installable IDE VSIX. Version-specific packaging and runtime coverage are required. |
| Obsidian | [Community directory](https://docs.obsidian.md/Themes/App+themes/Submit+your+theme) | Current route is community.obsidian.md, not the historical theme-list PR. Needs root metadata/license, matching version tag and separate manifest/theme release attachments, real screenshot, account linking and owner policy acceptance. |
| Windows Terminal | [Community gallery PR #115](https://github.com/atomcorp/themes/pull/115) | Submitted, open and awaiting review. Not yet a live gallery entry; this is not an official Microsoft marketplace. |
| Firefox | [AMO static themes](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/) | Needs Mozilla account/agreement and owner-approved listing license. Static-theme API licenses use CC choices or All Rights Reserved, not arbitrary MIT/custom licenses. |
| Discord / BetterDiscord | [BetterDiscord guidelines](https://docs.betterdiscord.app/themes/publishing/guidelines) | Local `.theme.css` installation is supported; the named release alias is identical. Existing generated variable-only CSS is ineligible for the directory. Do not disguise it or submit it. |
| Telegram Desktop | [Official theme editor](https://core.telegram.org/themes) | Logged-in owner can create a cloud theme/share link. Uploading the file alone does not create a managed cloud theme. No app-theme marketplace submission. |
| Slack | [Native sharing](https://slack.com/help/articles/205166337-Change-your-Slack-theme) | Theme Colors -> Share, not Slack Marketplace. A CSV preset is not a Slack app. |
| Chrome / Edge | [Chrome Web Store](https://developer.chrome.com/docs/webstore/publish) | Chrome needs an eligible account, owner declarations and mandatory store artwork. Edge can use Chromium themes; separate third-party Edge Add-ons theme eligibility is not established. |
| JetBrains | [Marketplace](https://plugins.jetbrains.com/docs/marketplace/uploading-a-new-plugin.html) | First upload is manual; requires vendor/account decisions, plugin icon, real IDE screenshots, licensing and compatibility review. |
| Sublime Text | [Package Control PR #9570](https://github.com/sublimehq/package_control_channel/pull/9570) | Submitted and awaiting review. [Distribution repository/tag 0.5.1](https://github.com/Zanark/DeepSeaFoam-SublimeText/tree/0.5.1) is public; channel acceptance and upstream workflow approval are pending. |
| Alacritty | [Official-project theme collection](https://github.com/alacritty/alacritty-theme#contributing) | Collection does not accept submissions from theme authors. Wait for genuine independent community interest. |
| Monkeytype | [Built-in preset PR #8421](https://github.com/monkeytypegame/monkeytype/pull/8421) / [native share guide](../targets/monkeytype/README.md) | **Submitted and awaiting review.** Native colors-only sharing works without login now; the built-in preset is not yet merged or deployed. The main upstream CI workflow requires maintainer approval. |
| Notepad++ | [Native XML install](../targets/notepad-plus-plus/README.md) | Local Style Configurator theme; no new upstream listing submitted. |
| Zsh | [Prompt source / optional Oh My Zsh](../targets/zsh/README.md) | Local dependency-free prompt. No framework installation or upstream acceptance claimed. |
| rofi | [Native Rasi install](../targets/rofi/README.md) | Local theme file, not a marketplace listing. |
| Xfce4 Terminal | [Native preset install](../targets/xfce4-terminal/README.md) | Local Scheme file; no desktop-wide theme or store registration. |
| Termux | [Native colors.properties](../targets/termux/README.md) | Manual colors-file copy; no paid styling add-on or submission needed. |
| GitHub Pages | [Static/Jekyll starter](../targets/github-pages/README.md) | Copy into your own site. Not a registered theme-picker entry, gem or root remote_theme repository. |
| Godot Engine | [Native .tet import](../targets/godot/README.md) | Script-editor colors, not a runtime Theme resource or Asset Library submission. |
| Nova Launcher | [Manual recipe](../targets/nova-launcher/README.md) | No documented safe colors-only import. No APK, backup, icon pack or marketplace listing is supplied. |

### Monkeytype submission boundary

The [generated guide](../targets/monkeytype/README.md) supplies safe colors-only
installation and restoration, not a full-settings import. Built-in contributions
use `frontend/src/ts/constants/themes.ts` plus
`packages/schemas/src/themes.ts` at the pinned revision; no `_list.json` or CSS
is needed. The older `_list` wording in the general contribution guidelines is
not the current format in `docs/THEMES.md` and the registry.

[Theme guidelines](https://github.com/monkeytypegame/monkeytype/blob/91bd24bb8513785c7364cbea29296ff7adafac41/docs/CONTRIBUTING.md#theme-guidelines)
require a distinctive, readable theme, near-white/black text and both flip and
colorful configurations. The PR template requests a human-written description
and screenshots of all four combinations. [PR #8421](https://github.com/monkeytypegame/monkeytype/pull/8421)
is open, non-draft and unmerged, from `Zanark:add-deepseafoam` at
`96639312a4ebfdc75308047710eec297d342a827`. It changes only the enum and
registry (two files, thirteen additions), and includes the owner's supplied
description, the showcase link and four actual Monkeytype custom-theme screenshots.

The generated share URL was exercised on the actual site in an unsigned-in,
disposable Edge context: typed/untyped/error/extra/caret colors matched in all
four modes, unrelated settings were preserved and the former preset restored.
The upstream theme asset check, formatter and seven existing theme-component
tests passed locally after building workspace dependencies. This is not a
physical-device, every-browser or production built-in acceptance claim.
Upstream [workflow 35719159121](https://github.com/monkeytypegame/monkeytype/actions/runs/35719159121)
is `action_required`, not passing CI; maintainer approval and review remain pending.

## Credentials and owner decisions

### VS Code manual-upload kit

Version **0.5.1 is already public**. The kit records that submission; future
updates need a higher version rather than replacing or resubmitting 0.5.1.

The historical 0.5.1 kit remains at
`dist\marketplace\vscode\DeepSeaFoam-VSCode-0.5.1.vsix`; do not resubmit it.
For the prepared 0.7.0 update, run `npm run package:release`, then use
`dist\releases\0.7.0\marketplace\vscode\DeepSeaFoam-VSCode-0.7.0.vsix`.
The folder also contains the [upload instructions](../publishing/vscode/UPLOAD.txt),
[listing copy](../publishing/vscode/LISTING.txt) and the original seaweed/foam
mark rendered as a 128px PNG. The VSIX already contains its manifest, theme,
README, icon and MIT license. A screenshot is optional for this store; the
website study is not misrepresented as an actual VS Code screenshot.

The packager recreates only `dist\releases\<version>\`, never the whole `dist`
tree. Other versions and the Instagram delivery remain untouched. Current
packages include `DeepSeaFoam-Monkeytype-0.7.0.zip` with the payload, link,
guide and license at the archive root, plus eight new target exports and an
identical BetterDiscord alias. Nova's ZIP is a manual guide, not an importer.
Packaging does not publish a GitHub
release or update a marketplace listing.

Never put tokens in the repository, scripts, release notes, screenshots, issue
bodies or chat. Use a publisher tool's local secure login or approved secret
storage. A GitHub account does not authorize unrelated marketplace accounts.
For VS Code, `vsce login zanark` accepts the publisher PAT locally; the PAT
needs Marketplace (Manage) permission.

The owner handles any unaccepted agreements, paid registration, trader
declarations and public contact information. Do not infer legal status from
the fact that a theme is free. Submission or successful upload is not approval.

## Important source distinctions

- [AMO theme license choices](https://mozilla.github.io/addons-server/topics/api/licenses.html#theme-licenses):
  do not silently relicense MIT files as an exclusive All Rights Reserved work.
- [Chrome required images](https://developer.chrome.com/docs/webstore/images):
  package/store icon, promotional tile and screenshot are distinct requirements.
- [JetBrains approval guidelines](https://plugins.jetbrains.com/docs/marketplace/jetbrains-marketplace-approval-guidelines.html):
  theme screenshots must show the actual product, not the website study.
- [Edge team's explicit third-party-theme answer](https://github.com/microsoft/MicrosoftEdge-Extensions/discussions/96#discussioncomment-6415729):
  this is dated evidence, not proof that policy can never change. Confirm current
  eligibility before attempting a separate Edge listing.

Keep native source in this repository. Distribution mirrors must record their
source revision and match the generated theme; they are not independently
maintained palettes. Preserve immutable published versions, required license
notices and accurate minimum-version claims.

The Sublime distribution is pinned to source commit
`bd41af252ce559b082ef6a0a3d2fdeea32039160`. Its channel PR leaves the human
author/maintainer declaration unchecked; the owner must participate in review.
Upstream workflow approval is controlled by channel maintainers, not this
repository. Neither community PR was merged as part of submission.
