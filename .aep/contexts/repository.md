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

- it is a website, hosted **for free on GitHub Pages** at the user-site
  address `saud-alnasser.github.io`, deployed by a GitHub Actions workflow on
  every push to `main` (`.github/workflows/deploy.yml`). The repository takes
  that name in the effort's ticket 02; until then the remote is still
  `saud-alnasser/portfolio` (`[[references/github]]`)
- it is built with **Astro 7**, Tailwind 4, and typed YAML content
  collections, chosen in `[[efforts/1-portfolio-site/plan]]` on 2026-09-08;
  the site is static files only, in English and Arabic, with a CV derived from
  the same content as a printable page, a PDF rendered at build time, and a
  JSON Resume document
- work lands as **stacked changes through Graphite** (`[[rules/version-control]]`)
- what it shows is specified in `[[efforts/1-portfolio-site/spec]]`

## Shape

| Directory | Holds |
| --- | --- |
| `.aep/` | the protocol tree: policies, skills, rules, references, efforts |
| `.github/` | the forge's side of how work lands: issue and pull request templates, the label configuration, Renovate, and the workflows: a title lint, the labeler with its merge-time status job, the integration gate (AEP index, check, build, PDF render, dist checks, Playwright tests, Lighthouse, the content mechanism test, the history scan), and the Pages deploy |
| `src/content/` | **the content source**: one YAML file per entry under `projects/`, `experience/`, `education/`, `certificates/`, `skills/`, and `profile.yaml`. Every fact the site or the CV shows lives here and nowhere else; `README.md` documents the format |
| `src/content.config.ts` | the content contract: the Zod schema of each collection, which the build enforces |
| `src/pages/`, `src/layouts/`, `src/components/` | the Astro templates: pages under `[locale]/` for `en` and `ar`, one base layout, one component per entry type |
| `src/lib/` | UI strings per locale (`i18n.ts`), the language fallback and its gap report (`localized.ts`), the entry ordering (`order.ts`), the JSON Resume mapper (`resume.ts`) |
| `src/styles/` | the one global stylesheet: Tailwind, the palette tokens for both themes, the print rules, the Arabic font faces |
| `public/` | files served as they are: `robots.txt`, the bundled Arabic font and its licence |
| `scripts/` | what runs after the build: the PDF render, the dist checks, the content mechanism test, the history scan, the static server the tests use |
| `tests/` | the Playwright tests over the built site |
| `AGENTS.md` | the entrypoint |

## Vocabulary

| Term | Means |
| --- | --- |
| localized | a text field written per language as `{ en, ar }`; every other field is written once |
| described | a project shown by name and summary without a link (`visibility: described`), the way private work appears |
| certificate-pending | the education status for course work that is complete while the certificate has not been issued; the site never says more than that |
| gap report | the build's one-line list of every field whose Arabic was missing and rendered its English instead |

## Where to look

| To understand | Start at |
| --- | --- |
| how work is done here | `.aep/protocol.md` |
| how work lands | `.aep/rules/version-control.md` |
| the content format | `README.md`, "Content" |
| what the site must be | `.aep/efforts/1-portfolio-site/spec.md` |
| why it is built this way | `.aep/efforts/1-portfolio-site/plan.md` |

## Areas with their own context

None yet.

| Area | Context |
| --- | --- |

---

**This file describes; it never instructs.** A requirement belongs in
`[[rules]]`; a procedure belongs in `[[references]]`. The repository is
authoritative over everything written here — where the source disagrees, the
source is right and this file gets corrected (`[[policies/authority]]`).
