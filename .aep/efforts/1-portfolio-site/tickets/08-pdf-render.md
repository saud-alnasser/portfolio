---
status: open
blocked-by: [06]
---

# build(cv): render the CV pages to PDF in CI and check the English text extracts

## Outcome
`scripts/render-pdf.mjs` opens `dist/<locale>/cv/index.html` in Playwright's Chromium after the build and writes `dist/cv.en.pdf` and `dist/cv.ar.pdf` in A4 with print media, using a bundled font that shapes Arabic. The integration and deploy workflows run it, and the check script extracts the English PDF's text and asserts the ordered lines criterion 5 names.

## Acceptance Criteria
- [ ] After `pnpm build && pnpm render:pdf`, `dist/cv.en.pdf` and `dist/cv.ar.pdf` exist, each under 1 MB, with selectable text (criterion 5).
- [ ] `pdftotext dist/cv.en.pdf -` yields the name, the email, each employer with title and dates, and each institution with degree and dates, each on its own line in reading order, and the check script asserts it in CI (criterion 5).
- [ ] `dist/cv.ar.pdf` renders Arabic glyphs joined and right to left when opened, checked by eye once and recorded in this ticket's notes with the Playwright and Chromium versions used (criterion 5).
- [ ] Both workflows install Playwright's Chromium with the official action or `pnpm exec playwright install --with-deps chromium`, cache it, and fail the job when rendering or extraction fails (requirement 5).
- [ ] The CV pages' download links from ticket 06 resolve to these files in `dist/` (requirement 5).

## Relevant areas
`scripts/render-pdf.mjs` (new), `scripts/check-dist.mjs`, `public/fonts/` for the Arabic-capable font and its licence file, `.github/workflows/integration.yml` and `deploy.yml`, `package.json` scripts.

## Constraints
- `page.pdf()` uses print media by default; do not emulate screen. Use `format: "A4"` and `printBackground: false`; Letter is checked through the print stylesheet's `@page` rather than a second render.
- The font must be licensed for embedding and redistribution (an OFL font such as Noto Naskh Arabic or IBM Plex Sans Arabic); record the licence beside it.
- Playwright is a dev dependency; the site ships none of it.

## Notes
The plan's technical approach step 7 and its first technical risk. If Chromium on the runner still renders boxes with the bundled font, that is a finding to record, not a reason to drop the Arabic PDF.
