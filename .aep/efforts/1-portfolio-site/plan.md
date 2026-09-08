---
use-when: "building a ticket in this effort and the approach is not obvious from the spec"
---

# Architecture

Astro builds the site from typed content collections, styled with Tailwind 4, with zero client-side JavaScript except a few lines for the theme control. The content source is one YAML file per entry under `src/content/`, validated by Zod schemas at build. Every text field is a language map (`{ en, ar }`); every other field is authored once. Three renderers read the same collections: the pages, the CV page per language with a print stylesheet, and a static endpoint per language that emits JSON Resume. A GitHub Actions workflow builds on every push to `main`, renders the CV pages to PDF with Playwright's Chromium, and deploys through the official Pages actions. The site is served at `saud-alnasser.github.io`, which requires renaming the repository.

The spec's requirements and criteria are in [[efforts/1-portfolio-site/spec]] and are not repeated here. The facts this plan rests on are in [[efforts/1-portfolio-site/evidence/research/static-site-generator-options]], [[efforts/1-portfolio-site/evidence/research/json-resume-schema]], [[efforts/1-portfolio-site/evidence/research/github-pages-free-hosting]], and [[efforts/1-portfolio-site/evidence/research/ats-parsing-and-resume-schemas]].

## The generator

Three candidates were compared against what exists here: Node 24 and pnpm 12 on the machine, Renovate configured, no source yet, and a repository whose owner has shipped SvelteKit applications (rentable, mudaraj).

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **Astro 7** (chosen) | the only candidate with first-party typed content (content layer, `file()` and `glob()` loaders, Zod schemas, build fails on bad content); first-party i18n routing (`i18n.locales`, `prefixDefaultLocale`) and sitemap (`@astrojs/sitemap`); zero client JavaScript by default; static JSON endpoints (`src/pages/resume.json.ts`); documented Pages workflow | a major every twelve months (5.0 in 2024-12, 6.0 in 2026-03, 7.0 in 2026-06), so upgrades arrive yearly; Vite 8 underneath | a content-layer API change across a major touches the schemas and loaders; nothing else in this design depends on Astro internals | Renovate proposes the bumps; the content source is plain YAML and survives any generator |
| Eleventy 3 | the slowest-moving option (a major every 13 to 20 months), Node 18 floor, no Vite, no client JavaScript | no typed content: YAML needs a parser registered by hand and there is no bundled schema validator, so the content contract has to be written and enforced by our own code; sitemap and i18n are templates and plugins rather than first-party | the content validation, which is what keeps the CV truthful over years, would be a bespoke script that nobody else maintains | fewer upgrades, more of our own code |
| SvelteKit 2 with adapter-static | the owner already knows it; prerendered `+server.ts` endpoints produce the JSON | hydrates by default and needs `csr = false` per page; no content facility beyond JSON import; no first-party sitemap or i18n; the framework is shaped for applications, and this is a document | the temptation to build an application where a document was asked for | a 2.x line with a 3.0 in prerelease that raises the Node floor to 22.17 |

Astro wins on the one thing the spec's longevity constraint turns on: the content contract is declared once, in Zod, and the build refuses a bad entry. Eleventy lost because that contract would be ours to write and maintain. SvelteKit lost because its defaults pull the wrong way for a static document and it offers nothing the other two lack.

## Styling, motion, and components

Tailwind 4 through the official Vite plugin (`astro add tailwind` installs `@tailwindcss/vite`; `@astrojs/tailwind` is legacy), with `@import "tailwindcss"` in one global stylesheet that also declares the palette tokens for both themes. Utility classes keep the layout responsive from 360 pixels to wide desktops with one set of templates, and logical-property utilities (`ms-`, `pe-`, `text-start`) make the same templates right-to-left under Arabic.

Motion is CSS only: Tailwind transition and keyframe utilities for hover states, the theme switch, and a reveal on section entry, all wrapped in `motion-safe:` so `prefers-reduced-motion` switches every animation off, which is what criterion 7 checks. No animation library and no page-transition router, because both ship JavaScript to every page for a document that does not need it.

shadcn/ui was asked for as a possibility. It installs into Astro (`shadcn init -t astro`, with an `--rtl` option) but its components are React, so it requires the React integration. Astro renders a framework component to static HTML with no client JavaScript unless it carries a `client:*` directive, so shadcn components used for static markup cost nothing at runtime and only an interactive one would ship React. Decision: start without React. The site's controls are a theme toggle and a language switch, and neither justifies a runtime. Adopt shadcn's design conventions (its CSS-variable palette and radius tokens) in the global stylesheet so that, if an interactive component is ever wanted, `astro add react` and `shadcn add` slot in without restyling. This is recorded here so it is not re-decided by accident; the ticket that first needs an interactive component reopens it.

