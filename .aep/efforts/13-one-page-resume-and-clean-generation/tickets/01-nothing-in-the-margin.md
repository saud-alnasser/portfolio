---
status: open
---

# feat(cv): a page box with no room for the browser's header and footer

## Outcome

The resume prints in a page box with no margin and carries its own white space instead, so a document generated through the form comes out with nothing on it the document did not put there. The render step proves it by taking a further render the way a print dialog takes one, and proves the check can fail by taking the same render of the CV, which still carries the furniture and is expected to.

## Acceptance Criteria

- [ ] `@page resume` carries no margin and the resume's article carries the white space the box used to, at the same 10mm, so the published `resume.en.pdf` and `resume.ar.pdf` render with their text in the same place as before. Compared by rendering the file before and after and reading back where the first line falls (criterion 1).
- [ ] `scripts/render-pdf.mjs` renders each resume page a further time with the header and footer switched on and fails, naming the locale, when the extracted text of that render carries the page title, the page address, a page number, or a date stamp (criterion 1).
- [ ] The same render of each CV page fails when it does **not** carry them. That is the positive control, and without it the check passes on a renderer that has quietly stopped drawing furniture at all (criterion 1).
- [ ] Tried once, both ways: putting a margin back on the resume's page box fails the resume half, and taking the furniture out of the CV fails the control half. A check neither half can fail is not a check.
- [ ] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm check`, and `pnpm test:content` all pass, and the resume's page count is no worse than it is on `main`.

## Relevant areas

`src/styles/global.css`, the `@page resume` rule and the `@media print` block under it; `scripts/render-pdf.mjs`, beside `render()` and `renderFilled()`; `.aep/efforts/13-one-page-resume-and-clean-generation/evidence/prototypes/print-furniture-and-the-page-box.md`, which measured the mechanism.

## Constraints

- **The CV's page box is untouched.** It runs to five pages and needs the margin on every one of them, which `spec.md` records in Out of Scope.
- **The usable text height does not change.** The margin becomes padding of the same size, so this ticket neither helps nor hurts the fit that ticket 05 has to make. A ticket that quietly bought height here would make the fit's arithmetic wrong.
- The white space goes on the document's own article rather than on `main`, so the box that carries the padding is the box that has to fit on one page.

## Notes

The furniture is drawn from the paper edge rather than from the text, so a small margin does not produce a small header: it is present or it is absent, and the page box is the switch. Measured in the prototype above, at three page boxes, with the furniture switched off and on.
