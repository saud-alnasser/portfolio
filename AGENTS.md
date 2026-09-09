# This repository

Saud Alnasser's personal portfolio website, served for free from GitHub Pages as his user site. It is an Astro site built from typed YAML content, in English and Arabic, with a CV derived from the same content; `README.md` says how it is built and how content is added. Work here lands as stacked changes through Graphite.

## Start here

Read `.aep/protocol.md`.

It is the bootstrap: the primitives, where state lives, how to discover what is
relevant, the workflow, and the invariants that hold on every turn. Everything
else loads when its `use-when` fires — nothing here needs to list it.

Nothing about the protocol is restated in this file. A summary in an entrypoint
is a second home for the rules, and it is the copy that drifts.

## About this file

AEP wrote it because the repository had no entrypoint. **It is yours now** — no
upgrade will touch it. Extend it with anything that must be true on every turn
and genuinely cannot wait for a rule to load.

Keep that list short. Anything conditional belongs in `.aep/rules/` with a
`use-when`, where it costs nothing until it applies.
