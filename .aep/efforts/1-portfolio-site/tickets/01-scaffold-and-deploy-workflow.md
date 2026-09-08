---
status: resolved
---

# build(site): scaffold the Astro site and its deployment workflow

## Outcome
An Astro 7 project exists at the repository root, builds a near-empty bilingual site with pnpm, and has the two workflows the plan names: the integration workflow gains install, check, and build steps, and a deploy workflow publishes `dist/` to GitHub Pages on push to `main`. Nothing is deployed yet, because the repository has not been renamed and the Pages source is not set; that is ticket 02.

## Acceptance Criteria
- [x] `pnpm install && pnpm build` succeeds on Node 24 and writes `dist/en/index.html`, `dist/ar/index.html`, `dist/index.html` (a meta refresh to `/en/`), `dist/sitemap-index.xml`, and `dist/robots.txt` (criterion 8, criterion 10, criterion 13).
  Verified 2026-09-08 on Node v24.18.0, pnpm 12.3.4: `rm -rf dist && pnpm install --frozen-lockfile && pnpm build` exited 0 and `find dist -type f` listed `_astro/index.Bbn4A-eu.css`, `ar/index.html`, `en/index.html`, `index.html`, `robots.txt`, `sitemap-0.xml`, `sitemap-index.xml`. `dist/index.html` contains `<meta http-equiv="refresh" content="0;url=/en/">`. `sitemap-0.xml` lists `/ar/` and `/en/`.
- [x] `astro.config` sets `output: "static"`, `site: "https://saud-alnasser.github.io"`, `i18n` with `defaultLocale: "en"`, `locales: ["en", "ar"]`, `routing.prefixDefaultLocale: true`, Tailwind through `@tailwindcss/vite`, and `@astrojs/sitemap`; no `base` is set (requirement 8, requirement 13).
  Verified: `grep -n` of `astro.config.mjs` shows `site: 'https://saud-alnasser.github.io'`, `output: 'static'`, `defaultLocale: 'en'`, `locales: ['en', 'ar']`, `prefixDefaultLocale: true`, `integrations: [sitemap()]`, `plugins: [tailwindcss()]`, and no `base:` line. `astro add` could not write it on this machine (its own `pnpm add` spawn exits 1 under both Git Bash and PowerShell even with the packages already installed), so the file was written in the shape the integration guides show.
- [x] `dist/ar/index.html` carries `lang="ar"` and `dir="rtl"` on `<html>`, and `dist/en/index.html` carries `lang="en"` (criterion 13).
  Verified: `grep -o '<html[^>]*>'` printed `<html lang="en" dir="ltr">` for `dist/en/index.html` and `<html lang="ar" dir="rtl">` for `dist/ar/index.html`.
- [x] `.github/workflows/integration.yml` runs `pnpm install --frozen-lockfile`, `pnpm check` (astro check), and `pnpm build` after the AEP index step, and `.github/workflows/deploy.yml` triggers on push to `main`, builds, uploads `dist/` with `actions/upload-pages-artifact`, and deploys with `actions/deploy-pages` at the majors the Pages evidence records, with `pages: write` and `id-token: write` in the `github-pages` environment (criterion 8).
  Verified by parsing both files with js-yaml: integration steps in order are checkout, setup node, verify generated indexes, setup pnpm, `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`; deploy triggers on `push` to `main` (and `workflow_dispatch`), its `build` job uploads `dist` with `actions/upload-pages-artifact@v5`, and its `deploy` job carries `permissions: {pages: write, id-token: write}`, `environment: github-pages`, and `actions/deploy-pages@v5`. The majors are the current ones: the actions' latest releases on 2026-09-08 are `upload-pages-artifact` v5.0.0 (2026-04-10) and `deploy-pages` v5.0.1 (2026-09-01), which the generator evidence (F19, F21) records from the framework docs; the Pages evidence's F16 quotes a README example at v4, which those releases supersede. `pnpm check` ran locally: 4 files, 0 errors, 0 warnings, 0 hints.
- [x] `package.json` lists no hosted service and no paid dependency; the only runtime is static output (requirement 8).
  Verified: dependencies are `astro`, `@astrojs/sitemap`, `@tailwindcss/vite`, `tailwindcss`; devDependencies are `@astrojs/check`, `typescript`. All open source on npm, no service, no token, no adapter; `output: 'static'`.
- [x] The build ships no client-side JavaScript: `dist/` contains no `.js` referenced from the two home pages (requirement 7).
  Verified: `grep -c -E '<script|\.js'` printed 0 for both `dist/en/index.html` and `dist/ar/index.html`, and `find dist -name '*.js'` found nothing.

## Relevant areas
Repository root (new): `package.json`, `pnpm-lock.yaml`, `astro.config.mjs`, `tsconfig.json`, `src/pages/[locale]/index.astro` or `src/pages/en/` and `src/pages/ar/`, `src/styles/global.css`, `public/robots.txt`. `.github/workflows/integration.yml` and a new `.github/workflows/deploy.yml`. `.gitattributes` already marks `pnpm-lock.yaml` as generated.

## Constraints
- Versions from [[efforts/1-portfolio-site/evidence/research/static-site-generator-options]] and [[efforts/1-portfolio-site/evidence/research/github-pages-free-hosting]]; pin what the lockfile pins and let Renovate move it.
- `astro add tailwind` and `astro add sitemap` rather than hand-written integration config, so the shape matches the documentation the next reader will find.
- Keep the integration workflow's index check first and unchanged; the file's own comment says where the new steps go.
- The `.github/labeler.yml` `type: tools` glob already matches `*.config.*` and `.github/**`; add an `area:` family only if a second place for diffs to land appears, per the plan's integration section.

## Notes
The plan's technical approach step 1. Ticket 02 performs the rename and the Pages setting and verifies the first live deploy.

Built 2026-09-08. Three things the build turned up, none of them a change to the approach:
- `astro check` refuses TypeScript 7 (the native compiler has no programmatic API yet), so `typescript` is pinned to the 6 line; Renovate will offer 7 and the build will say when it can take it.
- Astro's i18n redirect of `/` to `/en/` runs only in server output, so the root page comes from an explicit `redirects` entry, which static output materialises as the meta refresh the plan asks for.
- pnpm 12 records the packages allowed to run install scripts in `pnpm-workspace.yaml` (`allowBuilds: esbuild`), so that file is committed; the `minimumReleaseAgeExclude` entries it also wrote are pnpm's own record that `astro@7.3.2` was younger than its default minimum age on the day of install.