## The content source

Three shapes were designed under conflicting constraints, per the design-it-twice note.

**A. Minimise the interface: the source is `resume.json` itself.** One JSON Resume file is the content source; the pages render it and requirement 6 is satisfied by copying. Leverage is high until two languages arrive: JSON Resume has no language dimension, so the second language is a second file, and every date and link is then authored twice, which breaks requirement 1. It also cannot carry a project without a link, a pending degree, or a hidden entry without undeclared keys. Lost.

**B. Maximise flexibility: one collection per entity type, one YAML file per entry, text as language maps.** `src/content/projects/nova-lang.yaml` carries the facts once and `{ en, ar }` maps for text. Zod validates every entry and every language map. Adding a language is a new key in the map schema; adding an entity type is a new collection, schema, and template. Every output is a mapper over the collections. Leverage is good: the interface is the schema file, and everything a renderer needs to know is in it.

**C. Optimise for the common caller: one Markdown file per entry with frontmatter.** The common act is Saud adding a project, and a Markdown file with frontmatter is the most familiar shape. But the body of a Markdown file is one language, so bilingual text forces either two files (facts duplicated) or language maps in frontmatter with an unused body. Lost to B, which is C with the body removed.

**Chosen: B.** One file per entry, YAML, language maps for text, Zod schemas as the documented contract. `glob()` loads a directory of YAML entries; the project profile (name, label, summary, contact, profiles) is one `file()`-loaded YAML.

## The PDF

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **Build-time PDF with Playwright** (chosen) | a real `cv.en.pdf` and `cv.ar.pdf` to link and to upload to an applicant tracking system; the text-extraction check in criterion 5 runs in CI on every build rather than by hand; `page.pdf()` uses print media by default | a Chromium download in CI on every build (cached by the Playwright action); one more dev dependency | Arabic shaping in headless Chromium depends on fonts present on the runner, so the Arabic PDF needs a bundled font | Playwright moves monthly but `page.pdf()` has been stable for years |
| Browser print only | zero dependencies; the spec's wording is satisfied by the print stylesheet alone | recruiters get a "print this page" instruction instead of a file; the extraction check is manual | the criterion drifts unverified | none |

Chosen: build-time PDF. The alternative is the fallback if the Playwright step ever proves unmaintainable: the print stylesheet exists either way.

The CV page in each language carries two download actions for that language: the PDF and the JSON Resume document. A visitor reading `/ar/cv/` gets `cv.ar.pdf` and `/ar/resume.json`; a visitor on `/en/cv/` gets the English pair.

## Themes and language switching

Theme: two palettes as CSS custom properties on `:root`, `prefers-color-scheme` for the default, a `data-theme` attribute for the override, and an inline script of a few lines that reads `localStorage` before first paint to avoid a flash. This is the only client-side JavaScript on the site.

Language: Astro's i18n routing with `defaultLocale: "en"`, `locales: ["en", "ar"]`, and `prefixDefaultLocale: true`, so every page lives under `/en/` or `/ar/` and the two are symmetrical; the root redirects to `/en/` with a static meta refresh, since there is no server. The `<html>` element carries `lang` and `dir` from the locale. Layout is written in logical CSS properties (`margin-inline-start`, not `margin-left`) so right-to-left needs no second stylesheet.

# Components

| Component | Responsibility |
| --- | --- |
| `src/content.config.ts` | the content contract: one `defineCollection` per entity type with its Zod schema, and the shared `localized` text schema |
| `src/content/<collection>/*.yaml` | the content source: `profile.yaml` (one file), `projects/`, `experience/`, `education/`, `certificates/`, `skills/` |
| `src/lib/resume.ts` | the mapper from collections to a JSON Resume document for one language, and the language fallback with its gap report |
| `src/pages/[locale]/` | the site pages: home, work, education, cv |
| `src/pages/[locale]/resume.json.ts` | the static endpoint that emits JSON Resume per language |
| `src/styles/global.css` | the Tailwind import, the palette tokens for both themes in shadcn's variable conventions, and the print rules for the CV |
| `scripts/render-pdf.mjs` | after `astro build`, opens each CV page from `dist/` in Playwright's Chromium and writes `dist/cv.<locale>.pdf` |
| `scripts/check-dist.mjs` | the build-output checks CI runs: JSON Resume validation, PDF text extraction, identifier patterns, sitemap and metadata presence |
| `.github/workflows/deploy.yml` | build, render PDFs, run checks, upload the artifact, deploy to Pages on push to `main` |
| `README.md` | the content format, one section per collection, with every field and its meaning |

