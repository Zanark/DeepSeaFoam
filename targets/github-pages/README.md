# GitHub Pages

DeepSeaFoam **0.7.0** supplies a complete static HTML/CSS starter and
an optional Jekyll layout. It themes **your website**, not github.com or the
GitHub Pages settings UI. It is not a registered theme-picker entry, Ruby gem
or root-level remote-theme repository.

## Static install

1. Back up your site's current source and record its publishing source.
2. For a **new site**, copy `index.html`, `assets` and `.nojekyll` from this
   target into the directory your Pages workflow publishes. Include LICENSE
   when redistributing the theme.
3. Replace the example content, navigation and footer with your own. The CSS
   path is relative and works for both account sites and project subpaths.
4. Use your repository's existing Pages deployment workflow. GitHub recommends
   Actions for deployment; this kit does not enable publishing automatically.

For an **existing static site**, do not overwrite its index. Copy the stylesheet,
link it from your page, add `class="deepseafoam"` to the body, and adopt only the
`dsf-*` component classes you need. Unrelated CSS can override this theme.

## Optional Jekyll install

1. Copy only `assets/css/deepseafoam.css` and
   `_layouts/deepseafoam.html` into your existing Jekyll source.
2. Merge the relevant keys from `_config.example.yml`; retain your existing
   plugins, collections and other defaults. Set the correct `baseurl` for a
   project site. The layout uses Jekyll's `relative_url` filter.
3. Select `layout: deepseafoam` in a page's YAML front matter, or add the
   demonstrated scoped default without deleting existing defaults.
4. **Do not copy the static demo index or .nojekyll into Jekyll source.**
   If your branch-based Jekyll source already has .nojekyll, resolve that
   conflicting deployment setup deliberately before expecting a Jekyll build.
5. Build using your existing Jekyll toolchain. No new plugin is required.

The static example runs directly in a browser. The optional Liquid layout
requires Jekyll; viewing its raw source as HTML is not a Jekyll runtime test.

## Remove / restore

Restore your prior body class, stylesheet links, layout choices and configuration
from the backup. Remove only the files this theme added. Do not delete your
content, replace an entire configuration, or reset Git history to remove a theme.

## Mapping and limits

Content uses `#000F13`; header, footer and panels use
`#001E26`. Focus/actions use `#00A591`, ordinary text
`#93A1A1`, headings `#EEE8D5`, and native RGBA selection
`#00A59126`. Rouge/Pygments token classes receive a limited
syntax mapping; unsupported token classes inherit ordinary text.

No script, external asset, font download, image filter or app-setting change is
included. Pictures retain their pixels; responsive sizing preserves proportions.
Third-party widgets and pre-existing style rules remain outside this stylesheet.
The theme styles rendered document text intentionally; it does not rewrite
Markdown, code examples, image files or exported content.

## References

- [GitHub Pages static-site hosting](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
- [Creating a Pages site, static/Jekyll sources and deployment](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/creating-a-github-pages-site-with-jekyll)
- [Jekyll layouts](https://jekyllrb.com/docs/layouts/)
- [Jekyll configuration](https://jekyllrb.com/docs/configuration/options/)
- [Jekyll Liquid filters](https://jekyllrb.com/docs/liquid/filters/)
