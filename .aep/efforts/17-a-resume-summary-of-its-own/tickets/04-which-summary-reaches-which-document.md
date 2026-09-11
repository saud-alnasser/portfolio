---
status: resolved
blocked-by: [01, 02]
---

# docs(content): the field table says which summary reaches which document

## Outcome

`src/content/README.md` documents both summary fields and which outputs each one reaches, so the next person to edit either knows which document they are editing. The `summary` row stops saying it is for the top of the site and the CV, which was true when it was the only one and is now the half of the truth that omits the resume.

## Acceptance Criteria

- [x] The `profile.yaml` field table carries a row for `resumeSummary`, per language, saying it is the resume's opening paragraph and is read by nothing else (criterion 7). The row reads "the same, for the short resume alone, which reads this in place of `summary`", and names the page budget its length is measured against.
- [x] The `summary` row says it reaches the top of the site, the CV, the README profile block, and both JSON documents, and that the resume does not read it (criterion 7). All four outputs named in the row, and it ends "The resume does not read it".
- [x] The prose above the table, which explains that the README profile block is written from `summary` by `pnpm readme`, still reads correctly now that a second summary exists beside it (criterion 7). That sentence already named the field rather than saying "the summary", so it stayed as written; a paragraph was added before the table saying there are two, that each names only what its own document prints, where the choice is made, and to check which document you mean before editing one.
- [x] `pnpm check:dist` and `pnpm test:content` pass (criterion 6). Both pass, and `pnpm check` (0 errors, 0 warnings) and `pnpm test` (604 passed) with them.

## Relevant areas

`src/content/README.md`, the `profile.yaml` section at line 40 and its field table at line 50.

## Constraints

- **This documents the fields; it does not argue for them.** Why there are two is recorded in `src/content/profile.yaml`'s own comment and in [[efforts/17-a-resume-summary-of-its-own/spec]]. The field table says what an editor needs to type and where it comes out.
- **Both fields carry the same two-or-three-sentence guidance.** They are the same kind of text with different contents, and the resume's is the one with a page budget behind it.

## Notes

Blocked by both content tickets because the row for each field describes what that field ended up being. Written earlier it would describe an intention.

`docs/development.md` mentions no summary field and needs no change.
