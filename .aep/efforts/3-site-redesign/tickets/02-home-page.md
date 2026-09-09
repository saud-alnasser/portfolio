---
status: open
blocked-by: [01]
---

# feat(site): lay the home page out as a hero, contact actions, skill cards, and section cards

## Outcome
The home page opens with the name, the label, and the summary; the contact details are icon actions (email, each profile with its mark, the CV); the skill groups are a grid of cards; and one card per section of the site says what it holds and how many entries, computed from the collections. Nothing on the page repeats the footer.

## Acceptance Criteria
- [ ] In reading order the page shows the name, the label, the summary, the contact actions, the skill cards, and one card per section whose count matches the entries that section renders, in both languages (criterion 5).
- [ ] Each skill card is a card with the group's name, level where one exists, and keywords; the grid is one column at 360 and two or more at 1440 (criterion 3, criterion 4).
- [ ] The contact actions carry icons with accessible names, and the GitHub profile uses its mark; a profile with no mark falls back to the link icon (criterion 1).
- [ ] The content mechanism test still finds the fixture project in exactly the six outputs, since the home page shows counts rather than names (criterion 4).
- [ ] Lighthouse stays at 90 or above on `/en/` and `/ar/`; contrast passes in both palettes; the Arabic page mirrors the grid (criterion 10, criterion 11).

## Relevant areas
`src/pages/[locale]/index.astro`, `src/components/Skills.astro`, new `src/components/SectionCard.astro`, `src/lib/i18n.ts` for the count strings, new `tests/cards.spec.ts` (shared with tickets 03 and 04).

## Constraints
- Counts are computed from `getCollection` with the same visibility filter the pages use; never typed.
- The `frontend-design` skill guides the visual pass.

## Notes
The plan's technical approach step 2, first page.
