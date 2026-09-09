---
status: resolved
blocked-by: [01]
---

# feat(site): lay the home page out as a hero, contact actions, skill cards, and section cards

## Outcome
The home page opens with the name, the label, and the summary; the contact details are icon actions (email, each profile with its mark, the CV); the skill groups are a grid of cards; and one card per section of the site says what it holds and how many entries, computed from the collections. Nothing on the page repeats the footer.

## Acceptance Criteria
- [x] In reading order the page shows the name, the label, the summary, the contact actions, the skill cards, and one card per section whose count matches the entries that section renders, in both languages (criterion 5). Verified 2026-09-09: `tests/home.spec.ts` asserts the reading order on `/en/` and `/ar/` and each `[data-section-card]`'s counts against the collections read from `src/content/` with the work page's visibility filter; inflating a count made it fail in both languages; `pnpm test` 162 passed.
- [x] Each skill card is a card with the group's name, level where one exists, and keywords; the grid is one column at 360 and two or more at 1440 (criterion 3, criterion 4). Verified 2026-09-09: the spec checks each skill card's name, level, and keywords against the content and `gridTemplateColumns` has one track at 360 and three at 1440; passing.
- [x] The contact actions carry icons with accessible names, and the GitHub profile uses its mark; a profile with no mark falls back to the link icon (criterion 1). Verified 2026-09-09: the spec asserts an `svg` and a non-empty accessible name on every contact action and the GitHub mark's path on the GitHub link; `src/lib/networks.ts` maps any other network to `external-link`; axe passes.
- [x] The content mechanism test still finds the fixture project in exactly the six outputs, since the home page shows counts rather than names (criterion 4). Verified 2026-09-09: `pnpm test:content` passed with pnpm's `NODE_PATH` passed through, the fixture in exactly six outputs.
- [x] Lighthouse stays at 90 or above on `/en/` and `/ar/`; contrast passes in both palettes; the Arabic page mirrors the grid (criterion 10, criterion 11). Verified 2026-09-09: Lighthouse mobile through its Node API with the runner's configuration, `/en/` 100/100/96 and `/ar/` 92/100/96 (the `pnpm lighthouse` runner dies in chrome-launcher's temp cleanup on this machine after the audit); `tests/contrast.spec.ts` passes in both palettes; the spec asserts the first Arabic card sits at the end side.

## Relevant areas
`src/pages/[locale]/index.astro`, `src/components/Skills.astro`, new `src/components/SectionCard.astro`, `src/lib/i18n.ts` for the count strings, new `tests/home.spec.ts` (the plan named one `tests/cards.spec.ts` for tickets 02 to 04; it was split per page at dispatch).

## Constraints
- Counts are computed from `getCollection` with the same visibility filter the pages use; never typed.
- The `frontend-design` skill guides the visual pass.

## Notes
The plan's technical approach step 2, first page.
