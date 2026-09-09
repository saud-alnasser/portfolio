---
status: resolved
blocked-by: [01]
---

# feat(cv): lay the CV page out after the white and blue ATS template and print its bands

## Outcome
The CV page in each language follows the template: the name centred in capitals with the label beneath and a rule; one centred contact line with bar separators; section headings in full-width tinted bands in capitals, with "Work experience" and "Key skills" as the template names them; each entry's title bold at the start of the line with its dates bold at the far edge, the organisation or institution beneath; bullets; skills in up to three columns. The render script prints backgrounds, the band prints, and the dist check's extraction expectation is amended to the plan's document order.

## Acceptance Criteria
- [x] Both CV pages show the centred capitals name, the rule, the single contact line with bars, the tinted bands, bold titles with bold dates at the far edge of the same line, and the skills in columns; both PDFs show the bands; printed to A4 and Letter nothing is clipped (criterion 8). Verified 2026-09-09: screenshots of both pages at 360 and 1440 in both palettes read by eye; `pnpm render:pdf` wrote both PDFs (82 KB and 125 KB) with the bands; a Letter render with the same script setup ended on the last project's link, as A4 did, with nothing clipped.
- [x] The CV page has no `<table>`, no `<img>`, and no positioned element carrying content, and the amended extraction check finds the name (without case), the email, and every experience and education entry's facts in the plan's order, with a title and its dates allowed on one line; removing one expected line makes the check fail (criterion 9). Verified 2026-09-09: `pnpm check:dist` printed "cv.en.pdf: ... 8 expected facts found in 6 groups in reading order" and `cvHazards` passed; with the organisation line removed it failed with `"Al Othaim Markets" is nowhere after line 15 of the extracted text`, then restored.
- [x] The band with the foreground on it meets WCAG AA in both palettes on screen and prints light; the Arabic CV mirrors with the dates at the left, checked by eye at 360 and 1440 (criterion 10). Verified 2026-09-09: `--band` with the foreground is 13.0:1 light and 11.6:1 dark as recorded in `global.css`; `tests/contrast.spec.ts` (axe) passes on both CV pages in both palettes; the print test asserts the light band value; Arabic screenshots at 360 and 1440 show the dates at the left.
- [x] Lighthouse stays at 90 or above on `/en/cv/` and `/ar/cv/`; the print emulation test asserts the band's background prints (criterion 11). Verified 2026-09-09: Lighthouse mobile through its Node API with the runner's configuration, `/en/cv/` 100/100/100 and `/ar/cv/` 92/100/100 (the `pnpm lighthouse` runner dies in chrome-launcher's temp cleanup on this machine after the audit); `tests/theme.spec.ts` asserts `print-color-adjust: exact` and the light band colour in print; `pnpm test` 122 passed.
- [x] The two heading strings exist in both languages (criterion 12). Verified 2026-09-09: `cv.experience` and `cv.skills` exist in `en` and `ar` under the `Strings` type; `pnpm check` 0 errors; `pnpm build` 0 gaps.

## Relevant areas
`src/pages/[locale]/cv.astro`, `src/styles/global.css` (the band, the print rules), `src/lib/i18n.ts`, `scripts/render-pdf.mjs`, `scripts/check-dist.mjs` (`cvPdf`), `tests/theme.spec.ts`.

## Constraints
- The document order and the check's group expectation are in the plan, "Technical approach"; the letter spacing on the name stays at or under 0.025em.
- `printBackground: true` in the render script and `print-color-adjust: exact` on the band.
- The `frontend-design` skill guides the visual pass, within what the template dictates.

## Notes
The plan's technical approach step 4. Independent of tickets 02 to 06.
