---
status: open
---

# feat(content): a completion status on projects, a kind on certificates, a resume marker, and the one predicate every output reads

## Outcome
The content contract carries the three fields the plan's "Interfaces" names, the content is authored to the plan's "Data model", and `src/lib/shown.ts` is the one place that decides whether a project appears. Every output that filters projects reads it: the pages, the JSON Resume mapper, the dist check, the content mechanism test, and the browser tests that compute their expectations from `src/content/`. Only finished work is shown, screeps is in no output, and the content README documents the fields. The site still has today's sections; splitting and reordering them is ticket 02, and the documents are ticket 03.

## Acceptance Criteria
- [ ] Every project file carries `status`, every certificate file carries `kind`, and `pnpm build` refuses a project without `status` and a certificate without `kind`, naming the file, tried once with each field removed (criterion 1, criterion 15).
- [ ] Setting one project's status to `in-progress` and building removes it from the work page, the home page's project count, the CV page, and both JSON Resume documents with no other edit; a search of `dist/` for its name finds nothing (criterion 1).
- [ ] A search of `dist/` and both JSON Resume documents for "screeps" finds nothing; the file stays in `src/content/projects/` with `visibility: hidden` and `status: in-progress` (criterion 2).
- [ ] `pnpm check:dist` passes with `jsonResume` expecting the set `isShown` admits, computed by parsing each project file rather than matching `visibility: hidden`, and the JSON documents carry exactly that set (criterion 12).
- [ ] `tests/home.spec.ts` and `tests/work.spec.ts` compute their project expectations through `isShown` and pass against the built site; `pnpm test` passes (criterion 1).
- [ ] `pnpm test:content` passes with the fixture project carrying `status: completed` and `resume: true` and the fixture certificate carrying `kind: course`; the fixture project is asserted in the work page, the CV page, and the JSON document in both languages, six files until ticket 03 adds the resume page (criterion 15).
- [ ] `src/content/README.md` documents `status` and its values, `kind` and its values, and `resume`, and says which output each affects (criterion 15).

## Relevant areas
`src/content.config.ts`, new `src/lib/shown.ts`, `src/lib/resume.ts`, `src/pages/[locale]/index.astro`, `src/pages/[locale]/work/index.astro`, `src/pages/[locale]/cv.astro`, `src/content/projects/*.yaml`, `src/content/certificates/*.yaml`, `scripts/check-dist.mjs` (`visibleEntries`, `jsonResume`, `gaps`), `scripts/test-content-mechanism.mjs`, `tests/home.spec.ts`, `tests/work.spec.ts`, `src/content/README.md`.

## Constraints
- The field names, values, and the predicate's signature are the plan's "Interfaces"; the per-project statuses, the resume marks, and the kinds are the plan's "Data model", which is the spec's confirmed table. Author them exactly; a project not in the table does not exist.
- `status` is required on projects; `kind` is required on certificates; `resume` is optional and absent means false. The JSON Resume mapper does not emit `resume` or `kind`.
- The scripts and tests import `src/lib/shown.ts` the way they import `src/lib/order.ts` today, with Node stripping the types; no regular expression over the YAML remains for a project's visibility.
- The content mechanism test's outputs list for the project grows to eight in ticket 03; here it stays at the six that exist, and the resume flag on the fixture is authored now so ticket 03 changes the list alone.

## Notes
The plan's technical approach step 1. Every other ticket stacks on this branch.
