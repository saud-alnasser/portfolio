---
use-when: "mapping the portfolio's content source onto JSON Resume, or validating the generated resume.json"
---

# Question

What exactly does the JSON Resume schema (current version, from github.com/jsonresume/resume-schema) define, does it permit additional or custom properties, and how would a project without a public link, a degree whose certificate is pending, a practical-training placement, and online course certificates each be represented within it?

This file goes deeper on the schema than `ats-parsing-and-resume-schemas.md` (section A of that file), which established only the section list, the npm version, the archive status, and the absence of hiring-side consumers. Nothing from that file is repeated except where a claim here depends on it.

All sources were read on 2026-09-08. "Observation" entries marked "run" come from a local run under Node v24.18.0 in a scratch directory with `@jsonresume/schema@1.3.1`, `jsonschema@1.5.0`, `ajv@8.20.0` and `ajv-formats@3` installed from npm on 2026-09-08.

# Sources

## The schema itself

- S1. `schema.json` at tag `v1.2.1` of the archived repository. https://raw.githubusercontent.com/jsonresume/resume-schema/v1.2.1/schema.json. Primary. Tag `v1.2.1` points at commit `50798e3592`, committed 2024-08-06T09:37:59Z, message "Merge pull request #484 from jrschumacher/patch-1 fix: schema spacing" (GitHub API, https://api.github.com/repos/jsonresume/resume-schema/tags and .../commits/50798e359292ad4448d95b3bb0de5f694d6bcc4b).
- S2. `schema.json` on `master` of the archived repository. https://raw.githubusercontent.com/jsonresume/resume-schema/master/schema.json. Primary. Byte-identical to S1 (local `diff`).
- S3. `schema.json` on `master` of the monorepo, `packages/schema/schema.json`. https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/schema.json. Primary. This is what npm `@jsonresume/schema@1.3.1` ships (S8, S9).
- S4. `schema.json` at tag `v1.0.0` of the archived repository. https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json. Primary. Tag points at commit `7095651fbb`, committed 2020-11-25T12:45:07Z. Read because every bundled sample's `$schema` cites this URL (S10, S11).
- S5. Tag list of the archived repository. https://api.github.com/repos/jsonresume/resume-schema/tags. Primary. Tags in descending order: v1.2.1, v1.2.0 (2024-07-10), v1.1.1 (2024-07-10), v1.1.0 (2024-07-10), v1.0.0 (2020-11-25), then v0.2.1 down to 0.0.0.
- S6. Repository metadata. https://api.github.com/repos/jsonresume/resume-schema. Primary. `archived: true`, `pushed_at` 2026-06-12T11:52:05Z, description "MOVED to jsonresume/jsonresume.org (packages/schema) - npm @jsonresume/schema unchanged", licence MIT, default branch `master`.
- S7. Monorepo tags. https://api.github.com/repos/jsonresume/jsonresume.org/tags (pages 1 to 5). Primary. Tags `@jsonresume/schema@1.3.1` and `@jsonresume/schema@1.3.0` exist; `resume-cli@3.7.2` release published 2026-07-22T01:22:19Z.

## Documentation and package metadata

- S8. Monorepo `packages/schema/README.md`. https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/README.md. Primary.
- S9. Monorepo `packages/schema/package.json` and `CHANGELOG.md`. https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/package.json and .../CHANGELOG.md. Primary.
- S10. Monorepo `packages/schema/sample.resume.json`. https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/sample.resume.json. Primary.
- S11. Monorepo `packages/schema/examples/{new-grad,career-changer,senior-engineer}.resume.json`. https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema/examples. Primary.
- S12. Monorepo `packages/schema/validator.js`. https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/validator.js. Primary. Identical text to the archived repository's `validator.js`.
- S13. Monorepo `packages/schema/test/*.spec.js` and `test/__test__/*.json`. https://github.com/jsonresume/jsonresume.org/tree/master/packages/schema/test. Primary.
- S14. Archived repository README. https://raw.githubusercontent.com/jsonresume/resume-schema/master/README.md. Primary. Says only that the repository moved and where.
- S15. https://jsonresume.org/schema. Primary. Shows "version 1.0.0" and an annotated example `resume.json`; no field-by-field reference beyond the example.
- S16. https://jsonresume.org/getting-started. Primary.
- S17. https://jsonresume.org/themes and https://jsonresume.org/theme-development. Primary.
- S18. npm registry metadata: https://registry.npmjs.org/@jsonresume%2Fschema, https://registry.npmjs.org/resume-schema, https://registry.npmjs.org/resumed, https://registry.npmjs.org/resume-cli. Primary.

