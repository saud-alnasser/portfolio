---
status: open
blocked-by: [13]
---

# docs(repo): open the README as the profile page and name the repository saud-alnasser everywhere

## Outcome
The README, which GitHub shows at `github.com/saud-alnasser`, opens with who Saud is and where the site and the CV are, then says how the site is built and how content is added, as it does now. Every artifact that named `saud-alnasser/portfolio` or a user site at `saud-alnasser.github.io` names `saud-alnasser/saud-alnasser` and the project-site address.

## Acceptance Criteria
- [ ] `README.md` opens with a heading naming Saud, a paragraph saying what he does, links to `https://saud-alnasser.github.io/saud-alnasser/en/`, its Arabic twin, and the CV page, and a sentence saying this repository is the site's source; the "Content" section is unchanged in substance (criterion 15, criterion 9).
- [ ] `grep -rn -E "portfolio\.git|saud-alnasser/portfolio" README.md AGENTS.md package.json .aep/rules .aep/references .aep/contexts` matches nothing, and the README's address table and deployment section, `AGENTS.md`, `.aep/contexts/repository.md`, `.aep/references/github.md`, and `.aep/rules/version-control.md` describe the project site and the repository `saud-alnasser/saud-alnasser`; any mention of `saud-alnasser.github.io` as a repository name is historical and says so (requirement 8, criterion 15).
- [ ] `git remote get-url origin` in the main checkout and in the effort worktree prints `https://github.com/saud-alnasser/saud-alnasser.git` (requirement 8).

## Relevant areas
`README.md`, `AGENTS.md`, `package.json`, `.aep/contexts/repository.md`, `.aep/references/github.md`, `.aep/rules/version-control.md`, the local remote.

## Constraints
- The README's opening is short, because it is read on the profile page above the fold. The content documentation stays as it is, because requirement 9 depends on it.
- The remote URL changes locally only; nothing is pushed.
- The old name is not scrubbed from history or from the issue and the pull request.

## Notes
Appended on 2026-09-09 by the return to plan. Takes over the third criterion of ticket 02 as it was first written, and adds the profile opening requirement 15 asks for.
