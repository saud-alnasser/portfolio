---
status: open
blocked-by: [03]
---

# feat(cv): the GitHub address as a QR code with the mark at its centre

## Outcome

The GitHub address is a QR code in the header of both documents, with the GitHub mark in the middle of it, and the text of the address leaves the contact line. It is built from `src/content/profile.yaml` at build time, so it cannot point somewhere the content source does not, and a check decodes it out of the rendered PDF, because the code is now the only route to that address on paper.

## Acceptance Criteria

- [x] A component renders one inline `<svg>` from the address in the content source: the modules at error correction level H, a light plate behind them in both themes, a knockout at the centre, and the GitHub mark drawn inside the same SVG. Nothing is positioned, and `tests/resume.spec.ts`'s positioned-element case still passes (criterion 7).
- [x] The header of the CV and the resume shows it beside the name and the label, in both languages and both directions, and neither contact line carries a GitHub address in text any more (criterion 7, requirement 7).
- [x] On screen it is the link to that address, and it names that address for assistive technology, because the words that used to say it are gone (criterion 7).
- [x] A `qrCode` check in `scripts/check-dist.mjs` renders page one of `cv.en.pdf`, `cv.ar.pdf`, `resume.en.pdf`, and `resume.ar.pdf`, decodes the code out of the pixels, and fails naming the file when the payload is not the address in `profile.yaml` or when no code is found there at all (criterion 7).
- [x] Changing the address in `src/content/profile.yaml` changes what the code decodes to, with no other edit. Tried once, and put back (criterion 7).
- [x] `documentHazards` refuses a `<table>`, an `<img>`, and any `<svg>` inside the document's article but this one. Tried once by adding a second, so the widened check is known to fail (criterion 7).
- [x] The icon bodies move to a module that `src/components/Icon.astro` and the QR component both read, so the GitHub mark is written once. Every page that uses an icon renders as it did, which the layout, home, work, and education tests say (criterion 7).
- [ ] The code is printed on paper and scanned once with a phone. The ticket records the box size, the module size, and whether it read first time. No check can make a phone camera, and this is the only evidence that the thing works where it is meant to work (criterion 7).
- [x] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm check`, and `pnpm test:content` pass, and the build's gap report does not grow.

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

## The two numbers this ticket was to measure rather than assume

| | Estimated in the ticket | Measured |
| --- | --- | --- |
| the code | 33 by 33 modules at level H | **33 by 33**, as predicted |
| the drawn box | 20mm | **21.2mm**, sized to the name block beside it |
| a module on paper | 0.6mm | **0.52mm** |

**The estimate counted the data and forgot the quiet zone.** A 33 by 33 code is drawn over 41 modules, because the standard asks for four modules of blank on every side and a scanner relies on them. At 21.2mm that is 0.52mm a module rather than 0.6mm.

Reaching 0.6mm would mean a 24.6mm box, which is 13px more than the name block beside it, and the resume has 98px still to find. `spec.md` records that the scan and the fit pull against each other, and this is where they pulled: the box is sized to the block it sits beside, the quiet zone stays at the standard's four modules, and whether 0.52mm reads off a home printer is left to the one criterion no check can answer.

**What the header actually costs, measured rather than argued.** The article is **1033.9px on `/en/resume/` with the code in it and 1033.9px without** — the same number to the decimal, because the code is drawn no taller than the name and label block it sits beside:

```
/en/resume/ name block 80.0px (21.2mm), code 80.0px (21.2mm) over 41 modules, module 0.52mm, article 1033.9px
/ar/resume/ name block 80.0px (21.2mm), code 80.0px (21.2mm) over 41 modules, module 0.52mm, article 1013.9px
/en/cv/     name block 88.0px (23.3mm), code 80.0px (21.2mm) over 41 modules, module 0.52mm, article 3560.9px
```

So requirement 7's "it costs the fit nothing" is a measurement here, not a hope. A browser case asserts it too, so a code that later grows past the block fails rather than quietly taking the resume's last page.

## The checks, and both ways each of them fails

**The code decodes out of the rendered PDF**, not out of the markup. `qrCode` in `scripts/check-dist.mjs` rasterises page one of each document at four times scale with pdf.js and `@napi-rs/canvas` — the pattern `scripts/certificate-previews.mjs` already uses — and hands the pixels to a decoder that knows nothing about how they were drawn:

```
qr code: cv.en.pdf page 1 decodes to https://github.com/saud-alnasser
qr code: cv.ar.pdf page 1 decodes to https://github.com/saud-alnasser
qr code: resume.en.pdf page 1 decodes to https://github.com/saud-alnasser
qr code: resume.ar.pdf page 1 decodes to https://github.com/saud-alnasser
```

All three of its branches were made to fire:

- **The code follows the content source.** Changed `profile.yaml` to `https://github.com/saud-alnasser-elsewhere`, rebuilt and re-rendered with no other edit: all four documents decoded to the new address. Put back.
- **The check refuses a disagreement.** Put `profile.yaml` back without re-rendering, so the PDFs still carried the old address: `qr code: the QR code on page 1 of cv.en.pdf decodes to "https://github.com/saud-alnasser-elsewhere", and src/content/profile.yaml says "https://github.com/saud-alnasser"`. Re-rendered, green.
- **The check refuses a document with no code.** Suppressed the component and re-rendered: `qr code: no QR code could be read on page 1 of cv.en.pdf; the code is the document's only route to the GitHub address on paper, so a code that will not decode has lost it`. Put back, green.