## Tools

- S19. `resumed` README and source (`src/validate.ts`, `src/cli.ts`, `package.json`) on `main`. https://github.com/rbardini/resumed. Primary.
- S20. `resume-cli` README in the monorepo, `packages/cli/README.md`, plus `packages/cli/lib/validate.js`, `lib/get-schema.js`, `lib/validate-errors.js`, `package.json`, `CHANGELOG.md`. https://github.com/jsonresume/jsonresume.org/tree/master/packages/cli. Primary.
- S21. Archived `jsonresume/resume-cli` README and `lib/validate.js` on `master`. https://github.com/jsonresume/resume-cli. Primary but stale (see finding H4).
- S22. Registry README, monorepo `apps/registry/README.md`. https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/apps/registry/README.md. Primary. `github.com/jsonresume/registry` README returned 404.
- S23. `jsonresume-theme-even@0.26.1` (published 2025-10-04) npm tarball, `dist/index.js` and README. https://registry.npmjs.org/jsonresume-theme-even. Primary. Read because `resume-cli` bundles it as its default theme and `resumed` documents it as the example theme (S19, S20).

# Findings

Labels: source = what the page or file says; observation = what I saw, including local runs; interpretation = what I take it to mean; conclusion = what follows.

## A. Which version is current, and what "current" means

A1. Source (S5, S6): the newest tag on `jsonresume/resume-schema` is `v1.2.1`, at commit `50798e3592` dated 2024-08-06. The repository is archived; its last push was 2026-06-12 (the archival commit, S14).

A2. Source (S9, S18): npm `@jsonresume/schema` latest is 1.3.1, published 2026-07-22, from the monorepo (`repository.directory: packages/schema`). The monorepo carries tags `@jsonresume/schema@1.3.0` and `@jsonresume/schema@1.3.1` (S7); the archived repository has no 1.3.x tag.

A3. Observation (local diff of S1, S2, S3): `v1.2.1` and `master` of the archived repository are byte-identical. The monorepo copy (1.3.1) differs from them only by the removal of twenty `"additionalItems": false` lines; no property, type, pattern or description changed. Source (S9 changelog, 1.3.1): "Validation behavior is unchanged - verified old vs new schemas produce identical results across all examples, samples, and test fixtures." Source (S9 changelog, 1.3.0): the only change was adding three example resumes.

A4. Conclusion: for every question in this file, "the current schema" can be read as `v1.2.1` (2024-08-06) and 1.3.1 (2026-07-22) interchangeably; the property set is the same. Where this file says "v1.2.1/1.3.1" it means that shared definition.

A5. Source (S15): jsonresume.org/schema shows "version 1.0.0". Observation: the v1.0.0 schema (S4) is not the same document as v1.2.1 (finding C4). Interpretation: the documentation page's version label is stale, and the example it renders happens to be valid under both.

## B. Top-level structure

B1. Source (S1): `$schema` is `http://json-schema.org/draft-07/schema#`; `$id` is `http://example.com/example.json` (a placeholder, not a resolvable URL); `title` is "Resume Schema"; root `type` is `object`; root `additionalProperties` is `true`. There is one definition, `iso8601`. The root `properties` are, in file order: `$schema`, `basics`, `work`, `volunteer`, `education`, `awards`, `certificates`, `publications`, `skills`, `languages`, `interests`, `references`, `projects`, `meta`.

B2. Source (S1): the root `$schema` property is `{ "type": "string", "description": "link to the version of the schema that can validate the resume", "format": "uri" }`.

B3. Observation (S1, S3): the string `"required"` does not occur anywhere in either file (grep count 0). Conclusion: no property at any level is required; `{}` is a valid resume (confirmed by run, finding E1).

B4. Source (S1): the `iso8601` definition is
`{ "type": "string", "description": "Similar to the standard date type, but each section after the year is optional. e.g. 2014-06-29 or 2023-04", "pattern": "^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$" }`.
Interpretation: accepted forms are `YYYY-MM-DD`, `YYYY-MM`, `YYYY`, with a leading digit of 1 or 2, month first digit 0 or 1, day first digit 0 to 3. The pattern does not check calendar validity (`2024-19-39` matches). Every date field in the schema is a `$ref` to this definition, except `meta.lastModified` (finding B6).

