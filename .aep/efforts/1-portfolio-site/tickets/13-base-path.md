---
status: open
blocked-by: [09, 11, 12]
---

# feat(site): serve the site under the /saud-alnasser/ base path of the project site

## Outcome
The build is addressed at `https://saud-alnasser.github.io/saud-alnasser/`: `astro.config.mjs` carries the base, one module joins paths to it, and every address the site publishes carries it, in the pages, the downloads, the root redirect, the sitemaps, `robots.txt`, and the JSON Resume documents. The local server, the PDF render, the browser tests, the dist checks, and Lighthouse all run under the same base, so a path written without it fails here before it reaches Pages.

## Acceptance Criteria
- [ ] After `pnpm build`, every internal `href` in `dist/**/*.html`, the meta-refresh target of `dist/index.html`, the `<link rel="sitemap">`, the canonical, `hreflang`, and `og:url` addresses, the CV page's two download links, every `<loc>` in the sitemaps, the `Sitemap:` line of `robots.txt`, and `meta.canonical` and `basics.url` in both `resume.json` documents start with `/saud-alnasser/` or `https://saud-alnasser.github.io/saud-alnasser/` (criterion 8, criterion 10, criterion 15).
- [ ] No file under `src/` writes a leading-slash site path literal: every path goes through `src/lib/paths.ts`, and `scripts/check-dist.mjs` fails by name when a page carries an internal link, a sitemap entry, a `robots.txt` sitemap line, or a `resume.json` address without the base (criterion 15, requirement 9).
- [ ] `scripts/serve-dist.mjs` serves `dist/` under the base and answers 404 at `/en/`; `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm test:content`, and `pnpm lighthouse` pass against it with the same results as before (criterion 5, criterion 6, criterion 7, criterion 13).
- [ ] With `base` set to `/`, the build and `pnpm check:dist` still pass, so a custom domain added later needs one change and nothing else (requirement 8).

## Relevant areas
`astro.config.mjs`, `src/lib/paths.ts` (new), `src/layouts/Base.astro`, `src/pages/[locale]/index.astro`, `src/pages/[locale]/cv.astro`, `src/lib/resume.ts`, `public/robots.txt`, `scripts/serve-dist.mjs`, `scripts/render-pdf.mjs`, `scripts/check-dist.mjs`, `scripts/test-content-mechanism.mjs`, `tests/pages.ts`, `tests/*.spec.ts`, `playwright.config.ts`, `lighthouserc.json`.

## Constraints
- One constant: `base` in `astro.config.mjs`. The tests and the scripts read `site` and `base` from that file; nothing repeats the string.
- The plan's "The address" section says what Astro prefixes and what it does not; rely on nothing beyond that.
- No change to the content, the contract, or the deploy workflow.

## Notes
Appended on 2026-09-09 by the return to plan after Saud kept the repository name `saud-alnasser`. The probe build in [[efforts/1-portfolio-site/evidence/research/repository-name-and-base-path]] (F5 to F9) is the list of what breaks under the base.
