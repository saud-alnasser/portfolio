---
status: open
blocked-by: [03]
---

# feat(cv): the GitHub address as a QR code with the mark at its centre

## Outcome

The GitHub address is a QR code in the header of both documents, with the GitHub mark in the middle of it, and the text of the address leaves the contact line. It is built from `src/content/profile.yaml` at build time, so it cannot point somewhere the content source does not, and a check decodes it out of the rendered PDF, because the code is now the only route to that address on paper.

## Acceptance Criteria

- [ ] A component renders one inline `<svg>` from the address in the content source: the modules at error correction level H, a light plate behind them in both themes, a knockout at the centre, and the GitHub mark drawn inside the same SVG. Nothing is positioned, and `tests/resume.spec.ts`'s positioned-element case still passes (criterion 7).
- [ ] The header of the CV and the resume shows it beside the name and the label, in both languages and both directions, and neither contact line carries a GitHub address in text any more (criterion 7, requirement 7).
- [ ] On screen it is the link to that address, and it names that address for assistive technology, because the words that used to say it are gone (criterion 7).
- [ ] A `qrCode` check in `scripts/check-dist.mjs` renders page one of `cv.en.pdf`, `cv.ar.pdf`, `resume.en.pdf`, and `resume.ar.pdf`, decodes the code out of the pixels, and fails naming the file when the payload is not the address in `profile.yaml` or when no code is found there at all (criterion 7).
- [ ] Changing the address in `src/content/profile.yaml` changes what the code decodes to, with no other edit. Tried once, and put back (criterion 7).
- [ ] `documentHazards` refuses a `<table>`, an `<img>`, and any `<svg>` inside the document's article but this one. Tried once by adding a second, so the widened check is known to fail (criterion 7).
- [ ] The icon bodies move to a module that `src/components/Icon.astro` and the QR component both read, so the GitHub mark is written once. Every page that uses an icon renders as it did, which the layout, home, work, and education tests say (criterion 7).
- [ ] The code is printed on paper and scanned once with a phone. The ticket records the box size, the module size, and whether it read first time. No check can make a phone camera, and this is the only evidence that the thing works where it is meant to work (criterion 7).
- [ ] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm check`, and `pnpm test:content` pass, and the build's gap report does not grow.

## Relevant areas

`src/components/CvDocument.astro`, the header block and the contact list; `src/components/Icon.astro`, whose `icons` map moves; `src/content/profile.yaml`, which holds the address; `scripts/check-dist.mjs`, beside `documentHazards` and the PDF checks; `scripts/certificate-previews.mjs`, which already renders a PDF page to pixels with pdf.js and `@napi-rs/canvas` and is the pattern the decode check follows.

## Constraints

- **The code is a pure function of the content source.** No committed SVG, no external service, and nothing drawn by script in the browser: both document pages work with no script, which is a guarantee of effort 11, and the PDF render would otherwise be racing a script to draw it.
- **Dark modules on a light plate in both themes.** A scanner reads an inverted code unreliably, and the plate belongs to the code rather than to the page, so it is a shape inside the SVG rather than a CSS background.
- **The mark goes inside the SVG, not over it.** A positioned element inside the document is refused, so the mark is a transformed group in the same drawing, over a knockout that level H's redundancy pays for.
- The encoder is a dependency, since the site's own pages import it; the decoder is a devDependency, since only the check reads it. Both are pinned the way every other dependency here is and Renovate watches them.
- The QR is sized against the header block it sits beside. Growing it past that height takes millimetres out of the fit that ticket 05 has to make, and `spec.md` records that the scan and the fit pull against each other.

## Notes

This is the ticket that lifts "no image", which effort 5's criterion 11, effort 7's criterion 7, and `documentHazards` have all held. Saud asked for the code on 2026-09-11 and chose replacing the address text over keeping it beside the code, with the cost stated: an ATS reading the PDF now finds no GitHub address, and a recruiter reading on screen has the link but no text to copy. The address survives in both `resume.json` documents at `basics.profiles[].url`, which is untouched here.

The address is 32 characters, which at level H is a 33 by 33 code, so a 20mm box gives modules of about 0.6mm. Readable, and not comfortable. That is why the scan is an acceptance criterion rather than an assumption.
