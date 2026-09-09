---
use-when: "reading or writing anything on the GitHub repository: issues, pull requests, labels, or the Pages deployment"
---

# Reference — GitHub

**This file is yours.** Seeded on 2026-09-08, the day the remote was found on the
repository, and corrected on 2026-09-09 when Saud renamed it: `origin` is
`https://github.com/saud-alnasser/saud-alnasser.git`, public, default branch
`main`, and the label vocabulary is already created there. GitHub redirects the
old name, `portfolio`, for git and for the API. The repository
carries the account's username, so GitHub shows its `README.md` on the profile
page and serves its Pages site as a project site under `/saud-alnasser/`.

## Purpose

The forge. It holds the effort's two tracker objects (`[[policies/execution]]`),
the labels those objects carry, and, once the site exists, the Pages deployment.
`gh` is the CLI for all of it; Graphite (`[[references/graphite]]`) pushes and
opens the stacked pull requests for tickets.

## Prerequisites

`gh auth status` reports the `saud-alnasser` account with the `repo` and
`workflow` scopes. Verified on 2026-09-08.

## Commands

```sh
gh repo view saud-alnasser/saud-alnasser --json name,visibility,defaultBranchRef
gh label list --limit 200                              # the vocabulary; read before naming a label
gh issue list --state all --limit 50
gh pr list --state all --limit 50

gh issue create --title "<title>" --body-file <file> --label "<label>" [--label ...]
gh issue edit <n> --body-file <file>                   # the body is the spec's projection; rewrite it, never patch it
gh issue edit <n> --add-label "<label>" --remove-label "<label>"

git push -u origin <effort>                            # PUBLISHES. Only after the human said yes
gh pr create --draft --base main --head <effort> --title "<title>" --body-file <file> --label "<label>"
gh pr edit <n> --body-file <file>
gh pr edit <n> --add-label "<label>" --remove-label "<label>"
```

Label names carry their emoji and are matched byte for byte. Copy them from
`gh label list`, never retype them: the REST call creates a missing name rather
than failing, which leaves a duplicate with a random colour.

## The vocabulary

The families `[[policies/execution]]` projects onto all exist here already, with
an emoji prefix. The mapping from the policy's names to this repository's:

| Policy says | Label here |
| --- | --- |
| `status: backlog` | `🗃️ status: backlog` |
| `status: ready` | `🎯 status: ready` |
| `status: in progress` | `🚧 status: in progress` |
| `status: in review` | `👀 status: in review` |
| `status: done` | `✔️ status: done` |
| `type: enhancement` | `✨ type: enhancement` |
| `type: documentation` | `📚 type: documentation` |
| `priority: low / medium / high / critical` | `🏝 priority: low`, `🏕 priority: medium`, `🏔️ priority: high`, `🌋 priority: critical` |
| `flag: discussion` | `💬 flag: discussion` |
| `flag: triage` | `📝 flag: triage` |
| `flag: wontfix` | `🛑 flag: wontfix` |

The `size:` family and the thresholds behind it are recorded in
`.github/labels.yml`. `📦 flag: dependencies` and the `type:` labels on pull
requests are set by the workflows under `.github/workflows/`, so a run never
sets those two by hand.

## Pages

```sh
gh api repos/saud-alnasser/saud-alnasser/pages                        # 404 until Pages is enabled; then build_type
gh api -X POST repos/saud-alnasser/saud-alnasser/pages -f build_type=workflow   # enables Pages with GitHub Actions as the source. Saud's say-so, in that turn
gh run list --workflow deploy.yml --limit 5                          # the deploys, newest first
```

The deploy workflow needs the source set to GitHub Actions once; until then
its deploy job fails. The site is served at
`https://saud-alnasser.github.io/saud-alnasser/`, and the base path lives in
`astro.config.mjs`.

## Expected output

`gh issue create` and `gh pr create` print the new object's URL and nothing
else. `gh label list` prints one label per line: name, description, colour.

## Verification

```sh
gh issue view <n> --json labels,title,state
gh pr view <n> --json labels,title,isDraft,baseRefName,headRefName
```

## Failure handling

- `blank_issues_enabled: false` in `.github/ISSUE_TEMPLATE/config.yml` affects
  the web form only. `gh issue create --body-file` is unaffected.
- A label name that is not in `gh label list` is created silently. Check the
  list after any labelling call that used a name typed rather than copied.
- `gh pr create` refuses when the head branch is not on the remote. Push first,
  and pushing is the human's to authorise (`[[rules/version-control]]`).

## Never run

Anything that pushes, opens, merges, or closes a pull request without the human
asking in that turn. `gh pr merge` is never run by an agent. `gh repo delete`,
`gh repo rename`, `gh label delete`, and `gh issue delete` change or destroy
shared data; the rename also moves the profile README and the Pages address.
