---
status: implemented
---

# Problem

`src/content/profile.yaml` carries one `summary`. `CvDocument.astro` prints it on both documents, `src/pages/[locale]/index.astro` prints it as the home page's hero paragraph, `src/lib/resume.ts` maps it into `basics.summary` of both JSON Resume documents, and `scripts/readme-profile.mjs` writes its English into the profile block of `README.md`. One authored text, five outputs.

[[efforts/15-a-summary-that-names-the-work/spec]] filled that one text with what the resume was missing. The resume's projects section carries two entries, `rentable` and Mudaraj, and the summary was the only line on the page with room for anything else, so it took `cachescribe`, the PL/0 compiler, the Monkey interpreter, and the language in draft. That solved the resume's problem by spending the field every other output reads, and it left three things wrong.

- **The resume's summary and the section under it are about different work.** A reader opens the resume, reads a paragraph about an npm package and three language projects, and reaches a projects section holding a rent tracker and a ticketing platform. Nothing on the page connects the two, because nothing on the page can: neither project in the paragraph has an entry there.
- **One clause points at nothing at all, on both documents.** "A statically typed language on a bytecode virtual machine, in draft" is Nova. `src/content/projects/nova-lang.yaml` is `status: in-progress`, and `isShown()` in `src/lib/shown.ts` shows a project only where its status is `completed`, so Nova renders on no page, no document, and no JSON file. That clause is the only mention of it anywhere in the published site. Effort 15 constrained itself to name nothing the content source did not carry as an entry, so that the summary could be checked against the record; Nova has a file, and no output renders it.
- **Mudaraj is the resume's second project and the summary is silent about it.** Effort 15 required that, and its reason was sound: the entry's own role line says prototype and senior project, and a summary leading with it claims more than the entry does. But the remedy it chose was silence, when the qualifier was available and is what Saud asked for on 2026-09-11.

# Goal

Each document opens with a paragraph it can back up. The resume's names the two projects printed below it: `rentable`, by what it tracks and what it runs on, and Mudaraj, named as a prototype built for a bachelor's senior project. The CV keeps the longer paragraph it has, minus the one clause naming work no output shows. Every claim on either document resolves to an entry a reader can reach. The resume is still one page in both languages, on A4 and on Letter, published and generated, with headroom at or above the floor `scripts/render-pdf.mjs` enforces.

# Scope

- `src/content.config.ts`, the profile schema, which gains a second localized summary for the resume.
- `src/content/profile.yaml`: the new resume text authored in English and Arabic, the existing `summary` edited in both languages to drop the clause naming Nova, and the comment above them saying what each is for and why they sit apart.
- `README.md`, whose profile block is generated from `summary` and so follows it.
- `src/content/README.md`, the profile field table, which is where the content format is documented.
- `src/components/CvDocument.astro`, which decides which summary each variant prints.
- The checks and tests that assert what a document's summary is.

# Requirements

1. **The profile carries two summaries, and which document prints which is decided once.** The `cv` variant prints the existing `summary` and the `resume` variant prints the new one, both resolved in `CvDocument.astro` rather than by either page. The new field is required by the schema, so the resume cannot ship with a hole where its opening paragraph goes.
2. **The resume summary names only what the resume prints.** Every project named in it has an entry in that document's own projects section. In practice that is `rentable` and Mudaraj, and nothing else: no `cachescribe`, no compiler, no interpreter, no language in draft.
3. **Mudaraj is named with what it is.** The summary says it is a prototype built for a bachelor's senior project. It claims no more than `src/content/projects/mudaraj.yaml` already states in its role line, and that file is untouched by this effort.
4. **The CV summary names only work the CV shows.** The clause describing the statically typed language in draft comes out, because `nova-lang` is `in-progress` and `isShown()` keeps it off every output. The clauses naming `cachescribe`, the PL/0 compiler, and the Monkey interpreter stay: all three are `public` and `completed`, so all three print as entries on the CV, on the work page, and in both JSON documents.
5. **Everything generated from the CV summary follows it.** The home page hero, `basics.summary` in both `resume.json` documents, and the profile block of `README.md` all carry the edited text, and the README is regenerated rather than corrected by hand.
6. **Both languages say the same thing.** Each summary's Arabic is the same sentences making the same claims as its English, and the build reports no localisation gap for either field.
7. **The format is documented where the format is documented.** `src/content/README.md` describes the new field the way it describes `summary`, including which document each one reaches, so the next person to edit either knows which one they are editing.
8. **The resume is still one page, with headroom the runner will not eat.** Both languages, both papers, published and filled, at or above the 10mm floor at Letter. Measured rather than assumed, and the number recorded.

