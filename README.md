# Saud Alnasser

This repository is my portfolio: the record of my work and studies, in
English and Arabic, with a CV derived from the same content for people and
for machines. GitHub shows this file on my profile because the repository
carries my username, so the profile, the site, and its source are one place.

| | English | Arabic |
| --- | --- | --- |
| The site | <https://saud-alnasser.github.io/saud-alnasser/en/> | <https://saud-alnasser.github.io/saud-alnasser/ar/> |
| The CV, printable | <https://saud-alnasser.github.io/saud-alnasser/en/cv/> | <https://saud-alnasser.github.io/saud-alnasser/ar/cv/> |

Each CV page offers the same CV as a PDF and as a
[JSON Resume](https://jsonresume.org) document, in its language.

## Addresses

Everything the site publishes is under
`https://saud-alnasser.github.io/saud-alnasser/`:

| Path | What |
| --- | --- |
| `/en/`, `/ar/` | the site, in each language |
| `/en/cv/`, `/ar/cv/` | the CV page, printable |
| `/cv.en.pdf`, `/cv.ar.pdf` | the CV as a PDF, rendered at build time |
| `/en/resume.json`, `/ar/resume.json` | the CV as a JSON Resume document |
| `/sitemap.xml`, `/robots.txt` | for crawlers; the sitemap is also linked from every page |

## Development

```sh
pnpm install
pnpm dev          # local server
pnpm check        # type and template checks
pnpm build        # writes dist/
pnpm render:pdf   # writes dist/cv.en.pdf and dist/cv.ar.pdf (needs Playwright's Chromium)
pnpm check:dist   # the checks CI runs over dist/
pnpm test         # the Playwright tests, against a static server of dist/
pnpm test:content # adds a temporary project, rebuilds, and checks it shows everywhere
pnpm lighthouse   # Lighthouse on the home and CV pages, mobile profile
pnpm scan:history # the identifier scan over the whole git history
```

Node 22.12 or later (CI uses 24) and pnpm 12. The site is static files only.

## Deployment

GitHub Pages serves this repository as a project site, under the repository's
name, at `https://saud-alnasser.github.io/saud-alnasser/`. That base path is
`base` in `astro.config.mjs`, and every path the site publishes is joined
to it through `src/lib/paths.ts`; the dist checks fail a page that links
outside it. A push to `main` runs `.github/workflows/deploy.yml`, which
builds the site, renders the PDFs, runs the checks, and deploys `dist/`
through the Pages actions. The repository's Pages source is set to GitHub
Actions, once, in the repository settings. Nothing else is configured
anywhere: no custom domain, no server, no paid service. A custom domain, if
one is ever added, sets `base` to `/` and changes nothing else.

## Content

Every fact the site or the CV shows lives under `src/content/`, and nowhere
else. Adding a project, a course, or a job means adding one YAML file to the
right folder and nothing else: the pages, the CV page, the PDF, and the JSON
Resume document are all generated from these files. The build refuses a file
that does not fit the contract below and names the file and the field.

The contract itself is `src/content.config.ts`. This section describes it for
people; where the two disagree, the code is right and this section is corrected.

### Conventions

- **Per-language text.** A field marked *per language* is a map with an `en`
  key, required, and an `ar` key, optional. A missing `ar` renders the English
  text and the build lists the gap.

  ```yaml
  summary:
    en: A short description.
    ar: وصف قصير.
  ```

- **Everything else is written once.** Dates, links, technology names, status
  values, and email addresses are the same in both languages, so they carry no
  language map.
- **Dates** are `YYYY`, `YYYY-MM`, or `YYYY-MM-DD`, quoted or not. This is
  the JSON Resume date form, so a date accepted here is accepted there. A
  `period` is `start` and an optional `end`; no `end` means ongoing.
- **Links** are full URLs. To leave a link out, omit the key; an empty string
  is refused.
- **Unknown keys are refused**, so a misspelt field fails the build rather
  than silently vanishing.
- **Never** a national identifier, a student identifier, or a phone number,
  in any file.
- The name prefix `fixture-` is reserved: the content mechanism test writes a
  temporary entry with it and removes it again. A file carrying that prefix
  in the tree is a leftover to delete, never content.

### `profile.yaml`

One file, `src/content/profile.yaml`, with a single top-level key `profile:`
holding the person.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | yes | the name as it should appear |
| `label` | text | yes | one line saying what Saud does, such as "Software developer" |
| `summary` | text | yes | two or three sentences for the top of the site and the CV |
| `email` | email address | no | the public contact address |
| `location` | text | yes | city and country |
| `profiles` | list | no | public profiles; each has `network` (such as GitHub), `username`, and `url`. May be empty |

### `projects/`

One file per project.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | no | the project's name, a proper noun |
| `period` | `start`, optional `end` | no | when the work happened |
| `role` | text | yes | Saud's role, such as "Sole developer" |
| `summary` | text | yes | what the project is, in a sentence or two |
| `technologies` | list of text | no | languages, frameworks, and tools used |
| `links` | `repository`, `live` | no | optional. Either key may be absent; omit `links` entirely for a project with no public link |
| `visibility` | one of `public`, `described`, `hidden` | no | `public` shows the entry with its links; `described` shows the name and summary without links, for private work; `hidden` keeps the file but shows nothing anywhere |
| `order` | whole number | no | optional. Lower numbers sort first; entries without one sort by `period.start`, newest first |

### `experience/`

One file per job or placement.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `organisation` | text | yes | the employer or host |
| `position` | text | yes | the title held |
| `location` | text | yes | city and country |
| `period` | `start`, optional `end` | no | when |
| `summary` | text | yes | what the work was |
| `highlights` | list of text | yes, each item | notable things done. May be empty |
| `kind` | one of `employment`, `training` | no | `training` marks a practical training placement rather than a job |

### `education/`

One file per institution attended. The education page is one timeline in
order of time: institutions by `period.start` and certificates by `date`,
together, so high school comes first, the online courses next, and university
last. A certificate with no `date` is placed just before the most recent
institution, in the online-courses phase; give it a `date` to place it
exactly. The CV page keeps separate Education and Certifications sections.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `institution` | text | yes | the school or university |
| `area` | text | yes | the field, such as "Computer science" |
| `studyType` | text | yes | the qualification, such as "Bachelor of Science" or "High school diploma" |
| `period` | `start`, optional `end` | no | when; `end` is the completion term where course work is finished |
| `status` | one of `completed`, `certificate-pending`, `in-progress` | no | shown as it is. `certificate-pending` means the course work is complete and the certificate has not been issued; the site never says "graduated" or "awarded" for it |
| `courses` | list of text | yes, each item | optional. Notable courses |

### `certificates/`

One file per certificate, including online course completions.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | yes | the certificate or course title |
| `issuer` | text | no | who issued it, such as "Code with Mosh" |
| `date` | date | no | optional. When it was issued |
| `url` | URL | no | optional. Where it can be verified |

### `skills/`

One file per skill group.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | yes | the group, such as "Web development" |
| `keywords` | list of text | no | the concrete items in the group |
| `level` | text | yes | optional. How well, such as "Working knowledge" |
| `order` | whole number | no | optional. Lower numbers sort first |

### Adding a project, step by step

1. Copy any file in `src/content/projects/` to a new name, `my-project.yaml`.
2. Fill in every field. Leave `links` out if the work is private and set
   `visibility: described`.
3. Run `pnpm build`. If it fails, the message names the file and the field.
4. Commit. Nothing outside `src/content/` changes.