B5. Source (S1), every field per section, with type. All are optional (B3). Descriptions are quoted where they carry meaning.

- `basics` (object, `additionalProperties: true`): `name` string; `label` string ("e.g. Web Developer"); `image` string ("URL (as per RFC 3986) to a image in JPEG or PNG format", no `format` keyword); `email` string, `format: email`; `phone` string ("stored as strings so use any format you like"); `url` string, `format: uri`; `summary` string ("Write a short 2-3 sentence biography about yourself"); `location` object (`additionalProperties: true`) with `address` string ("To add multiple address lines, use \n"), `postalCode` string, `city` string, `countryCode` string ("code as per ISO-3166-1 ALPHA-2"), `region` string; `profiles` array of objects (`additionalProperties: true`) with `network` string, `username` string, `url` string `format: uri`.
- `work` (array of objects, `additionalProperties: true`): `name` string ("e.g. Facebook"); `location` string ("e.g. Menlo Park, CA"); `description` string ("e.g. Social Media Company"); `position` string ("e.g. Software Engineer"); `url` string `format: uri`; `startDate` iso8601; `endDate` iso8601; `summary` string ("Give an overview of your responsibilities at the company"); `highlights` array of string.
- `volunteer` (array of objects): `organization` string; `position` string; `url` string `format: uri`; `startDate` iso8601; `endDate` iso8601; `summary` string; `highlights` array of string.
- `education` (array of objects): `institution` string ("e.g. Massachusetts Institute of Technology"); `url` string `format: uri`; `area` string ("e.g. Arts"); `studyType` string ("e.g. Bachelor"); `startDate` iso8601; `endDate` iso8601; `score` string ("grade point average, e.g. 3.67/4.0"); `courses` array of string ("List notable courses/subjects", item "e.g. H1302 - Introduction to American history").
- `awards` (array of objects): `title` string; `date` iso8601; `awarder` string; `summary` string.
- `certificates` (array of objects, description "Specify any certificates you have received throughout your professional career"): `name` string ("e.g. Certified Kubernetes Administrator"); `date` iso8601; `url` string `format: uri` ("e.g. http://example.com"); `issuer` string ("e.g. CNCF").
- `publications` (array of objects): `name` string; `publisher` string; `releaseDate` iso8601; `url` string `format: uri`; `summary` string.
- `skills` (array of objects): `name` string ("e.g. Web Development"); `level` string ("e.g. Master"); `keywords` array of string.
- `languages` (array of objects): `language` string; `fluency` string ("e.g. Fluent, Beginner").
- `interests` (array of objects): `name` string; `keywords` array of string.
- `references` (array of objects): `name` string; `reference` string.
- `projects` (array of objects, description "Specify career projects"): `name` string; `description` string ("Short summary of project"); `highlights` array of string ("Specify multiple features"); `keywords` array of string ("Specify special elements involved", item "e.g. AngularJS"); `startDate` iso8601; `endDate` iso8601; `url` string `format: uri`; `roles` array of string ("Specify your role on this project or in company", item "e.g. Team Lead, Speaker, Writer"); `entity` string ("Specify the relevant company/entity affiliations e.g. 'greenpeace', 'corporationXYZ'"); `type` string (" e.g. 'volunteering', 'presentation', 'talk', 'application', 'conference'").
- `meta` (object, `additionalProperties: true`, description "The schema version and any other tooling configuration lives here"): `canonical` string `format: uri` ("URL (as per RFC 3986) to latest version of this document"); `version` string ("A version field which follows semver - e.g. v1.0.0"); `lastModified` string ("Using ISO 8601 with YYYY-MM-DDThh:mm:ss").

B6. Observation (S1): `meta.lastModified` is a plain string with no `pattern` and no `format`; its description names a date-time form but the validator does not enforce it (run: any string passes). `meta.version` is likewise unenforced.

B7. Observation (S1): `projects` is the only section with `type`, `roles`, `entity`, `keywords`. `work` has no `type`, no `keywords`, no `roles`. `education` has no `status`, `expected`, `graduationDate`, `completed`, `honors` or `thesis` field. `certificates` has no `expires`, `credentialId` or `score` field. I searched the schema text for `status`, `expected`, `pending`, `intern`, `employmentType`, `type` (as a property name): the only `type` property is `projects[].type`.

