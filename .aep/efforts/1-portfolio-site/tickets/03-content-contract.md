---
status: open
blocked-by: [01]
---

# feat(content): define the content collections and their schemas

## Outcome
`src/content.config.ts` declares one collection per entity type (profile, projects, experience, education, certificates, skills) with the Zod schemas the plan's interfaces section sketches, a shared `localized` text schema of `{ en, ar? }`, and an `iso8601` date pattern matching JSON Resume's. One fixture entry per collection exercises every field. The README documents the content format, one section per collection, every field and its meaning.

## Acceptance Criteria
- [ ] `pnpm build` fails with Astro's content error naming the file when a fixture entry has a date outside `YYYY`, `YYYY-MM`, `YYYY-MM-DD`, an unknown `status` or `visibility` value, a missing `en` text, or an empty-string `url` (requirement 1, requirement 9).
- [ ] The project schema accepts an entry with no `links` and one with `links.repository`, and `visibility` is one of `public`, `described`, `hidden` (requirement 3, criterion 3).
- [ ] The education schema requires `status` in `completed`, `certificate-pending`, `in-progress` (requirement 4).
- [ ] The experience schema carries `kind` in `employment`, `training` (requirement 11).
- [ ] `README.md` has a "Content" section documenting each collection, each field, its type, whether it is per language, and the allowed values; adding a project is described as adding one YAML file and nothing else (criterion 9).
- [ ] No fixture or schema example contains a phone number, national identifier, or student identifier (requirement 12).

## Relevant areas
`src/content.config.ts` (new), `src/content/<collection>/` fixture files (new), `README.md` (new at the root). The schema sketch is in [[efforts/1-portfolio-site/plan]] under Interfaces; the field meanings come from [[efforts/1-portfolio-site/evidence/research/json-resume-schema]].

## Constraints
- `glob()` loader for the per-entry collections, `file()` for the single profile file, per the plan.
- The `iso8601` pattern is JSON Resume's exactly, so a date valid here is valid there.
- Fixtures are clearly fictional and are replaced by ticket 04; name them so a grep for `fixture` finds them.

## Notes
The plan's technical approach step 2. This is the contract every later ticket reads; changing a field name after ticket 05 costs three templates and a mapper.
