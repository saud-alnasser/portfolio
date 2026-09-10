---
status: open
blocked-by: [01]
---

# feat(site): experience before projects, courses and certifications as their own grids, and the home page's section index

## Outcome
The work page shows the experience grid first and the projects grid after it, each under a heading with an id. The education page shows the studies timeline, whose online-courses node counts the courses and links to `#courses`, then the courses grid, then the certifications grid, with the one dialog serving both. The home page shows one section card per section, experience, projects, education, courses, certifications, and skills, each linking to its section's heading and counting what it renders, beside the CV card it has today; the resume card and the resume link in the navigation arrive with ticket 03. Every new string exists in both languages and the browser tests assert the new shape.

## Acceptance Criteria
- [ ] On both work pages the experience grid precedes the projects grid in document order, each under its own heading; `tests/work.spec.ts` asserts the order and passes (criterion 4).
- [ ] On both education pages `[data-grid="courses"]` holds one card per `kind: course` entry in date order with undated ones last, each showing its name, its issuer, and its date where known, and each card naming a document opens the dialog with the redesign's close, link, Escape, and focus behaviour; `[data-grid="certifications"]` holds one card per `kind: certification` entry with the same behaviour; `tests/certificates.spec.ts` asserts both grids and passes (criterion 5, criterion 6).
- [ ] The timeline's online-courses node shows the count of the courses grid, worded with the courses noun, and links to `#courses`; `tests/education.spec.ts` asserts it and passes (criterion 5).
- [ ] Reclassifying one entry's `kind` and rebuilding moves its card from one grid to the other with no other edit, tried once and recorded (criterion 6).
- [ ] On both home pages the section grid shows seven cards in order, experience, projects, education, courses, certifications, skills, CV, each section card linking to its section's heading anchor and showing a count equal to the entries that section renders; `tests/home.spec.ts` asserts the cards, their anchors, and their counts from the collections through the predicate, and passes (criterion 4, criterion 7).
- [ ] At 360 pixels every grid on the work, education, and home pages is one column with no horizontal scroll, and at 1440 two or more, asserted by the per-page tests as today (criterion 7).
- [ ] Every new string exists in both languages in `src/lib/i18n.ts`, `pnpm check` passes, and the dist check's gap line does not grow; `tests/contrast.spec.ts`, `tests/layout.spec.ts`, and `tests/menu.spec.ts` pass over every page including the no-script context (criterion 14).

## Relevant areas
`src/pages/[locale]/work/index.astro`, `src/pages/[locale]/education/index.astro`, `src/pages/[locale]/index.astro`, `src/components/Certificate.astro` (`data-entry` from `kind`), `src/components/SectionCard.astro`, `src/lib/i18n.ts`, `tests/work.spec.ts`, `tests/education.spec.ts`, `tests/certificates.spec.ts`, `tests/home.spec.ts`.

## Constraints
- The routes are the plan's option B, chosen by Saud: no route is added or removed here; sections are headings with ids on the pages that hold them, and the home cards link to those anchors. The `section` attribute values and the `data-grid` and `data-entry` values are the plan's "Interfaces".
- The certifications grid keeps the `#certificates` id on its heading so an inbound link still lands; the courses grid takes `#courses`.
- The skills card links to `#skills` on the home page and counts the skill groups.
- The strings this ticket adds are the plan's "Components" row for `i18n.ts`, minus the resume and document strings, which ticket 03 adds; the two sets share no key.

## Notes
The plan's technical approach step 2. Stacks on 01; independent of 03 and 04 except that 03 also edits `index.astro` and `i18n.ts`, which the orchestrator reconciles at integration.
