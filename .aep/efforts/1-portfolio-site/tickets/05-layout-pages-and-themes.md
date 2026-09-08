---
status: open
blocked-by: [03]
---

# feat(site): build the layout, the pages, the themes, and the language switch

## Outcome
A base layout with the light and dark palettes as CSS variables in shadcn's conventions, a theme control with a few lines of inline script that reads `localStorage` before first paint, a language switch linking to the same page in the other locale, metadata and Open Graph on every page, and the home, work, and education pages in both languages rendering the collections. Motion is CSS under `motion-safe:`. Layout uses logical properties so Arabic renders right to left from the same templates.

## Acceptance Criteria
- [ ] Each of home, work, education exists under `/en/` and `/ar/`, is linked from the navigation, and the education page lists entries by ascending start date with high school first and university last where both exist (criterion 2).
- [ ] A project with no link renders no anchor for it, and one with a repository link renders that anchor; every project shows name, period, role, summary, and technologies; a `visibility: hidden` entry appears nowhere in `dist/` (criterion 3).
- [ ] The Saudi Electronic University entry renders pending wording in both languages, and `dist/` contains neither "graduated" nor "awarded" beside it (criterion 4).
- [ ] Every page has a unique `<title>`, a `<meta name="description">`, and `og:title`, `og:description`, `og:url`, `og:locale` tags; the sitemap lists every page (criterion 10).
- [ ] The language switch on any page links to the same route in the other locale; `<html>` carries `lang` and `dir` per locale; an entry missing `ar` text renders its `en` text and the build prints a gap report listing it (criterion 13).
- [ ] With `prefers-color-scheme: dark` and nothing stored, the dark tokens apply; the control switches and a reload keeps it; both palettes pass WCAG AA contrast on every text and background pair (criterion 14, criterion 7).
- [ ] No horizontal scroll at 360 pixels, no wasted width at 1440 within the layout's stated maximum, and with `prefers-reduced-motion: reduce` nothing animates (criterion 7).
- [ ] The only client-side JavaScript in `dist/` is the theme script (requirement 7).

## Relevant areas
`src/layouts/`, `src/components/`, `src/pages/[locale]/` or `src/pages/en/` and `src/pages/ar/`, `src/styles/global.css`, `src/lib/i18n.ts` for the UI strings of both languages, `src/lib/localized.ts` for the fallback and gap report.

## Constraints
- Tailwind utilities and logical properties; no `-left`/`-right` utilities except where a direction is meant.
- UI strings (navigation labels, "certificate pending" wording, and so on) live in one file keyed by locale, so ticket 10 can complete the Arabic without touching templates.
- No animation library, no page-transition router, no React; the plan records why and when that is reopened.
- The `frontend-design` guidance applies for the visual pass; the spec's requirement 7 sets the register.

## Notes
The plan's technical approach step 4. The CV page is ticket 06 and shares this layout.
