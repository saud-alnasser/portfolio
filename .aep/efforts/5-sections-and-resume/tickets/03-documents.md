---
status: open
blocked-by: [01]
---

# feat(cv): one document component rendering the CV and a one-page resume, each as a page and a PDF

## Outcome
`src/components/CvDocument.astro` renders both documents through its `variant` prop in the document order the plan fixes, and the CV page and the new resume page are two thin pages over it, each with an actions row that links its PDF and the other document. The render step writes four PDFs and refuses a resume past one page at A4 or at Letter; the dist check extracts both English PDFs, checks both pages for hazards, and counts the resume's pages. The navigation carries Resume after CV, the home page carries the resume card and the resume contact action, and the resume route joins the tests, Lighthouse, the live check, and the development doc.

## Acceptance Criteria
- [ ] `/en/resume/` and `/ar/resume/` exist, `pnpm render:pdf` writes `dist/resume.en.pdf` and `dist/resume.ar.pdf` beside the CV PDFs, and each document page links its own PDF and the other document page; changing one fact in the content changes it on both pages with no second edit, tried once (criterion 8).
- [ ] The CV pages show the summary, experience, education with the course list, key skills, certifications, courses, and every project the predicate admits, in that order and in the redesign's template layout; `tests/resume.spec.ts` asserts the order and the project count against the content, and the redesign's `cvHazards` and extraction checks still pass over the CV (criterion 9).
- [ ] The resume pages show the summary, experience, education without the course list, the skills as one line per group, exactly the projects marked `resume: true`, and any certificate so marked, in that order; `tests/resume.spec.ts` asserts it against the content, and removing the mark from a project removes it from the resume with no other edit, tried once (criterion 10).
- [ ] The rendered resume PDF has exactly one page in each language at A4, and the render step's Letter render also has one; the render step fails with `resume-too-long` naming the locale and the paper when a page is forced over, tried once by lengthening a summary; `pnpm check:dist` (`resumePages`) fails on a two-page file, tried the same way (criterion 10).
- [ ] The resume pages have no `<table>`, no `<img>`, and no fixed or absolute positioned element carrying content, and their contact block is inside `main`; the extraction check over `dist/resume.en.pdf` finds the name, the email, every experience entry's position, period, and organisation, and every education entry's degree, period, and institution, in reading order, and fails on a removed line, tried once (criterion 11).
- [ ] Printed to A4 and to Letter from a browser, neither document clips text in either language, checked by eye and recorded (criterion 10).
- [ ] The navigation on every page lists Resume after CV; the home page's section grid shows the resume card after the CV card and the contact actions include the resume; `tests/home.spec.ts` and `tests/menu.spec.ts` assert it (criterion 4, criterion 8).
- [ ] `tests/pages.ts` carries `/resume/` at the document width, and `tests/layout.spec.ts`, `tests/contrast.spec.ts`, `tests/theme.spec.ts` (including the print test over the resume page), and `tests/menu.spec.ts` pass over it; `pnpm lighthouse` audits `/en/resume/` and `/ar/resume/` at 90 or above on the three categories; every new string exists in both languages and the gap line does not grow (criterion 14).
- [ ] `pnpm test:content` asserts the fixture project in eight outputs, the two resume pages included, and passes; `scripts/check-live.sh` and `docs/development.md` carry the four resume addresses (criterion 8, criterion 15).

## Relevant areas
New `src/components/CvDocument.astro`, `src/pages/[locale]/cv.astro`, new `src/pages/[locale]/resume.astro`, `src/layouts/Base.astro`, `src/pages/[locale]/index.astro`, `src/styles/global.css` (`cv-compact`), `src/lib/i18n.ts`, `scripts/render-pdf.mjs`, `scripts/check-dist.mjs` (`cvPdf` to `documentPdfs`, `cvHazards`, new `resumePages`), `scripts/lighthouse.mjs`, `scripts/check-live.sh`, `scripts/test-content-mechanism.mjs`, `tests/pages.ts`, `tests/theme.spec.ts`, new `tests/resume.spec.ts`, `docs/development.md`.

## Constraints
- The component's shape, the variant table, the document order, the compact rules, the addresses, and the page count mechanism are the plan's "Architecture" and "Interfaces": one component, `pdfjs-dist` for the count, 10pt as the resume's print size and no smaller.
- If the resume does not fit at 10pt, the levers are content in the plan's order: project summaries, the placement's bullets, the summary's length. Trimming a summary is a content edit recorded in the ticket, never a smaller type size. If the Arabic resume cannot fit with the content trimmed, stop: that is the plan's named return-to-plan finding.
- The CV keeps its JSON Resume link and its layout; the extraction check's groups are unchanged and apply to both documents.
- Letter spacing on the name stays at or under `0.025em`, as the redesign found `pdftotext -layout` needs.

## Notes
The plan's technical approach step 3. Stacks on 01; independent of 02 and 04 except for the shared edits to `index.astro` and `i18n.ts` with 02, which the orchestrator reconciles.
