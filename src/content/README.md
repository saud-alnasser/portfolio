# Content

Every fact the site or the CV shows lives under `src/content/`, and nowhere
else. Adding a project, a course, or a job means adding one YAML file to the
right folder and nothing else: the pages, the CV page, the PDF, and the JSON
Resume document are all generated from these files. The build refuses a file
that does not fit the contract below and names the file and the field.

The contract itself is `src/content.config.ts`. This file describes it for
people; where the two disagree, the code is right and this file is corrected.

## Conventions

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

## `profile.yaml`

One file, `src/content/profile.yaml`, with a single top-level key `profile:`
holding the person. The profile block of the repository's `README.md`,
between the `<!-- profile -->` markers, is written from `summary` here by
`pnpm readme`, under links to the site, the CV, and the resume in both
languages, so who Saud is stays authored once; the dist check fails when the
README is behind. The record itself — the skills, the projects, the rest —
is on the site, and the README links to it rather than repeating it.

**There are two summaries, because there are two documents.** Each names only
the work its own document prints as an entry, which is what one field could
not do once the CV and the resume stopped carrying the same projects. Which
document reads which is decided in one place, in
`src/components/CvDocument.astro`, and the reason they differ is recorded in
the comment above them in `profile.yaml`. Editing one does not change the
other, so check which document you mean first.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | yes | the name as it should appear |
| `label` | text | yes | one line saying what Saud does, such as "Software developer" |
| `summary` | text | yes | two or three sentences introducing Saud, read by the top of the site, the CV, the README profile block, and both JSON Resume documents. The resume does not read it |
| `resumeSummary` | text | yes | the same, for the short resume alone, which reads this in place of `summary`. Two or three sentences naming only what the resume itself prints. Its length is measured rather than assumed, because the resume has one page to fit: see the comment above the field |
| `email` | email address | no | Saud's address. Held here and rendered nowhere; see below |
| `nationality` | text | yes | the nationality as a hiring document states it, such as "Saudi". Required, and authored rather than read off `location`: where someone lives and what they hold are two facts |
| `location` | text | yes | city and country |
| `profiles` | list | no | public profiles; each has `network` (such as GitHub), `username`, and `url`. May be empty |

**The email is held here and published nowhere.** No page of the site and no
document it publishes renders the address. Contact details reach a document
one way only: the CV or the resume is opened at the marked address, the
document page's own with `#me` on the end, the download control there opens a
form, and the document that form produces in the browser is the only copy that
carries them. Everywhere else that control downloads the published PDF, which
carries none; `docs/development.md` says why the form is behind an address.
Nothing typed into it is stored, sent, or committed, and the published PDFs
carry no contact detail at all. The field stays because it is a fact about
Saud that another output may want; **it is not missing from the site, and
adding it back to a page, a document, or the JSON Resume output undoes a
deliberate decision.**

## `projects/`

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
| `status` | one of `completed`, `in-progress` | no | whether the work is finished. Only a `completed` project is shown: an `in-progress` one stays in the file and appears in no output, not on the work page, not in the home page's count, not in the CV, the resume, or the JSON Resume document. A project whose state is not known is `in-progress` until it is |
| `resume` | `true` | no | optional. Marks the project for the short resume; absent means it stays off. The CV shows every completed project whatever this says |
| `order` | whole number | no | optional. Lower numbers sort first; entries without one sort by `period.start`, newest first |

Whether a project appears is decided in one place, `src/lib/shown.ts`: not
`hidden`, and `completed`. Every output reads that function, so changing one
field changes every output together.

## `experience/`

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

## `education/`

One file per institution attended. The education page is one timeline in
order of time: the institutions by `period.start`, with one node for the
online-courses phase placed just before the most recent institution, so high
school comes first, the online courses next, and university last. That node
stands for the courses, dated or not: it counts them, runs from the earliest
dated one to the latest, and leads to the courses grid below the timeline,
where the certifications sit under their own heading beside it. The CV page
keeps separate Education, Certifications, and Courses sections.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `institution` | text | yes | the school or university |
| `area` | text | yes | the field, such as "Computer science" |
| `studyType` | text | yes | the qualification, such as "Bachelor of Science" or "High school diploma" |
| `period` | `start`, optional `end` | no | when; `end` is the completion term where course work is finished |
| `status` | one of `completed`, `certificate-pending`, `in-progress` | no | shown as it is. `certificate-pending` means the course work is complete and the certificate has not been issued; the site never says "graduated" or "awarded" for it |
| `courses` | list of text | yes, each item | optional. Notable courses |

## `certificates/`

One file per certificate, including online course completions. The `kind`
field says which of the two an entry is: a **course** is an online course
Saud completed, and its certificate is the proof of completion; a
**certification** is a credential that is not a course, such as an
assessment passed. The site lists the two kinds under their own headings and
the timeline's online-courses node counts the courses; the CV lists both.
Reclassifying an entry means changing this one field.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | yes | the certificate or course title |
| `issuer` | text | no | who issued it, such as "Code with Mosh" |
| `kind` | one of `course`, `certification` | no | a course completion, or a credential that is not one |
| `date` | date | no | optional. When it was issued |
| `url` | URL | no | optional. Where it can be verified |
| `document` | file path | no | optional. The certificate's PDF, relative to this folder, as `files/code-with-mosh-react.pdf`. The build refuses an entry whose PDF or preview does not exist, naming the file |
| `resume` | `true` | no | optional. Marks the entry for the short resume; absent means it stays off. The CV lists every entry whatever this says |

### The certificate documents

A certificate's PDF lives in `certificates/files/`, named after its entry:
the entry `code-with-mosh-react.yaml` names `files/code-with-mosh-react.pdf`.
Beside every PDF sits its preview, `files/code-with-mosh-react.webp`, the
first page rendered 1600 pixels wide; the site shows the preview and links
to the PDF. The previews are generated, and committed with the PDFs:

```sh
pnpm certificates:previews   # renders files/<name>.webp for every files/<name>.pdf
```

Run it after adding or replacing a PDF, and commit what it wrote. The build
checks that both files exist for every entry that names a `document`, so a
PDF added without its preview fails the build until the command has run. A
document is scanned for identifiers before it is published, the same way the
CV PDF is; one that carries a national or student identifier is not added
until it is redacted. A scanned certificate has no text layer for that scan to
read, so such a document is read by eye for identifiers before it is added,
and the dist check reports how many documents it could read.

## `skills/`

One file per skill group.

| Field | Type | Per language | Meaning |
| --- | --- | --- | --- |
| `name` | text | yes | the group, such as "Web development" |
| `keywords` | list of text | no | the concrete items in the group |
| `level` | text | yes | optional. How well, such as "Working knowledge" |
| `order` | whole number | no | optional. Lower numbers sort first |

## Adding a project, step by step

1. Copy any file in `src/content/projects/` to a new name, `my-project.yaml`.
2. Fill in every field. Leave `links` out if the work is private and set
   `visibility: described`. Set `status: completed` only when the work is
   finished; until then it is `in-progress` and appears nowhere. Add
   `resume: true` if the project belongs on the short resume.
3. Run `pnpm build`. If it fails, the message names the file and the field.
4. Commit. Nothing outside `src/content/` changes.
