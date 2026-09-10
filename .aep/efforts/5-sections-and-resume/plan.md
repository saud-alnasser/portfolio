---
use-when: "building a ticket in this effort and the approach is not obvious from the spec"
---

# Architecture

The effort stays inside the shape the first two efforts built: typed YAML collections, Astro components over them, one global stylesheet, one inline script, static output, and the checks over `dist/`. It adds three fields to the content contract, one predicate that every output reads through, one component that renders both documents, one new route per language, one more PDF per language, and a page-count check. Four decisions had more than one reasonable shape; each is settled here with what lost and why. The first was the human's call: Saud chose option B on 2026-09-10 from the table below.

## Where the sections live

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **B. Grouped routes, sections within them** (chosen): `/` holds the hero, the skills, and the section index; `/work/` holds experience then projects; `/education/` holds the studies timeline, the courses, and the certifications; `/cv/` and `/resume/` are the documents | every current address stays, so nothing on the live site or in the sitemap moves; the navigation stays five links (Home, Work, Education, CV, Resume), which fits one row on a phone; the home page is already the section index with counts, and each of its cards links to a section's heading; the tests and Lighthouse lists change by one route | a section is reached through the page that holds it, so criterion 7 is read as "reachable from the navigation, through the page that holds it, and from the home page's section cards", and the spec says so once Saud chooses | none | two page templates change; no new page beyond the resume |
| A. One route per section: `/experience/`, `/projects/`, `/education/`, `/courses/`, `/certifications/`, `/skills/`, `/cv/`, `/resume/` | the most literal reading of "sections"; each page is one grid; the navigation reaches every section directly | nine navigation links, which wrap to three rows at 360 pixels and read as clutter; `/work/` disappears, so an address a recruiter already has answers 404 unless a redirect page is kept; skills leave the home page, where the redesign put them as the fastest read; four more pages per language to test, audit, and list | Lighthouse and the browser suite grow with the page count; a nine-link header needs a different treatment on a phone, which is a design the spec did not ask for | eight page templates where three do |
| C. One long page with anchored sections | one address for everything | 20 project cards, 27 course cards, and the timeline on one page sink the mobile performance score and make the page a scroll rather than a scan, which is the problem the redesign solved; the CV and resume are documents and cannot sit inside it | the Lighthouse gate | rejected outright |

**B was recommended and chosen** because it keeps every address, keeps the header usable, and changes the least, and because the spec's assumption already said the home page stays the index of sections. Criterion 7 of the spec was reworded with the choice. A was recorded so it is not proposed again: its cost is the nine-link header and the moved addresses, not anything in the content.

## How a project says it is finished, and how the outputs agree

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A required `status` field with one predicate in `src/lib/shown.ts`** (chosen): `status: completed \| in-progress` on every project, and `isShown(project)` = `visibility !== 'hidden' && status === 'completed'`, imported by the pages, the resume mapper, the dist check, the content test, and the browser tests | one place decides what is shown, and the scripts and tests already import from `src/lib/` with Node stripping the types, so they read the same predicate rather than a regular expression over the YAML; the status is a fact on the entry, which is what the spec asks | the dist check and the tests today match `visibility: hidden` with a line-anchored regular expression; they move to parsing the file and calling the predicate, which the `yaml` package they already import makes one line | none | one predicate to extend if a third condition ever comes |
| Mark unfinished projects `visibility: hidden` and add no field | no schema change; the filter exists | a project's state and whether it is shown are one field, so the site cannot say "finished, but private" apart from "unfinished"; the spec requires a status the build refuses an entry without | the truthfulness constraint has nothing to key on | rejected because the spec names the field |
| A `status` field checked separately in each output | no new module | five copies of one condition, which is the drift the first effort's requirement 1 exists to prevent | one output forgets the status and shows an unfinished project | five places |

`status` reuses the education vocabulary where it fits: `completed` and `in-progress`. `certificate-pending` has no meaning for a project and is not a value here.

