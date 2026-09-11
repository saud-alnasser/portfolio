---
use-when: "building a ticket in effort 21 and the approach is not obvious from the spec"
---

# Architecture

The languages are a content collection, one file per language, read by the one document component into a section shaped exactly like the resume's skills lines, mapped into JSON Resume beside the other collections, and guarded by the same three instruments that guard the nationality: the section-order test, the PDF reading-order check, and a where-it-belongs check over the pages, the README, and the JSON files. The content mechanism test gains a fixture language, which is what a collection buys. The skills half is content and documentation only.

Two decisions were put to Saud on 2026-09-11 and both are his.

## Where the languages live

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| A. A `languages` list on the profile entry | A fact about the person, stored where nationality and location are; two lines of YAML; no loader or sort | The profile schema grows its first nested object | A gap report names a list index | One file |
| **B. A `languages/` collection, one file per language** (chosen) | Stored the way every other entry is; `scripts/test-content-mechanism.mjs` can prove an added language reaches every output and nothing else, which no profile field gets; a test result is a per-entry fact with a natural home | A loader, a schema, a type, and a sort for a list the spec caps at two; two files and an `order` field | The directory reads as an invitation to add a third language, which the spec declines | Four readers hold a collection they sort |

The recommendation was A; Saud chose B, and the reason B is sound is the second column: a collection is what the mechanism test covers, and a mechanism test is the one guarantee the profile field could not have.

## The score

The score was an open question when the plan was drafted and is not any more: STEP 85, 2022-08-21, read off the result. So the test ships in this effort as an optional `test` object on a language, and there is no second edit to plan for.

## What is not a choice

- **Where the section prints.** The spec fixes it: directly after the key skills on both variants. In `CvDocument.astro` that is a section between the skills block and the `tail.map(...)`, outside `tail`, because `tail` is the part whose order differs by variant and this section's does not.
- **What the lines look like.** The resume's skills block already prints "group: keywords" as one `<li class="cv-entry">` per line with the name in `font-medium` and the rest in `text-muted-foreground`; the languages use that markup on both variants, so a language and its level extract as one line of the PDF, which is what criterion 2 asks the reading-order check to find. The score is the tail of the same line, after the level and a list separator: `Working proficiency, STEP 85 (2022)`.
- **The heading string.** `t.cv.languages`, beside `skills`, `certifications`, and `courses` in `src/lib/i18n.ts`, English "Languages" and Arabic "اللغات", because the two document headings that are the template's rather than the site's live there.
- **The year, not the date, on the page.** The entry holds `2022-08-21`; the line prints `(2022)`. The document's other dates print at the precision the reader needs and the month of a language test is not one of them; the JSON document carries the same string as the page, since `fluency` is one free string and the schema has no date beside it.

# Components

| Part | Becomes responsible for |
| --- | --- |
| `src/content.config.ts` | a `languages` collection on `glob({ pattern: '*.yaml', base: './src/content/languages' })`: `name: localized`, `level: localized`, `test: { name: z.string().min(1), score: z.string().min(1), date: iso8601 }.strict().optional()`, `order: z.number().int().optional()`, the object `.strict()`; exported in `collections` |
| `src/content/languages/arabic.yaml`, `english.yaml` | the two entries, `order: 1` and `2`; the English file's comment names the research, says the level phrase is Saud's and why, and that the score is read off the ETEC result dated 1444/01/23 AH |
| `src/content/skills/*.yaml` | the eleven keywords gone; nothing else |
| `src/content/README.md` | a `languages/` section with its field table, placed after `skills/`; the rule beside `keywords`; "Languages" added where the README lists what the documents carry, and the sentence that says a language does not reach the home page or the README |
| `src/lib/i18n.ts` | `cv.languages` in `en` and `ar` |
| `src/lib/order.ts` | nothing new: `byOrderThenName` already sorts by `order` then a localized `name`, which is the language shape too |
| `src/components/CvDocument.astro` | `getCollection('languages')` sorted by `byOrderThenName`; the section; a local that builds the line's tail from `level` and, where present, `test` as `${test.name} ${test.score} (${test.date.slice(0, 4)})`; the header comment's table gains `languages, one line each` on both sides |
| `src/lib/resume.ts` | `getCollection('languages')` in the same `Promise.all`, sorted the same way; `languages: languages.map((entry) => mapLanguage(entry, locale))` after `skills`, `mapLanguage` returning `{ language, fluency }` where `fluency` is the same tail string the page prints, built by one shared function so the two cannot drift |
| `src/lib/shown.ts` or a new `src/lib/languages.ts` | the one function that turns a language entry into its printed tail, `levelLine(entry, locale, separator)`, imported by the component and the mapper; it lives beside `shown.ts` because that file is where "the one predicate every output reads" already is, and this is the same idea for a string |
| `tests/resume.spec.ts` | `entries('languages')` sorted the way the site sorts; `sectionsExpected` inserts `'languages'` after `'skills'` when the collection holds something; a new test asserts each line's text against the authored strings with the `[locale] ?? .en` fallback `summaryText` uses, the score tail included |
| `scripts/check-dist.mjs` | the reading-order `expected` gains one group per language, `[name, tail]`, after the education groups; `json resume` gains `languages` in `sections`, so the count is checked with the others, and asserts each `fluency` against the tail; a `languagesWhereTheyBelong` check beside `nationalityWhereItBelongs` asserts each level string stands alone between tags on both documents and appears in neither home page nor `README.md` |
| `scripts/test-content-mechanism.mjs` | a third fixture, `fixture-language-probe-<suffix>`, expected in both documents' pages and both JSON files and nowhere else, added and removed with the other two |
| `scripts/render-pdf.mjs` | unchanged; it is the measuring instrument for criterion 12 |

