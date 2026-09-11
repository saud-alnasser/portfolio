---
status: open
blocked-by: [01, 02]
---

# docs(content): the field table says which summary reaches which document

## Outcome

`src/content/README.md` documents both summary fields and which outputs each one reaches, so the next person to edit either knows which document they are editing. The `summary` row stops saying it is for the top of the site and the CV, which was true when it was the only one and is now the half of the truth that omits the resume.

## Acceptance Criteria

- [ ] The `profile.yaml` field table carries a row for `resumeSummary`, per language, saying it is the resume's opening paragraph and is read by nothing else (criterion 7).
- [ ] The `summary` row says it reaches the top of the site, the CV, the README profile block, and both JSON documents, and that the resume does not read it (criterion 7).
- [ ] The prose above the table, which explains that the README profile block is written from `summary` by `pnpm readme`, still reads correctly now that a second summary exists beside it (criterion 7).
- [ ] `pnpm check:dist` and `pnpm test:content` pass (criterion 6).

## Relevant areas

`src/content/README.md`, the `profile.yaml` section at line 40 and its field table at line 50.

## Constraints

- **This documents the fields; it does not argue for them.** Why there are two is recorded in `src/content/profile.yaml`'s own comment and in [[efforts/17-a-resume-summary-of-its-own/spec]]. The field table says what an editor needs to type and where it comes out.
- **Both fields carry the same two-or-three-sentence guidance.** They are the same kind of text with different contents, and the resume's is the one with a page budget behind it.

## Notes

Blocked by both content tickets because the row for each field describes what that field ended up being. Written earlier it would describe an intention.

`docs/development.md` mentions no summary field and needs no change.