## One document component, two pages

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **`src/components/CvDocument.astro` with a `variant: 'cv' \| 'resume'` prop, and two thin pages** (chosen) | the header, the summary, the experience, the education, and the skills are written once, so the two documents cannot drift in layout; the variant decides which sections render and which entries, in one file the extraction check's expectation can be read against | one component carries two shapes; the branches are section-level and read as a table of what each variant holds | none | one file for both documents |
| Copy `cv.astro` to `resume.astro` and trim | fastest to write | two copies of the template markup, the row and band classes, and the contact line; a print fix lands in one and not the other, which is the drift risk the spec names | the resume falls behind the CV on the first template change | two files |
| Pages pass pre-filtered collections into a dumb component | the component holds no policy | the pages then hold the variant policy each, which is the copy the second option makes one level up; the extraction check still needs to know both shapes | same drift, moved | two files plus the component |

**What each variant holds.** Both: the name, the label, the contact line, the summary, the experience with its highlights, the education, the key skills. The CV: the education's course list, then certifications, then courses, then every shown project. The resume: no course list under education, the skills as one line per group rather than the keyword columns, the projects marked `resume: true`, then the certificates marked `resume: true` where any is. The CV keeps the JSON Resume link; both pages link each other in the actions row, so a reader on either finds the other.

**The resume's size.** It is the same template at a tighter print size: `html` at 10pt under `@media print` on the resume page, with the section bands at `mt-5` instead of `mt-8` and body lines at `leading-6`, all keyed on a `cv-compact` class the resume variant puts on the article. 10pt is what the template's own sample reads at and the smallest the constraint allows. **This was not enough**, and what closes the rest of the gap is the section "Making the resume fit one page" below, written after the first build measured it.

## Counting the resume's pages

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **`pdfjs-dist`, already a devDependency, in the render step and the dist check** (chosen) | runs on every machine with the install, so a two-page resume fails locally and not only in CI; the render step renders the resume a second time to a buffer at Letter and counts that too, so both paper sizes are asserted; `getDocument` needs no canvas for a page count | one more import of a package the preview script already loads | none | none |
| `pdfinfo` from poppler beside `pdftotext` | consistent with the text check | skipped silently where poppler is not on the PATH, which is every developer machine here; the one-page rule would be enforced only in CI | a resume that fits in CI and not on paper is not the risk; a two-page resume nobody sees until the pull request is | none |
| Assert on the page's rendered height in the browser | no PDF parsing | a screen height is not a print page; the print layout is what the PDF is | a false pass | rejected |

## Making the resume fit one page

**Written on 2026-09-10, after the first build measured it.** The section above set the resume at 10pt with the compact bands and said the remaining levers were content. They are not enough, and this is the return-to-plan finding the risks section named, arriving in both languages rather than only Arabic. What was measured, on the built pages, by the implementer at the print column and by the orchestrator by rendering and counting with `pdfjs-dist`:

| | Article at the print column | A4 leaves 1002px | Letter leaves 935px | Pages, A4 and Letter |
| --- | --- | --- | --- | --- |
| `/en/resume/` | 1224px | 222px over | 289px over | 2 and 2 |
| `/ar/resume/` | 1164px | 162px over | 229px over | 2 and 2 |

Letter binds, being 67px shorter than A4. **Cutting every multi-line paragraph in the whole document to a single line recovers 240px in English and 180px in Arabic, which leaves each about 49px short**, so no amount of content trimming reaches one page and the constraint "the content bends to it, not the layout" cannot hold as written. English is the worse of the two, so a per-language reading of the rule, which the risks section offered, does not help either.

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A. The resume gets its own page box and entry spacing** (chosen by Saud on 2026-09-10): `@page` margins of 10mm all round for the resume alone, tighter gaps between entries and under headings, and a project entry that drops its repository and technologies lines on the resume variant only, on top of the content levers | recovers about 439px against the 289px needed, so it clears with room in both languages and leaves headroom for a later entry; keeps both marked projects, every section the spec's requirement 10 names, and 10pt; the CV's page box, spacing, and project entries are untouched, so the record document is exactly as the redesign left it; a wider column also takes out wrapped lines, which is where most of the gain is | the resume is no longer the CV's layout in every particular, so the spec's last constraint is revised rather than met; three separate knobs to keep in one place | a margin narrow enough to fall inside a printer's unprintable border, which 10mm does not on any common desktop printer; the extraction check is the guard, and it already runs over the resume | one more block of compact rules beside the ones that exist |
| B. Cut what the resume shows: drop one of the two marked projects and trim the summaries | no layout change at all, so both documents stay one template; recovers about 305px | the resume then shows one project where Saud fixed the pair, rentable and cachescribe, on 2026-09-10; the spec's assumption would be revised instead of the constraint; nothing is left for a third project later | the next marked entry puts it over again, so the question returns | one field, but the answer is fragile |
| C. Let the resume run to two pages | nothing to build; the break already falls cleanly after the skills, with the projects section moving whole and nothing clipped | a two-page resume is a short CV, which is the distinction the effort exists to draw; the spec's requirement 10 and criterion 10 would both be rewritten | the document stops being the thing that was asked for | none |
| D. Type below 10pt | closes the gap immediately | the spec's constraint forbids it in terms, because a parser and a reader both need the text as it is | illegible print, and a parser that mis-reads it | none |

