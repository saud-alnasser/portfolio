---
status: implemented
priority: high
---

# Problem

Saud's professional record has no single public home. The work lives in 22 GitHub repositories, nine of them private; the studies live in a Google Drive folder of certificates, term folders, and reports; the GitHub profile still shows the unedited README template. Every application means assembling a CV by hand from those places, and every CV assembled that way drifts from the last one. There is nowhere to send a recruiter, a collaborator, or an automated screening system that shows the whole of it, and nothing that will still be accurate in five years without being rewritten.

# Goal

One website, at a GitHub-hosted address that costs nothing, is the record of Saud's work life and studies. A CV is derived from the same content rather than written beside it, in a form a person can read and print and in a form a resume parser can consume. Keeping it current means editing content, never layout code, so the site is still the record years from now.

# Scope

- The site: identity, work (projects and employment, including the practical training placement), studies (high school, online courses, university, in that order of time), certifications, skills, and how to get in touch.
- The content source: one structured place in this repository from which every page and every CV output is generated.
- The CV: a human-readable, printable document and a machine-readable document, both generated from the content source.
- Hosting and deployment on GitHub's free infrastructure, from this repository.
- First content: the material inventoried in [[efforts/1-portfolio-site/evidence/research/source-material-inventory]], as far as it goes.
- The profile page: the repository README, which GitHub shows at `github.com/saud-alnasser` because the repository carries his username, opens as Saud's profile and points at the site.

# Requirements

1. **One source of content.** Every fact the site or the CV shows comes from one structured content source in this repository. No fact is written by hand in two places.
2. **The sections.** The site presents, at minimum: who Saud is, work (projects and experience), education, certifications and courses, skills, and contact. Education is ordered in time: high school, then online courses, then university.
3. **Projects.** A project entry carries a name, a period, Saud's role, a short summary, the technologies used, and optionally links. A project can be shown without a public link, so private work can be described without being exposed.
4. **Truthful academic status.** An education entry carries a status, and the site shows it as it is. The Saudi Electronic University degree reads as course work completed with the certificate pending until the certificate exists; nothing on the site claims an awarded degree before then.
5. **A CV a person reads.** A CV is generated from the content source in each language, laid out so that resume parsers handle it: one column, standard section headings, real text rather than images, no tables carrying content. It prints cleanly to A4 and Letter, and the CV page offers it as a PDF download in the language the visitor is reading.
6. **A CV a machine reads.** The same content is published at a stable address in an open, documented resume schema, so that tools that accept structured input can consume it without scraping the pages. The CV page offers it as a download beside the PDF, in the language the visitor is reading. [[efforts/1-portfolio-site/evidence/research/ats-parsing-and-resume-schemas]] found that no applicant tracking system documents accepting such a schema from a candidate, so the screening path is the PDF from requirement 5 and this output serves everything else: resume renderers, converters, and whoever wants the data.
7. **Minimal, professional, fast.** The visual design is content-first: a restrained palette, one typeface family or the system stack, no decorative imagery, generous whitespace. Motion is subtle, used for transitions and reveals rather than decoration, and switched off for visitors who ask for reduced motion. It is legible and responsive on a phone, a tablet, a desktop, and on paper, and it loads fast on a mobile connection. It meets basic accessibility: sufficient contrast, semantic headings, keyboard-reachable navigation, images with alternative text.
8. **Free hosting from this repository.** The site is served from GitHub's free hosting for a public repository, deployed automatically when a change lands on `main`. No paid service is in the path, and nothing runs on a server.
9. **Maintainable for years.** Adding a project, a course, or a job means adding to the content source and nothing else. The content format is documented in the repository so that Saud, or an agent working for him, can extend it without reading the site's code.
10. **Findable.** Every page carries a title, a description, and social preview metadata; the site publishes a sitemap and permits indexing.
11. **First content.** The site launches with the inventoried material: the projects Saud chooses to show, the practical training at Al Othaim Markets, the Saudi Electronic University degree with its status, the online course certificates, and high school once its details are supplied.
12. **Privacy.** No national identifier, student identifier, or phone number appears in the repository or on the site. Public contact is an email address and the GitHub profile, plus any profile Saud chooses to add.
13. **Two languages.** The site is published in English and Arabic. Every page exists in both, Arabic renders right to left, and a switch on every page leads to the same page in the other language. Both CV outputs exist per language. Text is authored per language; every other fact (a date, a link, a technology, a status) is authored once.
14. **Light and dark.** The site has a light and a dark theme. It follows the visitor's system preference by default, a control on every page overrides it, and the choice persists in that browser. The printed CV is always light.
15. **One repository, one place.** The repository is `saud-alnasser/saud-alnasser`, whose README GitHub shows as the profile page. The README opens as that profile, who Saud is and where the site and the CV are, and keeps the content documentation of requirement 9 below it. The site is served from the same repository, at the project-site address that name gives it, and every address it publishes is under that base. The README is the profile page and nothing else: a greeting, who Saud is, the portfolio and CV links, the contact, and what he works with, in the plain emoji style GitHub profile READMEs use, as Saud asked on 2026-09-09; that style is a declared deviation from the reporting policy's prohibition on decorative emoji and reaches no other text. The site's own documentation lives beside the code, in `docs/` and in `src/content/README.md`, which is the README requirement 9 and criterion 9 name.