## C. Additional properties

C1. Source (S1): `additionalProperties: true` is set explicitly at the root, on `basics`, on `basics.location`, on `basics.profiles` items, on `meta`, and on the item schema of every array section (`work`, `volunteer`, `education`, `awards`, `certificates`, `publications`, `skills`, `languages`, `interests`, `references`, `projects`). Nowhere in v1.2.1/1.3.1 is `additionalProperties: false`.

C2. Observation (run, `@jsonresume/schema@1.3.1` via `jsonschema@1.5.0`; and `ajv@8.20.0` with `strict:false` and with `strict:true`): a resume `{ "x-status": "draft", "education": [{ "institution": "U", "studyType": "Bachelor", "status": "pending", "startDate": "2022-09" }] }` is reported VALID by all three validators. `meta: { version, theme, custom: { a: 1 } }` is VALID. Unknown keys are neither rejected nor reported as warnings; the validators return no error object for them.

C3. Source (S16): the getting-started page instructs `{ "meta": { "theme": "elegant" } }` to select a registry theme; `theme` is not a schema-defined property of `meta`. Source (S19): `resumed` reads `resume.meta.theme`. Source (S23): `jsonresume-theme-even` reads `meta.themeOptions.colors`. Interpretation: the project's own tooling depends on `meta` accepting undeclared keys; `meta` is the sanctioned place for tooling configuration ("any other tooling configuration lives here", S1).

C4. Source (S4): the v1.0.0 schema (2020-11-25) declares `$schema: http://json-schema.org/draft-04/schema#` and root `additionalProperties: false`; its per-section item schemas already had `additionalProperties: true`; awards `date` was `format: date`; the `iso8601` description was "e.g. 2014-06-29" (the pattern was the same). Observation (run, `jsonschema@1.5.0` against S4): `{ "x-status": "draft" }` is INVALID ("instance is not allowed to have the additional property \"x-status\""), while `education[].status`, `work[].type` and `meta.theme` are VALID. Observation (run): `ajv@8` cannot compile S4 at all ("no schema with key or ref http://json-schema.org/draft-04/schema#"). Interpretation: unknown top-level keys became legal between v1.0.0 and v1.2.1; unknown keys inside sections and inside `meta` have been legal since v1.0.0.

C5. Source (S10, S11): `sample.resume.json` and all three bundled examples carry `"$schema": "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json"` and `"meta": { "version": "v1.0.0", ... }`, even though they ship inside package 1.3.1. Observation: that URL returns HTTP 200 and serves the v1.0.0 document (S4). Conclusion: the `$schema` value the project's own samples point at is a stricter, older document than the one the package validates with; a consumer that honours `$schema` literally would reject top-level custom keys that `@jsonresume/schema` accepts. No sample cites v1.2.1 or the monorepo path.

C6. Observation: the project's test suite (S13) has no test for unknown properties in either direction; each spec file tests each declared field with a valid value and with `null`. `compliance.spec.js` asserts the schema compiles under Ajv `strict: true` and validates the samples under the "resume-cli Ajv baseline" (`strict: false`, `allErrors: true`, `ajv-formats`).

## D. `meta`

D1. Source (S1): see B5 for the three declared fields. Source (S9 changelog): `meta` was added in the v0.0.17 line (PR 237), `canonical` replaced `url` (PR 257), `version` (PR 258) and `lastModified` (PR 259) were added then.

D2. Source (S10): the sample sets `canonical` to the raw GitHub URL of the sample itself, `version` to `v1.0.0`, `lastModified` to `2017-12-24T15:53:00` (no timezone). Source (S11): examples set `canonical` to a personal domain URL such as `https://danielreyes.example.com/resume.json`. Interpretation: `canonical` is meant to be the URL where the latest copy of this particular resume lives. The schema does not say whether `meta.version` is the schema version or the document version; the sample and examples use it for the schema version string.

## E. Dates and absent `endDate`

E1. Observation (run, all three validators): `startDate: "2024"` VALID; `"2024-07"` VALID; `"Sep 2024"` INVALID (pattern); `"2024/07/01"` INVALID (pattern); an `education` entry with `startDate` and no `endDate` VALID; `{}` VALID. The project's own fixtures (S13, `dates.json`) assert `2013-12-02`, `2013-12`, `2013` valid and `2013-12-021` invalid.

