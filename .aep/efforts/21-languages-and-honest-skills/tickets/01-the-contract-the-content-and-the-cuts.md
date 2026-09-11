---
status: resolved
---

# feat(content): a languages collection with its two entries, eleven keywords out of the skills, and the format documented

## Outcome

`src/content/` holds a `languages/` collection the build enforces, with Arabic and English authored in both languages of the site and the English entry carrying the STEP result as a fact; the eleven keywords no shown entry backs are gone from the skill groups; and `src/content/README.md` says what a language file holds, which outputs read it, and the rule a keyword has to meet. Nothing reads the collection yet, so the build is green at the end of this ticket with every existing output unchanged except the pruned skills, which shrink everywhere at once.

## Acceptance Criteria

- [x] `src/content.config.ts` declares a `languages` collection with a localized `name`, a localized `level`, an optional `test` of `name`, `score` as text, and `date` in the ISO pattern, and an optional `order`, every object strict; a file with `level` removed fails `pnpm build` with the schema's own message, quoted here, and the field is restored (criterion 1, the schema half). Verified 2026-09-11: with the `level` block cut from `arabic.yaml`, `pnpm build` printed `[InvalidContentEntryDataError] languages → arabic data does not match collection schema. level: Required`, naming `src/content/languages/arabic.yaml`; the file was restored from a copy and `grep -c level` on it reads 1 again.
- [x] `src/content/languages/arabic.yaml` and `english.yaml` exist with the values [[efforts/21-languages-and-honest-skills/plan]] gives under *Data model*: "Arabic: Native" / "العربية: اللغة الأم", and "English: Working proficiency" / "الإنجليزية: إجادة مهنية" with `test: { name: STEP, score: "85", date: "2022-08-21" }`; `order` 1 and 2 (criteria 3 and 4, the authored half). The English file's comment names the research file and says the level phrase and the score are Saud's, read off the ETEC result dated 1444/01/23 AH. Verified 2026-09-11 by reading both files back. One deliberate departure: the comment names the research by what it read (Saudi hiring platforms and employer forms, 2026-09-11) and what it found, not by its path, because `policies/artifacts` forbids a `.aep/` path in a source comment, and a comment that cited one was a review finding on effort 1.
- [x] `git diff --stat src/content/skills/` touches four files, and the diff removes exactly Renovate, pnpm, Scrum, AI-assisted development, Supabase, JIT compilation, Type systems, Garbage collection, React, ASP.NET MVC, and Entity Framework, with no other line changed (criterion 7). After `pnpm build`, `grep -ril` over `dist/` for each of the eleven finds nothing, except "Scrum" inside Mudaraj's summary. Verified 2026-09-11: `git diff --stat src/content/skills/` printed `4 files changed, 11 deletions(-)`, and the diff's only changed lines are the eleven `-  - "<keyword>"` removals. The grep found Renovate, pnpm, AI-assisted development, JIT compilation, Type systems, and Garbage collection in no file under `dist/`. It found the other five, and every hit is an entry's own fact rather than a skill: "Scrum" in Mudaraj's summary and "Supabase" on Mudaraj's technologies line (the `projects` section of the CV pages, the work pages, and `projects[]` of both JSON files), and "React", "ASP.NET MVC 5", and "Entity Framework 6" as the names of three course certificates (the `courses` section of the CV pages, the education pages, and `certificates[]` of both JSON files). The skills sections of the home pages and both documents, and `skills[].keywords` in both JSON files, carry none of the eleven; the criterion's "except Scrum" named one of these backing entries and missed the other four, which the spec itself leaves untouched.
- [x] `src/content/README.md` has a `languages/` section after `skills/` with the field table, saying the two documents and both JSON files read it and the home page and the README do not; the `keywords` row states the rule of requirement 8; and the `profile.yaml` prose that lists what the documents carry names languages (criteria 8 and 10). Verified 2026-09-11 by reading the file: the section sits between `skills/` and *Adding a project, step by step*; the `keywords` row opens its rule with "A keyword names something a shown entry backs"; the `profile.yaml` prose says the languages are entries under `languages/`, read by the two hiring documents and the JSON Resume document alone, beside the sentence on `nationality`.
- [x] `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass on this ticket alone, which proves the cuts reach the site's skills section, both documents, and both JSON files with no file outside `src/content/` (criteria 9 and 11). Verified 2026-09-11: `pnpm build` printed `[localized] 0 gaps`; `pnpm check` printed `0 errors, 0 warnings, 44 hints`; `pnpm render:pdf` then `pnpm check:dist` passed every check, both JSON files valid with `skills 6`; `pnpm test` printed `596 passed (33.2s)`; `pnpm test:content` printed `test-content-mechanism: passed`. Both JSON files carry 32 keywords in 6 groups, down from 43, and `grep` for each of the eleven over `dist/en/index.html` counts 0.

## Relevant areas

`src/content.config.ts`: `localized` at line 30, `iso8601` at line 15, the `skills` collection at line 186 as the nearest shape, `collections` at line 198. `src/content/skills/`, four of the six files. `src/content/README.md`: the `profile.yaml` section from line 40, `skills/` at line 178. `src/content/projects/mudaraj.yaml` is read, not changed.

## Constraints

- **Only the eleven leave.** SolidJS is an open question on the spec and stays; Drizzle ORM, PostgreSQL, C#, and the rest Saud kept are not touched.
- **`score` is text, quoted in YAML**, so a band with a half survives and `85` prints as written; the plan's *Data model* says why.
- **`pnpm check:dist` needs the PDFs**: run `pnpm render:pdf` after the build, as `docs/development.md` orders it. The resume's headroom is not this ticket's number; it is recorded in ticket 02, where the page changes.

## Notes

`scripts/test-content-mechanism.mjs` writes fixtures under `projects/` and `certificates/` only, so a new collection needs no change there for this ticket to pass; ticket 03 adds the language fixture.

Measured in passing, not owed here: the pruned skills set to fewer lines, so `pnpm render:pdf` reported 61.1mm free at Letter in English and 60.7mm in Arabic, up from 55.9mm and 55.4mm after #20. Ticket 02 spends from that.
