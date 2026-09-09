---
status: open
---

# feat(site): card, icon, and fold components, the wider column, and the header controls with icons

## Outcome
The pieces every other ticket renders through exist and the header uses them: the `--band` and `--card` tokens in both palettes, `Icon.astro` with the inline paths the plan lists, `Card.astro`, `Fold.astro`, the `column` prop on `Base.astro` with the three pages on the grid column and the CV on the document column, `LanguageMenu.astro` as a details menu with the languages icon and the script that dismisses it, `ThemeToggle.astro` with the sun and moon, the new strings in both languages, and the tests for the menu, for the widths, and for every page with scripting off. The pages still render their lists as before; making them cards is tickets 02 to 04.

## Acceptance Criteria
- [ ] On every page both controls contain an SVG icon and an accessible name, axe reports no control without a name, and the visible icon changes with the theme (criterion 1).
- [ ] The language control opens with a click and with Enter, lists "English" and "العربية" with `aria-current` on the current one, leads to the same route in the other language on every route, and closes on Escape and on a click outside; with JavaScript disabled the list is still reachable and its links work (criterion 2).
- [ ] `main` measures 1024 pixels wide at 1440 on the home, work, and education pages and 768 on the CV page, centred; nothing scrolls horizontally at 360; nothing animates under reduced motion (criterion 3, criterion 11).
- [ ] Every text and background pair on the header, the menu open and closed, and the card and band tokens meets WCAG AA in both palettes, and the Arabic header mirrors (criterion 10).
- [ ] Every new string exists in both languages in `src/lib/i18n.ts` and the gap report does not grow (criterion 12).
- [ ] With scripting off, every page's `main` still carries its content, asserted by a test in a `javaScriptEnabled: false` context (criterion 11).

## Relevant areas
`src/styles/global.css`, `src/layouts/Base.astro`, `src/components/` (new `Icon`, `Card`, `Fold`, `LanguageMenu`, `ThemeToggle`), `src/lib/i18n.ts`, `tests/pages.ts`, `tests/layout.spec.ts`, new `tests/menu.spec.ts`.

## Constraints
- The plan's "Architecture", "Components", and "Interfaces" fix the choices: inline SVG paths with the Lucide and Simple Icons notices in the component, a `<details>` menu, the one inline script, and the test hooks `[data-theme-toggle]`, `[data-language-menu]`.
- Keep the `theme-when-light` and `theme-when-dark` mechanism for the toggle so the theme test keeps passing unchanged.
- The `frontend-design` skill guides the visual pass; the spec's requirement 7 of the first effort sets the register, minimal and content-first.
- Tailwind utilities and logical properties, as the first effort's tickets required.

## Notes
The plan's technical approach step 1. Everything else stacks on this branch.
