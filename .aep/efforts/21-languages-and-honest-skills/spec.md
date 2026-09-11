---
status: draft
---

# Problem

Two things on the documents are wrong for the reader they are written for, a screener at a Saudi employer, and Saud named both on 2026-09-11.

**Neither document says which languages he speaks.** Employers ask; he has noticed it, and the research in `evidence/research/languages-section-in-saudi-resumes.md` says why. Jadarat, the national employment platform, carries a "اللغات" / "Languages" block in every job seeker's profile, one language and one proficiency level per entry, and it machine-reads languages out of the CV a Saudi applicant uploads (F1 to F4). The one Saudi template that renders the section lists Arabic then English, one word of level each (F7). The one Saudi software employer that states a language requirement states it for English, as a test score (F12, and effort 7's F18). The profile in `src/content/profile.yaml` carries name, label, two summaries, nationality, location, and GitHub, and nothing about language; `CvDocument.astro` prints no such section; `src/lib/resume.ts` emits no `languages` array although the JSON Resume schema has one (F19). A parser reading either PDF into Jadarat finds nothing to put in that block.

**The key skills claim things the record does not back.** Read as a screener reads them, against the projects, the placement, and the certificates the same document prints, some keywords have no witness at all, and a screener who checks one and finds nothing stops trusting the rest. Scrum is named only in Mudaraj's summary, a team prototype. Supabase comes only from Mudaraj, and Saud says he has not used it. JIT compilation, garbage collection, and type systems come only from Nova, which is in draft and shown nowhere. Renovate and pnpm are a bot's configuration and a package manager, not skills, and "AI-assisted development" is backed only by AEP, in progress and unshown, and reads as the phrase a generated resume would carry. React, ASP.NET MVC, and Entity Framework are each one course with nothing built since, on a stack the rest of the record has moved past. Saud reviewed each of these on 2026-09-11, cut the ones above, and kept Drizzle ORM, PostgreSQL, C#, the course-backed fundamentals, and the game development group.

# Goal

Both documents carry a languages section a Saudi screener and Jadarat's parser recognise: headed "Languages" / "اللغات", one line per language with a single level, Arabic then English, in both languages of the site, and both JSON Resume documents carry the same facts in the schema's own `languages` array. The key skills name only what a shown entry on the same document backs, in every output that prints them. The resume is still one page in both languages, on A4 and on Letter, published and filled, with headroom at or above the floor `scripts/render-pdf.mjs` enforces.

# Scope

- `src/content.config.ts`, the profile schema, which gains a list of languages.
- `src/content/profile.yaml`: the languages authored in English and Arabic, and the comment saying where the vocabulary comes from.
- `src/content/skills/*.yaml`: the keywords that leave.
- `src/content/README.md`, where the profile and skills field tables are, and where the rule a keyword has to meet is written down.
- `src/components/CvDocument.astro`, which prints the section on both variants.
- `src/lib/resume.ts`, which maps the languages into both JSON Resume documents.
- `src/lib/i18n.ts`, the section heading in both languages.
- The checks and tests that assert what a document holds and in what order: `tests/resume.spec.ts` and `scripts/check-dist.mjs`.
- The skills section of the site, `src/components/Skills.astro`, follows the content without a change of its own; it is in scope only in that its output changes.

# Requirements

