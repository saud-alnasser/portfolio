---
status: resolved
blocked-by: [05]
---

# feat(cv): render the CV page per language with a print stylesheet and downloads

## Outcome
`/en/cv/` and `/ar/cv/` render the profile, experience, education, skills, and certificates as one column with the standard headings, contact details in the body, no tables, images, or text boxes, and a print stylesheet that yields a clean A4 and Letter document in the light palette. Two download actions per page point at that language's PDF and JSON Resume document.

## Acceptance Criteria
- [x] The CV page in each language is a single column with headings for summary, experience, education, skills, and certifications, and `dist/*/cv/index.html` contains no `<table>`, no `<img>`, and no positioned header or footer holding the contact block (criterion 5).
  Verified 2026-09-08 after integration: `pnpm build` wrote 8 pages including `dist/en/cv/index.html` and `dist/ar/cv/index.html`; on each, `grep -c '<table'` and `grep -c '<img'` are 0 and the `h2` sequence is Summary, Experience, Education, Skills, Certifications, Projects (in Arabic, الملخص, الخبرة العملية, التعليم, المهارات, الشهادات, المشاريع). The contact block is a list in the flow of `main` under the name; the child found the only positioned element to be the skip link. The layout's static footer repeats the email on screen on every page, the CV page included; print hides the footer, so the PDF carries the contact block once, in the flow, which is what the parser hazard is about (corrected at review on 2026-09-09).
- [x] Printing to A4 and to Letter from a browser clips no text and breaks no entry across a page mid-line where `break-inside: avoid` can prevent it (criterion 5).
  Verified by the child with Playwright in the scratchpad: `page.pdf({ format: 'A4' })` and `({ format: 'Letter' })` for each locale gave four 7-page documents; `pdftotext -layout` on each found all 166 lines of the page's text present, every one of the 56 entries on a single page, and every page starting at a heading or an entry; in print emulation the content overflow width equalled the column width (658 px and 680 px), so nothing clips. `global.css` carries `@page { margin: 16mm 18mm }` and `break-inside: avoid` on `.cv-entry`, `break-after: avoid` on headings.
- [x] Print emulation applies the light tokens regardless of the stored theme (criterion 14).
  Verified by the child: with `theme=dark` stored and `colorScheme: dark`, the screen background was `rgb(18, 22, 28)`; under `page.emulateMedia({ media: 'print' })` the background was `rgb(255, 255, 255)` and the text `rgb(28, 33, 40)`, on both locales. The rule is the existing `@media print` light-forcing block from ticket 05, untouched.
- [x] Each CV page carries two links: `/cv.<locale>.pdf` and `/<locale>/resume.json` (requirement 5, requirement 6).
  Verified: `dist/en/cv/index.html` carries `href="/cv.en.pdf" download` and `href="/en/resume.json"`; `dist/ar/cv/index.html` carries `href="/cv.ar.pdf" download` and `href="/ar/resume.json"`. The PDFs exist once ticket 08 lands.
- [x] The page has its own title, description, and Open Graph tags and is in the sitemap (criterion 10).
  Verified: `<title>Curriculum vitae - Saud Alnasser</title>` and `<title>السيرة الذاتية - Saud Alnasser</title>`; the Open Graph set comes through the layout as on every page; `dist/sitemap-0.xml` lists `/en/cv/` and `/ar/cv/`.

## Relevant areas
`src/pages/[locale]/cv.astro`, print rules in `src/styles/global.css` under `@media print` and `@page`, the layout from ticket 05.

## Constraints
- The hazards to avoid are the ones [[efforts/1-portfolio-site/evidence/research/ats-parsing-and-resume-schemas]] lists from Greenhouse and the Daxtra reseller: keep the contact block in the flow of the document.
- Wording is per language through the UI-strings file from ticket 05.
- The PDF and JSON links may 404 until tickets 07 and 08 land; the criterion is that the links exist and are correct.

## Notes
The plan's technical approach step 5.

Built 2026-09-08 by a dispatched implementer. Decisions recorded: projects are included as a last section after certifications (the CV runs to 7 pages with them and about 2.5 without; removing the block is one edit in `cv.astro`); skills and certifications render as one-line list items rather than `h3` entries; a `cv` entry was added to the navigation so the page is reachable. New UI strings live under `strings[locale].cv` and `nav.cv`; the Arabic ones are drafts awaiting Saud in ticket 10. Raised for ticket 08 and 09: xpdf's default `pdftotext` mode reflows paragraphs (it joined an employer and title line and dropped a wrapped hyphen); the extraction check should use `-layout` or poppler's `pdftotext`.