**A was recommended and chosen.** B and C were put to Saud beside it with their costs; D was named and not proposed, because the constraint rules it out and only Saud could lift it. The gain is budgeted as: the page box about 165px, the entry and heading gaps about 40px, the two dropped lines per project entry about 74px, and the plan's three content levers about 160px. The first three are the resume's alone; the content levers are pulled only as far as the fit needs, and the profile summary among them is ticket 04's text, which is now written and is not re-cut for this.

**What stays fixed.** 10pt is still the floor. The extraction check, the hazard check, and the page count still run over the resume, and the one-page rule of requirement 10 is unchanged: this section is how it is met, not a relaxation of it.

# Components

| Part | Becomes responsible for |
| --- | --- |
| `src/content.config.ts` | `status` on projects (required), `resume` on projects and certificates (optional boolean), `kind` on certificates (required, `course` or `certification`); the vocabularies exported beside the existing ones |
| `src/lib/shown.ts` | `isShown(project)`, the one predicate for a project appearing in any output; `isCourse` and `isCertification` over a certificate's `kind`; `onResume` over an entry's `resume` flag |
| `src/lib/resume.ts` | filters projects through `isShown`; otherwise unchanged, so the JSON Resume document still carries every certificate under `certificates` |
| `src/components/CvDocument.astro` | the whole document for either variant, in the document order the extraction check reads; the `cv-compact` class on the resume variant; on that variant a project entry prints its name, period, role, and summary and drops its repository and technologies lines |
| `src/pages/[locale]/cv.astro` | the CV page: the actions row (PDF, JSON Resume, the resume page) and `<CvDocument variant="cv">` |
| `src/pages/[locale]/resume.astro` | the resume page: the actions row (PDF, the CV page) and `<CvDocument variant="resume">` |
| `src/pages/[locale]/index.astro` | the section index: one `SectionCard` per section (experience, projects, education, courses, certifications, skills) and one per document (CV, resume), with counts from the collections through the predicate; the skills card links to the skills heading on the same page; the contact actions gain the resume beside the CV |
| `src/pages/[locale]/work/index.astro` | experience first, then projects, each under its heading with an id the home page links to |
| `src/pages/[locale]/education/index.astro` | the studies timeline, whose node now counts the courses and links to `#courses`; then the courses grid; then the certifications grid; the one dialog |
| `src/components/Certificate.astro` | unchanged in shape; renders a course or a certification, and carries `data-entry` as `course` or `certification` from the entry's `kind` |
| `src/components/SectionCard.astro` | unchanged |
| `src/layouts/Base.astro` | the navigation gains Resume after CV; nothing else |
| `src/lib/i18n.ts` | the new strings, both languages: `nav.resume`; `sections.courses`, `sections.certifications`; `home.counts.nouns.courses`, `.certifications`, `.skills`; `home.experience`, `.projects`, `.courses`, `.certifications`, `.skills`, `.resume`; `education.onlineCourses.noun` reworded to courses and `.link` to "View the courses"; `cv.courses`, `cv.resumeLink`, `resume.title`, `resume.description`, `resume.cvLink` |
| `src/styles/global.css` | the `cv-compact` print rules: 10pt, the tighter bands, the resume's own `@page` margins at 10mm, and the tighter gaps between entries and under headings |
| `scripts/render-pdf.mjs` | renders `cv` and `resume` per language, writes `resume.<locale>.pdf`, counts the resume's pages at A4 and at Letter and fails past one |
| `scripts/check-dist.mjs` | `jsonResume` and `visibleEntries` read the predicate; `cvPdf` becomes `documentPdfs` over both English PDFs with the same groups; `cvHazards` runs over both pages; a `resumePages` check counts the A4 file's pages; `readmeProfile` unchanged |
| `scripts/readme-profile.mjs` | the CV line carries one link, to `/en/cv/` |
| `scripts/check-live.sh` | asks for `/en/resume/`, `/ar/resume/`, `resume.en.pdf`, `resume.ar.pdf` |
| `scripts/lighthouse.mjs` | audits the two resume pages too |
| `scripts/test-content-mechanism.mjs` | the fixtures carry the new fields and their outputs grow, below |
| `src/content/` | `status` on every project per the spec's table, `resume: true` on rentable and cachescribe, `kind` on every certificate, the profile summary reworded |
| `src/content/README.md`, `docs/development.md` | the three fields; the resume addresses and the page-count rule |
| `tests/` | `pages.ts` gains `/resume/` at the document width; `work.spec.ts` asserts experience before projects; `education.spec.ts` and `certificates.spec.ts` assert the two grids; `home.spec.ts` the eight cards; a new `resume.spec.ts` |

