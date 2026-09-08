---
status: resolved
blocked-by: [03]
---

# feat(site): build the layout, the pages, the themes, and the language switch

## Outcome
A base layout with the light and dark palettes as CSS variables in shadcn's conventions, a theme control with a few lines of inline script that reads `localStorage` before first paint, a language switch linking to the same page in the other locale, metadata and Open Graph on every page, and the home, work, and education pages in both languages rendering the collections. Motion is CSS under `motion-safe:`. Layout uses logical properties so Arabic renders right to left from the same templates.

## Acceptance Criteria
- [x] Each of home, work, education exists under `/en/` and `/ar/`, is linked from the navigation, and the education page lists entries by ascending start date with high school first and university last where both exist (criterion 2).
  Verified 2026-09-08: after integration `pnpm build` wrote `dist/{en,ar}/index.html`, `dist/{en,ar}/work/index.html`, `dist/{en,ar}/education/index.html` (6 pages). The child verified the navigation hrefs on every page and, with a temporary 2018 high school fixture, that it rendered above the 2022 university entry in both languages; the ordering is `byStartAscending` in `src/lib/order.ts`.
- [x] A project with no link renders no anchor for it, and one with a repository link renders that anchor; every project shows name, period, role, summary, and technologies; a `visibility: hidden` entry appears nowhere in `dist/` (criterion 3).
  Verified with the real content: `dist/en/work/index.html` carries the `github.com/saud-alnasser/rentable` anchor once (public) and `Mudaraj` (described) with no anchor; `grep -c 'href=""'` is 0. The child verified all five fields per project and, with a temporary hidden project named zebra, that `grep -ril zebra dist` was empty.
- [x] The Saudi Electronic University entry renders pending wording in both languages, and `dist/` contains neither "graduated" nor "awarded" beside it (criterion 4).
  Verified: `grep -r -n -i -E 'graduat|awarded' dist` printed nothing; the pending wording is `strings[locale].status['certificate-pending']` in `src/lib/i18n.ts`, rendered by `Education.astro`, and the child confirmed it on both `/en/education/` and `/ar/education/`.
- [x] Every page has a unique `<title>`, a `<meta name="description">`, and `og:title`, `og:description`, `og:url`, `og:locale` tags; the sitemap lists every page (criterion 10).
  Verified: `dist/ar/education/index.html` carries `og:type`, `og:title`, `og:description`, `og:url` (`https://saud-alnasser.github.io/ar/education/`), `og:locale` (`ar_SA`); the child counted six distinct titles, one description and the `og:` set per page, and `dist/sitemap-0.xml` listing all six routes.
- [x] The language switch on any page links to the same route in the other locale; `<html>` carries `lang` and `dir` per locale; an entry missing `ar` text renders its `en` text and the build prints a gap report listing it (criterion 13).
  Verified: `dist/en/work/index.html` carries `href="/ar/work/"` and `hreflang` alternates for both locales; `<html lang="en" dir="ltr">` and `<html lang="ar" dir="rtl">`; with the real English-only content the build printed `[localized] 108 gaps: certificates/code-with-mosh-aspnet-mvc-5.name, ...` naming every field, and the Arabic pages render the English text where the Arabic is missing.
- [x] With `prefers-color-scheme: dark` and nothing stored, the dark tokens apply; the control switches and a reload keeps it; both palettes pass WCAG AA contrast on every text and background pair (criterion 14, criterion 7).
  Verified by the child with Playwright (kept in the scratchpad, not added to the repository): `colorScheme: "dark"` with empty storage gave the dark background `rgb(18, 22, 28)`; clicking the control switched it and a reload kept it, in both directions; a contrast script over every text and background pair gave a lowest ratio of 5.54 in light and 6.42 in dark, all at or above 4.5.
- [x] No horizontal scroll at 360 pixels, no wasted width at 1440 within the layout's stated maximum, and with `prefers-reduced-motion: reduce` nothing animates (criterion 7).
  Verified by the child with Playwright: `document.documentElement.scrollWidth` was 360 at a 360-pixel viewport on every page; `main` measured 768 pixels wide at 1440 (the layout's stated `max-w-3xl`); `document.getAnimations().length` was 0 with `reducedMotion: "reduce"` and 1 without.
- [x] The only client-side JavaScript in `dist/` is the theme script (requirement 7).
  Verified: `find dist -name '*.js'` counts 0 and `dist/en/index.html` carries exactly one `<script>` element, the inline theme script.

## Relevant areas
`src/layouts/`, `src/components/`, `src/pages/[locale]/` or `src/pages/en/` and `src/pages/ar/`, `src/styles/global.css`, `src/lib/i18n.ts` for the UI strings of both languages, `src/lib/localized.ts` for the fallback and gap report.

## Constraints
- Tailwind utilities and logical properties; no `-left`/`-right` utilities except where a direction is meant.
- UI strings (navigation labels, "certificate pending" wording, and so on) live in one file keyed by locale, so ticket 10 can complete the Arabic without touching templates.
- No animation library, no page-transition router, no React; the plan records why and when that is reopened.
- The `frontend-design` guidance applies for the visual pass; the spec's requirement 7 sets the register.

## Notes
The plan's technical approach step 4. The CV page is ticket 06 and shares this layout.

Built 2026-09-08 by a dispatched implementer; no `frontend-design` skill is installed here, so requirement 7 set the register. Decisions recorded: skills are shown on the home page; certificates list by date ascending with undated ones last; `og:locale` is `en_US` and `ar_SA`; the palette tokens are written once with `light-dark()` and switched by `color-scheme`, which sets a browser floor of 2024 releases; Arabic dates use Latin digits; the control toggles rather than cycles. A small integration in `astro.config.mjs` prints the gap report at `astro:build:done`. Every Arabic UI string in `src/lib/i18n.ts` is a draft awaiting Saud's reading in ticket 10. At integration the orchestrator reconciled the seam with ticket 07: `src/lib/resume.ts` now uses `localized()` and the comparators in `src/lib/order.ts` instead of its own copies, so the JSON documents share the fallback, the gap report, and the ordering with the pages.
