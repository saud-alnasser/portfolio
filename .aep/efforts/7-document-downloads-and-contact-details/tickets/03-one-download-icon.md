---
status: resolved
---

# feat(cv): one download icon per document page, in place of the actions row

## Outcome
Each document page opens with a single control: an icon, no visible text, an accessible name saying which document it downloads, and a tooltip carrying the same words. It is an `<a href="/<document>.<locale>.pdf" download data-document-download>`, so with no script it downloads the published PDF and nothing else is needed to make requirement 4 true. The JSON Resume link and the link to the other document leave both pages; the header navigation, which already carries the CV and the resume, is how a reader moves between them. The strings those two links used leave `src/lib/i18n.ts` with them.

## Acceptance Criteria
- [x] Each document page's actions row contains exactly one element; it is a link whose visible content is an icon, whose accessible name names the document it downloads, and whose `href` resolves to that page's own PDF (criterion 1).
- [x] Neither document page contains a link to `resume.json` or to the other document's page, and the header navigation on both still links to the CV and to the resume (criterion 1).
- [x] The control is reachable and activatable by keyboard alone, has a visible focus ring in both themes, and its tooltip and accessible name agree (criterion 8).
- [x] Every string the control uses exists in English and Arabic, the strings the removed links used are gone from both, `pnpm check` reports no error, and the gap report does not grow (criterion 8).
- [x] The row is still hidden in print, so neither the published PDF nor a generated one shows it (criterion 7).
- [x] `pnpm test` passes with `tests/resume.spec.ts` updated: the actions-row test asserts one control per page rather than the old link set (criterion 1).

## Relevant areas
`src/pages/[locale]/cv.astro`, `src/pages/[locale]/resume.astro`, `src/components/Icon.astro` (the `download` icon exists), `src/lib/i18n.ts` (`cv.downloadPdf` stays; `cv.downloadJson`, `cv.resumeLink`, and `resume.cvLink` go), `src/styles/global.css` (`.cv-actions`, including the print rule that hides it), `tests/resume.spec.ts`, `tests/theme.spec.ts` which asserts the row is hidden in print.

## Constraints
- The control's shape is the plan's "Interfaces": a link with `download`, not a button, because a button with no script does nothing and requirement 4 rests on this element working without script.
- Ticket 04 intercepts this control's click. Leave the `data-document-download` hook on it and do not bind any behaviour to it here.
- The JSON Resume document keeps its address. What goes is the link, not the endpoint.

## Notes
The plan's technical approach step 3. Nothing gates it, and it shares no file with 01 or 02, so it can be built beside them.
