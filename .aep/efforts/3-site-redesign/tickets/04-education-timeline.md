---
status: resolved
blocked-by: [01]
---

# feat(site): render the studies timeline as institution cards with one node for the online courses

## Outcome
The education page's timeline holds the institutions as cards, each with the period, the institution, the degree and area, the status as authored, and the courses folded behind a control; and one node for the online-courses phase, placed where the undated certificates were placed before, showing the count and the date range of the dated certificates and linking to the `#certificates` heading. The certificates themselves leave the timeline; their grid is ticket 06, and until it lands the node's link points at a heading that ticket adds.

## Acceptance Criteria
- [x] The Saudi Electronic University card shows its pending wording and folds its course list; opening the fold lists all 21 courses in the page's language (criterion 4). Verified 2026-09-09: `tests/education.spec.ts` finds the card by its `data-status="certificate-pending"` wording, opens its fold, and compares the listed items to the entry's 21 courses read from `src/content/` in the page's language; `pnpm test` 150 passed.
- [x] The timeline reads in order of time with the online-courses node before the most recent institution, so a high school entry, once authored, still comes first and university last (criterion 4, and criterion 2 of the first effort as the spec's assumptions keep it). Verified 2026-09-09: the page splices the node at index `education.length - 1`; the spec asserts the `[data-courses-node]` item precedes the last institution and the most recent institution is last; passing.
- [x] The node's count equals the number of certificate entries and its range runs from the earliest to the latest dated certificate (criterion 4). Verified 2026-09-09: the spec reads the certificates from `src/content/`, expects the count (27) with its plural noun and the range formatted from the earliest and latest dated entries, and matches the node's text; passing.
- [x] Contrast passes in both palettes on `/en/education/` and `/ar/education/`; the page has no horizontal scroll at 360 (criterion 10, criterion 11). Verified 2026-09-09: `tests/contrast.spec.ts` (axe) passes on both education pages in both palettes, the spec runs axe again with the fold open, and asserts no horizontal scroll at 360 with the fold open; passing. `pnpm check:dist` passes including no overclaim.

## Relevant areas
`src/pages/[locale]/education/index.astro`, `src/components/Education.astro`, `src/lib/i18n.ts` for the node's strings, new `tests/education.spec.ts`.

## Constraints
- The placement rule from ticket 12 of the first effort stays as `src/content/README.md` describes it; only what is placed changes, from the certificates to their node.
- The `frontend-design` skill guides the visual pass.

## Notes
The plan's technical approach step 2, third page, and "The timeline node".
