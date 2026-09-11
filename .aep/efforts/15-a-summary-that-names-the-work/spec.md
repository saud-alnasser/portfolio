---
status: implemented
---

# Problem

[[efforts/13-one-page-resume-and-clean-generation/spec]] cut the profile summary to one sentence, because the resume had to reach one page and the summary was restating three project entries in their own words. What survived names the work only as categories: "offline-first desktop software, a published npm package, and a bilingual web platform built with a team of six". Saud read it on the generated document on 2026-09-11 and it told him nothing, which is the only test that sentence had to pass.

- **Not one noun in it is a thing.** A reader learns that there was desktop software without learning what it did, that a package was published without learning what it does, and that a platform exists without learning what it is. This is the first paragraph an employer reads on the document an application takes, and it spends itself on three category names.
- **The clause carrying the most weight describes a prototype.** "a bilingual web platform built with a team of six" is Mudaraj: a Saudi Electronic University senior project, built as a prototype, which is exactly what its own entry says in its role line two sections further down the same page. The summary leads with it and states none of that, so the document's opening claims more for it than the document's own entry does.
- **The resume shows no language work at all.** It carries two project entries, `rentable` and Mudaraj, and neither is a compiler. The PL/0 compiler, the Monkey interpreter, and the language in draft are on the CV, on the work page, and in both JSON documents, and nowhere on the resume. The summary is the only line on that page with room to carry them, and the cut spent it.

# Goal

The resume opens with a paragraph that names the work: what the desktop software tracks and what it runs on, what the npm package caches, and the language work in Rust that nothing else on the resume shows, as this effort left it and until 2026-09-11. It names Mudaraj nowhere, true of that paragraph until the same day, when the resume took a summary of its own ([[efforts/17-a-resume-summary-of-its-own/spec]]) that names Mudaraj as the prototype its entry already calls it and carries no language work at all. The resume is still one page in both languages, on A4 and on Letter, published and generated, and the added length comes out of the headroom effort 13 bought rather than out of the type size.

# Scope

- The `summary` field of `src/content/profile.yaml`, in English and in Arabic.
- The profile block of `README.md`, which `pnpm readme` generates from that field.
- The comment above the field, which records why it reads as it does and is now the record of two rewrites rather than one.

# Requirements

1. **The summary names things, not categories.** Every clause in it resolves to something a reader could go and look at: a named stack, a stated behaviour, a named language or tool. A clause that would read the same on another developer's resume is not doing the work.
2. **Mudaraj is named nowhere in it, and alluded to nowhere in it.** Not by name, not as a team of six, not as a senior project, not as a bilingual platform. The reason is that the entry itself states it is a prototype and a senior project, and a summary that leads with it claims more than the entry does. **The entry stays**, unchanged, on both documents.

    **Reversed on 2026-09-11 by [[efforts/17-a-resume-summary-of-its-own/spec]], for the resume.** `summary`, the field this names, still contains no Mudaraj, but the resume no longer reads it. The resume's own paragraph names Mudaraj and says it is a prototype built for a bachelor's senior project, which is the qualifier that was available here and not taken: the objection was that the summary claimed more than the entry, and stating what the entry states answers it without the silence. The entry is still unchanged on both documents.
3. **The language work appears on the resume.** The summary names at least one of the compiler, the interpreter, and the language in draft, because the resume's project entries carry none of them and the CV is not the document an application takes.

    **Reversed on 2026-09-11 by [[efforts/17-a-resume-summary-of-its-own/spec]].** The resume reads a field of its own now and names only what its own projects section prints, so no language work appears on it. The remedy this requirement chose was the only one available while one field served both documents, and it is what made that paragraph the CV's opening as well. The language in draft also left `summary` entirely: it is Nova, its entry is `status: in-progress`, and `isShown()` keeps it out of every output, so the clause pointed at nothing a reader could reach.
4. **The npm package keeps its clause.** Effort 13 removed `resume: true` from `cachescribe`, so this clause is the only appearance that work makes on the resume at all. Requirement 1 applies to it: what it caches and when, not that it exists.
5. **Both languages say the same thing.** The Arabic is the same three sentences making the same claims, not a shorter or longer document, and the build reports no localisation gap.
6. **The resume is still one page, with headroom the runner will not eat.** Both languages, both papers, published and filled, at or above the 10mm floor `scripts/render-pdf.mjs` enforces at Letter. The length is measured rather than assumed, and paid out of headroom rather than out of type size, which that script's own error message already refuses.
7. **The README profile block follows the content source.** It is generated, so it is regenerated, and the dist check that compares them passes rather than being satisfied by hand.

