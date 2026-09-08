---
status: resolved
blocked-by: [01]
---

# feat(content): define the content collections and their schemas

## Outcome
`src/content.config.ts` declares one collection per entity type (profile, projects, experience, education, certificates, skills) with the Zod schemas the plan's interfaces section sketches, a shared `localized` text schema of `{ en, ar? }`, and an `iso8601` date pattern matching JSON Resume's. One fixture entry per collection exercises every field. The README documents the content format, one section per collection, every field and its meaning.

## Acceptance Criteria
- [x] `pnpm build` fails with Astro's content error naming the file when a fixture entry has a date outside `YYYY`, `YYYY-MM`, `YYYY-MM-DD`, an unknown `status` or `visibility` value, a missing `en` text, or an empty-string `url` (requirement 1, requirement 9).
  Verified 2026-09-08 by a script that writes one bad entry at a time and runs `astro build`: `start: Sep 2024` was refused with `[InvalidContentEntryDataError] projects → zz-bad-date` and `period.start: a date is written YYYY, YYYY-MM, or YYYY-MM-DD`; `visibility: secret` with `visibility: Invalid option: expected one of "public"|"described"|"hidden"`; a `role` carrying only `ar` with `role.en: Required`; `links.repository: ""` with `links.repository: Invalid URL`; `status: graduated` with `status: Invalid option: expected one of "completed"|"certificate-pending"|"in-progress"`; a misspelt `keyword` key with `Unrecognized key: "keyword"`. Every run exited non-zero and printed the file's path under `Location:`. With the bad entry removed, `pnpm build` exits 0 and builds 2 pages.
- [x] The project schema accepts an entry with no `links` and one with `links.repository`, and `visibility` is one of `public`, `described`, `hidden` (requirement 3, criterion 3).
  Verified: the two committed fixtures are exactly those two shapes (`fixture-linked-project.yaml` with `links.repository`, `fixture-described-project.yaml` with no `links`) and `pnpm build` accepts both; `visibility` is `z.enum(['public', 'described', 'hidden'])` and the refusal of `secret` above shows the enum enforced.
- [x] The education schema requires `status` in `completed`, `certificate-pending`, `in-progress` (requirement 4).
  Verified: `status: z.enum(educationStatuses)` with those three values; the refusal of `graduated` above shows it enforced, and an entry with no `status` at all was refused with the same `status: Invalid option: expected one of "completed"|"certificate-pending"|"in-progress"` line.
- [x] The experience schema carries `kind` in `employment`, `training` (requirement 11).
  Verified: `kind: z.enum(experienceKinds)`; `kind: internship` was refused with `kind: Invalid option: expected one of "employment"|"training"`.
- [x] `README.md` has a "Content" section documenting each collection, each field, its type, whether it is per language, and the allowed values; adding a project is described as adding one YAML file and nothing else (criterion 9).
  Verified by reading `README.md`: a `## Content` section with a conventions list, one subsection and table per collection (`profile.yaml`, `projects/`, `experience/`, `education/`, `certificates/`, `skills/`) with columns Field, Type, Per language, Meaning, the allowed values for `visibility`, `status`, and `kind` in the Type column, and a closing "Adding a project, step by step" that ends "Nothing outside `src/content/` changes."
- [x] No fixture or schema example contains a phone number, national identifier, or student identifier (requirement 12).
  Verified: `grep -r -n -E '1[0-9]{9}|2[0-9]{8}|\+?9665[0-9]{8}|05[0-9]{8}' src/content README.md` printed nothing.

## Relevant areas
`src/content.config.ts` (new), `src/content/<collection>/` fixture files (new), `README.md` (new at the root). The schema sketch is in [[efforts/1-portfolio-site/plan]] under Interfaces; the field meanings come from [[efforts/1-portfolio-site/evidence/research/json-resume-schema]].

## Constraints
- `glob()` loader for the per-entry collections, `file()` for the single profile file, per the plan.
- The `iso8601` pattern is JSON Resume's exactly, so a date valid here is valid there.
- Fixtures are clearly fictional and are replaced by ticket 04; name them so a grep for `fixture` finds them.

## Notes
The plan's technical approach step 2. This is the contract every later ticket reads; changing a field name after ticket 05 costs three templates and a mapper.

Built 2026-09-08. What was finalised beyond the plan's sketch, for the tickets that read the contract:
- Every object schema is `.strict()`, so a misspelt key fails the build instead of vanishing.
- `iso8601` preprocesses what YAML hands over: an unquoted `2021-12-03` arrives as a Date and a bare `2022` as a number, and both are turned back into the text that was written before the pattern runs. The committed fixtures use both forms.
- `education.courses` and `skills.level` are per-language text (`localized`), not plain strings as the sketch had them, because a visitor reads them. `experience.highlights` is `localized[]` as sketched.
- `profile.yaml` is loaded with `file()` and carries one top-level key, `profile:`, which the loader takes as the entry id; the README says so.
- Ticket 05 reads the entry with `getEntry('profile', 'profile')` and the others with `getCollection()`.
- On this Windows machine a refused build exits with a libuv assertion (`!(handle->flags & UV_HANDLE_CLOSING)`) after printing the content error; the exit is non-zero either way, and the same refusal on the Linux runner is expected to exit 1.
