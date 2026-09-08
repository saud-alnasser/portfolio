---
status: open
blocked-by: [05, 07, 08]
---

# test(site): add the build-output checks and the accessibility and performance gates

## Outcome
`scripts/check-dist.mjs` runs every automated check the plan's testing strategy names against `dist/`, and the integration workflow runs it with Lighthouse and axe so that a pull request fails when a criterion regresses. The criterion-1 mechanism test builds with a fixture, changes one value, and asserts it appears in exactly the three outputs.

## Acceptance Criteria
- [ ] The check script asserts: every `dist/en/**` route has a `dist/ar/**` twin and each carries the right `lang` and `dir`; no `href=""` or `href="undefined"`; every page has title, description, and `og:` tags; `sitemap-index.xml` lists every route; `robots.txt` has no `Disallow: /`; the identifier patterns from ticket 04 match nothing in `dist/`; the gap report from the build is printed (criterion 2, criterion 3, criterion 10, criterion 12, criterion 13).
- [ ] Lighthouse runs in CI on `/en/`, `/ar/`, `/en/cv/`, `/ar/cv/` with the mobile profile and fails below 90 on performance, accessibility, or best practices (criterion 7).
- [ ] Playwright tests assert: axe contrast passes in light and dark; the theme control persists across a reload; print emulation on the CV page applies the light tokens; at 360 pixels `scrollWidth` is at most 360; with reduced motion emulated `document.getAnimations()` is empty (criterion 7, criterion 14).
- [ ] A test adds a fixture project, rebuilds, and asserts it appears on the work page, the CV page, and `resume.json` in both languages, and that `git status` shows nothing changed outside `src/content/` (criterion 1, criterion 9).
- [ ] A history scan over `git log -p` with the identifier patterns runs in CI and finds nothing (criterion 12).

## Relevant areas
`scripts/check-dist.mjs`, `tests/` for Playwright, `.github/workflows/integration.yml`, `lighthouserc` or the Lighthouse CI invocation, `package.json` scripts.

## Constraints
- Tests sit as near the code as Astro's conventions allow; Playwright tests under `tests/`, unit checks beside `scripts/`.
- Lighthouse and Playwright run against a local static server of `dist/`, never the live site, so a pull request is judged on its own build.
- Do not weaken a threshold to pass; a failing gate is a finding for the ticket that caused it.

## Notes
The plan's technical approach step 8. Criterion 11 is a reading against the inventory at the close and has no automated check.
