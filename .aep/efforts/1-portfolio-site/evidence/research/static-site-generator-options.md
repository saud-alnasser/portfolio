---
use-when: "choosing or checking the static site generator and its deployment path for the portfolio"
---

# Question

As of September 2026, what do Astro, Eleventy, and SvelteKit with
adapter-static each provide, out of the box or via first-party packages, for
building a small data-driven static site from typed structured content (YAML or
JSON), with a JSON endpoint, a sitemap, Open Graph metadata, print stylesheets,
and deployment to GitHub Pages, and what is each one's current major version,
release cadence, and Node requirement?

# Sources

All read on 2026-09-08. Where a docs page carries no date, the finding is dated
by the day it was read. The npm registry and the GitHub releases API are used
for version numbers and dates because they are the thing itself; a docs page
that quotes a version is secondary to them.

Registry and release APIs (primary):

- R1. npm registry, `latest` documents and per-version `time` maps for `astro`,
  `@astrojs/sitemap`, `@11ty/eleventy`, `@sveltejs/kit`,
  `@sveltejs/adapter-static`, `svelte`, `vite`
  (https://registry.npmjs.org/<package>).
- R2. GitHub releases API for withastro/astro tags `astro@3.0.0` through
  `astro@7.0.0` (https://api.github.com/repos/withastro/astro/releases/tags/...).
- R3. Astro changelog on main,
  https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md.
  Observation: the file on main today starts at 7.3.2 and ends at 7.0.0-alpha.0;
  entries for 6.x and earlier are not in it, so major-version notes for 6 and
  below were taken from R2.
- R4. SvelteKit changelog on main,
  https://github.com/sveltejs/kit/blob/main/packages/kit/CHANGELOG.md, and
  `packages/kit/package.json` on main.
- R5. Eleventy GitHub releases, https://github.com/11ty/eleventy/releases and
  https://github.com/11ty/eleventy/releases/tag/v3.0.0.

Astro docs (primary, docs.astro.build unless noted):

- A1. Deploy to GitHub Pages, /en/guides/deploy/github/ (also read as source
  markdown at withastro/docs `src/content/docs/en/guides/deploy/github.mdx`).
- A2. withastro/action README, https://github.com/withastro/action.
- A3. Content collections, /en/guides/content-collections/.
- A4. Endpoints, /en/guides/endpoints/.
- A5. @astrojs/sitemap, /en/guides/integrations-guide/sitemap/.
- A6. Install and setup, /en/install-and-setup/.
- A7. Configuration reference, /en/reference/configuration-reference/.
- A8. Islands, /en/concepts/islands/.
- A9. Upgrade to v7, /en/guides/upgrade-to/v7/; Upgrade to v6,
  /en/guides/upgrade-to/v6/.
- A10. Error reference, /en/reference/errors/invalid-content-entry-data-error/.
- A11. Testing, /en/guides/testing/.
- A12. Layouts, /en/basics/layouts/; Styling, /en/guides/styling/.
- A13. Render context (API reference), /en/reference/api-reference/ (read as
  source markdown in withastro/docs).

Eleventy docs (primary, www.11ty.dev unless noted):

- E1. Getting started, /docs/; homepage, https://www.11ty.dev/.
- E2. Global data files, /docs/data-global/; Data cascade, /docs/data-cascade/;
  Custom data formats, /docs/data-custom/; Validate data, /docs/data-validate/.
- E3. Permalinks, /docs/permalinks/.
- E4. Deployment, /docs/deployment/; Configuration, /docs/config/; HTML base
  plugin, /docs/plugins/html-base/; Virtual templates, /docs/virtual-templates/;
  Official plugins, /docs/plugins/official/; Quick tips, /docs/quicktips/;
  Vite plugin, /docs/server-vite/.
- E5. eleventy-base-blog repository, https://github.com/11ty/eleventy-base-blog:
  `package.json`, `.github/workflows/gh-pages.yml.sample`,
  `content/sitemap.xml.njk` (raw files on main). This is the starter the
  Eleventy deployment docs point at, so it is first-party.

SvelteKit docs (primary, svelte.dev unless noted):

- S1. adapter-static, /docs/kit/adapter-static (also read as source markdown at
  sveltejs/kit `documentation/docs/25-build-and-deploy/50-adapter-static.md`).
- S2. Page options, /docs/kit/page-options (also read as source markdown at
  `documentation/docs/20-core-concepts/40-page-options.md`).
- S3. Routing, /docs/kit/routing; Loading data, /docs/kit/load.
- S4. Configuration, /docs/kit/configuration.
- S5. SEO, /docs/kit/seo.
- S6. sv CLI Playwright add-on, /docs/cli/playwright; Creating a project,
  /docs/kit/creating-a-project.

Vite docs (primary): V1. Getting started, https://vite.dev/guide/; V2. Features,
https://vite.dev/guide/features.

GitHub Pages: the generic Actions deployment flow, user site vs project site,
and the current `actions/upload-pages-artifact` and `actions/deploy-pages`
majors are already recorded in `github-pages-free-hosting.md` in this
directory and are not repeated here.

Secondary sources used: a web search over docs.astro.build and 11ty.dev to
locate pages; the search summaries were not relied on for any claim.

# Findings

## Versions, cadence, and Node requirement

F1. source (R1): `astro` latest is 7.3.2, published 2026-09-08T15:55Z; engines
`node >=22.12.0`, `npm >=9.6.5`, `pnpm >=7.1.0`; dependency `vite ^8.0.13`.
First release of each major: 3.0.0 on 2023-08-30, 4.0.0 on 2023-12-05, 5.0.0 on
2024-12-03, 6.0.0 on 2026-03-10, 7.0.0 on 2026-06-22. A `legacy` dist-tag points
at 4.16.19.
observation (R2): the GitHub release for astro@6.0.0 (published
2026-03-10T09:49Z) says "Increases minimum Node.js version to 22.12.0" and
"Astro v6.0 upgrades to Vite v7.0". The astro@7.0.0 release (published
2026-06-22T10:10Z) and R3 say "Upgrade to Vite v8"; neither states a new Node
minimum, and A9 (upgrade to v7) states none either.
source (A6): prerequisites are Node.js "v22.12.0 or higher. Odd-numbered
versions like v23 are not supported."
interpretation: the last three Astro majors shipped at intervals of roughly 12
months (4 to 5), 15 months (5 to 6) and 3 months (6 to 7). Astro publishes no
fixed major cadence in the sources read.

F2. source (R1): `@11ty/eleventy` latest is 3.1.6, published 2026-06-02T22:02Z;
engines `node >=18`. First release of each major: 1.0.0 on 2022-01-08, 2.0.0 on
2023-02-08, 3.0.0 on 2024-10-01. A `canary` dist-tag points at 4.0.0-alpha.10,
whose engines are `node >=22.15`.
source (R5): the v3.0.0 release says "Requires Node 18 or newer" and that
"Eleventy is now written in ESM with full support for ESM in your projects"
while continuing to support CommonJS. The releases page lists v4.0.0-alpha.8
with "bump Node minimum to 22.15+", and alpha.10 dated 1 July (year not shown
on the page; R1 has 3.1.6 at 2026-06-02 and the alphas are later).
source (E1): the getting started page says Node.js 18 or higher and shows
v3.1.6 as the stable release.
interpretation: Eleventy majors have shipped roughly every 13 to 20 months, and
a 4.0 with a Node 22.15 floor is in alpha as of 2026-09-08 with no stated
release date in the sources read.

F3. source (R1): `@sveltejs/kit` latest is 2.70.3, published 2026-08-18T15:02Z;
engines `node >=18.13`; peer dependencies `svelte ^4.0.0 || ^5.0.0-next.0` and
`vite ^5.0.3 || ^6.0.0 || ^7.0.0-beta.0 || ^8.0.0`. First release of each
major: 1.0.0 on 2022-12-14, 2.0.0 on 2023-12-14. A `next` dist-tag points at
3.0.0-next.27 (published 2026-09-08T13:22Z; first next.0 on 2026-06-05) with
engines `node >=22.17` and peer dependencies `vite ^8.0.12`, `svelte ^5.56.4`.
`@sveltejs/adapter-static` latest is 3.0.10 with peer dependency
`@sveltejs/kit ^2.0.0`. `svelte` latest is 5.57.0.
source (R4): the 2.0.0 changelog entry says "breaking: require Node 18.13 or
newer"; `packages/kit/package.json` on main is still 2.70.3 with `node
>=18.13`.
observation (S6): the creating-a-project page states no Node version.
interpretation: SvelteKit has had two majors, twelve months apart, then a 2.x
line running 33 months so far; a 3.0 that raises the Node floor to 22.17 and
requires Vite 8 is in prerelease as of 2026-09-08 with no stated release date in
the sources read. Whether adapter-static 3.0.x will work with kit 3.0 is not
stated by its peer range (`^2.0.0`).

F4. source (R1): `vite` latest is 8.2.2, published 2026-08-20; engines
`node ^20.19.0 || >=22.12.0`. First release of each major: 5.0.0 on 2023-11-16,
6.0.0 on 2024-11-26, 7.0.0 on 2025-06-24, 8.0.0 on 2026-03-12.
source (V1): "Vite requires Node.js version 20.19+, 22.12+."
interpretation: Vite majors have shipped every 7 to 12 months since 2023.

## Whether Vite is required

F5. source (R1, A7): Astro 7.3.2 depends on `vite ^8.0.13`; the Astro
configuration reference has a `vite` option to "Pass additional configuration
options to Vite". conclusion: Vite 8 is required by Astro 7 and is installed
transitively.

F6. source (E4, server-vite page): Eleventy does not require Vite; the page
describes `@11ty/eleventy-plugin-vite` as "A plugin to use Vite with Eleventy
2.0+" that runs Vite as dev-server middleware and as a build postprocessor. The
page does not say which Vite majors the plugin supports. conclusion: Vite is
optional for Eleventy.

F7. source (R1): SvelteKit 2.70.3 declares Vite 5, 6, 7 or 8 as a peer
dependency; kit 3.0.0-next.27 narrows it to `^8.0.12`. conclusion: Vite is
required by SvelteKit and the project installs it directly.

## Structured content from YAML or JSON, and validation

F8. source (A3): Astro collections are defined in `src/content.config.ts`
(`.js` and `.mjs` also accepted), exporting a `collections` object built with
`defineCollection()`; each collection takes a required `loader` and an optional
`schema`. The built-in `glob()` loader takes `pattern` and `base` and supports
Markdown, MDX, Markdoc, JSON, YAML and TOML files, one entry per file. The
built-in `file()` loader reads many entries from one file, "auto-detects and
parses JSON and YAML arrays", treats top-level TOML tables as entries, requires
each entry to carry an `id`, and accepts a custom `parser` function for other
formats. Schemas are Zod schemas with `z` imported from `astro/zod`. Entries are
read with `getCollection()` and `getEntry()`, which return objects with `id`,
`data` and (for Markdown-like formats) `body`. The docs say "if any file
violates its collection schema, Astro will provide a helpful error".
source (A10): `InvalidContentEntryDataError` is listed as an error, thrown when
"a content entry does not match its collection schema", for example a missing
required field or a wrong type.
source (A9, v6 guide): legacy (pre content layer) collections were removed in
v6; all collections must use the content layer API introduced in 5.0.
interpretation: on Astro 7.3.2 a YAML or JSON file of entries can be loaded
with `file()`, validated against a Zod schema, and consumed with full
TypeScript types; a schema mismatch is reported as an error, not a warning. The
docs read do not state in so many words that the build exits non-zero on that
error; that was not observed by running a build.

F9. source (E2): Eleventy global data lives in `_data/` (configurable via
`dir.data`); "All `*.json` and `module.exports` values from `*.js` files in this
directory will be added into a global data object". A file's name becomes its
key, and folders nest keys. "Out of the box, Eleventy supports arbitrary
JavaScript and JSON"; YAML is added with
`eleventyConfig.addDataExtension("yaml", (contents) => YAML.parse(contents))`
using a third-party parser such as the `yaml` package. The data cascade
resolves, highest priority first: computed data, template front matter, template
data files, directory data files, layout front matter, configuration API global
data, global data files.
source (E2, validate data page): validation "Added in v3.0.0" via a special
`eleventyDataSchema` data property that may be set "anywhere in your Data
Cascade (front matter, directory data file, global data, etc)"; the example
uses `zod` and throws on `safeParse` error; the page says a thrown error fails
the build.
interpretation: Eleventy has a hook for validation but ships no schema library
and no type generation; YAML needs a parser dependency. `eleventyDataSchema`
validates the merged data object a template sees, so validating a global data
file means writing the schema against `data.<key>` from some template or
directory data file. The docs read do not show an example that validates a
global `_data` file directly.

F10. source (S3): in SvelteKit, `+page.server.js` exports a `load` typed as
`PageServerLoad` from `./$types` that runs only on the server; its return value
"must return data that can be serialized with devalue". `+page.js` universal
load is typed `PageLoad`. The generated `$types` module gives "full type
safety" over what load returns. The load docs make no mention of importing JSON
or YAML.
source (V2): Vite lets any module do `import json from './example.json'`, with
named imports of root fields. YAML is not mentioned in the Vite features page.
observation: no SvelteKit docs page read describes a content collection or
schema facility; the pages read (S1 to S6) contain none.
interpretation: SvelteKit has no first-party typed content facility. The
documented route is to import a JSON file (native in Vite) or parse YAML with a
third-party library inside a prerendered `load`, and to get types from the
inferred return type; schema validation would be user-supplied.

## Producing a static JSON file at build

F11. source (A4): an Astro file `src/pages/data.json.ts` exporting `GET`
produces `/data.json`; the function returns a `Response` and "Astro will call
this at build time and use the contents of the body to generate the file".
source (A9, v6 guide): custom endpoints with a file extension (the guide's
example is `/sitemap.xml.ts`) are served only without a trailing slash from v6.
conclusion: `src/pages/resume.json.ts` with a `GET` that returns
`JSON.stringify(...)` is the documented mechanism on Astro 7.

F12. source (E3): "You can change the permalink to output to any file
extension", with the worked example front matter `permalink: index.json` and
body `{{ page | json: 2 }}` (Eleventy ships a `json` filter). Setting
`permalink: false` keeps a template in collections without writing a file.
conclusion: a template with `permalink: /resume.json` and a JSON body is the
documented mechanism on Eleventy 3.

F13. source (S2, S3): `+server.js` exports `GET` and returns a `Response`; the
`json()` helper from `@sveltejs/kit` wraps a value. "Unlike the other page
options, `prerender` also applies to `+server.js` files" and the prerenderer
"generate[s] files for any prerenderable pages or `+server.js` routes it finds".
The docs recommend a file extension in the route name, for example
`src/routes/foo.json/+server.js`, which "would result in `foo.json`" on disk,
because a directory and a file cannot share a name. A `+server.js` that is not
linked from a page and not fetched by a prerendered load must be listed in
`config.kit.prerender.entries` or exported from `entries`, because the crawler
discovers only `<a>` links (S2).
conclusion: `src/routes/resume.json/+server.ts` with `export const prerender =
true` and a `GET` is the documented mechanism on SvelteKit 2.

## Sitemap and robots

F14. source (A5): `@astrojs/sitemap` (npm latest 3.7.4 per R1) is installed
with `npx astro add sitemap`, requires `site` in `astro.config.mjs` to be set
and to begin with `http://` or `https://`, and writes `sitemap-index.xml` plus
`sitemap-0.xml` (more numbered files for very large sites). The page shows
`<link rel="sitemap" href="/sitemap-index.xml" />` for the layout head and
suggests either a static `robots.txt` with a `Sitemap:` line or a
`src/pages/robots.txt.ts` endpoint that reuses `site`.
source (A7): `site` is "Your final, deployed URL" used "to generate your sitemap
and canonical URLs".

F15. source (E4, official plugins): the official `@11ty` plugin list contains
Image, Fetch, is-land, Render, i18n, Upgrade Helper, RSS, Syntax Highlighting,
InputPath to URL, Navigation, HTML base, Bundle, Id Attribute, Directory
Output, and Inclusive Language. None is a sitemap plugin.
source (E5): eleventy-base-blog ships `content/sitemap.xml.njk`, a template
with front matter `permalink: /sitemap.xml`, `layout: false`,
`eleventyExcludeFromCollections: true`, iterating `collections.all`, skipping
`permalink: false` pages, and building absolute URLs with `page.url |
htmlBaseUrl(metadata.url)`.
source (E4, virtual templates): `eleventyConfig.addTemplate(virtualPath,
content, data)` "Added in v3.0.0" can generate any output file from config; the
page shows no sitemap example.
conclusion: Eleventy has no first-party sitemap plugin; the first-party starter
does it with a Nunjucks template, and robots.txt would be the same pattern.

F16. source (S5): the SEO page's Sitemaps section shows a `+server.js` `GET`
returning a hand-built `<urlset>` XML string with `Content-Type:
application/xml`. It names no first-party sitemap package. It says every page
should set `<title>` and `<meta name="description">` inside `<svelte:head>`,
suggests returning SEO data from `load` and rendering it in the root layout,
and does not mention Open Graph.
conclusion: SvelteKit has no first-party sitemap generator; the documented
pattern is a prerendered `+server` endpoint, and because a sitemap route is not
linked from any page it must be listed in `prerender.entries` (F13).

## Open Graph metadata

F17. source (A12, A13): Astro layouts are ordinary `.astro` components; the
layouts guide's example puts a `<BaseHead title={title}/>` component inside
`<head>`, and the render-context reference shows
`const socialImageURL = new URL('/images/preview.png', Astro.url)` rendered as
`<meta property="og:image" content={socialImageURL} />`.
observation: no first-party Astro SEO or Open Graph component or integration
was found in the docs read; a web search over docs.astro.build for "og:image"
surfaced only the render-context example and the Cloudinary and ImageKit
guides.
conclusion: on all three frameworks Open Graph tags are hand-written `<meta>`
elements in the shared head (Astro: a layout or head component; Eleventy: a
layout template; SvelteKit: `<svelte:head>` per S5). None of the three ships a
first-party Open Graph helper in the sources read.

## Print stylesheets

F18. source (A12, styling): Astro `<style>` is scoped by default, `is:global`
opts out, and a global `.css` file is imported from frontmatter "like any other
ESM import". The page does not mention media queries or print.
observation: none of the Astro, Eleventy or SvelteKit pages read mentions print
stylesheets or `@media print`.
interpretation: a print stylesheet is plain CSS (`@media print` or `<link
media="print">`) and is not something any of the three frameworks mediates, so
the absence is expected rather than a gap in the frameworks.

## Deploying to GitHub Pages and the base path

F19. source (A1, A2): Astro's documented workflow uses `actions/checkout@v7`,
`withastro/action@v6` (inputs `path`, `node-version` defaulting to 24,
`package-manager` auto-detected from the lockfile, `build-cmd`, `cache`,
`cache-dir` defaulting to `node_modules/.astro`, `out-dir` defaulting to
`dist`), then `actions/deploy-pages@v5` in a second job; the repository's
Pages source must be set to "GitHub Actions". For a user site the config is
`site: 'https://astronaut.github.io'` with no `base`; for a project site it is
`site: 'https://astronaut.github.io'` plus `base: '/my-repo'`, and internal
links must carry the prefix (`<a href="/my-repo/about">`). For a custom domain,
add `public/CNAME`, set `site` to the domain, and remove `base`.
source (A7): `base` is "The base path to deploy to" used "as the root for your
pages and assets both in development and in production build";
`trailingSlash` defaults to `'ignore'`; `output` defaults to `'static'`.
observation (A2): withastro/action bundles checkout, install, build and
`upload-pages-artifact`; the alternative is the manual flow already recorded in
`github-pages-free-hosting.md`.
interpretation: Astro applies `base` to its own asset URLs but not to
hand-written hrefs; the docs put that on the author (`import.meta.env.BASE_URL`
is the documented way to read it, per A7's `base` entry).

F20. source (E4, E5): Eleventy's deployment page says to copy the
eleventy-base-blog sample workflow, set the Pages source to "GitHub Actions",
and make sure the `build-ghpages` script passes `--pathprefix=/YOUR_REPO_NAME/`;
"When using a Custom domain ... make sure to remove the `--pathprefix`
parameter entirely". The sample `gh-pages.yml.sample` on main pins
`actions/checkout` 6.0.2, `actions/setup-node` 6.3.0 with `node-version: '22'`,
`actions/cache` 5.0.3, runs `npm ci` and `npm run build-ghpages`, uploads
`_site/` with `actions/upload-pages-artifact` 4.0.0, and deploys with
`actions/deploy-pages` 4.0.5 (all by commit SHA). `pathPrefix` defaults to `/`
and "When paired with the HTML `<base>` plugin it will transform any absolute
URLs in your HTML to include this folder name"; the HTML base plugin "is
bundled with Eleventy 2.0" and rewrites `a[href]`, `img[src]`, `srcset` and
similar at build.
observation: the sample workflow pins `upload-pages-artifact` 4.0.0 and
`deploy-pages` 4.0.5, whereas the Astro and SvelteKit docs read the same day
use `deploy-pages@v5` and (SvelteKit) `upload-pages-artifact@v5`;
`github-pages-free-hosting.md` records what the actions' own READMEs said.
interpretation: a user site (`<user>.github.io`) needs no `--pathprefix`, the
same as the custom-domain case; a project site passes the repository name and
enables the HTML base plugin so hand-written absolute links are rewritten.

F21. source (S1, S4): "if your repo name is not equivalent to
`your-username.github.io`, make sure to update `config.kit.paths.base` to match
your repo name", generate a fallback `404.html`, and add an empty `.nojekyll`
to `static/`. The example `svelte.config.js` sets `paths.base` to
`process.argv.includes('dev') ? '' : process.env.BASE_PATH`. The example
workflow uses `actions/checkout@v7`, `actions/setup-node@v6` with
`node-version: 20`, builds with `BASE_PATH: '/${{ github.event.repository.name }}'`,
uploads `build/` with `actions/upload-pages-artifact@v5`, and deploys with
`actions/deploy-pages@v5`. `paths.base` must start with `/` and must not end
with `/` unless it is the empty string; `paths.relative` defaults to `true`,
which makes `base` and asset paths relative during server-side rendering.
Root `+layout.js` must `export const prerender = true`; adapter-static
`strict` (default `true`) fails the build if any page is not prerendered and
no fallback exists.
interpretation: for a user site `paths.base` stays `''`; for a project site it
is `/<repo>`; SvelteKit's own `<a>` handling and `$app/paths` respect `base`,
and links written as bare absolute paths need the `base` prefix added by the
author.

## Client-side JavaScript for a content-only page

F22. source (A8): Astro renders components to HTML and CSS, "stripping out all
client-side JavaScript automatically"; JavaScript ships only for components
marked with a `client:*` directive. conclusion: a content-only Astro page
ships no framework JavaScript by default.

F23. source (E1, homepage): "zero client-side JavaScript by default across the
board". conclusion: Eleventy emits only what the templates write.

F24. source (S2): pages hydrate by default; `export const csr = false` from a
`+page.js`, `+page.server.js`, or a layout means "no JavaScript is shipped to
the client": the page becomes HTML and CSS only, component `<script>` blocks
are removed, forms are not progressively enhanced, links are full-page
navigations, and HMR is off. The docs show `export const csr = dev` to keep it
on during development. conclusion: SvelteKit ships its runtime and hydration
code unless `csr = false` is set (in the root layout, to cover every page).

## Playwright or Chromium at build for a PDF

F25. source (A11): Astro lists Playwright as one recommended end-to-end testing
tool, installed by the user; the page says nothing about PDF generation.
source (S6): `npx sv add playwright` adds "Playwright browser testing" with
scripts, a config file, `.gitignore` entries and a demo test; nothing about
PDF.
source (E4, quick tips and official plugins): no Eleventy quick tip or official
plugin covers PDF; a web search over 11ty.dev for Playwright or Puppeteer found
only the hosted screenshot service (`v1.screenshot.11ty.dev`, Puppeteer-based,
for images).
conclusion: none of the three has a first-party way to run a browser at build
to produce a PDF; any of them can run a user-written Node script that drives
Playwright in the same CI job, but that is outside the framework.

# Conclusion

As of 2026-09-08: Astro is at 7.3.2 (majors 5.0.0 on 2024-12-03, 6.0.0 on
2026-03-10, 7.0.0 on 2026-06-22; Node 22.12.0+; Vite 8 required). Eleventy is
at 3.1.6 (majors 1.0.0 on 2022-01-08, 2.0.0 on 2023-02-08, 3.0.0 on
2024-10-01; Node 18+; Vite optional; a 4.0 alpha needs Node 22.15+). SvelteKit
is at 2.70.3 (majors 1.0.0 on 2022-12-14, 2.0.0 on 2023-12-14; Node 18.13+;
Vite 5 to 8 as a peer; a 3.0 prerelease needs Node 22.17+ and Vite 8), with
adapter-static 3.0.10.

Astro is the only one with a first-party typed, schema-validated content
facility for YAML or JSON (content collections with `file()` or `glob()` and
Zod) and a first-party sitemap integration. Eleventy reads JSON and JS data
natively, needs a parser for YAML, offers an `eleventyDataSchema` hook (since
3.0) with no bundled schema library, and has no sitemap plugin (its starter
uses a template). SvelteKit has no typed content facility beyond Vite's JSON
import and generated load types, and no sitemap package (the docs show a
`+server` endpoint). All three produce a static JSON file at build by their
documented endpoint or permalink mechanism. All three have a documented
GitHub Pages workflow through GitHub Actions and a base-path setting for a
project site (`base`, `--pathprefix` with the HTML base plugin, `paths.base`),
none of which is needed for a user site. Astro and Eleventy ship no client
JavaScript for a content-only page by default; SvelteKit does unless `csr =
false` is exported. None of the three ships Open Graph helpers, print styling,
or a build-time browser for PDFs.

# Not checked

- No build was run. That `InvalidContentEntryDataError` exits non-zero, that
  `eleventyDataSchema` fails `npx @11ty/eleventy`, and that SvelteKit's
  prerenderer writes `resume.json` for an unlinked `+server` route listed in
  `entries` are read from docs, not observed.
- Node minimums for Astro majors 3, 4 and 5 were not extracted (the release
  notes were only grepped); only the current floor (22.12.0, set in 6.0) is
  established.
- Astro's and Eleventy's release policies (whether a major cadence is
  published) were not searched for; the cadence above is inferred from dates.
- Whether `@sveltejs/adapter-static` 3.0.x supports kit 3.0.0-next was not
  checked beyond its peer range.
- The `@11ty/eleventy-plugin-vite` supported Vite range was not found on its
  docs page; its npm metadata was not queried.
- Community packages (astro-seo, eleventy-plugin-sitemap, svelte-sitemap,
  Open Graph image generators) were deliberately not surveyed; the question was
  about first-party support.
- GitHub Pages limits, user vs project site rules, and the actions' current
  majors are in `github-pages-free-hosting.md` and were not re-verified here.
- The Eleventy sample workflow's pinned action versions
  (`upload-pages-artifact` 4.0.0, `deploy-pages` 4.0.5) were not compared
  against the actions' current READMEs in this file.