# Acceptance Criteria

1. The profile schema requires a second localized summary; a `profile.yaml` without it fails the build, and `CvDocument.astro` selects between the two on `variant` in one place.
2. The English resume summary names `rentable` and Mudaraj and no other project. `cachescribe`, PL/0, Monkey, and the language in draft appear nowhere in it, in either language.
3. The resume summary calls Mudaraj a prototype built for a bachelor's senior project, and `git diff` shows `src/content/projects/mudaraj.yaml` unchanged.
4. Neither language's `summary` mentions a statically typed language, a bytecode virtual machine, or a language in draft, and both still name the npm package, the PL/0 compiler, and the Monkey interpreter.
5. The home page hero and `basics.summary` in both `resume.json` documents carry the edited `summary`, and `pnpm check:dist` reports `readme profile: README.md carries the profile as src/content/ states it`.
6. `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass.
7. `src/content/README.md` documents both summary fields and which output each reaches.
8. `pnpm render:pdf` writes `resume.en.pdf` and `resume.ar.pdf`, and the filled copy of each, at one page on A4 and one page at Letter, each reporting at least 10mm free at Letter. The number goes in the commit.

# Constraints

- **One content source, and this stays one.** A second field is not a second source: both texts are authored in `profile.yaml`, and every output still reads from `src/content/`. The moment either is written anywhere else the invariant the first effort set is gone.
- **No fact in a document's summary that the document itself does not print.** This is the rule effort 15 wrote and could not keep, because the field it was writing into served both documents at once. With one summary per document the rule is enforceable, and requirements 2 and 4 are it applied to each.
- **Length is paid out of headroom, never out of type size.** `scripts/render-pdf.mjs` fails with that sentence, and the floor exists because a document clearing the page count by a hair on one machine is two pages on another.
- **Two or three sentences each.** `src/content/README.md` sets that for `summary` and the new field is the same kind of text.
- **Everything the prior efforts constrain still binds.** Two languages with one set of facts, two themes, parser-safe documents, no contact detail in any published file, the form behind its marked address, the quality gates, and the resume's one page.

# Out of Scope

- **Nova's status.** The clause comes out of the summary; `src/content/projects/nova-lang.yaml` keeps `status: in-progress` and stays off every output. Marking an entry `completed` is a claim about whether the work is finished and it is Saud's to make, not a side effect of editing a paragraph. When he makes it, the entry appears on the work page and the CV on its own, which is the route every other project takes.
- **Mudaraj's entry and `rentable`'s entry.** Both untouched. Only the summary above them changes.
- **`cachescribe` returning to the resume as an entry.** Effort 13 dropped its marker to reach one page and effort 15 kept it off. With the resume summary no longer carrying it, `cachescribe` now appears on the resume nowhere at all. That is the cost of requirement 2 and it is accepted here: the CV, the work page, and both JSON documents still carry the entry whole.
- **The CV's length, and its summary as a separate text from the site's.** The CV has no page budget, and the home page, the README, and the JSON documents go on sharing `summary` with it. Only the resume gets a field of its own.
- **Every other section of either document.** Experience, education, skills, certifications, courses, and projects print what they print.

# Assumptions

- **The headroom this reports is the headroom the runner reports.** Effort 13 bundled Source Sans 3 and subset the Arabic faces so the page count stopped being a property of the rendering machine. If that is wrong the integration run fails on the page count and names the language, the paper, and the copy.
- **The new resume paragraph is shorter than the one it replaces**, since it drops four projects and adds one, so the fit gets easier rather than harder. Measured anyway, because effort 15 assumed a fit once and `scripts/render-pdf.mjs` caught it at 9.8mm.

# Risks

- **Two summaries about one person can drift.** This is the cost accepted when the resume-only field was chosen over narrowing the shared one. What holds it down is that both are authored a few lines apart in one file under one comment, and that they are allowed to differ: they are two documents with two jobs, not two copies of one text.
- **Nova disappears from the published site entirely.** It renders nowhere today, so nothing visible changes, but the clause was the last trace of it and after this there is none. The entry stays in the content source, and the moment its status changes it appears on its own.
- **A reader who sees both documents sees two different opening paragraphs.** That is intended. The CV carries the record and the resume carries the application, which is what effort 1 specified them as.
