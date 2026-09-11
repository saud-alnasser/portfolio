---
status: resolved
---

# feat(cv): a generated document saved under the published document's name

## Outcome

A document generated through the form lands on disk as `resume.en.pdf` or `cv.ar.pdf`, the same name the published download has, because the page takes that name off the download control's own address for the length of the print and puts its own title back afterwards. A reader who opens the form and changes their mind never sees it move.

## Acceptance Criteria

- [x] Generating on each of the four document pages sets the page's title to the download control's `href` basename without its extension at the moment `window.print()` is called: `resume.en`, `resume.ar`, `cv.en`, `cv.ar` (criterion 5).
- [x] The page's own title is back after the print call returns, after `afterprint`, and after a dismissal that never printed. All three, because `afterprint` is not uniformly reliable and the contact line beside it already clears on the same three paths (criterion 5).
- [x] A case that opens the form and dismisses it asserts the title never changed. A test that only ever generates would not see this one (criterion 5).
- [x] The file name is written down nowhere: no new string, no new attribute, no second copy of it. It is read from the address the control already links (criterion 5).
- [x] With no script, all four pages behave exactly as they do today and the control is the plain link to the published PDF, marker or no marker.
- [x] `pnpm build`, `pnpm test`, `pnpm check`, `pnpm render:pdf`, and `pnpm check:dist` pass.

## Relevant areas

`src/layouts/Base.astro`, the `documents()` function inside the one inline script, beside `clear()`; `tests/document-form.spec.ts`, which already stubs and counts `window.print()`.

## Constraints

- **Nothing else about the page changes once the print is over.** The title is what a tab, a history entry, and a bookmark read, so a leak is visible long after the document is saved.
- The published downloads are already named `resume.en.pdf` by their address. Nothing about them changes here.

## Notes

Chrome names a printed PDF after the page's title and appends `.pdf`, which is why the file Saud supplied on 2026-09-11 is called `Resume - Saud Alnasser.pdf` and the page's title is `Resume - Saud Alnasser`. Saud chose `resume.en.pdf` over that name on the same day, with both directions on the table.