# Interfaces

**The content contract.**

```yaml
# projects/<id>.yaml
status: completed        # required: completed | in-progress
resume: true             # optional; absent means false

# certificates/<id>.yaml
kind: course             # required: course | certification
resume: true             # optional; absent means false
```

The build refuses a project without `status` and a certificate without `kind`, naming the file. `resume` is a boolean with no default written into the document: the JSON Resume mapper does not emit it.

**The predicate.** `src/lib/shown.ts`:

```ts
export function isShown(project: { visibility: Visibility; status: ProjectStatus }): boolean;
export function onResume(entry: { resume?: boolean }): boolean;
export function isCourse(certificate: { kind: CertificateKind }): boolean;
export function isCertification(certificate: { kind: CertificateKind }): boolean;
```

Every `getCollection('projects', ...)` filter in the pages and the mapper becomes `({ data }) => isShown(data)`. The dist check, the content test, and the browser tests parse the YAML with the `yaml` package they already import and call the same function, replacing the `visibility: hidden` regular expression in `check-dist.mjs`, `home.spec.ts`, and `work.spec.ts`.

**The document component.**

```astro
<CvDocument locale={locale} variant="cv" | "resume" />
```

It loads the collections itself, as `cv.astro` does today, so the two pages hold nothing but the actions row and the component. The article carries `class="cv"` and, for the resume, `cv cv-compact`. Document order, which the extraction check reads: name, label, contact line; summary; each experience entry as position and period on one line, then organisation and location, then summary, then bullets; each education entry as degree and area with the period on one line, then institution, then status, then (CV only) the courses; skills; then, for the CV, certifications, courses, and projects; for the resume, projects and any marked certificates.

**The addresses.** `/<locale>/resume/` is the page and `/resume.<locale>.pdf` the file, beside `/<locale>/cv/` and `/cv.<locale>.pdf`. The JSON Resume document stays at `/<locale>/resume.json`; Astro writes `resume/index.html` and `resume.json` side by side without conflict. The two names are close, and the actions rows label each link by what it is, so a reader is never sent to the JSON by a link that says resume.

**The render step.** `render-pdf.mjs` loops over `[{ route: 'cv', file: 'cv' }, { route: 'resume', file: 'resume' }]` per locale. For the resume it renders once more with `format: 'Letter'` to a buffer and counts both with `getDocument({ data }).promise.then((pdf) => pdf.numPages)`, failing with `resume-too-long` naming the locale, the paper, and the count.

**The home page's cards.** `SectionCard` takes what it takes today; the page passes `href` as the section's heading anchor on its page (`/work/#experience`, `/education/#courses`, `/#skills`) and the counts from the filtered collections. The `section` attribute names the section for the tests: `experience`, `projects`, `education`, `courses`, `certifications`, `skills`, `cv`, `resume`.

**The README line.** `- 📄 CV: [read it](<site>/en/cv/)`; the PDF and JSON links leave the generator. The skills block stays.

**Test hooks.** `[data-grid="experience"]` precedes `[data-grid="projects"]` in the work page's document order; `[data-grid="courses"]` and `[data-grid="certifications"]` on the education page; `[data-entry="course"]` and `[data-entry="certification"]` on the cards; `[data-section-card="<section>"]` for the eight home cards; the resume page's article is `article.cv.cv-compact`.

# Data model

Three fields, above. The content lands as:

