---
status: open
blocked-by: [02]
---

# test(cv): the languages asserted where the nationality is, and a fixture language through the content mechanism

## Outcome

Every claim the spec makes about the languages has a check that fails when it stops being true: the section's place in the order, the exact text of each line in both locales, the two facts on one extracted line of each English PDF, the count and the `fluency` strings in both JSON files, the absence of the level from the home page and the README, and a fixture language that reaches both documents and both JSON files and nowhere else, then disappears. The browser suite passes again.

## Acceptance Criteria

- [ ] `tests/resume.spec.ts` expects `languages` directly after `skills` on both variants when the collection holds something, reading the collection the way `entries()` reads the others, and a new test asserts each `li` of the section against the authored name and the tail, per locale, with the `[locale] ?? .en` fallback the file already uses for the summary (criteria 2, 3, and 4).
- [ ] `scripts/check-dist.mjs`, reading order: one group per language, `[name, tail]`, after the education groups, found on one line in `cv.en.pdf`, `resume.en.pdf`, and both filled copies; the check's own output line counts the added facts (criterion 2, the PDF half; criterion 4).
- [ ] `scripts/check-dist.mjs`, `json resume`: `languages` joins `sections` so its count is checked against `src/content/languages/`, and each entry's `language` and `fluency` are compared to the authored text and the tail for that locale (criterion 5).
- [ ] `scripts/check-dist.mjs` gains `languagesWhereTheyBelong` beside `nationalityWhereItBelongs`: each level stands alone between tags on both document pages per locale, and appears in neither `dist/<locale>/index.html` nor `README.md`; it prints one line per locale like the nationality check (criterion 6).
- [ ] `scripts/test-content-mechanism.mjs` writes a third fixture under `src/content/languages/`, `fixture-language-probe-<suffix>`, expected in `en/cv`, `ar/cv`, `en/resume`, `ar/resume`, `en/resume.json`, and `ar/resume.json` and nowhere else, removed with the other two; the run's `present:` and `absent:` lines for it are quoted here (criterion 1, the mechanism half; criterion 9).
- [ ] `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass; the test count is quoted (criterion 11).

## Relevant areas

`tests/resume.spec.ts`: `entries()` at line 23, `tailOrder` and `sectionsExpected` at lines 66 to 78, `summaryText` at line 90, the per-variant describe from line 114, the skills-lines test near line 401 as the shape for the new one. `scripts/check-dist.mjs`: `json resume` from line 100 with `sections` at line 101, the reading-order `expected` from line 235, `nationalityWhereItBelongs` at line 1056 and where it is registered in the check list. `scripts/test-content-mechanism.mjs`: the `project` and `certificate` fixtures at lines 49 and 84, `fixtures` at line 98, `assertPresent` at line 168.

## Constraints

- **The tail is computed, not retyped.** The test and the check import the same function ticket 02 wrote, or reproduce it from the authored fields in one helper each; four hand-written copies of "STEP 85 (2022)" is what the plan rules out.
- **The reading-order check stays English-only**, as it is for every other fact; the Arabic lines are the browser test's, as the plan's *Technical risks* says.
- **The fixture language carries no `test`**, so the removal pass and the presence pass do not depend on a score's format.
- **Nothing in `src/` changes here.** A test that needs the page changed is a finding for ticket 02 or the plan.

## Notes

The where-it-belongs check asserts `>value<`, alone between tags, for the same reason the nationality check does: "Native" could one day appear inside a sentence somewhere true, and only the standalone item is the fact this check guards.
