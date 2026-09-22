import { composite } from "./colors.mjs";

export function addWebTheme({ palette, add, solid, overlay, derived, heritage }) {
  const escape = value => value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
  const name = escape(palette.name);
  const css = `/* Generated from palette/deepseafoam.json. Original theme: MIT; see LICENSE. */
.deepseafoam {
  --dsf-base: ${solid("base")};
  --dsf-panel: ${solid("panel")};
  --dsf-text: ${solid("text")};
  --dsf-faint: ${solid("faintText")};
  --dsf-warm: ${solid("warm")};
  --dsf-accent: ${solid("accent")};
  --dsf-border: ${solid("border")};
  --dsf-separator: ${overlay("separator")};
  --dsf-selection: ${derived("textSelection")};
  --dsf-hover: ${composite(overlay("hover"), solid("panel"))};
  --dsf-error: ${solid("error")};
  --dsf-warning: ${solid("warning")};
  --dsf-document: ${solid("document")};
  color-scheme: dark;
  margin: 0;
  background: var(--dsf-base);
  color: var(--dsf-text);
  font: 1rem/1.65 system-ui, -apple-system, "Segoe UI", sans-serif;
  overflow-wrap: anywhere;
}
.deepseafoam *, .deepseafoam *::before, .deepseafoam *::after { box-sizing: border-box; }
.deepseafoam ::selection { background: var(--dsf-selection); }
.deepseafoam a { color: var(--dsf-accent); text-underline-offset: .2em; }
.deepseafoam a:hover { color: var(--dsf-warm); }
.deepseafoam :focus-visible { outline: 2px solid var(--dsf-accent); outline-offset: 4px; }
.deepseafoam h1, .deepseafoam h2, .deepseafoam h3, .deepseafoam strong { color: var(--dsf-warm); }
.deepseafoam h1, .deepseafoam h2, .deepseafoam h3 { line-height: 1.2; }
.deepseafoam h1 { font-size: clamp(2rem, 6vw, 3.6rem); letter-spacing: -.04em; }
.deepseafoam .dsf-shell { width: min(72rem, calc(100% - 3rem)); margin-inline: auto; }
.deepseafoam .dsf-header, .deepseafoam .dsf-footer { background: var(--dsf-panel); }
.deepseafoam .dsf-header { border-bottom: 1px solid var(--dsf-separator); }
.deepseafoam .dsf-header .dsf-shell { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; padding-block: 1.3rem; }
.deepseafoam .dsf-brand { color: var(--dsf-warm); font-weight: 700; text-decoration: none; }
.deepseafoam nav { display: flex; flex-wrap: wrap; gap: 1.25rem; }
.deepseafoam nav a { color: var(--dsf-text); }
.deepseafoam .dsf-content { min-height: 65vh; padding-block: 3.5rem; }
.deepseafoam .dsf-content > :first-child { margin-top: 0; }
.deepseafoam .dsf-footer { border-top: 1px solid var(--dsf-separator); padding-block: 1.5rem; color: var(--dsf-faint); }
.deepseafoam .dsf-skip { position: absolute; top: .5rem; left: .5rem; z-index: 10; padding: .65rem 1rem; background: var(--dsf-panel); transform: translateY(-180%); }
.deepseafoam .dsf-skip:focus { transform: none; }
.deepseafoam .dsf-panel { background: var(--dsf-panel); border: 1px solid var(--dsf-separator); border-radius: .4rem; padding: 1.5rem; margin-block: 1.5rem; }
.deepseafoam .dsf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr)); gap: 1.5rem; }
.deepseafoam .dsf-grid > * { min-width: 0; }
.deepseafoam .dsf-button, .deepseafoam button { display: inline-block; padding: .7rem 1.1rem; border: 1px solid var(--dsf-accent); border-radius: .3rem; background: var(--dsf-accent); color: var(--dsf-base); font: inherit; font-weight: 650; text-decoration: none; cursor: pointer; }
.deepseafoam .dsf-button:hover, .deepseafoam button:hover { background: var(--dsf-text); color: var(--dsf-base); }
.deepseafoam input, .deepseafoam textarea, .deepseafoam select { max-width: 100%; border: 1px solid var(--dsf-border); border-radius: .25rem; padding: .6rem; background: var(--dsf-base); color: var(--dsf-text); font: inherit; }
.deepseafoam label { display: block; margin-block: .75rem; }
.deepseafoam blockquote { margin-inline: 0; padding: .6rem 1.3rem; border-left: 3px solid var(--dsf-accent); background: var(--dsf-panel); }
.deepseafoam code, .deepseafoam pre { font-family: ui-monospace, Consolas, monospace; }
.deepseafoam code { color: var(--dsf-warm); }
.deepseafoam pre { overflow-x: auto; padding: 1.25rem; border: 1px solid var(--dsf-separator); background: var(--dsf-base); }
.deepseafoam .dsf-table { overflow-x: auto; }
.deepseafoam table { width: 100%; border-collapse: collapse; }
.deepseafoam th, .deepseafoam td { text-align: left; padding: .8rem; border-bottom: 1px solid var(--dsf-separator); }
.deepseafoam th { background: var(--dsf-panel); color: var(--dsf-warm); }
.deepseafoam hr { border: 0; border-top: 1px solid var(--dsf-separator); margin-block: 2rem; }
.deepseafoam img, .deepseafoam video { max-width: 100%; height: auto; }
.deepseafoam details { padding: 1rem; border: 1px solid var(--dsf-separator); background: var(--dsf-panel); }
.deepseafoam summary { cursor: pointer; color: var(--dsf-warm); }
.deepseafoam .dsf-notice { padding: 1rem 1.25rem; border-left: 3px solid var(--dsf-warning); background: var(--dsf-panel); color: var(--dsf-warm); }
.deepseafoam .dsf-error { border-color: var(--dsf-error); color: var(--dsf-warm); }
.deepseafoam .dsf-document { border-color: var(--dsf-document); }
.deepseafoam .highlight .c, .deepseafoam .highlight .c1, .deepseafoam .highlight .cm { color: var(--dsf-faint); }
.deepseafoam .highlight .k, .deepseafoam .highlight .kd, .deepseafoam .highlight .kn { color: var(--dsf-document); }
.deepseafoam .highlight .s, .deepseafoam .highlight .s1, .deepseafoam .highlight .s2 { color: var(--dsf-accent); }
.deepseafoam .highlight .m, .deepseafoam .highlight .mi, .deepseafoam .highlight .mf { color: var(--dsf-warning); }
.deepseafoam .highlight .nf { color: var(--dsf-warm); }
.deepseafoam .highlight .nc, .deepseafoam .highlight .nt { color: ${heritage("blue")}; }
.deepseafoam .highlight .o, .deepseafoam .highlight .na { color: ${heritage("violet")}; }
.deepseafoam .highlight .sr, .deepseafoam .highlight .cp { color: ${heritage("orange")}; }
.deepseafoam .highlight .se { color: ${heritage("magenta")}; }
.deepseafoam .highlight .err { color: var(--dsf-base); background: var(--dsf-error); }
@media (max-width: 40rem) {
  .deepseafoam .dsf-shell { width: calc(100% - 2rem); }
  .deepseafoam .dsf-content { padding-block: 2rem; }
}
`;
  add("targets/github-pages/assets/css/deepseafoam.css", css);
  add("targets/github-pages/.nojekyll", "");
  add("targets/github-pages/index.html", `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${name} static website theme and GitHub Pages starter.">
  <title>${name} - your site</title>
  <link rel="stylesheet" href="assets/css/deepseafoam.css">
</head>
<body class="deepseafoam">
  <a class="dsf-skip" href="#content">Skip to content</a>
  <header class="dsf-header"><div class="dsf-shell">
    <a class="dsf-brand" href="./">${name}</a>
    <nav aria-label="Main navigation"><a href="#overview">Overview</a><a href="#reference">Reference</a></nav>
  </div></header>
  <main id="content" class="dsf-shell dsf-content" tabindex="-1">
    <section id="overview">
      <h1>Your content. A quieter frame.</h1>
      <p>A portable, flat-surface theme for a site you host on GitHub Pages. Replace this example with your own work.</p>
      <a class="dsf-button" href="#reference">Explore the components</a>
    </section>
    <div class="dsf-grid">
      <section class="dsf-panel"><h2>A place to write</h2><p>Near-black content surfaces, blue-green structure and warm headings. Ordinary links retain their underline.</p></section>
      <section class="dsf-panel"><h2>A place to build</h2><p>No JavaScript, external fonts, analytics, ocean scenery or runtime library is needed by this starter.</p></section>
    </div>
    <section id="reference">
      <h2>Component reference</h2>
      <blockquote>Use panels for structure, not decoration. Keep images and documents in their own colors.</blockquote>
      <pre><code>const workspace = '${solid("base")}';
const panels = '${solid("panel")}';
const focus = '${solid("accent")}';</code></pre>
      <div class="dsf-table"><table><caption>Surface hierarchy</caption><thead><tr><th scope="col">Role</th><th scope="col">Color</th></tr></thead><tbody><tr><th scope="row">Content</th><td><code>${solid("base")}</code></td></tr><tr><th scope="row">Structure</th><td><code>${solid("panel")}</code></td></tr></tbody></table></div>
      <label for="sample-note">Local component example - not submitted anywhere</label><input id="sample-note" type="text" placeholder="Your text stays in this page">
      <p class="dsf-notice">A notice uses a small warning boundary, not a bright full-page wash.</p>
      <p class="dsf-notice dsf-error">An error keeps its message warm and its boundary distinct.</p>
      <details><summary>Can this work with Jekyll?</summary><p>Yes. Use the optional layout and merge the example settings into your existing site, as described in README.md.</p></details>
    </section>
  </main>
  <footer class="dsf-footer"><div class="dsf-shell">${name} ${escape(palette.version)}. Original theme code: MIT. Replace this footer with your own site information.</div></footer>
</body>
</html>
`);
  add("targets/github-pages/_layouts/deepseafoam.html", `<!doctype html>
<html lang="{{ page.lang | default: site.lang | default: 'en' | escape }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ page.title | default: site.title | escape }}</title>
  <meta name="description" content="{{ page.description | default: site.description | escape }}">
  <link rel="stylesheet" href="{{ '/assets/css/deepseafoam.css' | relative_url }}">
</head>
<body class="deepseafoam">
  <a class="dsf-skip" href="#content">Skip to content</a>
  <header class="dsf-header"><div class="dsf-shell">
    <a class="dsf-brand" href="{{ '/' | relative_url }}">{{ site.title | escape }}</a>
    {% if site.deepseafoam_nav %}
    <nav aria-label="Main navigation">{% for item in site.deepseafoam_nav %}<a href="{{ item.url | relative_url | escape }}">{{ item.title | escape }}</a>{% endfor %}</nav>
    {% endif %}
  </div></header>
  <main id="content" class="dsf-shell dsf-content" tabindex="-1">{{ content }}</main>
  <footer class="dsf-footer"><div class="dsf-shell">{{ site.title | escape }}</div></footer>
</body>
</html>
`);
  add("targets/github-pages/_config.example.yml", `# Merge selected keys into an existing Jekyll configuration; do not replace it.
title: "Your site"
description: "Your site description"
lang: en
baseurl: ""
# For a project site, set baseurl to "/your-repository-name".
# Keep your own url, plugins, collections and other existing configuration.
deepseafoam_nav:
  - title: Home
    url: /
defaults:
  - scope:
      path: ""
    values:
      layout: deepseafoam
`);
  add("targets/github-pages/README.md", `# GitHub Pages

DeepSeaFoam **${palette.version}** supplies a complete static HTML/CSS starter and
an optional Jekyll layout. It themes **your website**, not github.com or the
GitHub Pages settings UI. It is not a registered theme-picker entry, Ruby gem
or root-level remote-theme repository.

## Static install

1. Back up your site's current source and record its publishing source.
2. For a **new site**, copy \`index.html\`, \`assets\` and \`.nojekyll\` from this
   target into the directory your Pages workflow publishes. Include LICENSE
   when redistributing the theme.
3. Replace the example content, navigation and footer with your own. The CSS
   path is relative and works for both account sites and project subpaths.
4. Use your repository's existing Pages deployment workflow. GitHub recommends
   Actions for deployment; this kit does not enable publishing automatically.

For an **existing static site**, do not overwrite its index. Copy the stylesheet,
link it from your page, add \`class="deepseafoam"\` to the body, and adopt only the
\`dsf-*\` component classes you need. Unrelated CSS can override this theme.

## Optional Jekyll install

1. Copy only \`assets/css/deepseafoam.css\` and
   \`_layouts/deepseafoam.html\` into your existing Jekyll source.
2. Merge the relevant keys from \`_config.example.yml\`; retain your existing
   plugins, collections and other defaults. Set the correct \`baseurl\` for a
   project site. The layout uses Jekyll's \`relative_url\` filter.
3. Select \`layout: deepseafoam\` in a page's YAML front matter, or add the
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

Content uses \`${solid("base")}\`; header, footer and panels use
\`${solid("panel")}\`. Focus/actions use \`${solid("accent")}\`, ordinary text
\`${solid("text")}\`, headings \`${solid("warm")}\`, and native RGBA selection
\`${derived("textSelection")}\`. Rouge/Pygments token classes receive a limited
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
`);
}
