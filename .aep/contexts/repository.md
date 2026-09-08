---
use-when: "orienting in this repository for the first time in a session, before reaching for a narrower context"
---

# Context — this repository

Cross-cutting orientation only: vocabulary and shape every area needs. An area
that grows enough gets its own context with its own `use-when`.

## What this repository is

`portfolio` is Saud Alnasser's personal portfolio website. It was initialised
locally on 2026-09-08 and joined to AEP the same day, before any source was
written.

Decided so far:

- it is a website, and it will be hosted **for free on GitHub-based
  infrastructure**. Which service, and how deployment runs, is deferred until
  there is something to deploy
- work lands as **stacked changes through Graphite** (`[[rules/version-control]]`)

Not decided: the stack it is built with, what it shows, and the remote. Nothing
below should be read as claiming otherwise.

## Shape

| Directory | Holds |
| --- | --- |
| `.aep/` | the protocol tree: policies, skills, rules, references, efforts |
| `.github/` | the forge's side of how work lands: issue and pull request templates, the label configuration, Renovate, and the workflows — a title lint, the labeler with its merge-time status job, and an integration gate that so far only verifies the AEP index |
| `AGENTS.md` | the entrypoint |

No source directories exist yet. Add a row here when one does.

## Vocabulary

No repository-specific terms yet. Add a row the first time a word here means
something different from what it means elsewhere.

| Term | Means |
| --- | --- |

## Where to look

| To understand | Start at |
| --- | --- |
| how work is done here | `.aep/protocol.md` |
| how work lands | `.aep/rules/version-control.md` |

## Areas with their own context

None yet.

| Area | Context |
| --- | --- |

---

**This file describes; it never instructs.** A requirement belongs in
`[[rules]]`; a procedure belongs in `[[references]]`. The repository is
authoritative over everything written here — where the source disagrees, the
source is right and this file gets corrected (`[[policies/authority]]`).
