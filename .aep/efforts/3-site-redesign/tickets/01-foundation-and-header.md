---
status: resolved
---

# feat(site): card, icon, and fold components, the wider column, and the header controls with icons

## Outcome
The pieces every other ticket renders through exist and the header uses them: the `--band` and `--card` tokens in both palettes, `Icon.astro` with the inline paths the plan lists, `Card.astro`, `Fold.astro`, the `column` prop on `Base.astro` with the three pages on the grid column and the CV on the document column, `LanguageMenu.astro` as a details menu with the languages icon and the script that dismisses it, `ThemeToggle.astro` with the sun and moon, the new strings in both languages, and the tests for the menu, for the widths, and for every page with scripting off. The pages still render their lists as before; making them cards is tickets 02 to 04.

## Acceptance Criteria
- [x] On every page both controls contain an SVG icon and an accessible name, axe reports no control without a name, and the visible icon changes with the theme (criterion 1). Verified 2026-09-09: `pnpm test` 122 passed; `tests/menu.spec.ts` asserts an `svg` inside `[data-language-menu] summary` and `[data-theme-toggle]` with a non-empty accessible name on all 8 routes; `tests/contrast.spec.ts` (axe) passes in both palettes; `tests/theme.spec.ts` asserts the visible icon swaps from moon to sun on toggle.
- [x] The language control opens with a click and with Enter, lists "English" and "العربية" with `aria-current` on the current one, leads to the same route in the other language on every route, and closes on Escape and on a click outside; with JavaScript disabled the list is still reachable and its links work (criterion 2). Verified 2026-09-09: `tests/menu.spec.ts` covers click, Enter, the two items with `aria-current="page"` on the current one, navigation to the twin route on all 8 routes, Escape and outside-click closing, and a `javaScriptEnabled: false` context following the link; all passing.
- [x] `main` measures 1024 pixels wide at 1440 on the home, work, and education pages and 768 on the CV page, centred; nothing scrolls horizontally at 360; nothing animates under reduced motion (criterion 3, criterion 11). Verified 2026-09-09: `tests/layout.spec.ts` asserts 1024 on the three pages and 768 on the CV at 1440 with header and footer matching and centred, no horizontal scroll at 360, and nothing animating under reduced motion; passing.
- [x] Every text and background pair on the header, the menu open and closed, and the card and band tokens meets WCAG AA in both palettes, and the Arabic header mirrors (criterion 10). Verified 2026-09-09: axe passes with the menu closed (contrast test) and open (menu test) in both palettes; the token ratios are computed and recorded in `src/styles/global.css` (card: muted text 5.89 and 6.63, accent 6.95 and 9.78; band: foreground 13.0 and 11.6, muted 4.95 and 5.69); Arabic screenshots at 1440 and 360 reviewed with the header mirrored.
- [x] Every new string exists in both languages in `src/lib/i18n.ts` and the gap report does not grow (criterion 12). Verified 2026-09-09: `nav.language`, `fold.show`, `fold.hide`, and `fold.nouns` exist in `en` and `ar` under the `Strings` type; `pnpm check` 0 errors; `pnpm build` printed `[localized] 0 gaps`; the dist check's gap line is unchanged from baseline.
- [x] With scripting off, every page's `main` still carries its content, asserted by a test in a `javaScriptEnabled: false` context (criterion 11). Verified 2026-09-09: `tests/menu.spec.ts` runs a `javaScriptEnabled: false` context over every route and asserts `main` has non-empty text; passing.

## Relevant areas
`src/styles/global.css`, `src/layouts/Base.astro`, `src/components/` (new `Icon`, `Card`, `Fold`, `LanguageMenu`, `ThemeToggle`), `src/lib/i18n.ts`, `tests/pages.ts`, `tests/layout.spec.ts`, new `tests/menu.spec.ts`.

## Constraints
- The plan's "Architecture", "Components", and "Interfaces" fix the choices: inline SVG paths with the Lucide and Simple Icons notices in the component, a `<details>` menu, the one inline script, and the test hooks `[data-theme-toggle]`, `[data-language-menu]`.
- Keep the `theme-when-light` and `theme-when-dark` mechanism for the toggle so the theme test keeps passing unchanged.
- The `frontend-design` skill guides the visual pass; the spec's requirement 7 of the first effort sets the register, minimal and content-first.
- Tailwind utilities and logical properties, as the first effort's tickets required.

## Notes
The plan's technical approach step 1. Everything else stacks on this branch.