E2. Source (S1): nothing in the schema states what an absent `endDate` means; there is no `current`, `present` or `ongoing` boolean anywhere.

E3. Source (S11): `senior-engineer.resume.json` has a `work[0]` entry with `startDate` and no `endDate` (the current job) and a `projects[0]` entry with no `endDate`; every education entry in all three examples has an `endDate`; no example has an in-progress degree.

E4. Source (S23, `jsonresume-theme-even@0.26.1`, `dist/index.js`): the date-range helper renders `startDate` and then either `endDate` or the literal string "Present" when `endDate` is falsy, followed by a `<time-duration>` element whose duration uses `Date.now()` when `endDate` is missing. The same helper is used for `work`, `volunteer`, `education` and `projects`. Each date is rendered through `new Date(t).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" })`, so `2026-06` renders as "Jun 2026" and `2026` as "Jan 2026". Observation: `education` rendering destructures `area, courses, institution, startDate, endDate, studyType, url` only; `score` is not rendered by this theme. Interpretation: in the reference theme, a degree with no `endDate` displays as "<start> - Present" with a running duration, which reads as "still enrolled"; a degree with a future `endDate` displays as "<start> - <future month>" with the duration computed to that future date. The theme has no notion of "expected".

E5. Observation (S17): the theme development page says only "Remember JSON Resume is just a schema"; it gives no guidance on absent `endDate`. No page on jsonresume.org read for this file documents the meaning of a missing `endDate`.

## F. `projects[]`

F1. Source (S1): `url` is a plain optional property with `format: uri`; nothing requires it (B3). Observation (run): a project with `name`, `roles`, `keywords`, `entity`, `type` and no `url` is VALID. A project with `url: ""` is INVALID under both `jsonschema` and `ajv` (does not conform to format "uri"); `url: "not a url"` is INVALID. Conclusion: to omit the link, omit the key; do not set it to an empty string.

F2. Source (S1): `roles` is an array of free strings; `keywords` an array of free strings; `entity` a free string for "the relevant company/entity affiliations"; `type` a free string with suggested values 'volunteering', 'presentation', 'talk', 'application', 'conference' (not an enum; any string passes). `startDate` and `endDate` are `iso8601` and both optional.

F3. Source (S23): even renders the project name as a link only when `url` is present, else as plain text (`h(url, name)`), lists `roles` with `Intl.ListFormat`, "at <entity>" when `entity` is set, the date range when `startDate` is set, and `type` on its own line.

## G. `education[]`, a pending certificate, and `certificates[]`

G1. Source (S1): the fields are exactly `institution`, `url`, `area`, `studyType`, `startDate`, `endDate`, `score`, `courses` (B5). There is no field for status, expected completion, thesis, honours or credential. `studyType` and `area` are free strings ("e.g. Bachelor", "e.g. Arts").

G2. Observation (run): `education[].status: "pending"` is accepted silently by every validator tested (C2), and was accepted even by v1.0.0 (C4). Interpretation: a custom key inside an education entry is schema-legal in every 1.x version; nothing will render it in the reference theme (E4), and nothing forbids it.

G3. Source (S1): `certificates[]` has `name`, `date` (iso8601), `url` (uri), `issuer`, all optional. Source (S11): `career-changer.resume.json` records two Coursera courses as certificates with `issuer` "Google / Coursera" and "IBM / Coursera", `date` values, and Coursera URLs; `new-grad` and `senior-engineer` use `certificates` for vendor certifications. Interpretation: the project's own examples put online course certificates in `certificates[]` with the platform named in `issuer`; the schema itself does not distinguish an accredited certification from a course completion certificate.

G4. Source (S1): `education[].courses` is a list of course names attached to one institution entry ("List notable courses/subjects"), which is a different thing from a standalone course certificate; nothing in the schema links a `certificates[]` entry to an `education[]` entry.

## H. `work[]` and practical training

H1. Source (S1): `work[]` has `name`, `location`, `description`, `position`, `url`, `startDate`, `endDate`, `summary`, `highlights` (B5). There is no employment type, contract type, hours, or `type` field.

