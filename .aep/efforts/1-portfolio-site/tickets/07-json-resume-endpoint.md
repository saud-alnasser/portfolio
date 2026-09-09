---
status: resolved
blocked-by: [03]
---

# feat(cv): emit a JSON Resume document per language

## Outcome
`src/lib/resume.ts` maps the collections to a JSON Resume document for one language, and `src/pages/[locale]/resume.json.ts` serves it as a static endpoint at `/en/resume.json` and `/ar/resume.json`. The document validates against `@jsonresume/schema` and carries every entry the CV page shows.

## Acceptance Criteria
- [x] Both endpoints exist in `dist/` and `@jsonresume/schema`'s `validate()` reports each valid (criterion 6).
  Verified 2026-09-08 in the run's surface after integration: `pnpm build` listed `/en/resume.json` and `/ar/resume.json` among the generated routes, and `pnpm check:dist` (which calls `validate()` from `@jsonresume/schema` 1.3.1) printed `en/resume.json: valid, work 1, education 1, certificates 1, skills 1, projects 2` and the same line for `ar`, exit 0.
- [x] Counts of `work`, `education`, `certificates`, `projects`, and `skills` entries equal the CV page's for that language; `visibility: hidden` entries are absent and `described` projects carry no `url` key (criterion 6, requirement 3).
  Verified: `check-dist.mjs` counts the non-hidden YAML files per collection, which is the set the CV page shows, and asserts each section against it (the line above shows the counts); the child added a temporary `visibility: hidden` fixture, rebuilt, and found zero occurrences of it in either document; the described fixture `Fixture Relay` has no `url` key in `dist/en/resume.json`, and the check fails by name if one appears. The comparison against the rendered CV page itself waits for ticket 06 and is re-checked by ticket 09 and at converge.
- [x] The pending degree maps to an `education` entry with `endDate` set to the completion term and a `status: "certificate-pending"` key inside the entry; the training placement maps to `work[]` with the placement nature in `position` and a `type: "training"` key; course certificates map to `certificates[]` with the platform in `issuer` (requirement 4, requirement 6).
  Verified by reading `dist/en/resume.json`: `education[0]` carries `"endDate": "2026-08"` and `"status": "certificate-pending"`; `work[0]` carries `"position": "IT trainee"` and `"type": "training"`; `certificates[0]` carries `"issuer": "Fixture Academy"`. The mapper (`mapEducation`, `mapWork`) writes those keys inside the entries only; the top level has `$schema` and the schema's sections and `meta` alone.
- [x] The document sets `$schema` to the monorepo `schema.json` URL the evidence names, `meta.canonical` to its own address, `meta.lastModified` to the build time, and `basics.url` to the site (requirement 6).
  Verified by reading `dist/en/resume.json`: `"$schema": "https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/schema.json"`, `"basics.url": "https://saud-alnasser.github.io/"`, `meta.canonical` is `https://saud-alnasser.github.io/en/resume.json` (and `/ar/resume.json` in the Arabic document), `meta.lastModified` is the build's UTC time as `YYYY-MM-DDThh:mm:ss`.
- [x] Changing one value in a content file changes it in the page, the CV page, and the JSON document with no other edit (criterion 1).
  Verified by the child: changing `name.en` in `profile.yaml` to `Fixture Persona` and rebuilding changed `dist/en/resume.json` with no other edit, then reverted. The page and CV page halves are checked when tickets 05 and 06 render the same collections, and by ticket 09's criterion-1 test.

## Relevant areas
`src/lib/resume.ts` (new), `src/pages/[locale]/resume.json.ts` (new), `@jsonresume/schema` as a dev dependency for the check, `scripts/check-dist.mjs` gains the validation step.

## Constraints
- Custom keys go inside section entries only, never at the top level, because the project's own samples point `$schema` at a v1.0.0 document that forbids top-level additions; see [[efforts/1-portfolio-site/evidence/research/json-resume-schema]].
- Omit `url` rather than emitting an empty string; an empty string fails `format: uri`.
- Dates pass through unchanged; the content contract already enforces the pattern.

## Notes
The plan's technical approach step 6. Independent of the layout tickets; it can land beside 05.

Built 2026-09-08 by a dispatched implementer. Decisions taken within the ticket and recorded: `basics.location` is `{ city: <the localized location text> }` because the content source carries one location text; `meta.version` is `v1.3.1`; `meta.lastModified` is read once per build so both languages carry the same time; `resume.ts` carries its own `pick()` fallback with a comment naming ticket 05's shared `src/lib/localized.ts`, to be reconciled when 05 lands. `scripts/check-dist.mjs` is a list of check functions for ticket 09 to extend; the workflows do not call `check:dist` yet, which is ticket 09's wiring.
