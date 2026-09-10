---
status: draft
---

# Problem

The site built across [[efforts/1-portfolio-site/spec]], [[efforts/3-site-redesign/spec]] and [[efforts/5-sections-and-resume/spec]] publishes two documents and every contact detail Saud has.

- **The document pages open with a row of sentences.** `src/pages/[locale]/cv.astro` offers "Download PDF", "Download JSON Resume" and "View the resume" as underlined links; `src/pages/[locale]/resume.astro` offers two of the three. The set differs between the two pages for no reason a reader can see, and the row reads as prose in a page whose header controls are icons. Saud asked on 2026-09-10 for one download control per page, as an icon.
- **The email is on every page of a public site, and in the README GitHub renders on his profile.** It is in the footer of every page (`src/layouts/Base.astro:231`), in the home page's contact actions (`src/pages/[locale]/index.astro:36`), on both document pages, in the README's profile block (`scripts/readme-profile.mjs:64`), and in `basics.email` of both JSON Resume documents. Saud does not want it published, and he does not want the phone number a Saudi employer will ask for published either.
- **There is no phone number anywhere, so a recruiter cannot call.** The contact line is email, location and GitHub. `src/content/profile.yaml` has no phone field and no nationality field.
- **The resume does not carry what this market screens on.** The research in `evidence/research/saudi-resume-conventions.md` establishes that nationality is the one personal field the Saudi market's gates turn on: every programme and employer track read on 2026-09-10 states "Saudi national" as an eligibility condition, and it is the one attribute the Ministry of Human Resources and Social Development's 23 March 2025 controls leave out of the list an employer may not discriminate on. The resume carries no nationality.
- **The strongest project in the record is not on the resume.** Mudaraj, the senior project built by a team of six, is `status: completed` and carries no resume marker. It is the one piece of team-built, shipped software Saud has, it is named in his profile summary, and the resume instead carries two solo projects.

# Goal

Each document page opens with a single icon: download this document. The site publishes no email and no phone number, anywhere, and neither does the README. A reader who wants a document with contact details on it types them into a form at the point of downloading, and gets a document that carries what they typed. The published files carry no contact details at all. Both documents gain a nationality line, the resume carries the three projects worth putting in front of an employer, and every guarantee the three prior efforts made still holds: one content source, two languages, two themes, parser-safe documents, and the quality gates.

# Scope

- The actions row on both document pages: what it holds, and what it looks like.
- Where the email may appear: the layout footer, the home page's contact actions, both document pages, both JSON Resume documents, and the README's profile block.
- The download path for both documents in both languages: the form, what it collects, and what the document it produces carries.
- The content contract and the content: a nationality field, the removal of the email from what the site renders, and the resume marker on one more project.
- The tests, the dist checks, the PDF render step, and the content documentation, updated to what the new shape guarantees.

# Requirements

1. **One control per document page, and it is an icon.** The CV page and the resume page each open with a single control that downloads that page's own document. It carries an icon and no visible text, it names itself for assistive technology and on hover, and it is the only thing in that row. The JSON Resume link and the link to the other document leave both pages; the header navigation already carries both documents (`src/layouts/Base.astro:44`), which is how a reader moves between them.
2. **The site publishes no contact details.** No page of the built site, no published PDF, no JSON Resume document, and no line of the README contains Saud's email address or any phone number. This includes the layout footer, the home page's contact actions, and the contact line of both document pages.
3. **The download collects contact details and the document carries them.** Activating the download control on either document page presents a form asking for an email address and a phone number. The document it produces carries exactly what was typed, in the contact line of the document, in the same position the email occupies today. Neither value is stored on a server, sent anywhere, or written into the repository.
4. **A reader who supplies nothing still gets a document.** Where the form is dismissed, or where the browser runs no script, the reader gets the published document, which carries no contact details. Nothing about the site requires script to reach either document or its published PDF.
5. **Both documents carry a nationality.** The CV page, the resume page, and both published PDFs show a nationality, authored in the content source. It does not appear on the home page, in the README, or in either JSON Resume document.
6. **The resume carries the three projects an application needs.** Mudaraj, rentable and cachescribe, each marked in the content source as the resume marker already works. Which projects the resume shows stays a fact on each entry, never a second list.
7. **Both documents stay parser-safe, and the resume stays within its budget.** Whatever the download produces is one column of real text in reading order, with standard headings, no table carrying content, no image, and no positioned header or footer, exactly as the published PDFs are today. The resume runs to at most two pages on A4 and on Letter in both languages.
8. **Both languages, both themes, and the gates.** Every new control, string and form field exists in English and Arabic, renders in both themes and both directions, and the Lighthouse, contrast, reduced-motion, keyboard and no-script criteria of the prior efforts still pass.
9. **The content format is documented.** `src/content/README.md` describes the nationality field and says plainly that the email in the content source is not rendered by the site, so that a later reader does not add it back.