# Acceptance Criteria

1. Changing one value in the content source changes it everywhere it appears, on the site and in both CV outputs, with no second edit. Searching the repository for a fact shown on the site finds it in exactly one authored place.
2. Each named section exists and is reachable from the site's navigation. The education section lists entries in chronological order with high school first and university last.
3. A project entry with no link renders without a broken or empty link, and a project with a repository link renders it. Each project shows its name, period, role, summary, and technologies.
4. The education entry for Saudi Electronic University renders with its status visible, and changing the status value in the content source changes the rendered wording. No page contains the words "graduated" or "awarded" for an entry whose status is pending.
5. The CV page, in each language, renders as a single column with the standard headings (summary, experience, education, skills, certifications) and none of the hazards the evidence lists: no images, no tables, no text boxes, no header or footer carrying contact details, no columns. Printing it from a browser to A4 and to Letter produces a document with no clipped text. Extracting the text of a PDF saved from it (with `pdftotext` or equivalent) yields the name, the email, every employer with its title and dates, and every institution with its degree and dates, each on its own line and in reading order. The extraction check applies to the English PDF; the Arabic PDF is checked by eye on the printed page, because right-to-left text extraction is not reliable enough to assert on.
6. A request to the machine-readable address returns a document that validates against the schema the plan names (the evidence points at JSON Resume 1.3.1 as the only open, maintained candidate), and it contains every entry the human CV shows.
7. The site scores at least 90 on Lighthouse performance, accessibility, and best practices for the home page and the CV page, on the mobile profile; every text and background pair meets WCAG AA contrast; navigation works with the keyboard alone; the layout has no horizontal scrolling at 360 pixels wide and no wasted width at 1440; with `prefers-reduced-motion: reduce` no element animates.
8. Merging a change to `main` publishes the site at its GitHub Pages address without any manual step, and the repository shows no paid dependency or hosted service. The site works with no server-side code.
9. Adding a new project to the content source and merging it results in the project appearing on the site and in both CV outputs, with no change to any file outside the content source. A README in the repository documents the content format and the fields each entry type accepts.
10. Every page has a unique title and a description; the home page carries Open Graph metadata; `/sitemap.xml` lists every page; `robots.txt` does not disallow indexing.
11. The published site shows the entries listed under requirement 11, and each is consistent with the inventory evidence.
12. A search of the repository history and the published site for the patterns of a Saudi national ID, an SEU student ID, and a phone number finds nothing.
13. Every route has an English and an Arabic counterpart. The Arabic pages carry `lang="ar"` and `dir="rtl"` on the root element, and the English pages `lang="en"`. The language switch on any page links to the same page in the other language. The machine-readable CV exists at one address per language. An entry whose Arabic text is missing renders its English text rather than a blank, and a build-time report lists every such gap.
14. With the system preference set to dark and no override stored, the page renders the dark palette; the control switches it and a reload keeps the choice; both palettes meet the contrast criterion in 7; printing the CV yields the light palette whatever the screen shows.
15. `https://github.com/saud-alnasser` shows the README, whose first section names Saud, links the site and the CV page, and says the repository is the site's source. Every address the site publishes, in its pages, its sitemaps, `robots.txt`, and the JSON Resume documents, is under `https://saud-alnasser.github.io/saud-alnasser/`. The README carries no build, deployment, or content-format documentation beyond a pointer to where it lives.

# Constraints

