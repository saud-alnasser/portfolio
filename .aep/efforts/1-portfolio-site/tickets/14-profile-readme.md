---
status: resolved
blocked-by: [13]
---

# docs(repo): open the README as the profile page and name the repository saud-alnasser everywhere

## Outcome
The README, which GitHub shows at `github.com/saud-alnasser`, opens with who Saud is and where the site and the CV are, then says how the site is built and how content is added, as it does now. Every artifact that named `saud-alnasser/portfolio` or a user site at `saud-alnasser.github.io` names `saud-alnasser/saud-alnasser` and the project-site address.

## Acceptance Criteria
- [x] `README.md` opens with a heading naming Saud, a paragraph saying what he does, links to `https://saud-alnasser.github.io/saud-alnasser/en/`, its Arabic twin, and the CV page, and a sentence saying this repository is the site's source; the "Content" section is unchanged in substance (criterion 15, criterion 9).
  Verified 2026-09-09 by reading `README.md`: it opens `# Saud Alnasser`, then "This repository is my portfolio: the record of my work and studies, in English and Arabic, with a CV derived from the same content for people and for machines. GitHub shows this file on my profile because the repository carries my username, so the profile, the site, and its source are one place.", then a table linking `https://saud-alnasser.github.io/saud-alnasser/en/`, `/ar/`, `/en/cv/`, and `/ar/cv/`. The opening states no fact the content source holds beyond the name, so criterion 1's one-authored-place rule is kept; what Saud does is the site's to say. The "Content" section is byte for byte what it was (`git diff` touches only the opening, the address table, and "Deployment").
- [x] `grep -rn -E "portfolio\.git|saud-alnasser/portfolio" README.md AGENTS.md package.json .aep/rules .aep/references .aep/contexts` matches nothing, and the README's address table and deployment section, `AGENTS.md`, `.aep/contexts/repository.md`, `.aep/references/github.md`, and `.aep/rules/version-control.md` describe the project site and the repository `saud-alnasser/saud-alnasser`; any mention of `saud-alnasser.github.io` as a repository name is historical and says so (requirement 8, criterion 15).
  Verified: the grep printed nothing (exit 1); a grep for `saud-alnasser.github.io` not followed by `/saud-alnasser` over the same files printed nothing. The README's "Addresses" table sits under `https://saud-alnasser.github.io/saud-alnasser/` and "Deployment" describes the project site, the base path, and the one change a custom domain would need; `AGENTS.md` says project site under the repository's name; the context says what the repository is and was, with the rename dated; the GitHub reference names the new `origin`, notes the redirect from `portfolio`, gains a "Pages" section with the enable command, and lists `gh repo rename` among the calls that change shared data; the version-control rule names the new `origin` with the rename dated. `package.json`'s `name` is `saud-alnasser`. `node .aep/scripts/validate.mjs` reports no failures and the build still emits 8 pages.
- [x] `git remote get-url origin` in the main checkout and in the effort worktree prints `https://github.com/saud-alnasser/saud-alnasser.git` (requirement 8).
  Verified: `git remote set-url origin https://github.com/saud-alnasser/saud-alnasser.git` in the run's worktree, whose config the main checkout shares; `git remote get-url origin` printed the new URL from both directories and `git fetch origin` succeeded against it.

## Relevant areas
`README.md`, `AGENTS.md`, `package.json`, `.aep/contexts/repository.md`, `.aep/references/github.md`, `.aep/rules/version-control.md`, the local remote.

## Constraints
- The README's opening is short, because it is read on the profile page above the fold. The content documentation stays as it is, because requirement 9 depends on it.
- The remote URL changes locally only; nothing is pushed.
- The old name is not scrubbed from history or from the issue and the pull request.

## Notes
Appended on 2026-09-09 by the return to plan. Takes over the third criterion of ticket 02 as it was first written, and adds the profile opening requirement 15 asks for.

Built by the orchestrator on 2026-09-09 as a wave of one. The README's opening is written in the first person, as a profile page reads; the "Content" section below it keeps its third-person wording, which is documentation rather than the profile. Recorded, not acted on: the two em dashes in `AGENTS.md` predate the effort and were left, as the standards review already noted.