# Interfaces

**The content contract** is the Zod schema. Shape, to be finalised in the ticket that writes `content.config.ts`:

```ts
const localized = z.object({ en: z.string(), ar: z.string().optional() });

projects: { name: string; period: { start: iso8601; end?: iso8601 }; role: localized;
            summary: localized; technologies: string[]; links?: { repository?: url; live?: url };
            visibility: "public" | "described" | "hidden"; order?: number }
experience: { organisation: localized; position: localized; location: localized;
              period; summary: localized; highlights: localized[]; kind: "employment" | "training" }
education: { institution: localized; area: localized; studyType: localized; period;
             status: "completed" | "certificate-pending" | "in-progress"; courses?: string[] }
certificates: { name: localized; issuer: string; date?: iso8601; url?: url }
skills: { name: localized; keywords: string[]; level?: string }
profile: { name: localized; label: localized; summary: localized; email; profiles[]; location: localized }
```

`iso8601` is the JSON Resume pattern (`YYYY`, `YYYY-MM`, or `YYYY-MM-DD`), enforced in Zod so a date that would fail JSON Resume fails the build instead. `visibility: hidden` keeps an entry in the source but out of every output. `status` renders wording per language; `certificate-pending` maps to JSON Resume as an `education` entry with `endDate` set to the completion term and an additional `status` key, which the schema permits (`additionalProperties: true` everywhere) and the reference theme ignores.

**Addresses the outside sees**, all under `https://saud-alnasser.github.io`:

| Path | What |
| --- | --- |
| `/` | meta refresh to `/en/` |
| `/en/`, `/ar/` | home |
| `/en/work/`, `/en/education/`, `/en/cv/` and the `/ar/` twins | sections and the CV page |
| `/en/resume.json`, `/ar/resume.json` | JSON Resume, with `meta.canonical` pointing at itself and `basics.url` at the site |
| `/cv.en.pdf`, `/cv.ar.pdf` | the rendered CVs |
| `/sitemap-index.xml`, `/robots.txt` | discovery |

# Technical Approach

The order is chosen so that every step can be checked by a build, and so the content contract exists before any content or template depends on it.

1. **Scaffold and deploy nothing.** Astro project with pnpm, `output: "static"`, `site: "https://saud-alnasser.github.io"`, the i18n block, Tailwind through `astro add tailwind`, `@astrojs/sitemap`, an empty home page per locale, and the deploy workflow. Rename the repository. First green deploy of a near-empty site proves the pipeline before anything sits on it. The integration workflow gains install, check, and build steps.
2. **Content contract.** `content.config.ts` with the schemas above, the `localized` helper, and the README section that documents them. One fixture entry per collection so the build exercises every schema.
3. **Content.** The real entries from the inventory evidence, English first, `visibility` set per project by Saud, identifiers absent. Arabic text follows in the same ticket or the next, reviewed by Saud.
4. **Pages and layout.** Base layout with palette tokens, the theme control, the language switch, logical-property utilities, `motion-safe:` transitions, metadata and Open Graph per page. Home, work, education.
5. **The CV page and its print stylesheet.** Single column, standard headings, contact in the body, per language.
6. **JSON Resume endpoint** through the mapper, validated in CI with `@jsonresume/schema`.
7. **PDF rendering** in CI with Playwright, a bundled Arabic-capable font, and the extraction check on the English PDF.
8. **Checks and accessibility.** `scripts/check-dist.mjs`, Lighthouse in CI on the home and CV pages, axe contrast checks, identifier-pattern scan of `dist/` and of history.

# Integration

- `.github/workflows/integration.yml` already gates the AEP index; it gains the install, check, test, and build steps at step 1, as its own comment anticipates. The deploy is a separate workflow on push to `main`, as the same comment says.
- `.github/labeler.yml` gains an `area:` family only if more than one place a diff can land emerges; `src/` and `scripts/` are the candidates.
- The repository rename changes the remote name. `[[references/github]]`, `[[rules/version-control]]`, and `[[contexts/repository]]` name `saud-alnasser/portfolio` and are corrected in the ticket that renames.
- Renovate already runs; the Playwright and Astro majors will arrive through it.

