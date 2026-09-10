---
status: resolved
blocked-by: [03]
---

# fix(cv): the resume may run to two pages, because one was not true everywhere

## Outcome
Verified locally on 2026-09-10 except the last criterion, which only the runner can answer. The render step and the dist check accept a resume of one or two pages and refuse a third, in both languages and at both papers. Nothing on the site or in either document calls the resume a one-page document any more, in either language. The spec's requirement 10, its criterion 10, the constraint on the resume's size, and the assumption that the resume is full all say two pages and say why; the plan's fit section records that the one-page target was met on Windows and not on the Linux runner that renders what ships. The integration workflow passes on the branch.

## Acceptance Criteria
- [x] `pnpm render:pdf` succeeds with the resume at two pages and fails naming the locale and the paper at three, tried once by lengthening content until it runs over; `pnpm check:dist` (`resumePages`) does the same, and its success line says how many pages the file has rather than asserting one (criterion 10).
- [x] No string in `src/lib/i18n.ts` calls the resume a one-page document in either language, and the built `dist/en/resume/index.html` and `dist/ar/resume/index.html` carry no such claim in their title, description, or contact and section cards; `pnpm check` passes and `pnpm build` prints `[localized] 0 gaps` (criterion 8, criterion 14). **Widened on 2026-09-10 from the strings alone**, which is where this criterion was first drawn and was too narrow: the same claim sat in the repository's context and entrypoint, the content guide, the content contract, the predicate, the document component, the resume page, the print stylesheet, and both scripts, and a comment describing behaviour the code no longer has is the defect two review rounds already named twice. All of them now say the short resume, or say what the budget is. A search for the phrase across the shipped source, the docs, and the AEP contexts returns only the sentences that explain the budget and its reason.
- [x] `docs/development.md` describes the resume's page budget as two rather than one (criterion 15).
- [x] The spec's requirement 10 and criterion 10 read two pages, the constraint on the resume's size and the assumption about headroom are revised with the reason, and the plan's fit section records the font-metric finding: the same document is one page under the fonts Windows resolves and two under the Linux runner's, so a one-page rule keyed on the system font stack is a rule about the renderer rather than about the document.
- [x] `pnpm check`, `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, and the content mechanism test all pass locally, and **the integration workflow passes on the pushed branch**, which is the only machine that has ever disagreed (criterion 14). Verified 2026-09-10: every gate passes locally, and the integration workflow on `847b095` is green on all eighteen steps, where the same workflow on `5d4cb55` failed at the render step. The runner measured `dist/resume.en.pdf: 39247 bytes, 1 page at A4, 2 pages at Letter` and the Arabic at one page on both, then `resume pages: resume.en.pdf is 1 page, at most 2`, `resume.en.pdf: 39247 bytes, 8 expected facts found in 6 groups in reading order`, `396 passed` in the browser tests, Lighthouse over all six pages, and the content mechanism test.

  Worth reading off those numbers: **the file that ships is the A4 render, so the English resume a reader downloads is one page on the runner too.** Two pages is what printing that document on US Letter paper produces. The Arabic resume is one page at both papers everywhere measured.

## Relevant areas
`scripts/render-pdf.mjs` (the `pages` budget), `scripts/check-dist.mjs` (`resumePages`), `src/lib/i18n.ts`, `docs/development.md`, the effort's `spec.md` and `plan.md`.

## Constraints
- **The fit work stays.** The resume's own page box, its tighter spacing, its shorter project entries, and the four shortened texts are not reverted: they were authorised on their own terms and undoing them would change Saud's content again without being asked. What changes is only what the document is allowed to run to.
- Two is a budget, not a target. The resume is still the short document, and a third page is still refused.
- The type size floor is unchanged: 10pt, never smaller.

## Notes
Saud decided this on 2026-09-10, after the integration workflow refused the branch with `render-pdf: resume-too-long: en at Letter runs to 2 pages`. The alternatives put to him were a bundled print face, which would have made the metrics identical on every machine, and trimming further against the runner's fonts; he chose the two-page budget over both. The deploy workflow runs the same render step on the same runner, so without this the merge would have stopped the site updating.
