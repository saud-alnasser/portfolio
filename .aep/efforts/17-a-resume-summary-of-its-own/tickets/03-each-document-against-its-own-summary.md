---
status: resolved
blocked-by: [01]
---

# test(cv): each document asserted against the summary it prints

## Outcome

Nothing today asserts that either document prints the profile summary at all, and nothing asserts `basics.summary` in either JSON document against the source. A document that drifted from the field it is supposed to read would ship. Both gaps close: `tests/resume.spec.ts` asserts per document that the summary section holds the authored text for that document, and the `jsonResume` check in `scripts/check-dist.mjs` asserts `basics.summary` is the authored `summary`, beside the `basics.url` assertion already there.

## Acceptance Criteria

- [x] `tests/resume.spec.ts` asserts, for each locale, that the CV page's summary section holds `profile.summary` and the resume page's holds `profile.resumeSummary`, read from `src/content/profile.yaml` the way that file already reads the rest of the content (criterion 1). Eight cases, two documents by two languages by two colour schemes, reading the `profile` const the file already parses. `pnpm test --grep "opens with the summary authored"`: 8 passed.
- [x] Swapping the two in `src/components/CvDocument.astro` fails that test rather than passing it. Confirmed once by hand, because an assertion that holds either way is not one (criterion 1). Swapped on the effort branch after integration, rebuilt, and the test failed on both documents in both languages; reverted and the eight pass again.
- [x] The `jsonResume` check asserts `basics.summary` equals the authored `summary` for each locale, with its Arabic falling back to English exactly as `pick()` does, so the check agrees with the renderer rather than with the file (criterion 5). Proved to have teeth by pointing `src/lib/resume.ts` at the wrong field, which failed the check with both texts quoted, and proved to agree with the renderer by deleting `summary.ar`, which left the check passing while the build reported `[localized] 1 gap: profile/profile.summary`. Both edits reverted.
- [x] `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` pass (criterion 6). On the effort branch with 01 and 02 already on it: `check` 0 errors and 0 warnings, `check:dist` every check including `readme profile`, `test` **604 passed** which is 596 plus the eight new cases, `test:content` passed.

## Relevant areas

`tests/resume.spec.ts`, which already parses `src/content/profile.yaml` at line 32 and exists to assert the part where the two documents differ. `scripts/check-dist.mjs`, the `jsonResume` function and its `basics.url` assertion at line 160. The summary section on the page carries `data-cv-section="summary"`, which is what the assertion selects on.

## Constraints

- **The expectation is read from `src/content/`, never written into the test.** That is how `tests/resume.spec.ts` and `scripts/check-dist.mjs` both already work, so a document that drifts from the source fails rather than being believed.
- **The Arabic case must fall back the way the site falls back.** `pick()` in `src/lib/localized.ts` renders English when the Arabic is absent, so an assertion reading the file's `ar` directly would fail on a gap that is legal.

## Notes

Blocked by 01 only because the resume half of the assertion needs the field to exist. The JSON half is independent of both content tickets: it reads whatever `summary` says at the time it runs, so it passes before and after ticket 02.

This is the first assertion in the suite that either document prints a profile field at all. The document tests until now have covered which sections each carries, in what order, and which entries are in them.

**`pick()` inside a dist check writes to the gap store.** `jsonResume` now calls it, and the store is process-global, so the source it passes is deliberately the exact one the `gaps` check derives for that field. Verified: with the Arabic removed the build reported `[localized] 1 gap: profile/profile.summary`, one key rather than a duplicate. A future assertion in `jsonResume` over a field that `gaps()` does not walk would add a phantom line to the report. A non-recording read would close that off and is not this ticket's.
