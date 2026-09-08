---
use-when: "committing, branching, or preparing work to land"
---

# Rule — version control

**This file is yours.** Reviewed at install on 2026-09-08 against an empty
repository: `main` with no commits, no remote, and no forge. Where something
below was a choice rather than a detection, it says so.

## The line an agent does not cross

`[[protocol]]` states it: never push, never publish. What that covers:

| Allowed | Not allowed without the human asking |
| --- | --- |
| `git add`, `git commit`, `git branch`, local `git rebase`, `git worktree` | `git push` in any form |
| reading remotes: `git fetch`, and the forge's read commands | opening or merging a pull request |
| local `git tag` | pushing a tag, publishing a release, publishing a package |

*Why the line sits exactly there: a commit is reversible in this clone and
everything past it is not. That asymmetry is what makes committing unasked safe
and makes the prohibition load-bearing.*

## Commits

Conventional Commits — `type(scope): summary`. Adopted at install; there was
no history to detect a convention from.

- One logical change per commit. A summary needing "and" describes two commits.
- Say what capability changed and why. **Never a file-by-file account** — the
  diff already lists the files.
- Never `--no-verify`; never bypass signing. A failing hook is a finding, not an
  obstacle.
- **Committing is part of finishing.** `[[skills/implement]]` lands work when it is
  reviewed and ready; it does not wait to be asked. What waits to be asked is
  everything in the right-hand column above.

## Branches

One branch per ticket, cut from the branch its effort is on and named
`<effort>/<ticket-id>-<slug>`, where `<effort>` is the effort directory's own
name: `51-branch-scope/03-execution-policy`.

**The namespace is what makes the name unique**, and uniqueness across efforts
is required (`[[policies/execution]]`). Ticket ids restart at `01` in every
effort, so two efforts each holding a ticket `03` want one bare `03-<slug>` for
two different claims. Under a runtime that gives each thread its own worktree,
git refuses the second outright; without one, the second run quietly takes a
claim the first is already holding. The namespace also gives a fresh branch an
effort before it has any commits: the first segment is an effort directory name,
and that is the only signal a branch with nothing on it carries.

**Existing branches keep the names they have.** The convention is forward-only:
a branch already called `03-execution-policy` still resolves to its effort by
what its commits touch, and renaming one breaks the claim whoever is on it
holds.

**The branch is the claim** (`[[policies/execution]]`): create it before the first
read of source, not after the first edit.

## How work reaches the default branch

The default branch is `main`. **This repository uses stacked changes,
submitted through Graphite** — decided at install on 2026-09-08, before any
source existed. `[[references/graphite]]` has the invocations.

What follows from that, and what `[[skills/specify]]` and `[[skills/implement]]`
read here rather than assume:

| Question | Answer here |
| --- | --- |
| where a new effort's branch starts | the **current branch**, which is what stacking means. The parent change is reviewed on its own branch and lands through its own pull request |
| what `blocked-by` means | **stack on top of**, not *wait for*. A task joins the frontier once its blockers are committed — not merged |
| how a commit references its task | the commit **carries the closing keyword**. It reaches `main` only through its own branch's pull request, so the cherry-pick hazard that bans the keyword on plain-merge repositories cannot arise. A stack merges bottom-first, so the keyword goes on the change that merges **last** and everything under it carries a plain reference |
| what publishes | `gt submit` opens pull requests. It is the human's call, never an agent's |

**There is no remote yet.** Graphite submits to GitHub, so the forge will be
GitHub when one is added; until then stacks are built and restacked locally and
nothing is submitted. Adding the remote is the moment to run `gt init`, seed a GitHub reference
under `references/`, and create the label vocabulary on the repository. The
merge-time job and the labelers are already written under `.github/workflows/`,
and every label they name must exist there first — the REST call behind them
creates a missing label with a random colour rather than failing.

## Pull request descriptions

Problem, solution, architectural impact, testing, related issues, breaking
changes. Never a commit-by-commit account.

---

`[[references]]` records the actual invocations — flags included. This rule says
what is required; a reference says how it is typed.