# Migration

Nothing exists to migrate. The repository rename is the one act with an outside effect: GitHub redirects `saud-alnasser/portfolio` to the new name for git and web, and the local remote URL is updated afterwards.

# Testing Strategy

How each acceptance criterion in [[efforts/1-portfolio-site/spec]] is checked. Automated checks run in `scripts/check-dist.mjs` against `dist/` in CI unless stated otherwise.

| Criterion | Check |
| --- | --- |
| 1 | a test builds with a fixture entry, changes one value, rebuilds, and asserts the value appears in the page, the CV page, and `resume.json`, and nowhere else in `src/` outside the content source |
| 2 | HTML parse of `dist/en/` and `dist/ar/`: every section route exists and is linked from the navigation; education entries appear in ascending start date |
| 3 | fixture entries with and without links; assert no `href=""` and no `href="undefined"` in `dist/` |
| 4 | content test: `status: certificate-pending` renders the pending wording in both languages; grep `dist/` for "graduated" and "awarded" on pending entries |
| 5 | HTML parse of the CV page: single-column layout markers, no `<table>`, `<img>`, or positioned header with contact; `pdftotext` on `dist/cv.en.pdf` and assert the ordered lines; A4 and Letter rendered by the PDF script with page-count sanity |
| 6 | `@jsonresume/schema` `validate()` on both endpoints; assert entry counts equal the CV page's |
| 7 | Lighthouse CI on `/en/`, `/ar/`, `/en/cv/`, `/ar/cv/`, mobile profile, thresholds 90 on performance, accessibility, and best practices; axe contrast rule in both themes via Playwright; viewport 360 asserts `scrollWidth <= 360` and viewport 1440 asserts the content column is not narrower than the layout's stated maximum; with `reducedMotion: "reduce"` emulated, `getAnimations()` on the document returns none |
| 8 | the deploy workflow on `main`; a `curl` of the live address in the workflow's last step; `package.json` reviewed for hosted services |
| 9 | the criterion-1 test covers the mechanism; README section presence asserted by the check script |
| 10 | assert `<title>`, `<meta name="description">`, `og:` tags on every page; `sitemap-index.xml` lists every route; `robots.txt` has no `Disallow: /` |
| 11 | reviewed by eye against the inventory evidence at the close |
| 12 | regex scan of `dist/` and of `git log -p` for `1[0-9]{9}`, `2[0-9]{8}`, and `\+?9665[0-9]{8}` or `05[0-9]{8}`; runs in CI |
| 13 | every route under `dist/en/` has a twin under `dist/ar/`; `lang` and `dir` attributes asserted; the gap report is emitted by the build and printed in CI |
| 14 | Playwright with `colorScheme: "dark"` asserts the dark tokens; toggling and reloading asserts persistence; print emulation asserts the light tokens on the CV page |

# Operational Considerations

- **Pages settings.** After the rename, the repository's Pages source must be set to GitHub Actions once, by hand, in the repository settings. The first deploy fails until then.
- **The rename** is done by Saud, or by the run with his say-so in that turn, since it is a write to shared data.
- **Content updates** are ordinary pull requests through Graphite; the build refuses bad content, and the deploy runs on merge.
- **Arabic review** is a human step for every entry, per the spec's assumption.

# Technical Risks

- **Arabic rendering in the PDF.** Headless Chromium on the runner may lack an Arabic font; the fix is a bundled font in `public/fonts/` referenced by the print stylesheet. Shows up as boxes in `cv.ar.pdf` on the first render.
- **Astro's i18n under static output.** The docs state the `domains` option needs server output and say nothing about the rest; the plan uses only prefixed routes, which are plain static files. Shows up at step 1, before anything depends on it.
- **The v1.0.0 `$schema` trap.** JSON Resume's own samples point `$schema` at the old document that forbids top-level custom keys. The endpoint sets `$schema` to the monorepo `schema.json` and keeps custom keys inside sections, where every version permits them.
- **Tailwind 4 and Astro majors moving together.** Both sit on Vite 8 today; a Vite major that one adopts before the other blocks the upgrade until both do. Shows up as a Renovate pull request that fails to build; the answer is to wait, not to pin one side by hand.
- **Playwright on Windows.** Local rendering on Saud's machine needs a Chromium download; CI is the authoritative renderer, and the local script is optional.
