---
status: open
blocked-by: [01]
---

# feat(cv): both documents redesigned as one pair, in type rather than in markup

## Outcome

The CV and the resume stop looking like a form and start looking like a document somebody designed. The grey band across every heading is gone, replaced by the heading set in the accent over a hairline rule; the header has a hierarchy; a period is quiet tabular text rather than bold. The markup does not move, so every guarantee that rests on the document's shape holds without being re-earned, and the resume's share of the change returns height to the fit rather than spending it.

## Acceptance Criteria

- [ ] The diff over `src/components/CvDocument.astro` touches class strings and comments only. No element is added, removed, or reordered, and `tests/resume.spec.ts`'s project-entry case, the extraction groups in `scripts/check-dist.mjs`, and `documentHazards` all pass without being edited (criterion 4).
- [ ] `.cv-band` is gone and the `--band` token with it, from `:root` and from `@theme inline`. A section heading is accent type over a hairline rule, still uppercase and still at `tracking-[0.025em]`, because `pdftotext -layout` turns wider tracking into spaces between the letters (criterion 4).
- [ ] The gap between a heading and the block under it stays at 20px on the resume, and the extraction still puts the first entry's dates beside its title rather than on the heading's line. Checked by reading the extracted text, not by reading the rule (criterion 4).
- [ ] `tests/theme.spec.ts` asserts the new state of affairs rather than the band's: nothing inside either document's article declares a background colour, so the printed document no longer depends on the reader's background-graphics setting at all (criterion 4).
- [ ] Every text and background pair on all six pages meets WCAG AA in both palettes, and axe finds no violation. The contrast tests measure computed colours on the live page, so every colour introduced here is covered without being named (criterion 4).
- [ ] Lighthouse reports at least 90 on the three categories for the home, CV, and resume pages in both languages on the mobile profile (criterion 4).
- [ ] The resume's rendered height on `/en/resume/` and `/ar/resume/` is measured before and after, and the ticket records what the change returned. The fit in ticket 05 is budgeted against that number (criterion 2, which ticket 05 owns).
- [ ] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm check`, and `pnpm test:content` pass.

## Relevant areas

`src/styles/global.css`, the CV block and the `@media print` block; `src/components/CvDocument.astro`, the `band`, `row`, `period`, `muted`, and `link` constants and the header block; `tests/theme.spec.ts`; `tests/contrast.spec.ts` and `tests/contrast.ts`, which need no edit and are the check.

## Constraints

- **The type size floor is 10pt and does not move**, as `spec.md` and two prior efforts fix it. A design that needs smaller text is a design this repository refuses.
- **No new markup, and nothing positioned.** `spec.md` refuses a sidebar, a two-column body, an icon standing in for a word, and a skill drawn as a bar. The design is made of type, rule, and colour.
- **The CV takes the same treatment as the resume**, which is Saud's choice of 2026-09-11: the two are one pair and a restyle of one alone makes them read as two unrelated documents.
- The heading must stay a real `<h2>` with real text. Nothing about the look may reach a parser as anything else.

## Notes

The band is the only thing on either document that needs `print-color-adjust: exact`, which `tests/theme.spec.ts` exists to pin. A border is not a background and prints whatever the reader's setting says, so removing the band removes a dependency rather than a decoration, and the test changes to say so.
