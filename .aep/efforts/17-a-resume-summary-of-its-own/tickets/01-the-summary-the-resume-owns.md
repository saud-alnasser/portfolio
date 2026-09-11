---
status: resolved
---

# feat(cv): a second summary on the profile, and the resume printing it

## Outcome

The profile carries a required `resumeSummary` beside `summary`, authored in both languages, and the resume prints it. It names `rentable` and Mudaraj, the two projects the resume's own section carries, and it says Mudaraj is a prototype built for a bachelor's senior project. The CV, the home page, both JSON documents, and the README are untouched, because nothing but `src/components/CvDocument.astro` can see the new field. The resume is still one page in both languages on both papers, and the free height at Letter is measured rather than assumed.

## Acceptance Criteria

- [x] `src/content.config.ts` declares `resumeSummary` as a required `localized` field on the profile, and a `profile.yaml` without it fails the build (criterion 1). Removing the field and building printed `[InvalidContentEntryDataError] profile → profile data does not match collection schema. resumeSummary: Required`, and the field was restored.
- [x] `src/components/CvDocument.astro` chooses between the two summaries in exactly one place, on the `resume` boolean it already derives from `variant`. No page decides it, and no second read of either field appears in `src/` (criterion 1). `grep -rn "resumeSummary" src/` returns the comment at line 39 and the read at line 73, and nothing else outside `content.config.ts` and the content source.
- [x] The English `resumeSummary` names `rentable` and Mudaraj and no other project; `cachescribe`, PL/0, Monkey, and the language in draft appear in neither language of it (criterion 2). Screened both languages against `cachescribe`, `PL/0`, `Monkey`, `bytecode`, `virtual machine`, `in draft`, `npm`, and the Arabic of each: no hits, and both name `rentable` and `Mudaraj`.
- [x] It calls Mudaraj a prototype built for a bachelor's senior project, claiming no more than the role line in `src/content/projects/mudaraj.yaml` already states, and `git diff --stat` shows that file absent from this change (criterion 3). The English reads "built as a prototype for a bachelor's senior project"; the diff touches three files and that is not one of them.
- [x] The Arabic is the same sentences making the same claims as the English, and `pnpm build` prints `[localized] 0 gaps` (criterion 6). Three sentences in each, in the same order, making the same three claims. Each document was read back out of `dist/` and compared against the field it is supposed to print: `en/cv` and `ar/cv` match `summary`, `en/resume` and `ar/resume` match `resumeSummary`.
- [x] `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` pass (criterion 6). `check`: 0 errors, 0 warnings over 59 files. `check:dist`: every check, `readme profile` among them. `test`: 596 passed. `test:content`: passed.
- [x] `pnpm render:pdf` writes `resume.en.pdf` and `resume.ar.pdf`, and the filled copy of each, at one page on A4 and one page at Letter, each reporting at least 10mm free at Letter. The number goes in the commit message (criterion 8). All four at one page on both papers, **15.4mm free at Letter** against the 10mm floor, and 28.1mm (en) and 33.4mm (ar) at A4.

## Relevant areas

`src/content.config.ts`, the `profile` collection at line 63 and the `localized` helper above it at line 30. `src/content/profile.yaml`, the `summary` field and the comment block above it. `src/components/CvDocument.astro`, `const resume = variant === 'resume'` at line 62 and the `summary` const at line 68.

## Constraints

- **The comment above the fields is rewritten once, here**, to say what each field is for and which outputs read it. Ticket 02 edits the other field under the same comment, so leave it saying something true of both.
- **`summary` is not touched by this ticket.** Its Nova clause is ticket 02's.

The ordering, the sentence count, and what the wording may reuse are in [[efforts/17-a-resume-summary-of-its-own/plan]], under *Technical approach*.

## Notes

The `localized` helper is used unchanged, so the new field arrives covered by both gap reporters without either learning it exists: `pick()` in `src/lib/localized.ts` records at render, and the `gaps` check in `scripts/check-dist.mjs` recurses the profile object and treats any value with a string `en` as localized.

`scripts/test-content-mechanism.mjs` writes a fixture project and a fixture certificate and never touches `profile.yaml`, so a newly required profile field does not reach its fixture.

The resume should gain headroom rather than lose it: the paragraph drops four projects and adds one, against the 15.4mm at Letter effort 15 left. A number that comes back lower means something other than the summary changed, which is why it is recorded rather than merely cleared.

**At Letter it gained none.** Letter came back at 15.4mm in both languages, the same figure to the tenth of a millimetre, because the old and new paragraphs set to the same number of lines at that width. A4 did gain a line, which is what shows the instrument is not simply insensitive: measured from the lowest text baseline of each rendered page, with the old paragraph injected for the comparison, the new one sets a line shorter there in both languages. That line is 15pt, about 5.3mm, which is the dominant baseline-to-baseline gap in the rendered body. Letter is the paper the floor is enforced on and the paper that does not move, so the spec's assumption that the fit would get easier was wrong where it counts. Both papers clear the floor and nothing is owed here; the note is for whoever lengthens this next and reads the assumption rather than the number.
