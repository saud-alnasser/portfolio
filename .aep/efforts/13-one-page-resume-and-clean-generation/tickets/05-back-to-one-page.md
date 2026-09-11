---
status: open
blocked-by: [03, 04]
---

# fix(cv): the resume back to one page, with headroom the runner will not eat

## Outcome

The resume is one page in both languages, on A4 and on Letter, published and generated, with at least 10mm of the last page still empty at Letter. The render step and the dist check say so on the machine that renders what ships, and everything the resume gave up to get there is still on the CV.

## Acceptance Criteria

- [ ] Every resume render reports how much of its last page is unused, at both papers, for the published copy and the filled one (criterion 2).
- [ ] `scripts/render-pdf.mjs` refuses a resume that runs to two pages **and** one whose last page at Letter has less than 10mm unused, naming the locale, the paper, and which copy it was. The constant carries its reason beside it: 16 pixels of headroom was not enough on 2026-09-10, and 10mm is about 38 (criterion 2).
- [ ] `resumePages` in `scripts/check-dist.mjs` refuses a second page rather than a third, with the message and the comment saying why it changed back (criterion 2).
- [ ] `resume.en.pdf`, `resume.ar.pdf`, and both filled copies under `.artifacts/` are one page at A4 and one at Letter, with at least 10mm free at Letter, **on the CI runner**, and the integration workflow is green on the pushed branch. That is the only machine whose answer has ever counted here (criterion 2).
- [ ] Every project, course, certification, skill, and line of text the resume no longer shows is on the CV page, in `cv.en.pdf` and `cv.ar.pdf`, and in both `resume.json` documents. No file leaves `src/content/`, `pnpm build` prints `[localized] 0 gaps`, and `pnpm test:content` passes (criterion 3).
- [ ] Each content edit is recorded on this ticket with what the text said before and what it says now, in both languages, so a later reader can see that a shortened line is still true (criterion 3).
- [ ] The type size is untouched at 10pt, and the diff contains no change to it (criterion 2, and the constraint `spec.md` carries).
- [ ] `pnpm test` passes with `tests/resume.spec.ts`'s expectations following the content rather than being edited to match it.

## Relevant areas

`scripts/render-pdf.mjs`, the `documents` array and both render functions; `scripts/check-dist.mjs`, `resumePages`; `src/content/projects/cachescribe.yaml` and the other marked projects; `src/content/profile.yaml`, the summary; `src/content/experience/al-othaim-markets.yaml`, the highlights.

## Constraints

- **The levers are pulled in this order, and only as far as the floor needs**: the height ticket 03 returned, then the resume drops cachescribe, then the profile summary loses a line, then a project summary, then a placement bullet. Stop at the first point where both languages clear the floor.
- **Dropping cachescribe means removing its resume marker and nothing else.** It keeps its entry, its Arabic, its place on the work page, on the CV, and in both JSON documents. Effort 7's spec records this as the standing instruction: "If the page budget refuses three, cachescribe is the one to drop", because the CV keeps it whole and it is the oldest of the three.
- **A shortened text is still true**, and it is the content source's, so the site and both JSON documents show it too. Shortening a line because it reads better is out of scope; shortening it because the page needs it is not.
- **The budget tightens last.** Measure and cut first; a budget of one page set before the document fits makes every build between here and there red, and a red build is not a signal when it is expected.

## Notes

Measured on 2026-09-11 on `main`, before any of this effort landed: the English resume is two pages at both papers and the Arabic is one at A4 and two at Letter. Letter binds. English has about 31mm to lose and Arabic about 18mm, which is about 117 and 66 pixels at the resume's print size. The plan's lever table says what each is worth.

The filled copies measure identically to the published ones at both papers in both languages, so the contact line the form adds lands inside the line the header already has. That retires the assumption that it might cost one.