- **Free, forever.** No paid service anywhere in the path, because the site must outlive any subscription. Hosting is GitHub's free tier for a public repository (GitHub Pages), which also means static output only: no server-side code, no database.
- **Static output is portable.** Whatever builds the site must produce plain files that could be served from any static host, so a change in GitHub's free tier does not take the record with it.
- **Truthful.** The site never states more than the evidence supports (requirement 4). This constraint exists because an overstated academic claim on a hiring document is a reason for dismissal, not a typo.
- **Stacked changes through Graphite** land the work, as [[rules/version-control]] states.
- **Two languages, one set of facts.** Arabic and English are both first-class (requirement 13). Any text a visitor reads is authored per language; anything else is authored once, so a date can never disagree between the two versions.
- **No tracking.** No analytics or third-party scripts that profile visitors, because the site is a record, and because free-tier analytics change terms.

# Out of Scope

- **The King Saud University period.** Saud asked for it to be left out. The education timeline runs high school, online courses, Saudi Electronic University.
- **Qiyas test results.** The GAT and SAAT printouts sit beside the studies but are pre-university admissions scores and carry the national ID. They are not portfolio material.
- **A blog or writing section.** The site is a record of work and study; writing is a separate product with its own upkeep.
- **Live data from GitHub at page load.** Project content is committed, not fetched from the GitHub API when the page loads. A fetch at load depends on rate limits and a token and makes the page's content something the repository does not hold, which breaks requirement 1.
- **A contact form.** Needs a backend or a paid form service; an email address does the job.
- **A content management interface.** Editing is through the repository. A web editor is a second write path to the content source.
- **A DOCX output.** PDF is accepted by every applicant tracking system and parser the evidence covers, and JSON Resume tooling can convert the structured output if a DOCX is ever demanded.
- **A custom domain.** The GitHub Pages address is enough for the first version, and a domain is a paid, renewing dependency. The site must not break if one is added later.
- **Populating every repository.** Which projects appear is Saud's editorial choice, not an export of the account.

# Assumptions

- "Hosted for free based on my GitHub" means GitHub Pages serving this repository. On 2026-09-08 that was read as the user-site address `saud-alnasser.github.io`, which needs a repository of that name. On 2026-09-09 Saud renamed the repository `saud-alnasser` instead and chose to keep it, so the site is a project site at `https://saud-alnasser.github.io/saud-alnasser/` (requirement 15); [[efforts/1-portfolio-site/evidence/research/repository-name-and-base-path]] records what that changes. [[efforts/1-portfolio-site/evidence/research/github-pages-free-hosting]] establishes that Pages is free for a public repository and that any static site generator can build it through GitHub Actions.
- Saud writes or reviews every Arabic text, because the CV is a hiring document in both languages. An agent may draft a translation. First read as: nothing Arabic is published before he reads it. On 2026-09-09 Saud chose to read the Arabic on the published site instead, because he cannot review it before the effort merges, and to carry any correction as a later effort; until that reading the Arabic pages and the Arabic CV are a draft an agent wrote.
- Private repositories may be described publicly by name and summary, without a link. The evidence marks which are private; Saud decides per project when the content is authored.
- The public contact is an email address chosen for this purpose, and the phone number stays off the site.
- Saudi Electronic University course work is complete as of the 2025-2026 summer term, per the study folder and Saud's statement, and the certificate has not been issued.
- The practical training at Al Othaim Markets is the only employment-type entry to date. Nothing in the sources shows another job.
- The content source will be edited by Saud and by agents, in this repository, for years. Its format is therefore plain text under version control rather than a hosted store.

# Open Questions

- **High school.** The Drive folder is empty. The school's name and the years attended are needed before that entry can be authored.
- **Which private projects to show.** Candidates: mudaraj, nexuscord, nova-lang, screeps, etg, discord-trengo-integration, and the two course projects. Shown by name and summary, linked, or omitted, per project.
- **Practical training dates.** The report is dated 2026-09-08 and names the summer term, but not the start and end dates.
- **Other profiles.** Whether a LinkedIn or other profile should appear beside GitHub in contact.
- **A photograph.** Whether the site and the CV carry a portrait. The CV layout for parsers is better without one; the site is a separate decision.

# Risks

- **The record drifts from reality.** The site says one thing, the latest CV another. One content source and a low cost of editing are the mitigation; the risk returns if editing ever requires touching code.
- **Parsers disagree.** A layout one applicant tracking system reads cleanly can confuse another. Mitigated by keeping the human CV as plain as the evidence recommends and by publishing the structured form beside it.
- **The free tier changes.** GitHub Pages has been free for public repositories for over a decade, but the site must be plain static files so it can move.
- **Overclaiming.** A status field that is easy to forget is a risk in the other direction: the certificate arrives and the site still says pending. Acceptable, because understating is recoverable and overstating is not.