H2. Source (S11): `new-grad.resume.json` records two internships in `work[]` with `position` "Software Engineering Intern" and "Research Intern"; the internship nature is carried only in the `position` string. Observation: no example uses `volunteer[]` or `projects[]` for an internship, and no example contains the words "training", "trainee", "co-op" or "practical".

H3. Observation (run): `work[].type: "internship"` is accepted silently by the 1.3.1 validator and by v1.0.0 (C2, C4). Source (S23): even groups consecutive `work` entries that share `name`, `description`, `url` into one employer block and renders `position`, date range, `location`, `summary`, `highlights`; it does not read any other key.

H4. Observation: the archived `jsonresume/resume-cli` repository's `master` still holds `lib/validate.js` using `z-schema` and a dependency on the legacy `resume-schema` package (S21), but npm `resume-cli@3.7.2` (published 2026-07-22) depends on `ajv ^8.17.1`, `ajv-formats ^3.0.1`, `@jsonresume/schema 1.3.1` and `@jsonresume/ats-validator 0.3.0` (S18), matching the monorepo `packages/cli` (S20). Conclusion: the archived repository's source is not what the published CLI runs; findings I1 to I4 use the monorepo source.

## I. Validation tooling

I1. Source (S9, S12, S18): the package that validates a resume is `@jsonresume/schema` (latest 1.3.1, 2026-07-22, MIT, `engines.node >=20`, `main: validator.js`, single runtime dependency `jsonschema ^1.4.1`). `validator.js` exports `{ validate, schema, jobSchema }`. `validate(resumeJson, callback)` constructs a `new Validator()` from `jsonschema`, runs `v.validate(resumeJson, schema)`, and calls `callback(validation.errors, false)` on failure or `callback(null, true)` on success. It accepts no options and no schema version; it always validates against the bundled `schema.json`. The README's example passes a third argument; the source ignores anything after the second.

I2. Source (S18): the legacy npm package `resume-schema` (latest 1.0.1, 2024-07-10) is marked deprecated: "Schema moved to @jsonresume/schema (current spec). This legacy package stays published for compatibility." It depends on `z-schema`.

I3. Source (S19, S18): `resumed` (latest 7.0.0, published 2026-09-04, pure ESM, `bin: resumed`, depends on `@jsonresume/schema ^1.0.0`) exposes `validate(filename)` which reads the file and calls `promisify(schema.validate)` from `@jsonresume/schema`, so it inherits I1 exactly; CLI: `resumed validate [filename]` (default filename `resume.json`; comments are stripped with `strip-json-comments` on the render path). `resumed` installs no theme and requires `--theme` or `meta.theme`. No schema version option exists in the README or `cli.ts`.

I4. Source (S20, S18): `resume-cli` (latest 3.7.2, 2026-07-22, `bin: resume`, Node >=18) `resume validate` loads the schema with `require.resolve('@jsonresume/schema/schema.json')` unless `--schema <path>` is given, compiles it with `new Ajv({ allErrors: true, strict: false })` plus `addFormats(ajv)`, and prints one annotated block per error with path, rule, value and hint; exits non-zero on failure. The README documents the hint for dates: "must be an ISO-8601 date: YYYY, YYYY-MM, or YYYY-MM-DD". `--schema` is the only way to validate against a different schema document; there is no version selector. The CLI also offers `export` to html, pdf, md, txt, `audit` (an advisory ATS score using `@jsonresume/ats-validator`), `themes`, `serve`, and accepts JSON or YAML input.

I5. Observation (run): with the 1.3.1 schema, `jsonschema@1.5.0` and `ajv@8.20.0` (`strict` either way, with `ajv-formats`) agreed on every one of fifteen cases tried, including `format: email` and `format: uri` enforcement and the date pattern. Conclusion: the two validation paths in the ecosystem (`@jsonresume/schema` and `resumed` on `jsonschema`, `resume-cli` on Ajv) behave the same on the cases that matter here.

## J. The `$schema` URL

J1. Source (S1): the schema defines a `$schema` property described as "link to the version of the schema that can validate the resume" but names no URL. Source (S8, S14, S15, S16, S20): no README or documentation page read states which URL a `resume.json` should carry.

