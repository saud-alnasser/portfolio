---
status: open
---

# feat(cv): a second summary on the profile, and the resume printing it

## Outcome

The profile carries a required `resumeSummary` beside `summary`, authored in both languages, and the resume prints it. It names `rentable` and Mudaraj, the two projects the resume's own section carries, and it says Mudaraj is a prototype built for a bachelor's senior project. The CV, the home page, both JSON documents, and the README are untouched, because nothing but `src/components/CvDocument.astro` can see the new field. The resume is still one page in both languages on both papers, and the free height at Letter is measured rather than assumed.

## Acceptance Criteria

- [ ] `src/content.config.ts` declares `resumeSummary` as a required `localized` field on the profile, and a `profile.yaml` without it fails the build (criterion 1).
- [ ] `src/components/CvDocument.astro` chooses between the two summaries in exactly one place, on the `resume` boolean it already derives from `variant`. No page decides it, and no second read of either field appears in `src/` (criterion 1).
- [ ] The English `resumeSummary` names `rentable` and Mudaraj and no other project; `cachescribe`, PL/0, Monkey, and the language in draft appear in neither language of it (criterion 2).
- [ ] It calls Mudaraj a prototype built for a bachelor's senior project, claiming no more than the role line in `src/content/projects/mudaraj.yaml` already states, and `git diff --stat` shows that file absent from this change (criterion 3).
- [ ] The Arabic is the same sentences making the same claims as the English, and `pnpm build` prints `[localized] 0 gaps` (criterion 6).
- [ ] `pnpm check`, `pnpm check:dist`, `pnpm test`, and `pnpm test:content` pass (criterion 6).
- [ ] `pnpm render:pdf` writes `resume.en.pdf` and `resume.ar.pdf`, and the filled copy of each, at one page on A4 and one page at Letter, each reporting at least 10mm free at Letter. The number goes in the commit message (criterion 8).

## Relevant areas

`src/content.config.ts`, the `profile` collection at line 63 and the `localized` helper above it at line 30. `src/content/profile.yaml`, the `summary` field and the comment block above it. `src/components/CvDocument.astro`, `const resume = variant === 'resume'` at line 62 and the `summary` const at line 68.

## Constraints

- **The schema change and the content land in one commit.** The field is required, so a schema that demands it and a `profile.yaml` that lacks it is a tree that does not build. Nothing in between may be committed.
- **Two or three sentences**, as `src/content/README.md` sets for a summary of this kind.
- **The rentable clause may be reused from `summary`.** The two documents are read separately and the same sentence is true on both; there is no requirement that they differ in wording.
- **The comment above the fields is rewritten once, here**, to say what each field is for and which outputs read it. Ticket 02 edits the other field under the same comment, so leave it saying something true of both.
- **`summary` is not touched by this ticket.** Its Nova clause is ticket 02's.

## Notes

The `localized` helper is used unchanged, so the new field arrives covered by both gap reporters without either learning it exists: `pick()` in `src/lib/localized.ts` records at render, and the `gaps` check in `scripts/check-dist.mjs` recurses the profile object and treats any value with a string `en` as localized.

`scripts/test-content-mechanism.mjs` writes a fixture project and a fixture certificate and never touches `profile.yaml`, so a newly required profile field does not reach its fixture.

The resume should gain headroom rather than lose it: the paragraph drops four projects and adds one, against the 15.4mm at Letter effort 15 left. A number that comes back lower means something other than the summary changed, which is why it is recorded rather than merely cleared.