# Acceptance Criteria

- [x] The English summary names `rentable`'s stack, states what the npm package caches and when, and names the PL/0 compiler, the Monkey interpreter, and the language in draft. The Arabic makes the same claims in the same three sentences.

  **The language-in-draft clause was removed on 2026-09-11 by [[efforts/17-a-resume-summary-of-its-own/spec]], requirement 4**, in both languages. The stack, the npm package, the compiler, and the interpreter are all still named. What this criterion recorded was true when it was ticked.
- [x] Neither language's summary contains Mudaraj's name, a team of six, a senior project, or a bilingual platform. `src/content/projects/mudaraj.yaml` is untouched by this effort and the entry still prints on the resume and on the CV.
- [x] `pnpm render:pdf` writes `resume.en.pdf` and `resume.ar.pdf`, and the filled copy of each, at one page on A4 and one page at Letter, each reporting at least 10mm of the last page free at Letter. The number is recorded in the commit so a later reader can see what the length cost.
- [x] `pnpm build` prints `[localized] 0 gaps`, and `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` all pass.
- [x] `pnpm check:dist` reports `readme profile: README.md carries the profile as src/content/ states it`, and the no-contact-details and identifiers checks still pass over `README.md` and every published file.
- [x] The comment above the field says what the summary is for, that it was cut and refilled on 2026-09-11, why Mudaraj is absent, and that lengthening it again means measuring again.

  **Replaced on 2026-09-11 by [[efforts/17-a-resume-summary-of-its-own/spec]].** That comment now covers two fields rather than one: what each is for, which outputs read it, and that the measuring instruction belongs to the resume's field, since the CV has no page count to hold. Mudaraj's absence is no longer among the things it explains, because the resume's paragraph names it.

# Constraints

- **Everything the prior efforts constrain still binds.** One content source, two languages with one set of facts, two themes, parser-safe documents, no contact detail in any published file, the form behind its marked address, the quality gates, and the resume's one page.
- **Length is paid out of headroom, never out of type size.** `scripts/render-pdf.mjs` says so in the message it fails with, and the floor exists because a document that clears the page count by a hair on one machine is two pages on another. That is what widened the budget on 2026-09-10 and what effort 13 spent a bundled typeface to close.
- **No fact enters the summary that the content source does not already carry as an entry.** Every project the summary names has its own file under `src/content/projects/`, so the summary can be checked against the record rather than believed.
- **Three sentences at most.** `src/content/README.md` states the field is two or three sentences for the top of the site and the CV, and the site's home page and the CV render the same text.

# Out of Scope

- **Mudaraj's entry, on either document.** Only the summary stops pointing at it. Removing the entry would take a finished piece of work off the resume, which is a different decision and not this one.
- **The degree and the training placement.** Both were candidates for the space the third sentence takes. Neither is in it, because the education and experience sections carry them whole a few centimetres further down the same page, and a summary that restates the section under it is what effort 13 was right to cut.
- **`cachescribe` returning to the resume as an entry.** Effort 13 dropped its marker to reach one page. The clause in the summary is deliberately that work's only appearance, and this effort keeps it that way rather than spending an entry's worth of height to say it twice.
- **The CV's length, and the CV's summary as a separate text.** The CV has no budget and shares this field. It gets the longer summary too, which is what one content source means.

# Assumptions

- **The headroom this reports is the headroom the runner reports.** Effort 13 bundled Source Sans 3 and subset the Arabic faces precisely so the page count stopped being a property of the rendering machine. If that assumption is wrong, the integration run fails on the page count and says which language, which paper, and which copy, which is the failure mode the floor was added to produce.

# Risks

- **The third sentence names work that is unfinished.** The language in draft is in draft, and the summary says so in those words. A reader who follows it to the work page finds the same status on the entry. The risk is a reader who does not follow it and reads a finished language into the line; the wording is what holds that down, and it is the same wording the entry uses.
- **The summary is now long enough to be the thing that breaks the fit next.** It sits at roughly five printed lines on a page with 15.4mm to spare. Any future entry added to the resume meets a summary that is no longer nearly free, and the failure will surface as a page count rather than as a sentence, which is why the comment above the field says to measure.
