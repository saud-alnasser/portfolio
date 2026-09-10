---
status: resolved
blocked-by: [02, 03]
---

# feat(cv): the form that fills the contact line, and the print that generates the document

## Outcome
A `<dialog>` holding two fields, a generate button, and a plain-download link. With script, the download control opens it instead of downloading; generate writes the typed email and phone into the contact line's hidden slots, unsets `hidden`, closes the dialog, and calls `window.print()`, and the reader saves the result as a PDF. Printing finished, or the dialog closed, clears both slots and hides them again, so the page returns to the state the published document is in. Nothing is stored and nothing is sent: the dialog's form is `method="dialog"`, the submit handler calls `preventDefault()`, and the page makes no request while generating.

## Acceptance Criteria
- [x] Activating the control with script opens the dialog; entering an email and a phone and generating produces a document whose contact line contains both, in that order, at the position the email occupied before this effort; entering one and not the other produces a document carrying the one (criterion 3).
- [x] The page issues no network request while the dialog is open or while generating, asserted in a test that fails if one is made (criterion 3).
- [x] With JavaScript disabled, both document pages render in full and the control is a plain link that downloads the published PDF, which carries no contact details (criterion 4).
- [x] Dismissing the dialog, by its close control, by Escape, or by the backdrop, leaves the contact slots hidden and empty, and the plain-download link in the dialog downloads the published document (criterion 4).
- [x] After printing, the contact slots are empty and hidden again, on both the `afterprint` path and the dialog's `close` path (criterion 3).
- [x] The dialog is reachable and completable by keyboard alone, both fields are labelled, Escape closes it, focus returns to the control that opened it, it renders correctly in both themes and both directions, and it respects reduced motion (criterion 8).
- [x] Every string the dialog uses exists in English and Arabic, `pnpm check` reports no error, and the gap report does not grow (criterion 8).
- [x] Lighthouse reports at least 90 on the three categories for the home, CV, and resume pages in both languages on the mobile profile (criterion 8).
- [x] Whether `print-color-adjust: exact` overrides a reader's background-graphics setting is established by trying it, and the answer is recorded on this ticket (criterion 7).

## Relevant areas
New `src/components/DocumentForm.astro`, modelled on `src/components/CertificateDialog.astro`; `src/layouts/Base.astro` (the existing inline script block, and rendering the dialog outside `<main>` as the certificate dialog already does); `src/pages/[locale]/cv.astro` and `resume.astro`; `src/components/CvDocument.astro` (the slots ticket 02 leaves); `src/styles/global.css` (the dialog's surface and the print rules); `src/lib/i18n.ts`; `tests/certificates.spec.ts` as the model for the dialog's keyboard test; `tests/resume.spec.ts`, `tests/theme.spec.ts`, `tests/contrast.spec.ts`.

## Constraints
- The script's contract is the plan's "Interfaces": fill, unhide, close, print; clear on both `afterprint` and `close`. Treat the filled state as transient, never as the page's state, because `afterprint` is not uniformly reliable and the plan names that as a risk.
- The dialog renders outside `<main>`, as the certificate dialog does, because a transform on an ancestor breaks a dialog's place in the top layer.
- The form stores nothing. No `localStorage`, no cookie, no query parameter. Saud chose this on 2026-09-10 over a remember-on-this-device checkbox.
- The dialog's own text says a print dialog is what opens, so a reader is not left to guess why. The plan's "Operational considerations" says why that sentence exists.
- The generated document is not written anywhere by the site. Producing one in CI is ticket 05's.

## Notes
The plan's technical approach step 4. Stacks on 02, which leaves the slots, and on 03, which leaves the control this binds to.

### The background-graphics answer

`print-color-adjust: exact` **does** override a reader whose print dialog has background graphics switched off, in Chromium. Established by rendering `/en/cv/` twice through Playwright's `page.pdf()`, once with `printBackground: true` and once with `false`, which is that setting, and reading the fill colours pdf.js finds on the first page of each. The band resolves to `rgb(221, 232, 240)` with `print-color-adjust: exact`, and `#dde8f0` is among the fills in **both** renders. The two files differ by 32 bytes, so the flag is not inert, but the band is not what it reaches.

**Not established: Firefox and Safari.** Chromium is what the render step drives and what Chrome and Edge readers use, and it is the only engine this probe covers. Either outcome was acceptable, per the plan: the bands are the template's one tint and the document is legible and parseable without them.
