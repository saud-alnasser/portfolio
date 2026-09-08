---
status: open
blocked-by: [03]
---

# feat(cv): emit a JSON Resume document per language

## Outcome
`src/lib/resume.ts` maps the collections to a JSON Resume document for one language, and `src/pages/[locale]/resume.json.ts` serves it as a static endpoint at `/en/resume.json` and `/ar/resume.json`. The document validates against `@jsonresume/schema` and carries every entry the CV page shows.

## Acceptance Criteria
- [ ] Both endpoints exist in `dist/` and `@jsonresume/schema`'s `validate()` reports each valid (criterion 6).
- [ ] Counts of `work`, `education`, `certificates`, `projects`, and `skills` entries equal the CV page's for that language; `visibility: hidden` entries are absent and `described` projects carry no `url` key (criterion 6, requirement 3).
- [ ] The pending degree maps to an `education` entry with `endDate` set to the completion term and a `status: "certificate-pending"` key inside the entry; the training placement maps to `work[]` with the placement nature in `position` and a `type: "training"` key; course certificates map to `certificates[]` with the platform in `issuer` (requirement 4, requirement 6).
- [ ] The document sets `$schema` to the monorepo `schema.json` URL the evidence names, `meta.canonical` to its own address, `meta.lastModified` to the build time, and `basics.url` to the site (requirement 6).
- [ ] Changing one value in a content file changes it in the page, the CV page, and the JSON document with no other edit (criterion 1).

## Relevant areas
`src/lib/resume.ts` (new), `src/pages/[locale]/resume.json.ts` (new), `@jsonresume/schema` as a dev dependency for the check, `scripts/check-dist.mjs` gains the validation step.

## Constraints
- Custom keys go inside section entries only, never at the top level, because the project's own samples point `$schema` at a v1.0.0 document that forbids top-level additions; see [[efforts/1-portfolio-site/evidence/research/json-resume-schema]].
- Omit `url` rather than emitting an empty string; an empty string fails `format: uri`.
- Dates pass through unchanged; the content contract already enforces the pattern.

## Notes
The plan's technical approach step 6. Independent of the layout tickets; it can land beside 05.
