---
status: resolved
blocked-by: [05]
---

# docs(cv): nothing still says the resume may run to two pages

## Outcome

Every sentence in the repository that describes the resume's budget describes the one it now has. The places that record the two-page budget as history keep it and say it was history; everything else says one page. Effort 5's spec, which is where the budget was widened, says so where a later reader will hit it rather than being left to contradict this effort in silence.

## Acceptance Criteria

- [x] A search across `scripts/`, `src/`, `docs/`, and `.aep/` for the two-page budget returns only sentences that record it as history. The search and its output are quoted in this ticket's outcome (criterion 8).
- [x] `.aep/efforts/5-sections-and-resume/spec.md` requirement 10, its constraint on the resume's size, its assumption about headroom, and its risk about the page budget say one page and point here for why it changed back. That spec keeps its own record of what it built, and gains the line rather than being rewritten (criterion 8).
- [x] `docs/development.md` says the resume is refused past one page, says the generated resume carries no header or footer, says the generated CV still does and why, and names the QR code as the route to the GitHub address (criterion 8).
- [x] The comments in `src/styles/global.css`, `src/components/CvDocument.astro`, `scripts/render-pdf.mjs`, and `scripts/check-dist.mjs` describe the behaviour those files now have. A comment describing behaviour the code no longer has is the defect two review rounds of effort 5 named twice (criterion 8).
- [x] `.aep/contexts/repository.md` and `AGENTS.md` describe the pair as it now is, or are confirmed to need no change and that is said (criterion 8).
- [x] `pnpm check`, `pnpm build`, and `node .aep/scripts/validate.mjs` pass, and the AEP index is regenerated rather than edited.

## Relevant areas

`docs/development.md`, the addresses table and the contact-details section; `src/styles/global.css`; `src/components/CvDocument.astro`; `scripts/render-pdf.mjs`; `scripts/check-dist.mjs`; `.aep/efforts/5-sections-and-resume/spec.md`; `.aep/contexts/repository.md`; `AGENTS.md`.

## Notes

This ticket is last because until the budget is one page the prose saying two is still true. It is also where the reversal is recorded properly: effort 5 widened the budget on 2026-09-10 after the runner refused the branch, and a boundary left standing beside an effort that contradicts it is worse than no boundary.

## The search, and its output

```
grep -rn -i "two page|two-page|at most 2|pages: 2|past two pages|no more than two pages" scripts/ src/ docs/ .aep/ AGENTS.md
```

What it returns now falls into four groups, and every one of them records the budget as history.

**The current code, describing what it used to be.** `scripts/check-dist.mjs:511` and `scripts/render-pdf.mjs:75` say the budget read two for a day and why it changed back; `scripts/render-pdf.mjs:115` says the two-page widening is the failure the free-height floor exists for. All three are the reason beside a constant, which is what this repository writes instead of a number nobody can check.

**Two that are not about the budget at all.** `scripts/check-dist.mjs:702` is about two addresses sharing one canonical page in a search result. `src/components/CvDocument.astro:18` is about one component rather than two pages of markup. Both were read and left.

**The earlier efforts' own records.** `.aep/efforts/5-sections-and-resume/` and `.aep/efforts/7-document-downloads-and-contact-details/` are finished efforts whose specs, plans, and tickets say what was true when they ran. They are history by construction, and rewriting them would destroy the record of a decision rather than update it. What they gained instead is below.

**This effort's own files**, which describe the reversal and quote what was reversed.

Nothing left says the resume may run to two pages.

## What changed, and what was left alone

| | |
| --- | --- |
| `src/pages/[locale]/resume.astro` | said the resume "runs to at most two pages" and explained the budget as a property of the renderer. Now says one page, records the two-page day, and names the 10mm floor beside the count |
| `src/styles/global.css` | said "a resume that still runs to two pages is fixed in the content". Now "a resume that runs past its one page, or fits it by less than 10mm" |
| `scripts/render-pdf.mjs` | the file's own header comment now says the step refuses a near miss as well as an overrun, and reports the free height on every render |
| `scripts/check-dist.mjs` | `resumePages` refuses a second page rather than a third; its comment and its success line say so |
| `docs/development.md` | the addresses table, the `pnpm render:pdf` line, and two new paragraphs, below |
| `.aep/efforts/5-sections-and-resume/spec.md` | five notes added, nothing rewritten |
| `.aep/contexts/repository.md` | corrected in three places: `src/lib/` gained `icons.ts`, the components gained the QR code, and the stylesheet row still listed the CV band among the palette tokens, which this effort retired |
| `AGENTS.md` | **confirmed to need no change**, and that is said here. It describes the pair as "a CV that carries the whole record and a short resume for an application", which is what they are, and it states no page count |

## `docs/development.md`

Three things the ticket asks it to say, which it did not:

- **The resume is refused past one page**, and refused again if it fits by less than 10mm. Both the addresses table and the `pnpm render:pdf` line now say it.
- **The generated resume carries no header or footer, and the generated CV still does.** A new paragraph in "Contact details, and the documents that carry them" says why that is the mechanism rather than an oversight: the furniture is drawn in the paper margin, the resume's box has none and carries its 10mm as padding instead, and the CV cannot do the same because padding applies at the ends of a box and not at every fragment, and the CV runs to five pages. It names the control the check is read against. The same paragraph records that a generated document lands under the published document's name, and where that name is read from.
- **The QR code is the route to the GitHub address on paper.** A second paragraph says the address left the contact line, that this is the one place a document trades a fact a parser can read for one a phone can, that the cost is an ATS finding no GitHub address, that `basics.profiles[].url` in either `resume.json` still carries it, and that `qr code` decodes it back out of the rendered pixels because the code is now the only route.

## `.aep/efforts/5-sections-and-resume/spec.md`

It keeps every word it had. Five places gained a line, each beginning **"Reversed on 2026-09-11 by [[efforts/13-one-page-resume-and-clean-generation/spec]], back to one page"**: requirement 10, acceptance criterion 10, the constraint on the resume's size, the assumption about headroom, and the risk about the page budget. Four of those are the ones this ticket names; criterion 10 was added because it states the budget as plainly as requirement 10 does and a reader landing on it would otherwise find this effort contradicting it in silence.

Each note says what replaced the two-page remedy rather than only that it was replaced, because the problem that produced the widening is real and did not go away: the fonts still differ between this machine and the runner. What changed is that the remedy is now content plus a floor, rather than a wider budget.

## One drift corrected

`plan.md` fixed the new refusal's name as `resume-has-no-headroom`; ticket 05 shipped it as `resume-too-tight`. The plan is the approved design and the code took its name back. Found by this ticket's own search rather than by a check, which is worth saying: nothing would have caught it.

## Comments now describing behaviour the code has

The defect two review rounds of effort 5 named twice. Read and corrected across this effort: the page box and the heading in `src/styles/global.css`, the template block and the header in `src/components/CvDocument.astro`, the document table, the header comment, and `printBackground` in `scripts/render-pdf.mjs`, and `resumePages` and `documentHazards` in `scripts/check-dist.mjs`. The `printBackground` one is the easiest to miss: it said backgrounds are printed because the headings sit in a tinted band, and there is no band any more.