# Acceptance Criteria

1. Each document page contains exactly one element in its actions row. It is a link or a button whose visible content is an icon, whose accessible name says which document it downloads, and which resolves to that page's own PDF. Neither page contains a link to `resume.json` or to the other document's page. The header navigation on both pages still links to the CV and to the resume.
2. Searching every file under `dist/`, both `resume.json` documents, both rendered PDFs and `README.md` for the string `saud4services@gmail.com`, for `mailto:`, and for any sequence matching a phone number finds nothing. `pnpm readme --check` passes with the email absent from the profile block.
3. On either document page, activating the download control and entering an email address and a phone number produces a document whose contact line contains both, in reading order, at the position the email occupies today. Entering one and not the other produces a document carrying the one. The values appear in no network request the page makes.
4. With JavaScript disabled, both document pages render in full and the published PDF for each is reachable and downloadable, and neither PDF contains a contact detail. Dismissing the form on a page with script produces the same published document.
5. The English and Arabic CV pages, the resume pages, and all four rendered PDFs show the nationality as authored. The home page, the README's profile block, and both JSON Resume documents do not contain it.
6. The resume page in each language shows Mudaraj, rentable and cachescribe and no other project. Removing the marker from any one of them removes it from the resume with no other edit, and the projects section of the site and the CV are unchanged by the marker.
7. The resume page has no `<table>`, no `<img>`, and no fixed or absolute positioned element carrying content. The extraction check runs over both rendered PDFs and over a document produced through the form, and finds the name, every experience entry's position, period and organisation, and every education entry's degree, period and institution, in reading order, and fails on a missing line. The rendered resume PDF has no more than two pages in each language at each paper, and the render step and the dist check both fail if it has more.
8. Every new string exists in both languages in `src/lib/i18n.ts` and the build's gap report does not grow. Lighthouse reports at least 90 on the three categories for the home, CV and resume pages in both languages on the mobile profile. The form is reachable and completable by keyboard alone, its fields are labelled, and it respects reduced motion and both themes. The layout, contrast, theme and keyboard tests pass with their expectations updated.
9. `src/content/README.md` documents the nationality field and the fact that the email is not rendered, and the content mechanism test still passes.

# Constraints

- **Everything the three prior efforts constrain still binds:** free static hosting, one content source, truthful academic status, two languages with one set of facts, no tracking, no external request, progressive script, stacked changes through Graphite.
- **This is a static site on a public repository, so privacy comes from absence, not from access control.** There is no server to hand one file to one person and a different file to another, and `src/content/` is readable by anyone on GitHub. The only thing that keeps a value private is that it is never committed and never built into a published file. Any design that stores the phone number in the repository, in the build, or in a published PDF fails this requirement no matter how hard the address is to guess.
- **The published documents remain the fallback, and they remain checkable.** The build still renders a PDF per document per language, and the page-count and extraction checks still run over them. Their contact line is what changes, not their existence: a check that has nothing to run over is a guarantee that quietly left.
- **The type size and the template do not bend.** The white and blue template stays for both documents, at the size it reads at now, as [[efforts/5-sections-and-resume/spec]] fixed. Removing the email frees a fragment of one line and buys nothing that may be spent on smaller text.
- **The document is a hiring document, so what it claims must be true.** The nationality is authored as a fact, and a project marked for the resume is finished. This is the constraint under which Mudaraj qualifies and ETG does not.

# Out of Scope

