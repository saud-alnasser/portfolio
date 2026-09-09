---
status: resolved
blocked-by: [13, 14]
---

# chore(repo): enable GitHub Pages for saud-alnasser and check the live site on every deploy

## Outcome
The repository `saud-alnasser/saud-alnasser` has its Pages source set to GitHub Actions, and the deploy workflow ends by asking the live site for its addresses, so the first push to `main` publishes the site at `https://saud-alnasser.github.io/saud-alnasser/` and proves it answered, with no manual step and nobody having to look.

## Acceptance Criteria
- [x] The repository's Pages settings show source "GitHub Actions": `gh api repos/saud-alnasser/saud-alnasser/pages` reports `build_type: workflow` and the site's address (criterion 8).
  Verified 2026-09-09: enabled by the run on Saud's say-so in that turn ("push to pull request; continue any missing pieces before merge", after the exact command had been shown to him), with `gh api -X POST repos/saud-alnasser/saud-alnasser/pages -f build_type=workflow`, which answered `{"build_type":"workflow","html_url":"https://saud-alnasser.github.io/saud-alnasser/"}`; a following `gh api repos/saud-alnasser/saud-alnasser/pages` printed `build_type: workflow`, `html_url: https://saud-alnasser.github.io/saud-alnasser/`, `public: true`.
- [x] The deploy job ends with a step that asks the live site for the root redirect page, both home pages, both CV pages, both JSON Resume documents, both PDFs, and `sitemap.xml`, retrying while Pages serves a fresh deployment, and fails naming the address and the status when one is missing, so a merge to `main` verifies criterion 8 itself (criterion 8, criterion 15).
  Verified: `.github/workflows/deploy.yml` parses with the deploy job's steps `checkout repository`, `deploy to github pages`, `check the live site`, the last running `bash scripts/check-live.sh "${{ steps.deployment.outputs.page_url }}"`, with `contents: read` added for the checkout. Against `scripts/serve-dist.mjs` on this machine the script printed `-> 200` for all ten addresses under `http://127.0.0.1:4197/saud-alnasser/` and `carries the redirect to the default language`, exit 0; pointed at the server's root it failed with `http://127.0.0.1:4197/ -> 404, expected 200 after 2 attempts`, exit 1; with `dist/cv.ar.pdf` moved aside it failed naming that address, exit 1. The first run on a real deploy happens when the effort merges, since the deploy workflow exists only on the effort branch.

## Relevant areas
GitHub repository settings (Pages), `.github/workflows/deploy.yml`, `scripts/check-live.sh`.

## Constraints
- Setting the Pages source is a write to shared data outside this repository. It is performed by Saud, or by the run only with his say-so in that turn, with the exact command shown first: `gh api -X POST repos/saud-alnasser/saud-alnasser/pages -f build_type=workflow`.
- Nothing merges to `main` by this ticket. The deploy workflow exists only on the effort branch, so the first live deploy happens when the effort merges and the push to `main` triggers it.
- The old name `portfolio` redirects; do not rewrite history or issue references that say it.

## Notes
The plan's operational considerations and its testing strategy for criterion 8 ("a `curl` of the live address in the workflow's last step"). Rewritten on 2026-09-09: the ticket first asked for a rename to `saud-alnasser.github.io`. Saud renamed the repository `saud-alnasser` instead and keeps it (spec, requirement 15), so the rename is gone, the base path is ticket 13, and the artifacts that named the old repository are ticket 14. Parked on 2026-09-08 and 2026-09-09 while the other tickets were built.

Resolved on 2026-09-09 by the orchestrator as a wave of one. Its second criterion as first written, a green deploy on `main` and a `curl` of the live address, could only be true after the merge, which no ticket of an unmerged effort can satisfy; the plan's own testing strategy puts that check in the workflow's last step, so the deploy job now carries it and the merge verifies criterion 8 without a person. Converge reads criterion 8 as verified by that step on the first push to `main`.
