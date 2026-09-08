---
status: open
blocked-by: [05]
---

# feat(cv): render the CV page per language with a print stylesheet and downloads

## Outcome
`/en/cv/` and `/ar/cv/` render the profile, experience, education, skills, and certificates as one column with the standard headings, contact details in the body, no tables, images, or text boxes, and a print stylesheet that yields a clean A4 and Letter document in the light palette. Two download actions per page point at that language's PDF and JSON Resume document.

## Acceptance Criteria
- [ ] The CV page in each language is a single column with headings for summary, experience, education, skills, and certifications, and `dist/*/cv/index.html` contains no `<table>`, no `<img>`, and no positioned header or footer holding the contact block (criterion 5).
- [ ] Printing to A4 and to Letter from a browser clips no text and breaks no entry across a page mid-line where `break-inside: avoid` can prevent it (criterion 5).
- [ ] Print emulation applies the light tokens regardless of the stored theme (criterion 14).
- [ ] Each CV page carries two links: `/cv.<locale>.pdf` and `/<locale>/resume.json` (requirement 5, requirement 6).
- [ ] The page has its own title, description, and Open Graph tags and is in the sitemap (criterion 10).

## Relevant areas
`src/pages/[locale]/cv.astro`, print rules in `src/styles/global.css` under `@media print` and `@page`, the layout from ticket 05.

## Constraints
- The hazards to avoid are the ones [[efforts/1-portfolio-site/evidence/research/ats-parsing-and-resume-schemas]] lists from Greenhouse and the Daxtra reseller: keep the contact block in the flow of the document.
- Wording is per language through the UI-strings file from ticket 05.
- The PDF and JSON links may 404 until tickets 07 and 08 land; the criterion is that the links exist and are correct.

## Notes
The plan's technical approach step 5.