- `status: completed` on rentable, cachescribe, Mudaraj, PL/0 compiler, CPU scheduling simulator, Personal information form, CourseViewer, advent-of-code, leetcode, learning-rust, monkey-lang, bevy-pong, godot-brackeys-simple-platformer; `status: in-progress` on Nova, nexuscord, ETG, discord-trengo-integration, AEP; screeps keeps its file with `visibility: hidden` and `status: in-progress`.
- `resume: true` on rentable and cachescribe.
- `kind: course` on the 19 Code with Mosh and 7 SoloLearn entries; `kind: certification` on typing-com-advanced-assessment.
- The profile summary, both languages, naming the rent tracker, the persistent cache package, and the senior-project ticketing platform; the ticket writes the sentence and the Arabic draft.

# Technical approach

1. **The contract and the predicate.** The three fields, `src/lib/shown.ts`, the content authored to the table above, the JSON Resume mapper reading the predicate, the dist check and the content test reading it, and the content README. Everything else filters through this, so it lands first and alone. The site builds green at the end of this step with the sections it has today, fewer projects on them.
2. **The sections.** The work page reordered, the education page split into timeline, courses, and certifications, the home page's eight cards and the resume contact action, the navigation, and the strings; the browser tests for the work, education, certificate, and home pages updated. Stacks on 1.
3. **The documents.** `CvDocument.astro`, the two pages, the compact print rules, the render step with the page count, the dist checks over both PDFs and both pages, the Lighthouse and live-check lists, and `tests/resume.spec.ts`. Stacks on 1; independent of 2, except that both touch `i18n.ts` and `index.astro`, which the orchestrator reconciles at integration.
4. **The README and the summary.** The generator's CV line, the summary reworded in both languages, `pnpm readme` run and its result committed, `docs/development.md` updated. Stacks on 1 and gates nothing; small enough to land at any point after it.

Under Graphite each step is a branch on the effort branch; 2, 3, and 4 may proceed in any order once 1 is committed.

# Integration

- `scripts/check-dist.mjs`: `visibleEntries` parses each file and applies `isShown` for projects, so `jsonResume` expects exactly the shown set; `cvPdf` is generalised to both English PDFs; `cvHazards` reads `cv/index.html` and `resume/index.html`; `resumePages` is new; `identifiers` already walks every PDF under `dist/`, the two new ones included; `gaps` skips a project the predicate hides, as it skips a hidden one today.
- `scripts/test-content-mechanism.mjs`: the fixture project carries `status: completed` and `resume: true`, so its outputs are the work page, the CV page, the resume page, and the JSON document in both languages, eight files; the fixture certificate carries `kind: course` and no `resume`, so its outputs are the education page, the CV page, and the JSON document, six files, and the unopenable-card assertion looks for `data-entry="course"`.
- `scripts/lighthouse.mjs`: `/en/resume/` and `/ar/resume/` join the list; `lighthouserc.json` is unchanged.
- `scripts/check-live.sh` and `docs/development.md`: the four resume addresses.
- `.github/workflows/`: unchanged; the render step already runs in both workflows and the page count runs inside it.
- `tests/pages.ts`: `/resume/` at 768; `layout.spec.ts`, `contrast.spec.ts`, `menu.spec.ts`, and `theme.spec.ts` pick it up from the list with no edit. The print test in `theme.spec.ts` gains the resume page.
- `README.md`: rewritten by `pnpm readme` in step 4; the dist check's `readmeProfile` fails between the generator change and that run, which is why the two land in one ticket.
- `package.json`: no new dependency.

# Migration

Every current address stays under option B. The JSON Resume documents change only by losing the unfinished projects. The certificate cards keep their `document` fields and files; only their grid and their `data-entry` value change. `education.onlineCourses` on the timeline changes its wording from certificates to courses and its link from `#certificates` to `#courses`; an inbound link to `#certificates` still lands, on the certifications heading. Under option A, `/work/` becomes a redirect page to `/experience/` through `redirects` in `astro.config.mjs`, joined to the base as the root redirect is.

# Testing strategy

