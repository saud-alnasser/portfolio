---
status: open
blocked-by: [04, 05]
---

# feat(site): show the certificates as a card grid whose cards open the document in a dialog

## Outcome
Below the timeline, under the `#certificates` heading, the certificates render as a grid of cards with the name, the issuer, and the date where one is known. A card with a document is a link to its PDF that the script turns into the page's one dialog, showing the preview, a caption, the link to the PDF, and a close control; a card without a document is neither a link nor a button. The dialog test covers open, close, and focus return.

## Acceptance Criteria
- [ ] 27 cards carry `data-document`; clicking one opens the dialog with the preview's `src` set and the PDF link present; Escape closes it and focus returns to the card; with scripting off the card opens the PDF (criterion 6, criterion 11).
- [ ] A certificate entry with no `document`, checked with a temporary fixture, renders a card that is neither `<a>` nor `<button>` (criterion 6).
- [ ] No preview loads with the page: the dialog's image has no `src` until opened, and Lighthouse stays at 90 or above on the home and CV pages (criterion 11).
- [ ] The grid is one column at 360 and two or more at 1440; contrast passes in both palettes with the dialog open and closed; the Arabic grid fills from the right (criterion 3, criterion 10).
- [ ] The CV page's certifications list is unchanged (criterion 6).

## Relevant areas
`src/pages/[locale]/education/index.astro`, `src/components/Certificate.astro`, new `src/components/CertificateDialog.astro`, `src/layouts/Base.astro` for the dialog handler in the inline script, `src/lib/i18n.ts`, new `tests/certificates.spec.ts`.

## Constraints
- The plan's "Interfaces" fix the globs, the `getImage()` call, the data attributes, and the dialog as a child of `body`, outside `main`.
- The `certificate.view` string is replaced by `certificate.open`.

## Notes
The plan's technical approach step 3, the page half. Blocked by 04 because both restructure the education page, and by 05 for the field and the files.