# Interfaces

- **The collection**, seen by `getCollection('languages')`: `{ name: Localized; level: Localized; test?: { name: string; score: string; date: string }; order?: number }`.
- **`resume.json`**, seen by whoever imports it: gains the schema's own `languages` array, `[{ language, fluency }]`. No custom key, so nothing to add to the comment in `resume.ts` that lists the custom ones.
- **`data-cv-section="languages"`**, seen by the tests and the print stylesheet. The stylesheet keys nothing on section ids today, and the compact rules (`.cv-compact section > ol > .cv-entry`, `.cv-compact .cv-heading + *`) key on structure, so a `<ul>` of `.cv-entry` under a `.cv-heading` gets the resume's spacing with no new rule.
- **The printed tail**, seen by the page, the JSON mapper, the browser test, and the dist check: one function, so the four agree by construction rather than by four copies of a template string.

# Data Model

```yaml
# src/content/languages/english.yaml
name: { en: English, ar: الإنجليزية }
level: { en: Working proficiency, ar: إجادة مهنية }
test:
  name: STEP
  score: "85"
  date: "2022-08-21"
order: 2
```

`score` is text, not a number: IELTS bands carry a half, and a number that prints must print as written. `level` is free localized text on purpose: the vocabulary is the applicant's (research, conclusion 5), and a closed enum here would be a Saudi ladder nobody publishes. `test.name` is free text for the same reason; the three the market names are STEP, IELTS, and TOEFL.

# Technical Approach

1. **The content contract, the content, and the documentation.** The collection in the schema, the two files, the eleven cuts, both parts of `src/content/README.md`. Self-contained: `pnpm build` passes at the end of this step because nothing reads the collection yet, and the skills cuts already show everywhere. First because every later step reads the collection and the tests of step 3 read the content.
2. **The line, the section, and the mapping.** The shared tail function, `i18n.ts`, `CvDocument.astro`, `resume.ts`. After this step both pages and both JSON files carry the languages, and the existing section-order test fails, which is the signal step 3 answers.
3. **The instruments.** `tests/resume.spec.ts`, `scripts/check-dist.mjs`, and the fixture in `scripts/test-content-mechanism.mjs`. Each of criteria 1, 2, 4, 5, 6, and 7 is a named assertion here; the JSON count check also stops the mapper from being dropped later without a failure.
4. **The measurement.** `pnpm render:pdf` on the finished branch, the four numbers into the commit, criterion 12. Last because it measures the page the other steps produce.

Steps 2 and 3 could be one ticket; they are two so that the instruments are reviewed as instruments, against the criteria, rather than as the tail of a rendering diff.

# Integration

- `Skills.astro` and the home page's skills count read the skills collection and follow the cuts with no edit; the count is of groups, which do not change.
- `scripts/readme-profile.mjs` writes `summary` only; the README is unaffected by the languages and `pnpm check:dist`'s `readme profile` check keeps passing without a regeneration.
- `src/pages/[locale]/index.astro` does not read the new collection, which is how criterion 6 holds by construction; the where-it-belongs check is what notices if that changes.

# Testing Strategy

| Criterion | Checked by |
| --- | --- |
| 1 | `pnpm check` on the schema; a one-off build with `level` removed from one file, reported in the ticket, proves the refusal; `pnpm test:content` with the fixture language |
| 2 | `tests/resume.spec.ts`: `sectionsExpected` and the new lines test, both locales, both variants; `scripts/check-dist.mjs` reading-order groups over the four English PDFs |
| 3, 4 | the new lines test reads the authored strings and the tail function, so the exact wording, score, and year are the expectation; `json resume` asserts `fluency` the same way |
| 5 | `scripts/check-dist.mjs`, `json resume`: count and text per locale, plus the existing schema validation |
| 6 | `languagesWhereTheyBelong` in `scripts/check-dist.mjs` |
| 7 | `git diff --stat src/content/skills/` in the ticket, and `grep` across `dist/` for each of the eleven, with the one allowed hit in Mudaraj's summary |
| 8, 10 | reading `src/content/README.md`; there is no mechanical check of prose |
| 9 | `pnpm test:content`, and the existing browser tests over the skills section |
| 11 | `pnpm build`'s gap line and the four gates, as every effort runs them |
| 12 | `pnpm render:pdf`'s own page count and headroom lines |

# Technical Risks

- **The resume's headroom.** Two lines and a heading at the compact size are on the order of 12mm; 55mm is free. If the runner disagrees it says so by language, paper, and copy, and the answer is never the type size.
- **The reading-order check and Arabic.** It runs over the English PDFs only, as it does for every other fact, because `pdftotext` and shaped Arabic do not agree on line order. The Arabic lines are asserted in the browser test instead, which is the split the nationality already uses.
- **"STEP 85 (2022)" and the identifiers scan.** Read before planning: `scripts/identifiers.mjs` matches runs of nine or ten digits and Saudi mobile numbers, each bounded by non-digits, so a two-digit score beside a four-digit year matches nothing. Not a risk; recorded so nobody re-checks it.
- **A level string that occurs elsewhere.** "Native" and "Working proficiency" occur on no page today. The where-it-belongs check asserts the string alone between tags, as the nationality check does, so a future summary that uses the word does not trip it.
