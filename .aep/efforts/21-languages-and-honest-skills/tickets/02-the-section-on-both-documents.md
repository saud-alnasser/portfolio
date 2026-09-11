---
status: resolved
blocked-by: [01]
---

# feat(cv): the languages section on both documents and in both JSON documents, from one line function

## Outcome

Both document pages print a "Languages" / "اللغات" section directly after the key skills, one line per language, "Arabic: Native" and "English: Working proficiency, STEP 85 (2022)" in English and their Arabic in Arabic; both `resume.json` files carry a `languages` array whose `fluency` is the same string the page prints; and one function in `src/lib/` is the only place that string is built. The home page, the README, and the skills section are untouched because nothing outside the document component and the mapper reads the collection. The resume is still one page on both papers, measured.

## Acceptance Criteria

- [x] On `/en/cv/`, `/en/resume/`, `/ar/cv/`, and `/ar/resume/`, a `<section data-cv-section="languages">` headed `t.cv.languages` sits between the skills section and the variant tail, holding one `li.cv-entry` per language in the resume's skills-line markup, on both variants without a variant branch (criterion 2, the rendering half; requirement 2). Verified 2026-09-11 by reading the four built pages: each has one `<section aria-labelledby="cv-languages" data-cv-section="languages">` holding two `li.cv-entry`, and the section order read off `data-cv-section` is `summary, experience, education, skills, languages, certifications, courses, projects` on the CV and `summary, experience, education, skills, languages, projects` on the resume. The section is one block in the component, outside `tail`, with no `resume` branch.
- [x] The two lines read exactly "Arabic: Native" and "English: Working proficiency, STEP 85 (2022)" in English, and "العربية: اللغة الأم" and "الإنجليزية: إجادة مهنية، STEP 85 (2022)" in Arabic, with the locale's own `listSeparator` before the score (criteria 3 and 4, the rendered half). Verified 2026-09-11: the text of the two `li` elements, tags stripped, compared equal to the four expected strings on all four pages, the Arabic ones byte for byte, and the Arabic line's separator before `STEP` is `، `, the locale's `listSeparator`.
- [x] `dist/en/resume.json` and `dist/ar/resume.json` carry `languages: [{ language, fluency }]` in the documents' order, `fluency` identical to the page's tail, and both still validate in `pnpm check:dist` (criterion 5). Verified 2026-09-11: `dist/en/resume.json` carries `[{"language": "Arabic", "fluency": "Native"}, {"language": "English", "fluency": "Working proficiency, STEP 85 (2022)"}]`, `dist/ar/resume.json` the Arabic pair with the same score tail, each `"language: fluency"` equal to the page's line; `pnpm check:dist` printed `en/resume.json: valid` and `ar/resume.json: valid`.
- [x] The string is built by one exported function beside `src/lib/shown.ts`, called from `CvDocument.astro` and `resume.ts` and nowhere else; `grep -rn "STEP\|test.score" src/` finds no template string outside that function (requirement 5; the plan's *Interfaces*, "the printed tail"). Verified 2026-09-11: the function is `levelLine` in `src/lib/languages.ts`, a new file beside `shown.ts` with no runtime import so the scripts and tests can load it the same way; `grep -rn "STEP\|test.score\|test\.name" src/` outside `src/content/` hits only that file and one prose comment in the component that says "the test score". Its signature takes the picked level string rather than the entry, so the callers' own `text('level', ...)` call keeps feeding the gap report.
- [x] `grep` over `dist/en/index.html`, `dist/ar/index.html`, and `README.md` for "Native", "Working proficiency", "اللغة الأم", and "إجادة مهنية" finds nothing (criterion 6). Verified 2026-09-11: the count of each of the four strings in `dist/en/index.html`, `dist/ar/index.html`, and `README.md` is 0.
- [x] `pnpm render:pdf` writes `resume.en.pdf` and `resume.ar.pdf`, and the filled copy of each, at one page on A4 and one page at Letter, each reporting at least 10mm free at Letter; the four numbers go in the commit message (criterion 12). Verified 2026-09-11, `pnpm render:pdf`: `resume.en.pdf` 1 page at A4 with 54.8mm free, 1 page at Letter with 36.8mm free; `resume.en.filled.pdf` the same; `resume.ar.pdf` 1 page at A4 with 54.3mm free, 1 page at Letter with 36.3mm free; `resume.ar.filled.pdf` the same. The section cost 24.3mm and 24.4mm at Letter against the plan's estimate of about 12mm, from the 61.1mm and 60.7mm ticket 01 measured; both clear the 10mm floor by 26mm.
- [x] `pnpm build` prints `[localized] 0 gaps`, `pnpm check` and `pnpm check:dist` pass, and `pnpm test` fails on exactly one expectation, the section-order test, which ticket 03 updates; that failure and its message are quoted here (criterion 11, in part; the plan's *Technical approach*, step 2). Verified 2026-09-11: `pnpm build` printed `[localized] 0 gaps`; `pnpm check` `0 errors, 0 warnings`; `pnpm check:dist` exited 0 with every check printed. `pnpm test` printed `588 passed, 8 failed`: the eight are the one expectation at `tests/resume.spec.ts:121`, `expect(await sectionsOf(page), ...).toEqual(sectionsExpected(variant))`, on the four document pages in both themes, each failing with `- Expected - 0 / + Received + 1` and the one received line `+ "languages"`.

## Relevant areas

`src/components/CvDocument.astro`: the header comment's variant table at line 34, the collection reads at line 79, the skills block at line 318 whose resume branch is the markup to reuse, `tail.map(` at line 353. `src/lib/resume.ts`: `mapSkill` at line 117, the `Promise.all` and the document object in `resumeFor` from line 127. `src/lib/i18n.ts`: `cv.skills` at line 198 and its Arabic at line 342, `listSeparator` at lines 74 and 245. `src/lib/order.ts`: `byOrderThenName` at line 38. `src/lib/shown.ts` for where the new module sits.

## Constraints

- **The section prints only where the collection holds something**, like every other section, so the mechanism test's removal pass in ticket 03 can assert the heading gone.
- **The year, not the date**, on the page and in `fluency`: `test.date.slice(0, 4)`, as the plan fixes under *What is not a choice*.
- **No new print rule.** The compact rules key on structure; if the section needs one, that is a finding for the plan, not a rule added here.
- **Length is paid out of headroom, never out of type size.** `scripts/render-pdf.mjs` says so in the message it fails with.

## Notes

The existing section-order test is expected to fail after this ticket, and that failure is the handover to ticket 03: it names the page and prints the section list, which is the evidence that the section landed where the spec puts it.