1. **The profile carries the languages as facts.** A list on the profile entry, each item a language name and a proficiency level, both localized, in the order they print. The list is required and non-empty: a document with no languages section is the defect this effort fixes, and the schema refuses it.
2. **Both documents print a languages section, in the same place.** Headed with the standard word, "Languages" in English and "اللغات" in Arabic, one line per language reading "language: level", directly after the key skills on the CV and on the resume alike. A parser reading either PDF gets each language and its level whole, in reading order, the way it gets every other fact on the page.
3. **The level is one short phrase, and it is true of him.** Arabic is "Native" / "اللغة الأم". English is "Working proficiency" / "إجادة مهنية", chosen on 2026-09-11 at Saud's request from what the record showed before late 2022 and from his STEP result: the 2021 courses were English-taught, every repository, comment, and README since is written in English, and a STEP score of about 80 sits at roughly IELTS 5.5 on the one Saudi equivalence table that publishes the row (research F16), below the 85 stc screens at. "Fluent" would claim more than a 5.5 supports; "Intermediate" less than a record written entirely in English does. The vocabulary stays a single level per language, as the Saudi template has it (F7); CEFR bands and the LinkedIn ladder appear on no Saudi form (F8, F13) and are not used.
4. **A test score prints only once it is confirmed.** Saud holds a STEP result from university entry, which he remembers as 80 and is not sure of. Until the number is read off the ETEC certificate, the English line carries the level alone. When it is confirmed, the line carries it after the level as "STEP <score>", the way the market states the requirement (F12, F16), and the schema gets an optional score on a language for that purpose. A number nobody has checked does not go on a hiring document.
5. **Both JSON Resume documents carry the languages.** `languages` is an array of `{ language, fluency }` in each locale's own words, in the same order as the documents, and both files still validate against the schema.
6. **The site's pages do not change for the languages.** The home page, the skills section, and the README carry no languages line. Like the nationality, this is a fact for the two hiring documents and for the JSON file that follows them.
7. **The listed keywords leave the skill groups.** From `tools-and-practices`: Renovate, pnpm, Scrum, AI-assisted development. From `databases`: Supabase. From `language-implementation`: JIT compilation, Type systems, Garbage collection. From `web-and-desktop-applications`: React, ASP.NET MVC, Entity Framework. Nothing else in any group changes: no group is removed, no group is renamed, and the order of what remains is the order it had.
8. **A keyword names something a shown entry backs.** That is the rule the cuts apply, and it is written into `src/content/README.md` beside `keywords` so the next addition meets it: a keyword is a language, framework, tool, or practice that a completed project, an experience entry, or a certificate on the CV names or plainly used. Mudaraj's summary keeps "developed with Scrum", because that is a fact about the project rather than a claim of a skill.
9. **Every output that prints the skills follows.** The skills section of the site, the key skills on both documents, and `skills[].keywords` in both JSON documents print the pruned lists, with no change outside `src/content/`, because there is one content source.
10. **The format is documented where the format is documented.** `src/content/README.md` describes the languages field the way it describes `nationality`, says which outputs read it and which do not, and carries the keyword rule of requirement 8.
11. **Both languages of the site say the same thing.** Each language's name and level is authored in English and Arabic, and the build reports no localisation gap.
12. **The resume is still one page, with headroom the runner will not eat.** Both languages, both papers, published and filled, at or above the 10mm floor at Letter. The section is paid for out of the 55.9mm (en) and 55.4mm (ar) free at Letter after #20, never out of type size, and the number is measured and recorded.

# Acceptance Criteria

