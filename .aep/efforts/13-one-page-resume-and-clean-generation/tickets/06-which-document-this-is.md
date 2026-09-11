---
status: open
---

# feat(cv): one line on each document page saying what that document is for

## Outcome

A reader who lands on either document page is told which one they are looking at: the CV is the whole record, the resume is the short one to send with an application. One line, in both languages, on the page and in neither document.

## Acceptance Criteria

- [ ] The CV page and the resume page each show one line saying what that document is for, in English and in Arabic, carrying `[data-document-purpose]` (criterion 6).
- [ ] The line sits above the actions row rather than inside it, so that row still contains exactly one element, which is what effort 7's criterion 1 fixed and what `tests/resume.spec.ts` asserts (criterion 6).
- [ ] The line appears in none of the four published PDFs and in no generated document. It is chrome, and print hides it the way print hides the actions row (criterion 6).
- [ ] Both strings exist in both languages in `src/lib/i18n.ts` and the build's gap report does not grow (criterion 6).
- [ ] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, and `pnpm check` pass, and Lighthouse is unchanged.

## Relevant areas

`src/pages/[locale]/cv.astro` and `src/pages/[locale]/resume.astro`; `src/lib/i18n.ts`, the `cv` and `resume` blocks; `src/styles/global.css`, the print rule that already hides `.cv-actions`.

## Constraints

- **The words are the site's own, not new claims.** `src/lib/i18n.ts` already describes both documents in `pages.sections`; this line says the same thing where a reader of the document page can see it.
- Nothing about the document itself changes, and nothing here costs the fit anything, because none of it prints.

## Notes

Saud asked for this on 2026-09-11 as part of making the division plain: the CV for everything, the resume for job applications. The division is already true of what the two documents carry; what was missing is the site saying so at the point a reader meets them.
