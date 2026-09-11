---
status: open
---

# feat(content): a languages collection with its two entries, eleven keywords out of the skills, and the format documented

## Outcome

`src/content/` holds a `languages/` collection the build enforces, with Arabic and English authored in both languages of the site and the English entry carrying the STEP result as a fact; the eleven keywords no shown entry backs are gone from the skill groups; and `src/content/README.md` says what a language file holds, which outputs read it, and the rule a keyword has to meet. Nothing reads the collection yet, so the build is green at the end of this ticket with every existing output unchanged except the pruned skills, which shrink everywhere at once.

## Acceptance Criteria

- [ ] `src/content.config.ts` declares a `languages` collection with a localized `name`, a localized `level`, an optional `test` of `name`, `score` as text, and `date` in the ISO pattern, and an optional `order`, every object strict; a file with `level` removed fails `pnpm build` with the schema's own message, quoted here, and the field is restored (criterion 1, the schema half).
- [ ] `src/content/languages/arabic.yaml` and `english.yaml` exist with the values [[efforts/21-languages-and-honest-skills/plan]] gives under *Data model*: "Arabic: Native" / "العربية: اللغة الأم", and "English: Working proficiency" / "الإنجليزية: إجادة مهنية" with `test: { name: STEP, score: "85", date: "2022-08-21" }`; `order` 1 and 2 (criteria 3 and 4, the authored half). The English file's comment names the research file and says the level phrase and the score are Saud's, read off the ETEC result dated 1444/01/23 AH.
- [ ] `git diff --stat src/content/skills/` touches four files, and the diff removes exactly Renovate, pnpm, Scrum, AI-assisted development, Supabase, JIT compilation, Type systems, Garbage collection, React, ASP.NET MVC, and Entity Framework, with no other line changed (criterion 7). After `pnpm build`, `grep -ril` over `dist/` for each of the eleven finds nothing, except "Scrum" inside Mudaraj's summary.
- [ ] `src/content/README.md` has a `languages/` section after `skills/` with the field table, saying the two documents and both JSON files read it and the home page and the README do not; the `keywords` row states the rule of requirement 8; and the `profile.yaml` prose that lists what the documents carry names languages (criteria 8 and 10).
- [ ] `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass on this ticket alone, which proves the cuts reach the site's skills section, both documents, and both JSON files with no file outside `src/content/` (criteria 9 and 11).

## Relevant areas

`src/content.config.ts`: `localized` at line 30, `iso8601` at line 15, the `skills` collection at line 186 as the nearest shape, `collections` at line 198. `src/content/skills/`, four of the six files. `src/content/README.md`: the `profile.yaml` section from line 40, `skills/` at line 178. `src/content/projects/mudaraj.yaml` is read, not changed.

## Constraints

- **Only the eleven leave.** SolidJS is an open question on the spec and stays; Drizzle ORM, PostgreSQL, C#, and the rest Saud kept are not touched.
- **`score` is text, quoted in YAML**, so a band with a half survives and `85` prints as written; the plan's *Data model* says why.
- **`pnpm check:dist` needs the PDFs**: run `pnpm render:pdf` after the build, as `docs/development.md` orders it. The resume's headroom is not this ticket's number; it is recorded in ticket 02, where the page changes.

## Notes

`scripts/test-content-mechanism.mjs` writes fixtures under `projects/` and `certificates/` only, so a new collection needs no change there for this ticket to pass; ticket 03 adds the language fixture.
