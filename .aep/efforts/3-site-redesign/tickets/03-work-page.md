---
status: resolved
blocked-by: [01]
---

# feat(site): render projects and experience as card grids with folded highlights

## Outcome
The work page shows the projects as a grid of cards, each with the name, the period, the role, the summary, the technologies, and the links a public project has; and the experience entries as cards with the position, the period, the organisation and location, the training badge where it applies, the summary, and the highlights folded behind a control.

## Acceptance Criteria
- [x] Every project and experience entry renders inside a card; the grids are one column at 360 and two or more at 1440 with no horizontal scroll (criterion 3). Verified 2026-09-09: `tests/work.spec.ts` counts `[data-entry]` cards against the collections read from `src/content/`, asserts `gridTemplateColumns` has one track at 360 and two at 1440 on both grids, and no horizontal scroll at 360; `pnpm test` 152 passed.
- [x] Each card shows the entry's name, period, and meta line with the summary; the placement's highlights are folded and open in place listing every highlight; a described project shows no link and a public one shows its repository link (criterion 4). Verified 2026-09-09: the same spec asserts each card's name, period, and meta text against the content, opens the fold and counts its items against the entry's highlights, and checks a described project has no `a` while a public one links its repository; passing.
- [x] With scripting off the folds still open, since they are native details elements (criterion 11). Verified 2026-09-09: the spec's `javaScriptEnabled: false` context opens the fold and reads its list; passing.
- [x] Contrast passes in both palettes on `/en/work/` and `/ar/work/`, and the Arabic grid fills from the right (criterion 10). Verified 2026-09-09: `tests/contrast.spec.ts` (axe) passes on both work pages in both palettes; the spec asserts the first Arabic card's box sits at the end side; reviewed by eye at 360 and 1440 in both palettes and languages.

## Relevant areas
`src/pages/[locale]/work/index.astro`, `src/components/Project.astro`, `src/components/Experience.astro`, new `tests/work.spec.ts`.

## Constraints
- The order of entries is unchanged: `byOrderThenStartDescending` for projects, `byStartDescending` for experience (`src/lib/order.ts`).
- The `frontend-design` skill guides the visual pass.

## Notes
The plan's technical approach step 2, second page.
