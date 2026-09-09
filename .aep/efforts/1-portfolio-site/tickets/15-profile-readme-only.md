---
status: resolved
blocked-by: [14]
---

# docs(repo): make the README the profile page alone and move the site's documentation beside the code

## Outcome
`README.md` is what a visitor to `github.com/saud-alnasser` expects of a profile page and nothing more: a greeting, who Saud is, the portfolio and CV links, how to reach him, and what he works with, in the plain emoji style profile READMEs use. Every fact on it beyond the name is written from the content source and the site config by a script, so nothing is authored twice. The site's own documentation moves beside the code: how to build and deploy it in `docs/development.md`, and the content format in `src/content/README.md`, which is the README criterion 9 names.

## Acceptance Criteria
- [x] `README.md` opens with a greeting naming Saud and carries the summary, the portfolio link in both languages, the CV link with its downloads, the email, and the skill groups, with emoji as profile READMEs use, and carries no build, deployment, or content-format documentation beyond one paragraph pointing at where it lives (criterion 15, requirement 15).
  Verified 2026-09-09 by reading `README.md`: `# Hi, I'm Saud 👋`, then the generated block with the summary paragraph, `🌐 Portfolio` linking `/en/` and, as `بالعربية`, `/ar/`, `📄 CV` linking the page, `cv.en.pdf`, and `en/resume.json`, `✉️ Email`, and `## 🧰 What I work with` with the seven skill groups; then one `## 🛠️ This repository` paragraph pointing at `docs/development.md` and `src/content/README.md`. Nothing else is on the page.
- [x] Every fact on the README beyond the name is written between the `<!-- profile -->` markers by `pnpm readme` from `src/content/profile.yaml`, `src/content/skills/`, and `astro.config.mjs`, and `pnpm check:dist` fails by name when the README is behind them (criterion 1, requirement 1).
  Verified: `node scripts/readme-profile.mjs` printed `README.md rewritten from src/content/ and astro.config.mjs` and `--check` then passed; the addresses come from the same `site` and `base` the build uses, through `joinBase`; `pnpm check:dist` prints `readme profile: README.md carries the profile as src/content/ states it`; with `SQL` changed to `SQL (probe)` in `src/content/skills/databases.yaml` it failed with `check-dist: readme profile: README.md is behind src/content/ or astro.config.mjs; run \`pnpm readme\` and commit the result`, exit 1, and passed again once restored.
- [x] `src/content/README.md` documents the content format, one section per collection, unchanged in substance from the root README's former "Content" section; `docs/development.md` carries the addresses, the scripts, and the deployment; and every pointer to the former README sections in the code comments, the context, and the plan names the new files (criterion 9, requirement 9).
  Verified: `src/content/README.md` opens `# Content` and carries the eight former subsections as `##` headings (conventions, `profile.yaml`, `projects/`, `experience/`, `education/`, `certificates/`, `skills/`, adding a project), the text moved by the script with two sentences reworded to name the file; `docs/development.md` carries the "Addresses", "Development", and "Deployment" sections; a grep of `scripts/`, `src/`, and `astro.config.mjs` for `README.md` finds only `src/content/README.md` and the readme script's own references; the context's shape and where-to-look tables, `AGENTS.md`, and the plan's components table name the new files. `node .aep/scripts/validate.mjs` reports no failures, `astro check` 0 errors, the build 8 pages, `check:dist` exit 0 with thirteen checks, the content mechanism test and the history scan clean.

## Relevant areas
`README.md`, `docs/development.md` (new), `src/content/README.md` (new), `scripts/readme-profile.mjs`, `scripts/check-dist.mjs`, `astro.config.mjs`, `src/content.config.ts`, `src/lib/order.ts`, `src/pages/[locale]/education/index.astro`, `scripts/test-content-mechanism.mjs`, `AGENTS.md`, `.aep/contexts/repository.md`, the plan's components table.

## Constraints
- The profile README is Saud's page in the style he asked for, emoji on its headings and list items included; that is a declared deviation from the reporting policy's prohibition on decorative emoji, recorded in the spec's requirement 15, and it reaches no other governed text.
- The content documentation is moved, not rewritten: requirement 9 depends on it.
- Nothing about the site's pages, content, or checks changes beyond the README check reading the wider block.

## Notes
Appended on 2026-09-09 after the close had stamped the spec, when Saud read the README and asked for a profile page instead ("readme should be only as if it's for github saud-alnasser main usage the front page of my github account; you can include the link for the portfolio; usage emojis simple texts look at great examples in the web"). The spec's stamp was lifted for this ticket and is set again when it lands. The two review rounds of the close had already run, so this ticket is verified by the gates and by no reviewer; recorded in the run log.

Built by the orchestrator on 2026-09-09 as a wave of one. The GitHub profile entry in `profiles` is left off the page, since the page is that profile; any other profile Saud adds to `profile.yaml` appears as a `🔗` line.