| Criterion | Checked by |
| --- | --- |
| 1 | `pnpm build` refuses a project file without `status`, tried once by hand; `tests/work.spec.ts` and `tests/home.spec.ts` compute their expectations through `isShown`, so a project set to `in-progress` disappears from the page and the count together; `pnpm check:dist` (`jsonResume`) expects the shown set; a grep of `dist/` for an in-progress project's name, done once in the ticket |
| 2 | a grep of `dist/` for "screeps", done in the ticket and recorded in the run log |
| 3 | `pnpm readme --check` inside `pnpm check:dist`; the ticket greps the README, both home pages, and both documents for the names of the in-progress projects |
| 4 | `tests/work.spec.ts` asserts the experience grid precedes the projects grid in document order; `tests/home.spec.ts` asserts the card order; `tests/resume.spec.ts` and the CV test in it assert the section order; the JSON document's key order is fixed in `resume.ts` |
| 5 | `tests/certificates.spec.ts` over `[data-grid="courses"]`: count equals the `kind: course` entries, each documented card opens the dialog as today; `tests/education.spec.ts` asserts the node's count and `#courses` link |
| 6 | `tests/certificates.spec.ts` over `[data-grid="certifications"]`; reclassifying one entry and rebuilding, done once in the ticket |
| 7 | the per-page specs assert grid columns at 360 and 1440 as today; `tests/home.spec.ts` asserts eight cards with counts from the collections and the anchors they link to; `tests/layout.spec.ts` covers the new route |
| 8 | `tests/resume.spec.ts` asserts both pages exist, each links the other and its PDF; `pnpm render:pdf` writes four files; the content mechanism test proves a content change reaches both pages and both PDFs' source pages |
| 9 | `tests/resume.spec.ts` asserts the CV page's sections in order (summary, experience, education, skills, certifications, courses, projects) and that its project count is the shown set; the redesign's `cvHazards` and `cvPdf` checks still run over it |
| 10 | `tests/resume.spec.ts` asserts the resume's sections, that its projects are exactly the `resume: true` set and its certificates the marked set; `pnpm render:pdf` fails past one page at A4 or Letter; `pnpm check:dist` (`resumePages`) fails past one page; A4 and Letter printed from a browser by hand, as the first effort did |
| 11 | `pnpm check:dist` (`cvHazards` over both pages, `documentPdfs` over both English PDFs); a deliberate removal of one expected line to see the resume check fail, recorded in the ticket |
| 12 | `pnpm check:dist` (`jsonResume`), which compares the document's sections with the shown set through the predicate |
| 13 | `pnpm check:dist` (`readmeProfile`); the ticket greps the README for `.pdf` and `resume.json` and expects nothing |
| 14 | `pnpm check` (the `Strings` type refuses a key missing from `ar`); the gap line in `pnpm check:dist`; `pnpm lighthouse` over six pages; `tests/contrast.spec.ts`, `layout.spec.ts`, `theme.spec.ts`, `menu.spec.ts` over the new route; the no-script context in `menu.spec.ts` asserts the resume page's `main` text |
| 15 | `pnpm test:content` with the fixtures carrying the new fields; the content README's diff read in review |

# Operational considerations

`pnpm readme` runs by hand after the summary changes and its result is committed, as today. No new command, no new dependency, no new CI step. The certificate previews are untouched.

# Technical risks

- **The resume does not fit one page. This happened**, on 2026-09-10, in both languages rather than only Arabic: the estimate here was about 45 of 57 available lines in English, and the built document was 61 against 47 available on Letter. The render step and the dist check both refused it on the real document, which is the guard working. It was carried to Saud as the return-to-plan trip-wire and answered by the section "Making the resume fit one page", whose remedy is measured to clear both languages with room. The risk that remains is the ordinary one: a long entry added later puts it over again, and the same two checks catch it.
- **A print margin narrower than the printer's unprintable border.** The resume's own `@page` box is 10mm all round, inside the 6.35mm most desktop printers reserve and well inside what the browsers' own print preview allows. The by-eye check at both papers in both languages is what confirms it, as it did for the CV.
- **`pdftotext -layout` over the resume.** The resume prints the same groups the CV check expects, in the same order, so the amended check should pass unchanged; the skills-as-group-lines block sits after the education groups and outside the expectation. A failure names the line.
- **Two tickets touch `i18n.ts` and `index.astro`.** Steps 2 and 3 both add strings and both add a home card. Serial integration reconciles the seam; the strings are disjoint keys.
- **The `home.spec.ts` count for skills.** The skills card counts skill groups, six today, from the collection; a seventh group changes the count and the card together.
- **The `#certificates` anchor.** The education test today expects `h2#certificates` to be the certificate grid's heading. The certifications grid keeps that id and the courses grid takes `#courses`, so the assertion moves with the heading rather than breaking.