**`documentHazards` was widened, and made to fail.** It now refuses every `<svg>` inside the document's article except the one marked `data-qr-code`, and refuses a second code. Added a four-pixel `<svg>` to the header and rebuilt: `document hazards: dist/en/cv/index.html carries 1 graphic(s) in the document besides the QR code; a resume parser reads none of them, and the code is the one exception this repository agreed to`. Removed, green.

That widening is the point rather than a side effect. Four efforts held "no image", and an inline `<svg>` is not an `<img>`: without it the check would have gone on printing "no table or image" over a document carrying a graphic.

## What moved, and why

- **`src/lib/icons.ts` is new**, holding the icon bodies that were inside `Icon.astro`. `QrCode.astro` draws the GitHub mark into the middle of the code from the same map, and a mark typed out twice is a mark that can differ in two places. `Icon.astro` reads it and renders exactly as before, which the 596 passing cases over the layout, home, work, and education pages say.
- **The mark is a `<g transform>` inside the same SVG**, over a knockout of 8 modules square, about 6 percent of the code's area and well inside what level H recovers. Not a positioned element laid over the code, which `spec.md` and `tests/resume.spec.ts` both refuse.
- **The plate is a `<rect>` inside the drawing**, not a CSS background, so the code is dark on light in both palettes and prints whatever the reader's background-graphics setting says. The same reasoning that took the heading band out in ticket 03.
- **The header is a flex row**: a spacer, the centred name block, the code at the trailing edge. Logical properties, so Arabic mirrors the whole row. The spacer is empty and `aria-hidden`; it exists so the name stays centred on the paper rather than centred in what is left over.
- **Any profile that is not GitHub keeps its address as text.** One code is what the header has room for, and a network dropped from the document because it has no code would be a fact lost in silence.

## Dependencies

`qrcode` as a dependency, because the site's own pages import it, and `jsqr` plus `@types/qrcode` as devDependencies, because only the check and the types read them. `@napi-rs/canvas` and `pdfjs-dist` were already here.

## Parked on

**The scan, which needs a phone and a printer.** Every other criterion is verified. `spec.md` and this ticket both say why no check can stand in for it: a code is unreadable in ways nothing about the page shows, and the decode above proves the pixels are right, not that a camera reads them off paper at 0.52mm a module.

**Saud: print either document and scan the code once with a phone.** If it reads first time, the ticket closes. If it does not, the lever is in `spec.md` already — the box grows, the header grows with it, and ticket 05 has that much less room. Nothing else in the effort waits on the answer.
