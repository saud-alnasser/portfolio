---
status: open
blocked-by: [01]
---

# chore(repo): point the repository at saud-alnasser.github.io

## Outcome
The repository is named `saud-alnasser.github.io`, its Pages source is GitHub Actions, the deploy workflow from ticket 01 has published the scaffold to `https://saud-alnasser.github.io`, and every AEP artifact that named `saud-alnasser/portfolio` names the new repository.

## Acceptance Criteria
- [ ] `gh repo view` shows the name `saud-alnasser.github.io`, and `git remote get-url origin` in the main checkout and in the effort worktree points at it (requirement 8).
- [ ] The repository's Pages settings show source "GitHub Actions"; the deploy workflow has run green on `main` at least once; `curl -sI https://saud-alnasser.github.io/en/` returns 200 and `https://saud-alnasser.github.io/` returns the meta-refresh page (criterion 8).
- [ ] `.aep/references/github.md`, `.aep/rules/version-control.md`, and `.aep/contexts/repository.md` name the new repository and none still says `saud-alnasser/portfolio`; the context's "Shape" table gains rows for the new source directories (requirement 8).

## Relevant areas
GitHub repository settings (name, Pages), the local remotes, and the three AEP artifacts above.

## Constraints
- The rename and the Pages setting are writes to shared data outside this repository. They are performed by Saud, or by the run only with his say-so in that turn, with the exact command shown first: `gh repo rename saud-alnasser.github.io`.
- Nothing merges to `main` by this ticket. The first live deploy therefore happens when the effort's stack merges, or from a manual `workflow_dispatch` run of the deploy workflow on `main` if the workflow gains that trigger; say which was used to satisfy the second criterion.
- GitHub redirects the old name; do not rewrite history or issue references that say `portfolio`.

## Notes
The plan's operational considerations. This ticket is small and gated on a human act; it can be parked without blocking anything but the live-address checks in later tickets.

Parked on 2026-09-08 and 2026-09-09 while every other ticket was built: the rename and the Pages setting are Saud's. `README.md` already describes the repository as `saud-alnasser.github.io`, because Saud asked for that wording on 2026-09-09 ("write readme as if this repo will be renamed"); the standards review noted the README runs ahead of the rename, and that is accepted by him. The third criterion's list of artifacts to correct is now `.aep/references/github.md`, `.aep/rules/version-control.md`, and `.aep/contexts/repository.md`, which name the old repository on purpose until this ticket lands.
