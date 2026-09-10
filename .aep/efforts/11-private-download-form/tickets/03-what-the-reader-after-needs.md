---
status: open
blocked-by: [02]
---

# docs(cv): the marked address in the development notes, and the line effort 7 needs

## Outcome
The two places a later reader will look both say what is now true. `docs/development.md` names the address that opens the form and says the render step navigates there, so the one person who has to remember it can find it. Effort 7's spec keeps its own text as the record of what it built and gains a line pointing here, so nobody reads its requirement 3 as current.

## Acceptance Criteria
- [ ] `docs/development.md` names the marked address in the paragraph that already describes the form, and says the render step navigates to it (criterion 9).
- [ ] `.aep/efforts/7-document-downloads-and-contact-details/spec.md` carries a line at its requirement 3 naming this effort as what changed it, and its `status:` and the rest of its text are untouched (criterion 8).
- [ ] `pnpm check` and the integration gate pass, and `node .aep/scripts/validate.mjs` reports no failures (criterion 9).

## Relevant areas
`docs/development.md`, the paragraph beginning "A reader who wants a document carrying contact details" and the one after it about `pnpm render:pdf` and `.artifacts/`. `.aep/efforts/7-document-downloads-and-contact-details/spec.md`, requirement 3 and nothing else in it.

## Constraints
- **Effort 7's spec is the record of what it built, not a document to bring up to date.** One line that points here. Its requirements, criteria, and `status: implemented` stay exactly as they are, including the sentences this effort falsifies.
- The development notes are written for whoever builds this site next, not for Saud alone. Say what the address is and why the form is behind one, in the voice the rest of that file is in.

## Notes
The plan's technical approach step 3. Nothing depends on this, and it depends on the behaviour in 02 existing, which is the only reason it is last.
