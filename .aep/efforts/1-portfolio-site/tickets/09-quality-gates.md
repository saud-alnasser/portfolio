---
status: resolved
blocked-by: [05, 07, 08]
---

# test(site): add the build-output checks and the accessibility and performance gates

## Outcome
`scripts/check-dist.mjs` runs every automated check the plan's testing strategy names against `dist/`, and the integration workflow runs it with Lighthouse and axe so that a pull request fails when a criterion regresses. The criterion-1 mechanism test builds with a fixture, changes one value, and asserts it appears in exactly the three outputs.

## Acceptance Criteria
- [x] The check script asserts: every `dist/en/**` route has a `dist/ar/**` twin and each carries the right `lang` and `dir`; no `href=""` or `href="undefined"`; every page has title, description, and `og:` tags; `sitemap-index.xml` lists every route; `robots.txt` has no `Disallow: /`; the identifier patterns from ticket 04 match nothing in `dist/`; the gap report from the build is printed (criterion 2, criterion 3, criterion 10, criterion 12, criterion 13).
  Verified 2026-09-09 in the run's surface after integration: `pnpm check:dist` printed `locale twins: 4 routes in each language, lang and dir as expected: /cv/ /education/ / /work/`, `hrefs: 174 links in 9 pages, none empty or undefined`, `metadata: 8 pages with a unique title, a description, and og:title, og:description, og:url, og:locale`, `sitemap: 1 sitemap(s) listing all 8 pages`, `robots.txt: no "Disallow: /" line`, `identifiers: no pattern matches in 15 text files and the text of 2 PDFs`, `[localized] 0 gaps`, exit 0. The child ran eight negative probes (a missing twin, an empty href, a page without a description, a route missing from the sitemap, a `Disallow: /` line, a bare student-id and national-id number in `dist/`, a mobile number beside a URL) and each failed with the file named.
- [x] Lighthouse runs in CI on `/en/`, `/ar/`, `/en/cv/`, `/ar/cv/` with the mobile profile and fails below 90 on performance, accessibility, or best practices (criterion 7).
  Verified: `lighthouserc.json` collects the four URLs from `staticDistDir: ./dist` with Lighthouse's default mobile profile, three runs each, and asserts the three categories at `minScore: 0.9` as errors; the integration workflow runs `pnpm lighthouse` after `pnpm check:dist`. The child's twelve runs passed with scores of 96 to 100, and a probe at `minScore: 0.99` failed on `/ar/` (0.98), so the assertion is live. In the run's surface two runs completed at performance 1, accessibility 1, best practices 0.96 on `/en/` before chrome-launcher's temp-profile cleanup failed with `EPERM` on this Windows machine, an intermittent local race; the Linux runner is the authoritative one.
- [x] Playwright tests assert: axe contrast passes in light and dark; the theme control persists across a reload; print emulation on the CV page applies the light tokens; at 360 pixels `scrollWidth` is at most 360; with reduced motion emulated `document.getAnimations()` is empty (criterion 7, criterion 14).
  Verified: `pnpm test` ran `tests/contrast.spec.ts`, `tests/theme.spec.ts`, and `tests/layout.spec.ts` against `scripts/serve-dist.mjs` in light and dark projects: `38 passed (5.2s)`. The child's probe with a grey paragraph failed the contrast test at 2.32:1. axe's `color-contrast` rule matches nothing on the Arabic pages (its icon-ligature heuristic takes joined Arabic for an icon font), so the test asserts that exact reason and adds a direct WCAG measurement of every text and background pair on every page in both palettes.
- [x] A test adds a fixture project, rebuilds, and asserts it appears on the work page, the CV page, and `resume.json` in both languages, and that `git status` shows nothing changed outside `src/content/` (criterion 1, criterion 9).
  Verified: `pnpm test:content` printed `present: "fixture-mechanism-probe-4f9c2e" in dist/en/work/index.html, dist/ar/work/index.html, dist/en/cv/index.html, dist/ar/cv/index.html, dist/en/resume.json, dist/ar/resume.json and nowhere else`, then `absent: ... is in no file under dist/`, `test-content-mechanism: passed`, and `git status --porcelain` showed nothing outside `src/content/` during and nothing at the end.
- [x] A history scan over `git log -p` with the identifier patterns runs in CI and finds nothing (criterion 12).
  Verified: `pnpm scan:history` (`scripts/scan-history.mjs` over `git log -p --all`, the integration checkout at `fetch-depth: 0`) exits 0 with `no identifier pattern matches` once the integrated commit was amended; see the notes for the one decision it took.

## Relevant areas
`scripts/check-dist.mjs`, `tests/` for Playwright, `.github/workflows/integration.yml`, `lighthouserc` or the Lighthouse CI invocation, `package.json` scripts.

## Constraints
- Tests sit as near the code as Astro's conventions allow; Playwright tests under `tests/`, unit checks beside `scripts/`.
- Lighthouse and Playwright run against a local static server of `dist/`, never the live site, so a pull request is judged on its own build.
- Do not weaken a threshold to pass; a failing gate is a finding for the ticket that caused it.

## Notes
The plan's technical approach step 8. Criterion 11 is a reading against the inventory at the close and has no automated check.

Built 2026-09-09 by a dispatched implementer (a first attempt died on a session limit before writing anything; the second re-entered the same worktree). One decision, taken by the orchestrator when the child stopped on it: the identifier patterns ignore digits inside a URL token (`https?://\S+`), in `scripts/identifiers.mjs`, shared by the dist check and the history scan, because the spec's evidence file cites support articles whose nine-digit numbers read like a student id, and criterion 12 is about an identifier standing in the text. The exemption must never grow into a list of exceptions. The child's own comment then carried such a number without a scheme and tripped the scan; the comment was reworded at integration. Probes after the decision: a bare nine-digit and ten-digit number still fail, a support URL alone passes, a mobile number beside a URL still fails.