J2. Source (S10, S11): the only value the project uses is `https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json`, in the sample and all three examples. Observation: that URL resolves (HTTP 200) to the v1.0.0 document (C4, C5). `https://raw.githubusercontent.com/jsonresume/resume-schema/v1.2.1/schema.json` and `.../master/schema.json` also resolve (200) to the v1.2.1 document, and `https://raw.githubusercontent.com/jsonresume/jsonresume.org/master/packages/schema/schema.json` resolves (200) to the 1.3.1 document. `https://jsonresume.org/schema.json` and `https://jsonresume.org/schema/schema.json` return 404; `https://registry.jsonresume.org/schema.json` returns 400.

J3. Observation (S12, S20): neither `@jsonresume/schema` nor `resume-cli` reads the resume's `$schema` value; both validate against their bundled copy regardless. Conclusion: `$schema` in a `resume.json` is informational for editors and third parties; the official validators ignore it.

# Conclusion

1. The current schema is one definition published two ways: tag `v1.2.1` (commit `50798e3592`, 2024-08-06) of the archived `jsonresume/resume-schema`, and npm `@jsonresume/schema@1.3.1` (2026-07-22) from the monorepo; they differ only by removed no-op `additionalItems` keywords. It is a draft-07 document with fourteen top-level properties (`$schema` plus the thirteen sections), one `iso8601` definition accepting `YYYY`, `YYYY-MM`, `YYYY-MM-DD`, and no `required` keyword anywhere.

2. `additionalProperties: true` is set explicitly at the root, on `basics`, `location`, `profiles` items, `meta`, and every section's item schema. Unknown keys such as a root `x-status` or `education[].status` pass every official validator silently (observed under `jsonschema` 1.5.0 and Ajv 8 strict and non-strict). The one exception is the v1.0.0 document, which every bundled sample's `$schema` still points at: it rejects unknown root keys but accepts unknown keys inside sections and `meta`.

3. `meta` holds `canonical` (URL of the latest copy of this document), `version` (semver string, unenforced), `lastModified` (date-time string, unenforced), and by design any tooling configuration (`theme` and `themeOptions` are read by official tools).

4. A project without a public link: omit `url` entirely; an empty string fails `format: uri`. `roles`, `keywords`, `entity`, `type`, `startDate`, `endDate` are all optional free-form fields. A degree with a pending certificate: the schema has no status or expected-completion field; options that validate are omitting `endDate` (reference theme renders "Present" and a running duration), setting a future `YYYY-MM` `endDate` (renders as that month), or adding an undeclared key such as `status`, which validators accept and no reference theme renders. A practical-training placement: `work[]` has no employment-type field; the project's own new-grad example carries "Intern" in `position` only; an undeclared `type` key validates. Online course certificates: `certificates[]` with `name`, `issuer` (the examples write "Google / Coursera"), `date`, `url`.

5. Validation is `@jsonresume/schema` (callback API `validate(resume, cb)`, no options, no version selection), wrapped by `resumed validate` (7.0.0) and reimplemented by `resume-cli validate` (3.7.2, Ajv `strict:false` with formats, optional `--schema <path>`). No documentation states a `$schema` URL; the samples use the v1.0.0 raw GitHub URL, and the official validators ignore the field.

# Not checked

- Themes other than `jsonresume-theme-even@0.26.1`: how the registry's other official themes render a missing `endDate`, `education.score`, or `projects` without `url` was not examined; the monorepo `packages/themes` directory holds several dozen packages and no README.
- The registry's server-side rendering (`registry.jsonresume.org`): whether it validates a gist before rendering, and against which schema copy, was not read; only the app README was.
- The `resumed` compiled `dist/` output and its `Resume` TypeScript type (`json-schema-to-typescript` from `@jsonresume/schema`), and whether an undeclared key like `education[].status` type-checks there.
- The `@jsonresume/schema` `job-schema.json`, `@jsonresume/ats-validator`, `@jsonresume/converters` and `packages/types`: not read; they may define stricter or richer types than `schema.json`.
- Any GitHub issue or discussion on the monorepo about status, expected graduation, employment type, or `additionalProperties`; the issue tracker was not searched for this file.
- Calendar validity of dates: the pattern accepts impossible dates such as `2024-19-39`; whether any tool rejects them downstream was not tested.
- The historical draft-04 `format: date` on awards in v1.0.0 and whether `jsonschema` 1.5.0 enforced it; only the four cases in C4 were run against v1.0.0.
- Third-party validators (PHP, Python, Go) listed on jsonresume.org/projects: which schema version they bundle and whether they honour `$schema` was not examined.
