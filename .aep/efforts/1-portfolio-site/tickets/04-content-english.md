---
status: resolved
blocked-by: [03]
---

# feat(content): author the English content from the inventory

## Outcome
The fixtures are replaced by real entries: the profile, the projects Saud chooses to show with `visibility` set per project, the practical training at Al Othaim Markets as an experience entry of kind `training`, the Saudi Electronic University degree with `status: certificate-pending`, the certificates from Code with Mosh, SoloLearn, and typing.com, the skills, and high school once its details exist. English text only; Arabic is ticket 10.

## Acceptance Criteria
- [x] Every entry in [[efforts/1-portfolio-site/evidence/research/source-material-inventory]] that Saud has not excluded exists as a content file, and every fact in a content file traces to that inventory or to an answer Saud gave (criterion 11).
  Verified 2026-09-08: `git ls-tree` of `src/content/` lists 56 files: `profile.yaml`, 19 projects (one per repository in the inventory that is a project; `portfolio`, `saud-alnasser`, and `knowledge` left out as not projects), `experience/al-othaim-markets.yaml`, `education/saudi-electronic-university.yaml`, 27 certificates (19 Code with Mosh, 7 SoloLearn, typing.com), 7 skill groups. `find src/content -name 'fixture-*'` counts 0. The child's record lists the source for each rule applied (the inventory; `gh` reads of the account; `pdftotext` over the SoloLearn, typing.com, training report, and study plan PDFs) and every open question left as a gap rather than guessed: no high school entry, Code with Mosh dates unset, GitHub the only profile, no photograph. One value is flagged for Saud rather than traced: the email in `profile.yaml`, taken from the account's public commit author because the inventory names none.
- [x] The education entry for Saudi Electronic University carries `status: certificate-pending`, `studyType` "Bachelor of Science", `area` "Computer Science", a start of `2023-09` or earlier as the inventory supports, and an end at the 2025-2026 summer term; no King Saud University entry exists (requirement 4, criterion 4).
  Verified by reading `src/content/education/saudi-electronic-university.yaml`: `status: certificate-pending`, `studyType.en: Bachelor of Science`, `area.en: Computer Science`, `period.start: "2023-09"`, `period.end: "2026-09"` (the final report's date being the month the evidence ties to that term; flagged for Saud to confirm). `grep -r -n -i -E 'king saud|graduat|awarded' src/content dist` printed nothing.
- [x] Every private repository shown has `visibility: described` and no `links.repository`; every public one shown has its repository link (requirement 3).
  Verified: for every file under `src/content/projects/`, `visibility` against the count of `repository:` lines gives `8 described 0` and `11 public 1`, nothing else.
- [x] A grep over `src/content/` for the identifier patterns (a ten-digit number starting with 1, a nine-digit number starting with 2, a Saudi mobile number with or without the country code) finds nothing; the profile's contact is an email address and the GitHub profile only (criterion 12).
  Verified: `grep -r -n -E '1[0-9]{9}|2[0-9]{8}|\+?9665[0-9]{8}|05[0-9]{8}' src/content dist` printed nothing; `profile.yaml` carries `email`, and one profile, `network: GitHub` with `https://github.com/saud-alnasser`, and no phone.
- [x] `pnpm build` succeeds with the real content (requirement 1).
  Verified in the run's surface after integration: `pnpm check` 0 errors, 0 warnings; `pnpm build` exit 0, 2 pages; `pnpm check:dist` printed `en/resume.json: valid, work 1, education 1, certificates 27, skills 7, projects 19` and the same for `ar`.

Answers from Saud on 2026-09-09, after the close: PHP and Python are out of the programming languages he lists, as things he has not worked in enough to claim; FiveM is out of game development for the same reason; the IT support group is removed altogether, since its items are the custom tools of one placement. The projects and certificates that name those technologies are unchanged, being facts about the work rather than claims about him.

## Relevant areas
`src/content/**` only. The inventory evidence file is the source; the Drive folder and the GitHub account are where to verify a fact it lacks.

## Constraints
- Which private projects appear, the high school details, the placement dates, and any extra profile are the spec's open questions. Where an answer is missing when this ticket runs, leave the entry out or leave the field unset rather than guessing, and record the gap in the ticket's notes; the criterion above allows an entry Saud excluded to be absent.
- Copy no identifier from any source document. The Qiyas printouts and the training report carry them.
- Dates in the JSON Resume pattern.

## Notes
The plan's technical approach step 3, English half. The Code with Mosh certificate dates are unknown (image PDFs); leave `date` unset for those unless Saud supplies it.

Built 2026-09-08 by a dispatched implementer. Gaps and values for Saud, each one edit in `src/content/`:
- Email: `saud4services@gmail.com` in `profile.yaml`, from the account's public commit author. The spec assumes an address chosen for this purpose; change the one value if another is wanted.
- Saudi Electronic University end: `2026-09`. Training period: `2026` to `2026`, since the report gives no dates.
- Private projects: all eight shown as `described`; set `visibility: hidden` on any to remove it everywhere.
- No high school entry, no Code with Mosh dates, no second profile, no photograph, until supplied.
- Project periods run from the repository's creation month to its last-update month as the inventory records them; delete `end` to mark one ongoing.
- The typing.com certificate has no `url` because its verification link embeds account numbers.
