---
status: resolved
blocked-by: [02]
---

# test(cv): the languages asserted where the nationality is, and a fixture language through the content mechanism

## Outcome

Every claim the spec makes about the languages has a check that fails when it stops being true: the section's place in the order, the exact text of each line in both locales, the two facts on one extracted line of each English PDF, the count and the `fluency` strings in both JSON files, the absence of the level from the home page and the README, and a fixture language that reaches both documents and both JSON files and nowhere else, then disappears. The browser suite passes again.

## Acceptance Criteria

- [x] `tests/resume.spec.ts` expects `languages` directly after `skills` on both variants when the collection holds something, reading the collection the way `entries()` reads the others, and a new test asserts each `li` of the section against the authored name and the tail, per locale, with the `[locale] ?? .en` fallback the file already uses for the summary (criteria 2, 3, and 4). Verified 2026-09-11: `sectionsExpected` inserts `'languages'` after `'skills'` when `entries('languages')`, sorted by `byOrderThenName`, holds something; the new test `lists each language with its level on one line` asserts the `h2` against `t.cv.languages` and the `li` texts against `name: levelLine(level, test, listSeparator)` per locale with the `[locale] ?? .en` fallback. `pnpm test` printed `604 passed (35.2s)`, the eight runs of the new test among them, and the section-order test passes again.
- [x] `scripts/check-dist.mjs`, reading order: one group per language, `[name, tail]`, after the education groups, found on one line in `cv.en.pdf`, `resume.en.pdf`, and both filled copies; the check's own output line counts the added facts (criterion 2, the PDF half; criterion 4). Verified 2026-09-11: `pnpm check:dist` printed `cv.en.pdf: 47593 bytes, 11 expected facts found in 7 groups in reading order`, `resume.en.pdf: 24963 bytes, 11 expected facts found in 7 groups`, and `13 expected facts found in 8 groups` for each filled copy, up from 7 in 5 and 9 in 6 before the two language groups.
- [x] `scripts/check-dist.mjs`, `json resume`: `languages` joins `sections` so its count is checked against `src/content/languages/`, and each entry's `language` and `fluency` are compared to the authored text and the tail for that locale (criterion 5). Verified 2026-09-11: the check prints `en/resume.json: valid, work 1, education 1, certificates 27, skills 6, languages 2, projects 13` and the same for `ar`; with `fluency` of the first entry edited to `Fluent` in `dist/en/resume.json`, it printed `check-dist: json resume: en: languages[0] is {"language":"Arabic","fluency":"Fluent"}, expected {"language":"Arabic","fluency":"Native"} from src/content/languages/` and exited non-zero; the file was restored and the check passed again.
- [x] `scripts/check-dist.mjs` gains `languagesWhereTheyBelong` beside `nationalityWhereItBelongs`: each level stands alone between tags on both document pages per locale, and appears in neither `dist/<locale>/index.html` nor `README.md`; it prints one line per locale like the nationality check (criterion 6). Verified 2026-09-11: the check prints `languages: en shows "Native" and "Working proficiency, STEP 85 (2022)" on both documents and not on the home page`, its Arabic twin, and `languages: README.md carries none`; with `>Native<` edited to `>Native.<` in `dist/en/cv/index.html` it printed `check-dist: languages: dist/en/cv/index.html does not show "Native" as authored` and exited non-zero; the file was restored.
- [x] `scripts/test-content-mechanism.mjs` writes a third fixture under `src/content/languages/`, `fixture-language-probe-<suffix>`, expected in `en/cv`, `ar/cv`, `en/resume`, `ar/resume`, `en/resume.json`, and `ar/resume.json` and nowhere else, removed with the other two; the run's `present:` and `absent:` lines for it are quoted here (criterion 1, the mechanism half; criterion 9). Verified 2026-09-11, `pnpm test:content`: `present: "fixture-language-probe-9e3d5c" in dist/en/cv/index.html, dist/ar/cv/index.html, dist/en/resume/index.html, dist/ar/resume/index.html, dist/en/resume.json, dist/ar/resume.json and nowhere else`, then `absent: "fixture-language-probe-9e3d5c" is in no file under dist/`, and `test-content-mechanism: passed`; `src/content/languages/` holds `arabic.yaml` and `english.yaml` after the run.
- [x] `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass; the test count is quoted (criterion 11). Verified 2026-09-11: `pnpm build` printed `[localized] 0 gaps`; `pnpm check` `0 errors, 0 warnings`; `pnpm check:dist` exited 0; `pnpm test` `604 passed (35.2s)`; `pnpm test:content` `passed`. `git diff --stat` on this ticket touches `tests/resume.spec.ts`, `scripts/check-dist.mjs`, and `scripts/test-content-mechanism.mjs` and nothing under `src/`.

## Relevant areas

`tests/resume.spec.ts`: `entries()` at line 23, `tailOrder` and `sectionsExpected` at lines 66 to 78, `summaryText` at line 90, the per-variant describe from line 114, the skills-lines test near line 401 as the shape for the new one. `scripts/check-dist.mjs`: `json resume` from line 100 with `sections` at line 101, the reading-order `expected` from line 235, `nationalityWhereItBelongs` at line 1056 and where it is registered in the check list. `scripts/test-content-mechanism.mjs`: the `project` and `certificate` fixtures at lines 49 and 84, `fixtures` at line 98, `assertPresent` at line 168.

## Constraints

- **The tail is computed, not retyped.** The test and the check import the same function ticket 02 wrote, or reproduce it from the authored fields in one helper each; four hand-written copies of "STEP 85 (2022)" is what the plan rules out.
- **The reading-order check stays English-only**, as it is for every other fact; the Arabic lines are the browser test's, as the plan's *Technical risks* says.
- **The fixture language carries no `test`**, so the removal pass and the presence pass do not depend on a score's format.
- **Nothing in `src/` changes here.** A test that needs the page changed is a finding for ticket 02 or the plan.

## Notes

The where-it-belongs check asserts `>value<`, alone between tags, for the same reason the nationality check does: "Native" could one day appear inside a sentence somewhere true, and only the standalone item is the fact this check guards.