1. The profile schema requires a non-empty list of languages, each with a localized name and a localized level; a `profile.yaml` without it fails `pnpm build`.
2. On `/en/cv/`, `/en/resume/`, `/ar/cv/`, and `/ar/resume/`, a `[data-cv-section="languages"]` section headed "Languages" / "اللغات" prints one line per authored language as "name: level", and the section-order test in `tests/resume.spec.ts` places it directly after `skills` on both variants. The reading-order check in `scripts/check-dist.mjs` finds each language's name and level on one extracted line, in order, in the English PDFs.
3. The Arabic language's line reads "Arabic: Native" and "العربية: اللغة الأم"; the English language's reads "English: Working proficiency" and "الإنجليزية: إجادة مهنية", both authored in `profile.yaml`.
4. No score appears on any output until the STEP number is confirmed; once it is, the English line carries "STEP <score>" after the level in both PDFs and both JSON documents, and `profile.yaml` carries the number in one place. Which state landed is recorded in the commit.
5. `en/resume.json` and `ar/resume.json` carry `languages` with one `{ language, fluency }` per authored language in that locale's words, in the documents' order, and `pnpm check:dist` still reports both valid.
6. The home page, the skills section, and `README.md` contain no language name or level from the new field, checked in both locales.
7. `git diff` on `src/content/skills/` shows exactly the eleven keywords of requirement 7 removed and nothing else changed; `grep` for each of the eleven across `dist/` finds none, except "Scrum" inside Mudaraj's summary.
8. `src/content/README.md` states the keyword rule beside the `keywords` field.
9. `pnpm test:content` passes, and the skills section of `/en/` and `/ar/`, both documents, and both JSON files show the pruned keywords with no file outside `src/content/` needed for that change.
10. `src/content/README.md` documents the languages field, its vocabulary, and which outputs read it.
11. `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass.
12. `pnpm render:pdf` writes `resume.en.pdf` and `resume.ar.pdf`, and the filled copy of each, at one page on A4 and one page at Letter, each reporting at least 10mm free at Letter. The number goes in the commit.

# Constraints

- **One content source.** The languages and the skills are authored in `src/content/` and every output reads them there. A heading string lives in `src/lib/i18n.ts` with every other heading, which is the one place UI strings live.
- **The document is a hiring document, so what it claims must be true.** The level is authored by Saud, as the nationality was, and a keyword stays only where the record shows it. This is the constraint under which Supabase leaves and Drizzle ORM stays: he says he knows one and not the other, and Mudaraj's technologies line backs both, so his word decides.
- **Parser-safe, as before.** One column in reading order, real text, a standard heading, no table: the languages print as lines, not as a grid of levels, so extraction keeps each language with its level.
- **Length is paid out of headroom, never out of type size.** `scripts/render-pdf.mjs` fails with that sentence, and the floor exists because a document that clears the page count by a hair on one machine is two pages on another.
- **Everything the prior efforts constrain still binds.** Two languages with one set of facts, two themes, no contact detail in any published file, the form behind its marked address, the quality gates, and the resume's one page.

# Out of Scope

- **Speaking, reading, and writing rated apart.** Only SAP SuccessFactors models that (research F10), no Saudi resume does, and three words per language is a table on a page that has no room for one.
- **A CEFR band or the LinkedIn ladder.** Neither appears on a Saudi employer's or government form (F8, F13, F14). A reader who wants a band converts the word; a reader who wants a score gets one only under requirement 4.
- **A third language.** No source found lists one for this market (research, conclusion 3), and Saud named two.
- **Languages on the site's pages.** The home page and the skills section stay as they are; the section is for the documents, like the nationality.
- **Re-judging the keywords Saud kept.** Drizzle ORM, PostgreSQL, C#, Java, Docker, Tailwind CSS, the course-backed fundamentals, and the game development group were each put to him and stay. SolidJS is an open question below, not a cut.
- **Mudaraj's summary.** "developed with Scrum" stays; it describes the project.
- **The CV's length.** It has no page budget and gains one short section.

# Assumptions

- **The section fits in the headroom.** A heading and two lines cost on the order of 12mm at the resume's compact size, against 55mm free. If that is wrong the integration run fails on the page count and says which language, which paper, and which copy.
- **Jadarat's parser reads "Language: level" lines.** Its code shows that it extracts a languages section from an uploaded CV (F4) and nothing shows what shapes it accepts. The line form is the one the Saudi template uses (F7), which is the best available guess.

# Open Questions

- **The STEP score.** Saud remembers 80 and is not sure. Requirement 4 prints nothing until he reads the number off the ETEC certificate; the result also dates from university entry in 2023, and Saudi institutions accept a STEP result for two to three years (F16), so whether a reader still counts it is his call when the number is confirmed.
- **SolidJS.** Backed only by ETG, which is in progress and unshown. Saud did not answer on it and it stays until he does.

# Risks

- **The level is a self-assessment with no witness on the page.** Every other fact on the documents resolves to an entry a reader can check; a level does not, until the score sits beside it. The mitigation is a modest phrase chosen against the record and the score, and requirement 4 once the score is confirmed.
- **Jadarat's proficiency list is unknown.** Its values sit behind a Nafath login (F2). If its parser maps words to that list, "Native" and the word chosen for English may or may not land on a value; nothing in this effort can verify it, and the fallback is that the applicant corrects the field in the profile once.
- **The pruned skills lists are shorter on the site too.** That is intended, and it is worth saying: the home page's skills count and the skills section shrink by eleven keywords.