- **Changing the resume's section order.** Put to Saud on 2026-09-10 with the evidence, and he chose to keep experience before education as it is today. The research could not settle the order: Bayt's own template leads with experience and tells a candidate with no employment to fill that section with internships, while the one Saudi university guide reachable lists education first with nothing Saudi in its text. Nothing here changes the order of any section in either document.
- **Any other personal field.** No date of birth, marital status, gender, photograph, national ID or Iqama number. The research found date of birth and marital status asked for by Bayt's profile builder but absent from Bayt's own CV template, gender and marital status now restricted as bases for discrimination by the March 2025 controls, and no Saudi employer portal observed asking for any of them at the point of applying. A national ID is demanded as a document copy after a process has started, never as a line on a CV.
- **A GPA.** Put to Saud on 2026-09-10 with the finding that Aramco, stc and Petro Rabigh each publish a numeric floor, and not chosen. The education entry gains no GPA field, and nothing here depends on one existing later.
- **A contact form, a mail relay, or any means of reaching Saud from the site.** The site is losing its contact channel, deliberately. Adding a form that sends a message needs a server or a third-party endpoint, which the no-external-request constraint forbids.
- **A phone number in the content source.** It is not authored, not committed, and not gitignored-and-read-at-build. It exists only in what a reader types into the form.
- **New content.** No project, job, course or credential is added. ETG stays `in-progress` and appears nowhere.
- **A different CV template, a DOCX output, a blog, a custom domain, live GitHub data**, which the first effort already excludes.
- **A JSON Resume document for the resume.** The machine-readable output follows the CV, as [[efforts/5-sections-and-resume/spec]] fixed.
- **Reviewing the Arabic.** New Arabic strings are drafts until Saud reads them on the published site.

# Assumptions

- **The published PDFs keep their addresses and lose only their contact line.** `cv.<locale>.pdf` and `resume.<locale>.pdf` are still written by the render step and still checked. A document produced through the form is a second thing, produced in the reader's browser, and never published.
- **The JSON Resume documents drop `basics.email` and gain nothing.** They are published files on the website, so requirement 2 reaches them. Nothing else about the mapping in `src/lib/resume.ts` changes.
- **The nationality is authored as "Saudi" in English and the Arabic equivalent**, on the profile entry, since it describes the person rather than any one document.
- **The resume's project set is Mudaraj, rentable and cachescribe.** Saud delegated this choice on 2026-09-10, asking for the best set for a job application. The three carry distinct signals: a system delivered by a team of six under Scrum, a recent solo desktop application, and a package published to a public registry. Mudaraj is the addition, and the reason it earns the place is that it is the only evidence of shipping with other people, which is what a fresh-graduate screen looks for. Each is one field, and Saud changes the set by editing an entry. **If the page budget refuses three, cachescribe is the one to drop**, because the CV keeps it whole and it is the oldest of the three.
- **The form is the reader's, and the site remembers nothing about it on a server.** Whether the browser remembers what was typed between visits is a detail for [[skills/plan]], not a promise made here.
- **The email stays in `src/content/profile.yaml`.** It is a fact about Saud and other outputs may want it later; requirement 2 is about what the site renders, not about what the content source holds. Requirement 9 exists so that this does not read as an oversight to whoever arrives next.

# Open Questions

None that prose can settle. How the browser produces a document carrying typed contact details, and whether that document can keep the parser-safe guarantees and the page budget the published PDFs are checked against, is the technical question this effort turns on, and it is [[skills/plan]]'s to answer.

# Risks

- **The site loses its only contact channel.** A recruiter who finds the portfolio has no way to reach Saud from it except GitHub. That is the direct consequence of requirement 2, chosen on 2026-09-10 with the alternative on the table. It shows up as an application that never arrives, which is not something the build can check.
- **A public page that generates a document in someone else's name is an impersonation surface.** Once the form ships, anyone can produce a document that looks like Saud's CV carrying a phone number and an email that are not his. The published PDFs, which carry no contact details at all, are the only copies with any authority. This is worth deciding about in [[skills/plan]] rather than discovering later.
- **The extraction check loses the email, which was one of its anchors.** Criterion 11 of [[efforts/5-sections-and-resume/spec]] asserts the name and the email in reading order in the PDF. The email is going, so the check keeps one fewer fact and gets weaker. Requirement 7 answers this by running the check over a form-produced document as well, which is the only place the contact line still exists.
- **A browser-produced document may not be the document.** The published PDFs are rendered by the same engine every time, on the runner, and are checked there. A document produced in a reader's browser is produced by whatever that browser does, and the page-count evidence from [[efforts/5-sections-and-resume/spec]] is that the same document takes one page under the fonts Windows resolves and two under the runner's. Whatever the plan chooses has to say what is guaranteed about the produced document and what is not.
- **The page budget is tight and the third project spends it.** Adding Mudaraj adds an entry to the resume's projects block against a two-page budget that CI, not a developer's machine, decides. The render step and the dist check are what say whether it fits, and the assumption above names what to drop if it does not.
