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
| VS Code | [Visual Studio Marketplace](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) | Owner confirmed `zanark` and chose manual browser upload without a PAT. Upload kit is generated under `dist\marketplace\vscode`; not submitted by automation. |
| Visual Studio | [Visual Studio Marketplace](https://learn.microsoft.com/en-us/visualstudio/extensibility/walkthrough-publishing-a-visual-studio-extension) | `.vstheme` is source, not an installable IDE VSIX. Version-specific packaging and runtime coverage are required. |
| Obsidian | [Community directory](https://docs.obsidian.md/Themes/App+themes/Submit+your+theme) | Current route is community.obsidian.md, not the historical theme-list PR. Needs root metadata/license, matching version tag and separate manifest/theme release attachments, real screenshot, account linking and owner policy acceptance. |
| Windows Terminal | [Community gallery](https://github.com/atomcorp/themes#contributing) | Preparing a contribution; this is not an official Microsoft marketplace. |
| Firefox | [AMO static themes](https://extensionworkshop.com/documentation/publish/submitting-an-add-on/) | Needs Mozilla account/agreement and owner-approved listing license. Static-theme API licenses use CC choices or All Rights Reserved, not arbitrary MIT/custom licenses. |
| Discord | [BetterDiscord guidelines](https://docs.betterdiscord.app/themes/publishing/guidelines) | Existing generated variable-only CSS is ineligible. Do not disguise it or submit it. Native Discord theme sharing is a different, limited feature. |
| Telegram Desktop | [Official theme editor](https://core.telegram.org/themes) | Logged-in owner can create a cloud theme/share link. Uploading the file alone does not create a managed cloud theme. No app-theme marketplace submission. |
| Slack | [Native sharing](https://slack.com/help/articles/205166337-Change-your-Slack-theme) | Theme Colors -> Share, not Slack Marketplace. A CSV preset is not a Slack app. |
| Chrome / Edge | [Chrome Web Store](https://developer.chrome.com/docs/webstore/publish) | Chrome needs an eligible account, owner declarations and mandatory store artwork. Edge can use Chromium themes; separate third-party Edge Add-ons theme eligibility is not established. |
| JetBrains | [Marketplace](https://plugins.jetbrains.com/docs/marketplace/uploading-a-new-plugin.html) | First upload is manual; requires vendor/account decisions, plugin icon, real IDE screenshots, licensing and compatibility review. |
| Sublime Text | [Package Control](https://github.com/sublimehq/package_control_channel) | Preparing a root-level distribution package and channel contribution; monorepo subdirectory is not a package repository. |
| Alacritty | [Official-project theme collection](https://github.com/alacritty/alacritty-theme#contributing) | Collection does not accept submissions from theme authors. Wait for genuine independent community interest. |

## Credentials and owner decisions

### VS Code manual-upload kit

Run `npm run package:release`, then use
`dist\marketplace\vscode\DeepSeaFoam-VSCode-0.5.1.vsix`.
The folder also contains the [upload instructions](../publishing/vscode/UPLOAD.txt),
[listing copy](../publishing/vscode/LISTING.txt) and the original seaweed/foam
mark rendered as a 128px PNG. The VSIX already contains its manifest, theme,
README, icon and MIT license. A screenshot is optional for this store; the
website study is not misrepresented as an actual VS Code screenshot.

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
