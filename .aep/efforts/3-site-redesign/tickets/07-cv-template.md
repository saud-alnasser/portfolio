---
status: open
blocked-by: [01]
---

# feat(cv): lay the CV page out after the white and blue ATS template and print its bands

## Outcome
The CV page in each language follows the template: the name centred in capitals with the label beneath and a rule; one centred contact line with bar separators; section headings in full-width tinted bands in capitals, with "Work experience" and "Key skills" as the template names them; each entry's title bold at the start of the line with its dates bold at the far edge, the organisation or institution beneath; bullets; skills in up to three columns. The render script prints backgrounds, the band prints, and the dist check's extraction expectation is amended to the plan's document order.

## Acceptance Criteria
- [ ] Both CV pages show the centred capitals name, the rule, the single contact line with bars, the tinted bands, bold titles with bold dates at the far edge of the same line, and the skills in columns; both PDFs show the bands; printed to A4 and Letter nothing is clipped (criterion 8).
- [ ] The CV page has no `<table>`, no `<img>`, and no positioned element carrying content, and the amended extraction check finds the name (without case), the email, and every experience and education entry's facts in the plan's order, with a title and its dates allowed on one line; removing one expected line makes the check fail (criterion 9).
- [ ] The band with the foreground on it meets WCAG AA in both palettes on screen and prints light; the Arabic CV mirrors with the dates at the left, checked by eye at 360 and 1440 (criterion 10).
- [ ] Lighthouse stays at 90 or above on `/en/cv/` and `/ar/cv/`; the print emulation test asserts the band's background prints (criterion 11).
- [ ] The two heading strings exist in both languages (criterion 12).

## Relevant areas
`src/pages/[locale]/cv.astro`, `src/styles/global.css` (the band, the print rules), `src/lib/i18n.ts`, `scripts/render-pdf.mjs`, `scripts/check-dist.mjs` (`cvPdf`), `tests/theme.spec.ts`.

## Constraints
- The document order and the check's group expectation are in the plan, "Technical approach"; the letter spacing on the name stays at or under 0.025em.
- `printBackground: true` in the render script and `print-color-adjust: exact` on the band.
- The `frontend-design` skill guides the visual pass, within what the template dictates.

## Notes
The plan's technical approach step 4. Independent of tickets 02 to 06.
