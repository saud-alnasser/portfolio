---
status: open
blocked-by: [01]
---

# feat(site): render the studies timeline as institution cards with one node for the online courses

## Outcome
The education page's timeline holds the institutions as cards, each with the period, the institution, the degree and area, the status as authored, and the courses folded behind a control; and one node for the online-courses phase, placed where the undated certificates were placed before, showing the count and the date range of the dated certificates and linking to the `#certificates` heading. The certificates themselves leave the timeline; their grid is ticket 06, and until it lands the node's link points at a heading that ticket adds.

## Acceptance Criteria
- [ ] The Saudi Electronic University card shows its pending wording and folds its course list; opening the fold lists all 21 courses in the page's language (criterion 4).
- [ ] The timeline reads in order of time with the online-courses node before the most recent institution, so a high school entry, once authored, still comes first and university last (criterion 4, and criterion 2 of the first effort as the spec's assumptions keep it).
- [ ] The node's count equals the number of certificate entries and its range runs from the earliest to the latest dated certificate (criterion 4).
- [ ] Contrast passes in both palettes on `/en/education/` and `/ar/education/`; the page has no horizontal scroll at 360 (criterion 10, criterion 11).

## Relevant areas
`src/pages/[locale]/education/index.astro`, `src/components/Education.astro`, `src/lib/i18n.ts` for the node's strings, `tests/cards.spec.ts`.

## Constraints
- The placement rule from ticket 12 of the first effort stays as `src/content/README.md` describes it; only what is placed changes, from the certificates to their node.
- The `frontend-design` skill guides the visual pass.

## Notes
The plan's technical approach step 2, third page, and "The timeline node".
