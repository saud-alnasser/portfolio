---
use-when: "orienting in this repository for the first time in a session, before reaching for a narrower context"
---

# Context — this repository

Cross-cutting orientation only: vocabulary and shape every area needs. An area
that grows enough gets its own context with its own `use-when`.

## What this repository is

`saud-alnasser/saud-alnasser` is Saud Alnasser's personal portfolio website
and, because the repository carries his username, the README GitHub shows on
his profile page. It was initialised locally on 2026-09-08 as `portfolio`,
joined to AEP the same day before any source was written, and renamed
`saud-alnasser` on 2026-09-09; GitHub redirects the old name.

Decided so far:

- it is a website, hosted **for free on GitHub Pages** as a project site at
  `https://saud-alnasser.github.io/saud-alnasser/`, deployed by a GitHub
  Actions workflow on every push to `main` (`.github/workflows/deploy.yml`).
  The base path is `base` in `astro.config.mjs`, and every path the site
  publishes is joined to it (`src/lib/paths.ts`); the address was re-decided
  on 2026-09-09 in `[[efforts/1-portfolio-site/plan]]`, "The address"
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
| `.github/` | the forge's side of how work lands: issue and pull request templates, the label configuration, Renovate, and the workflows: a title lint, the labeler with its merge-time status job, the integration gate (AEP index, check, build, PDF render, dist checks, Playwright tests, Lighthouse, the content mechanism test, the history scan), and the Pages deploy, which ends by checking the live site |
| `src/content/` | **the content source**: one YAML file per entry under `projects/`, `experience/`, `education/`, `certificates/`, `skills/`, and `profile.yaml`. Every fact the site or the CV shows lives here and nowhere else; `README.md` documents the format |
| `src/content.config.ts` | the content contract: the Zod schema of each collection, which the build enforces |
| `src/pages/`, `src/layouts/`, `src/components/` | the Astro templates: pages under `[locale]/` for `en` and `ar`, the `resume.json` and `robots.txt` endpoints, one base layout, one component per entry type |
| `src/lib/` | UI strings per locale (`i18n.ts`), the language fallback and its gap report (`localized.ts`), the entry ordering (`order.ts`), the JSON Resume mapper (`resume.ts`), the base-path join every published path goes through (`paths.ts`) |
| `src/styles/` | the one global stylesheet: Tailwind, the palette tokens for both themes, the print rules, the Arabic font faces |
| `public/` | files served as they are: the bundled Arabic font and its licence |
| `scripts/` | what runs after the build: the PDF render, the dist checks, the content mechanism test, the history scan, the Lighthouse runner, the static server the tests, the PDF render, and Lighthouse use, which serves `dist/` under the base path as Pages does, and the live check the deploy job runs last |
| `tests/` | the Playwright tests over the built site |
| `AGENTS.md` | the entrypoint |
| `README.md` | the profile page GitHub shows for the account, then how the site is built and how content is added |

## Vocabulary

| Term | Means |
| --- | --- |
| localized | a text field written per language as `{ en, ar }`; every other field is written once |
| described | a project shown by name and summary without a link (`visibility: described`), the way private work appears |
| certificate-pending | the education status for course work that is complete while the certificate has not been issued; the site never says more than that |
| gap report | the build's one-line list of every field whose Arabic was missing and rendered its English instead |
| base path | `/saud-alnasser`, the prefix GitHub Pages puts a project site under; `withBase()` in `src/lib/paths.ts` joins a site path to it |

## Where to look

| To understand | Start at |
| --- | --- |
| how work is done here | `.aep/protocol.md` |
| how work lands | `.aep/rules/version-control.md` |
| the content format | `README.md`, "Content" |
| the address and the base path | `astro.config.mjs`, then `README.md`, "Deployment" |
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
