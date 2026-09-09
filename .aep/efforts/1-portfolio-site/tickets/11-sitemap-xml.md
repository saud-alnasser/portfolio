---
status: resolved
blocked-by: [09]
---

# feat(site): publish the sitemap at /sitemap.xml as the spec names it

## Outcome
`/sitemap.xml` exists in `dist/` and lists every page, so the address criterion 10 names resolves to a sitemap that lists every page. The sitemap integration's `sitemap-index.xml` and `sitemap-0.xml` stay as they are and `robots.txt` keeps pointing at the index.

## Acceptance Criteria
- [x] After `pnpm build`, `dist/sitemap.xml` exists and its `<urlset>` lists exactly the pages `dist/sitemap-0.xml` lists (criterion 10).
  Verified 2026-09-09: `pnpm build` printed `[@astrojs/sitemap] sitemap-index.xml created at dist` followed by `[sitemap-alias] sitemap.xml created at dist`; `ls dist/sitemap*.xml` lists `sitemap.xml`, `sitemap-0.xml`, `sitemap-index.xml`; `diff dist/sitemap-0.xml dist/sitemap.xml` prints nothing. The file is copied from the integration's own page list at `astro:build:done`, so there is no second list of routes.
- [x] The dist check asserts `sitemap.xml` is present and lists every route, beside its existing check of the index (criterion 10).
  Verified: `pnpm check:dist` prints `sitemap: 1 sitemap(s) listing all 8 pages, and sitemap.xml lists them all`, exit 0; with `dist/sitemap.xml` moved aside it fails with `check-dist: sitemap: dist/sitemap.xml does not exist`, exit 1, and passes again once restored.

## Relevant areas
`astro.config.mjs` (a hook beside the gap-report integration), `scripts/check-dist.mjs`.

## Constraints
- No second list of routes anywhere: the file is derived from what `@astrojs/sitemap` wrote, at `astro:build:done`, so it can never disagree with the index.

## Notes
Appended by converge on 2026-09-09: the spec's criterion 10 says `/sitemap.xml`, the plan's URL table said `/sitemap-index.xml`, and tickets 01 and 09 checked the plan's name. The spec wins. Built by the orchestrator as a wave of one. The alias integration is listed after the sitemap integration because `astro:build:done` hooks run in integration order and the copy needs the source to exist.
