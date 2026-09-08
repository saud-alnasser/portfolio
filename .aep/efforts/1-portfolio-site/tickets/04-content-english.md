---
status: open
blocked-by: [03]
---

# feat(content): author the English content from the inventory

## Outcome
The fixtures are replaced by real entries: the profile, the projects Saud chooses to show with `visibility` set per project, the practical training at Al Othaim Markets as an experience entry of kind `training`, the Saudi Electronic University degree with `status: certificate-pending`, the certificates from Code with Mosh, SoloLearn, and typing.com, the skills, and high school once its details exist. English text only; Arabic is ticket 10.

## Acceptance Criteria
- [ ] Every entry in [[efforts/1-portfolio-site/evidence/research/source-material-inventory]] that Saud has not excluded exists as a content file, and every fact in a content file traces to that inventory or to an answer Saud gave (criterion 11).
- [ ] The education entry for Saudi Electronic University carries `status: certificate-pending`, `studyType` "Bachelor of Science", `area` "Computer Science", a start of `2023-09` or earlier as the inventory supports, and an end at the 2025-2026 summer term; no King Saud University entry exists (requirement 4, criterion 4).
- [ ] Every private repository shown has `visibility: described` and no `links.repository`; every public one shown has its repository link (requirement 3).
- [ ] A grep over `src/content/` for the identifier patterns (a ten-digit number starting with 1, a nine-digit number starting with 2, a Saudi mobile number with or without the country code) finds nothing; the profile's contact is an email address and the GitHub profile only (criterion 12).
- [ ] `pnpm build` succeeds with the real content (requirement 1).

## Relevant areas
`src/content/**` only. The inventory evidence file is the source; the Drive folder and the GitHub account are where to verify a fact it lacks.

## Constraints
- Which private projects appear, the high school details, the placement dates, and any extra profile are the spec's open questions. Where an answer is missing when this ticket runs, leave the entry out or leave the field unset rather than guessing, and record the gap in the ticket's notes; the criterion above allows an entry Saud excluded to be absent.
- Copy no identifier from any source document. The Qiyas printouts and the training report carry them.
- Dates in the JSON Resume pattern.

## Notes
The plan's technical approach step 3, English half. The Code with Mosh certificate dates are unknown (image PDFs); leave `date` unset for those unless Saud supplies it.
