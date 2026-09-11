---
status: open
blocked-by: [05]
---

# feat(cv): a bundled Latin face, so one document measures the same everywhere

## Outcome

The site bundles Source Sans 3 for Latin text beside the Noto Naskh Arabic it already bundled for Arabic, and the resume's page count stops being a property of the machine that renders it. Every content cut ticket 05 made stands; what changes is that the number this machine reports is the number the runner has.

## Acceptance Criteria

- [x] Both weights of a Latin face are committed under `public/fonts/` with their licence beside them, in the shape the Arabic face already uses, and the build serves them under the site's base path (criterion 2).
- [x] The face is the first entry of the stack, with the system stack still behind it, so a face that fails to load leaves a readable page rather than a blank one and the render step refuses a PDF taken in that state (criterion 2).
- [x] Every render reports both faces loaded, on all four documents (criterion 2).
- [x] The type size is untouched at 10pt, and the diff contains no change to it (criterion 2, and the constraint `spec.md` carries).
- [x] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm check`, and `pnpm test:content` pass.
- [ ] The English and Arabic resumes are one page at A4 and at Letter, published and filled, with at least 10mm free at Letter, **on the CI runner**, and the integration workflow is green on the pushed branch (criterion 2).

## Relevant areas

`public/fonts/`; `src/styles/global.css`, the `@font-face` block and `--font-sans`.

## Constraints

- **The type size floor is 10pt and does not move.** A bundled face changes which glyphs are drawn, never how large they are.
- **The Arabic face keeps its `unicode-range`**, so a page with no Arabic text still never requests it. The Latin face carries no range: it is the stack's first entry and it is wanted everywhere.
- **Nothing about the content changes here.** Ticket 05's cuts were made to fit the page and the page still has to be fitted; this ticket is about which machine's answer counts, not about how much is on the page.

## Notes

Saud declined a bundled face on 2026-09-10, when the divergence between his machine and the runner was "less than one line", and again on 2026-09-11 when it was 16 pixels. He took it on 2026-09-11 once the runner reported the real figure: with the content cut and the floor measuring ink rather than baselines, this machine had 15.0mm of headroom at Letter and the runner had the English resume at two pages with 25.4mm on the second, a divergence of about 40mm. Every content lever the spec still allowed was measured at 17.8mm together, so no amount of further cutting inside the rules could have closed it.

## What it measured

Source Sans 3 rather than Noto Sans, which would have paired with the bundled Arabic by design: the English resume is the document under pressure, Source Sans 3 is the more economical of the two, and it is a text face drawn for exactly this. Both weights are subset to Latin and come to 31KB together, against the 310KB the two Arabic files take.

On this machine, with the face in and no content changed:

| | A4 | Letter |
| --- | --- | --- |
| `resume.en.pdf`, published and filled | 33.4mm free | **20.7mm free** |
| `resume.ar.pdf`, published and filled | 38.7mm free | **20.7mm free** |

Against 27.7mm and 15.0mm for English before it, so the face returns 5.7mm at Letter as well as ending the divergence: it is narrower than the Segoe UI this machine was resolving. Both documents now report the same headroom in both languages, which is itself a sign the layout is the face's rather than the system's.

Every render names both faces: `fonts Source Sans 3 400, Source Sans 3 700, Noto Naskh Arabic 400, Noto Naskh Arabic 700`. The built stylesheet rewrites the URLs under the base path, `url(/saud-alnasser/fonts/SourceSans3-Regular.woff2)`, and the files are in `dist/fonts/`.

The rendered documents also got substantially smaller, `resume.en.pdf` from 53KB to 27KB, because a subset face embeds less than the system one did.

## Parked on

**The CI runner, which is the whole point of the ticket.** Everything above was measured here, and here is precisely the machine whose answer has never counted. The claim this ticket makes is that the runner will now report what this machine reports; only the runner can confirm it. The criterion clears when the integration workflow is green on the pushed branch.
