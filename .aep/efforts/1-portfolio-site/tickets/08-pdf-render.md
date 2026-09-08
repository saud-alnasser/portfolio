---
status: resolved
blocked-by: [06]
---

# build(cv): render the CV pages to PDF in CI and check the English text extracts

## Outcome
`scripts/render-pdf.mjs` opens `dist/<locale>/cv/index.html` in Playwright's Chromium after the build and writes `dist/cv.en.pdf` and `dist/cv.ar.pdf` in A4 with print media, using a bundled font that shapes Arabic. The integration and deploy workflows run it, and the check script extracts the English PDF's text and asserts the ordered lines criterion 5 names.

## Acceptance Criteria
- [x] After `pnpm build && pnpm render:pdf`, `dist/cv.en.pdf` and `dist/cv.ar.pdf` exist, each under 1 MB, with selectable text (criterion 5).
  Verified 2026-09-09 in the run's surface after integration: `pnpm build && pnpm render:pdf` printed `dist\cv.en.pdf: 72836 bytes` and `dist\cv.ar.pdf: 119552 bytes, fonts Noto Naskh Arabic 400, Noto Naskh Arabic 700`, exit 0; `pdftotext -enc UTF-8 -layout` extracts the English text (name, label, email, location, GitHub URL, Summary, and on) and Arabic text from the Arabic file, so the text is real and selectable.
- [x] `pdftotext dist/cv.en.pdf -` yields the name, the email, each employer with title and dates, and each institution with degree and dates, each on its own line in reading order, and the check script asserts it in CI (criterion 5).
  Verified: `pnpm check:dist` printed `cv.en.pdf: 72836 bytes, 8 expected lines found in reading order`, the `cvPdf` check in `scripts/check-dist.mjs` reading the expected name, email, organisation with position and period, and institution with degree and period from `src/content/` and wording them with the site's own `formatPeriod`; the child's negative runs (missing file, wrong PDF) failed with the missing line named. Both workflows run `pnpm check:dist` after `pnpm render:pdf`. The check uses `pdftotext -layout` because xpdf's default mode reflows paragraphs, and skips with a notice where `pdftotext` is absent; CI installs `poppler-utils`.
- [x] `dist/cv.ar.pdf` renders Arabic glyphs joined and right to left when opened, checked by eye once and recorded in this ticket's notes with the Playwright and Chromium versions used (criterion 5).
  Verified by the child, who rasterised page 1 of `dist/cv.ar.pdf` with pdf.js in Chromium and viewed it: right to left, joined Naskh glyphs (`الملخص`, `الخبرة العملية`, `(تدريب عملي)`, `2026 إلى 2026`), no boxes. Playwright 1.63.0, Chromium 153.0.8010.12, Noto Naskh Arabic v2.021. Viewed as a rasterisation rather than in a PDF viewer; Saud's own look in a viewer is the remaining formality, recorded in the notes. `pdftotext` on the Arabic file returns Arabic text, and the render script reports both weights of the font embedded.
- [x] Both workflows install Playwright's Chromium with the official action or `pnpm exec playwright install --with-deps chromium`, cache it, and fail the job when rendering or extraction fails (requirement 5).
  Verified by reading both workflows: after `pnpm build`, each reads the Playwright version, caches the browsers with `actions/cache@v6` keyed on it, runs `pnpm exec playwright install --with-deps chromium`, installs `poppler-utils`, runs `pnpm render:pdf`, then `pnpm check:dist`; the deploy workflow uploads `dist/` after those steps. `render-pdf.mjs` exits 1 with a named reason (`no-build`, `page-not-loaded`, `font-not-loaded`, `file-not-written`) and `check-dist.mjs` exits 1 on any failed assertion, which fails the job.
- [x] The CV pages' download links from ticket 06 resolve to these files in `dist/` (requirement 5).
  Verified: `dist/en/cv/index.html` links `/cv.en.pdf` and `dist/ar/cv/index.html` links `/cv.ar.pdf`; `ls dist/*.pdf` lists both files after the render.

## Relevant areas
`scripts/render-pdf.mjs` (new), `scripts/check-dist.mjs`, `public/fonts/` for the Arabic-capable font and its licence file, `.github/workflows/integration.yml` and `deploy.yml`, `package.json` scripts.

## Constraints
- `page.pdf()` uses print media by default; do not emulate screen. Use `format: "A4"` and `printBackground: false`; Letter is checked through the print stylesheet's `@page` rather than a second render.
- The font must be licensed for embedding and redistribution (an OFL font such as Noto Naskh Arabic or IBM Plex Sans Arabic); record the licence beside it.
- Playwright is a dev dependency; the site ships none of it.

## Notes
The plan's technical approach step 7 and its first technical risk. If Chromium on the runner still renders boxes with the bundled font, that is a finding to record, not a reason to drop the Arabic PDF.

Built 2026-09-09 by a dispatched implementer. Noto Naskh Arabic v2.021 (official notofonts release, unhinted TTF, regular and bold, OFL text beside them under `public/fonts/`) is declared with `unicode-range` on the Arabic blocks and applied through `html:lang(ar)`, so Latin text stays in the system stack and the English page never fetches it. TTF rather than woff2 because the official release ships no woff2 (158 KB each). The runner's Latin fallback is not Segoe UI, so the English PDF rendered in CI uses a different Latin face from a Windows render; recorded, not acted on. The by-eye check of the Arabic PDF was a rasterised page in Chromium; a look in a PDF viewer by Saud is still worth doing once.
