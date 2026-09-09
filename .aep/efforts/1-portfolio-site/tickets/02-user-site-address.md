---
status: open
blocked-by: [13, 14]
---

# chore(repo): enable GitHub Pages for saud-alnasser and publish the first deploy

## Outcome
The repository `saud-alnasser/saud-alnasser` has its Pages source set to GitHub Actions, the deploy workflow has published the site to `https://saud-alnasser.github.io/saud-alnasser/`, and the addresses the site publishes resolve there.

## Acceptance Criteria
- [ ] The repository's Pages settings show source "GitHub Actions" (`gh api repos/saud-alnasser/saud-alnasser/pages` reports `build_type: workflow`), and the deploy workflow has run green on `main` at least once (criterion 8).
- [ ] `curl -sI https://saud-alnasser.github.io/saud-alnasser/en/` returns 200, `https://saud-alnasser.github.io/saud-alnasser/` returns the meta-refresh page, and `https://saud-alnasser.github.io/saud-alnasser/en/resume.json` returns the JSON Resume document (criterion 8, criterion 15).

## Relevant areas
GitHub repository settings (Pages), `.github/workflows/deploy.yml`.

## Constraints
- Setting the Pages source is a write to shared data outside this repository. It is performed by Saud, or by the run only with his say-so in that turn, with the exact command shown first: `gh api -X POST repos/saud-alnasser/saud-alnasser/pages -f build_type=workflow`.
- Nothing merges to `main` by this ticket. The deploy workflow exists only on the effort branch, so the first live deploy happens when the effort merges and the push to `main` triggers it; say so when the second criterion is verified.
- The old name `portfolio` redirects; do not rewrite history or issue references that say it.

## Notes
The plan's operational considerations. Rewritten on 2026-09-09: the ticket first asked for a rename to `saud-alnasser.github.io`. Saud renamed the repository `saud-alnasser` instead and keeps it (spec, requirement 15), so the rename is gone, the base path is ticket 13, and the artifacts that named the old repository are ticket 14. Parked on 2026-09-08 and 2026-09-09 while the other tickets were built: setting the Pages source is Saud's act.
