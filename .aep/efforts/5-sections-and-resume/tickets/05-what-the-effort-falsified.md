---
status: resolved
blocked-by: [03]
---

# fix(site): the CV stops calling itself one page, and the repository context catches up

## Outcome
Neither CV page describes itself as fitting one page, in either language, so the two documents say which is which wherever a reader meets them, the search result included. `.aep/contexts/repository.md` no longer contradicts what this effort built: it names both derived documents rather than one, its `src/lib/` row names the predicate module every output reads, and its `described` entry no longer implies that a described project is shown whatever its status.

## Acceptance Criteria
- [x] `t.cv.description` in both languages says what the CV is, the whole record, and claims no page count; the rendered `<meta name="description">` on `dist/en/cv/index.html` and `dist/ar/cv/index.html` carries the new text, and neither contains "one printable page" nor "صفحة واحدة"; the resume's own description still says one page in both languages (criterion 8, criterion 14). Verified 2026-09-10: the English CV page's description now opens `The curriculum vitae of Saud Alnasser: the whole record of experience, education, skills, certifications...` and the Arabic `سيرة سعود الناصر الذاتية: السجل الكامل...`; `grep -c "one printable page" dist/en/cv/index.html` and `grep -c "صفحة واحدة" dist/ar/cv/index.html` both print 0. The resume pages still read `The one-page resume of Saud Alnasser...` and `السيرة المختصرة لـسعود الناصر في صفحة واحدة...`, so the one-page claim now sits only on the document that is one page.
- [x] `pnpm check` passes with both strings present under the `Strings` type, `pnpm build` prints `[localized] 0 gaps`, `pnpm check:dist` passes with `metadata` still finding a unique description on every page, and `pnpm test` passes (criterion 14). Verified 2026-09-10: `pnpm check` 0 errors and 0 warnings, `pnpm build` `[localized] 0 gaps`, `pnpm check:dist` exit 0 with `metadata: 10 pages with a unique title, a description, and og:title, og:description, og:url, og:locale`, `resume pages: resume.en.pdf is 1 page` and its Arabic twin, and the render step still writing one page at both papers in both languages; `pnpm test` `396 passed`.
- [x] `.aep/contexts/repository.md` states that the site derives two documents from the content, a CV and a one-page resume, each as a page and a PDF, beside the JSON Resume document; its `src/lib/` row names `shown.ts` as what decides whether a project appears; its `described` vocabulary entry says that visibility and completion are separate fields and that both must admit a project before it is shown. Read against the built site, no sentence in the file is false (`.aep/policies/execution.md`, converge's second judgement). Verified 2026-09-10: all three corrections are in the file, and it was then read whole against the built site with nothing else found false. The three that were false are the ones this effort caused: the site had one derived document and now has two, `src/lib/` gained the module that decides what is shown, and `described` was written when visibility was the only gate on a project.

## Relevant areas
`src/lib/i18n.ts`, `.aep/contexts/repository.md`.

## Constraints
- Wording only on the site's side: no layout, no template, no route, and no other string.
- The context is corrected where this effort falsified it and nowhere else. A concept nobody had named before is reported at the close rather than named here.

## Notes
Converge, round one. Both halves are the same finding: the effort added a second document and a second gate on a project, and two places still describe the site as it was before. Traces to criterion 8, which requires the site to label each document, and to criterion 14 for the strings; the context half is the correction `.aep/policies/execution.md` requires to land inside the effort that falsified it.
