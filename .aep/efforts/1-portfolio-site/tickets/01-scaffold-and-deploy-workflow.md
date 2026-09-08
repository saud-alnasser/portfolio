---
status: open
---

# build(site): scaffold the Astro site and its deployment workflow

## Outcome
An Astro 7 project exists at the repository root, builds a near-empty bilingual site with pnpm, and has the two workflows the plan names: the integration workflow gains install, check, and build steps, and a deploy workflow publishes `dist/` to GitHub Pages on push to `main`. Nothing is deployed yet, because the repository has not been renamed and the Pages source is not set; that is ticket 02.

## Acceptance Criteria
- [ ] `pnpm install && pnpm build` succeeds on Node 24 and writes `dist/en/index.html`, `dist/ar/index.html`, `dist/index.html` (a meta refresh to `/en/`), `dist/sitemap-index.xml`, and `dist/robots.txt` (criterion 8, criterion 10, criterion 13).
- [ ] `astro.config` sets `output: "static"`, `site: "https://saud-alnasser.github.io"`, `i18n` with `defaultLocale: "en"`, `locales: ["en", "ar"]`, `routing.prefixDefaultLocale: true`, Tailwind through `@tailwindcss/vite`, and `@astrojs/sitemap`; no `base` is set (requirement 8, requirement 13).
- [ ] `dist/ar/index.html` carries `lang="ar"` and `dir="rtl"` on `<html>`, and `dist/en/index.html` carries `lang="en"` (criterion 13).
- [ ] `.github/workflows/integration.yml` runs `pnpm install --frozen-lockfile`, `pnpm check` (astro check), and `pnpm build` after the AEP index step, and `.github/workflows/deploy.yml` triggers on push to `main`, builds, uploads `dist/` with `actions/upload-pages-artifact`, and deploys with `actions/deploy-pages` at the majors the Pages evidence records, with `pages: write` and `id-token: write` in the `github-pages` environment (criterion 8).
- [ ] `package.json` lists no hosted service and no paid dependency; the only runtime is static output (requirement 8).
- [ ] The build ships no client-side JavaScript: `dist/` contains no `.js` referenced from the two home pages (requirement 7).

## Relevant areas
Repository root (new): `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/pages/[locale]/index.astro` or `src/pages/en/` and `src/pages/ar/`, `src/styles/global.css`, `public/robots.txt`. `.github/workflows/integration.yml` and a new `.github/workflows/deploy.yml`. `.gitattributes` already marks `pnpm-lock.yaml` as generated.

## Constraints
- Versions from [[efforts/1-portfolio-site/evidence/research/static-site-generator-options]] and [[efforts/1-portfolio-site/evidence/research/github-pages-free-hosting]]; pin what the lockfile pins and let Renovate move it.
- `astro add tailwind` and `astro add sitemap` rather than hand-written integration config, so the shape matches the documentation the next reader will find.
- Keep the integration workflow's index check first and unchanged; the file's own comment says where the new steps go.
- The `.github/labeler.yml` `type: tools` glob already matches `*.config.*` and `.github/**`; add an `area:` family only if a second place for diffs to land appears, per the plan's integration section.

## Notes
The plan's technical approach step 1. Ticket 02 performs the rename and the Pages setting and verifies the first live deploy.
