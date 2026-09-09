---
status: implemented
priority: high
---

# Problem

The site built in [[efforts/1-portfolio-site/spec]] is correct and complete, and it reads as a document rather than a portfolio. Every page is one narrow column of text with a rule between entries: the home page stacks the summary, a contact table, a skills table, and a list of links with nothing to separate one from the next, and the work page runs 19 projects down one column. The two controls in the header, the language switch and the theme control, are words alone, with no icon a visitor recognises at a glance, and the language switch is a single link rather than a control that shows what is available. The 27 course certificates render on the education timeline as a flat list of names and issuers, and none can be opened: the certificate files sit in Google Drive, outside the repository, and no entry carries a link. The CV page uses the site's own column and type, so it does not look like a resume, and it does not resemble the white and blue corporate ATS template Saud chose on 2026-09-09 as the layout he wants.

The cost is the first impression. A recruiter who opens the site sees a plain page and cannot tell in a few seconds what is where; the certificates, which are the bulk of the studies record, cannot be verified from the site at all.

# Goal

The site reads as a modern, minimal, professional portfolio: the content is grouped into cards with a clear hierarchy, the controls are recognisable by their icons, the certificates open on the page when clicked, and the CV page and its PDF follow the chosen template. Everything the first effort guarantees still holds: one content source, two languages, two themes, a parser-safe CV, and the quality gates.

# Scope

- The chrome: the header, its navigation, the language control, the theme control, and the footer.
- The home page, the work page, and the education page: how their entries are grouped and presented.
- The certificate section: the cards, the document each opens, and the documents themselves joining the content source.
- The CV page and the PDF rendered from it: the template's layout.
- The interface strings the new controls need, in both languages.
- The tests and checks that assert on the layout, updated to what the new layout guarantees.

# Requirements

1. **Controls carry icons.** The theme control shows an icon for the theme it switches to (a sun for light, a moon for dark) and the language control shows a language icon. Each icon has an accessible name in the visitor's language; no control is an icon alone to a screen reader.
2. **The language control is a menu.** It opens a list of every language the site is published in, each in its own name and script, with the current one marked, and choosing one leads to the same page in that language. It opens and closes with the keyboard, closes on Escape and on a click outside, and with scripting unavailable it still leads to the other language.
3. **Entries are cards.** A project, an experience entry, an institution, a certificate, and a skill group each render as a card: a bounded surface with consistent spacing and radius, the same in both themes and in both directions. A page that lists entries lays the cards in a grid that is one column on a phone and two or three on a desktop, so that a list of 19 projects is scanned rather than scrolled.
4. **A card shows the essentials and holds the rest.** At a glance a card shows the entry's name, its period or date, and its one-line meta (role, issuer, institution, or organisation), with the summary. A list that would swamp the card, the 21 university courses or the highlights of a placement, is folded behind a control on the card and opens in place. Every fact on the card is the same fact the first effort's content source holds; nothing is added by hand.
5. **The home page has a hierarchy.** It opens with the name, the label, and the summary, and the contact details as icon actions (email, each profile, the CV) rather than a table; then the skill groups as cards; then one card per section of the site, each saying what it holds and how many entries. Nothing on it repeats what the footer says.
6. **Certificates are a card grid, and a card opens its certificate.** The certificates render as their own grid, each card showing the name, the issuer, and the date where one is known. A card whose certificate document is in the content source opens that document in an overlay on the page, with a control to close it, a link to open the document itself, and Escape closing it; focus moves into the overlay and returns to the card. A card whose document is absent is not clickable and does not pretend to be. The CV page keeps its certifications list as it is.
7. **The certificate documents join the content source.** Each certificate entry may name its document, and the document lives in this repository beside the content, so the site shows a file it holds rather than one it links to. A document is checked for identifiers the same way the pages and the CV PDF are before it is published, and one that carries a national or student identifier is not added until it is redacted.
8. **The CV follows the template.** The CV page in each language is laid out after the white and blue minimalist corporate ATS template: the name centred in capitals with the label beneath and a rule under both; the contact details on one centred line, separated by bars; each section heading in a full-width pale blue band in capitals; each entry's title in bold on the left with its dates in bold on the right of the same line and the organisation or institution beneath; highlights as bullets; skills as a compact list in up to three columns; black text on white with the band as the one tint. Section order is summary, work experience, education, key skills, then certifications and projects, which the template does not have and the first effort requires. The PDF the build renders shows the same layout, with the bands printed.
9. **The CV stays parser-safe.** It is still one column of real text in reading order, with no table carrying content, no image, and no positioned header or footer. Criterion 5 of the first effort is amended by this one in two places, because the template needs them: an entry's title and its dates may share a line, and the skills list may lay its keywords in columns, since every keyword survives extraction whole whatever the order. Every other fact the extraction check expects is still found, in reading order.
10. **Both themes, both directions.** Every new surface, the cards, the menu, the overlay, and the CV bands, has a light and a dark rendering that meets the contrast criterion, and mirrors correctly in Arabic: a card grid fills from the right, an icon that points a direction flips, and the CV's right-aligned dates sit on the left.
11. **The gates still pass.** Lighthouse performance, accessibility, and best practices stay at 90 or above on the mobile profile for the home page and the CV page; no page scrolls horizontally at 360 pixels; nothing animates under reduced motion; keyboard navigation reaches every control, including the menu, the folds, and the overlay; and the pages render their content with scripting unavailable, with only the menu, the theme choice, the folds, and the overlay needing a script.
12. **Strings in both languages.** Every new interface string (the menu's name, the fold's labels, the overlay's controls, the CV's heading names where they change) is authored in both languages in the one strings file, and the Arabic is a draft until Saud reads it on the published site, as the first effort's assumption already states.
13. **The profile page does not mention the pending certificate.** Saud asked on 2026-09-09 that the README, which GitHub shows as his profile, stop saying the degree's certificate is pending. The README's profile block is written from the profile summary, which the site's home page and the CV's summary also show, so the sentence about the degree's status leaves the summary in both languages. The status itself is untouched: the education entry still carries `certificate-pending`, and the education page, the CV, and the JSON Resume document still show it as it is, which is what the first effort's requirement 4 protects.

# Acceptance Criteria

1. On every page, the theme control and the language control each contain an SVG icon and an accessible name; an accessibility audit of the header reports no control without a name. Switching the theme swaps the icon shown.
2. Clicking or pressing Enter on the language control shows a list with "English" and "العربية", the current language marked with `aria-current` or the equivalent; choosing the other leads to the same route in that language, on every route. Escape and a click outside close it. With JavaScript disabled, the control still leads to the other language.
3. Every project, experience entry, institution, certificate, and skill group renders inside an element styled as a card; at 360 pixels the grids are one column and at 1440 two or more, with no card wider than its column and no horizontal scroll.
4. Each card shows the entry's name, its period or date, and its meta line. The Saudi Electronic University card shows its status wording and folds its course list behind a control; opening it lists all 21 courses. A search of the rendered pages for any fact finds it in the content source.
5. The home page, in reading order, shows the name, the label, the summary, the contact actions, the skill cards, and one card per section with a count that matches the number of entries that section renders.
6. Each certificate whose entry names a document renders as a card that opens an overlay showing that document; the overlay has a close control, a link to the document, and closes on Escape with focus returned to the card. A certificate entry with no document renders as a card that is not a button and is not a link. The 27 certificate PDFs on Drive are added, so 27 cards open.
7. The certificate documents are files in the repository under the content source, referenced from their entries; the build refuses an entry that names a file that does not exist. The identifier scan over `dist/` reads the text of each certificate document as it reads the CV PDF, and the history scan finds nothing.
8. The English and Arabic CV pages show the name centred in capitals, a rule, a single contact line with bar separators, section headings in tinted bands, titles bold left with bold dates at the far edge of the same line, and a skills list in columns; the PDF rendered from each shows the bands. Printed to A4 and to Letter, nothing is clipped.
9. The CV page has no `<table>`, no `<img>`, and no fixed or absolute positioned element carrying content. The extraction check over the English PDF finds the name, the email, every experience entry's organisation, position, and period, and every education entry's institution, degree, and period, in reading order, allowing a title and its dates on one line. The check is updated to say so, and still fails on a missing line.
10. Every text and background pair on the new surfaces meets WCAG AA in both palettes, on screen; the Arabic pages render the card grids from the right and the CV dates on the left, checked by eye at 360 and 1440 pixels.
11. Lighthouse reports at least 90 on the three categories for `/en/`, `/ar/`, `/en/cv/`, and `/ar/cv/` on the mobile profile; the existing layout, theme, contrast, and reduced-motion tests pass with their expectations updated to the new layout; a keyboard-only pass reaches the menu, a fold, and a certificate overlay; with JavaScript disabled every page shows all of its content.
12. Every string the new controls show exists in both languages in `src/lib/i18n.ts`, and the build's gap report does not grow.
13. The README's profile block, the home page summary, and the CV summary in both languages contain neither "certificate pending" nor any sentence about the degree; `pnpm readme` reports the README current; the Saudi Electronic University entry still renders its pending wording on the education page and the CV, and the no-overclaim check passes.

# Constraints

- **Everything the first effort constrains still binds:** free static hosting, one content source, truthful academic status, two languages with one set of facts, no tracking, stacked changes through Graphite ([[efforts/1-portfolio-site/spec]], "Constraints").
- **No external request for an icon, a font, or a script.** Icons are inline vectors and the page loads nothing from another origin, because the site is a record that must not depend on a CDN, and because the Lighthouse gate is a requirement.
- **Script is progressive.** The pages render their content without JavaScript; a script adds the menu, the folds, the overlay, and the theme choice. A visitor with scripting off still reads everything, and a parser reading the CV page reads the same text a browser shows.
- **Repository size.** The certificate documents add about 2.5 MB across 27 files as they are on Drive. That is acceptable once; a document is committed at the size it needs to be legible and no larger, and the site loads a document only when its card is opened, never with the page.
- **The CV stays one column of real text**, as the first effort's evidence on parsers requires; the template is followed as far as that allows and no further.
- **The palette's accent stays the site's.** The template's blue band is realised with the site's existing tokens or one added tint, so the CV reads as part of the site and both themes stay consistent.

# Out of Scope

- **A photograph.** The template has none, the first effort left it open, and a parser-safe CV is better without one.
- **New content.** No project, course, or job is added or reworded; the redesign shows what the content source already holds, plus the certificate documents. The one wording change is the profile summary's last sentence, which requirement 13 removes. High school stays absent until its details exist.
- **Dating the Code with Mosh certificates.** Their PDFs are images and carry no extractable date; the cards show no date for them, as the entries have none. Reading the dates off the images is a content change for another day.
- **The JSON Resume output** and its schema, which are unaffected by how the page looks.
- **The README's shape.** It stays the profile page, written by `pnpm readme` from the content; the only change it sees is the summary of requirement 13 flowing through.
- **A blog, a contact form, a custom domain, a DOCX output, live GitHub data**, which the first effort already excludes.
- **A different navigation structure.** The four pages stay the four pages; this effort changes how they look and how entries are grouped, not which routes exist.
- **Decorative motion.** Cards may settle in on load and a fold or overlay may transition, all under `motion-safe`; nothing moves for its own sake.

# Assumptions

- The Canva template, "White and Blue Minimalist Professional Corporate ATS Resume", is the layout Saud wants for the CV, from the page he sent and the image of it he pasted on 2026-09-09: single column, centred header, tinted heading bands, bold dates at the right, three-column skills. Its typeface is a humanist sans; the site's system stack stands in for it.
- The 27 certificate PDFs at `G:\My Drive\studies\online courses\certificates\` on this machine are the documents the cards open, one per existing certificate entry, matched by name. The SoloLearn and typing certificates carry text; the Code with Mosh ones are images. Whether any carries an identifier is checked before it is added; the inventory notes identifiers in the university documents, not in these.
- The overlay shows a rendered image of the certificate's first page, with the PDF one click away, rather than the PDF inline: Android Chrome offers a download instead of rendering a PDF in a frame, and iOS shows one unscrollable page. [[efforts/3-site-redesign/evidence/prototypes/pdf-preview-render]] confirmed on 2026-09-09 that both kinds of certificate render to a WebP under 40 KB with npm packages alone; that pipeline is promoted and the shipped script is written fresh.
- "Dropdown" means a menu on the language control, and the theme control stays a two-state toggle, because a menu of two themes adds a click for nothing.
- "Use MDX" was a suggestion about the tooling rather than a requirement. [[efforts/3-site-redesign/plan]] weighed it and chose Astro components over the existing YAML collections: nothing in this effort needs rich text, and a summary formatted for the web would need a second, plain rendering for the CV and the JSON Resume output. A writing section, if one ever comes, is where MDX belongs.
- The pages with card grids take a wider column at 1440 pixels and the CV page keeps the document column it has, since it is a document; the widths are the plan's and the layout test asserts them.
- The education timeline keeps its order, high school, online courses, university, with the online-courses phase as one node that counts the certificates and links to their grid, so criterion 2 of the first effort still holds after the certificates move into a grid of their own.
- The CV's tinted band has a dark-theme value chosen in the plan, so the same design reads on a dark screen; on paper it is always the light one.

# Risks

- **Page weight.** 27 documents on one page would sink the Lighthouse score if any loaded eagerly; the constraint that a document loads on open is what prevents it, and the gate is what catches it.
- **The extraction check.** Moving dates onto the title's line changes what `pdftotext -layout` emits; the check is amended with the criterion, and a regression in reading order would surface as a failing dist check rather than a silent one.
- **An identifier in a certificate.** A certificate PDF can carry a certificate number that matches an identifier pattern by accident; the scan would refuse the build, which is the right failure, and the document is redacted or left out.
- **Arabic mirroring of the template.** Right-aligned dates and left-aligned titles swap in RTL; the CV must be checked by eye in Arabic, as the first effort already requires, because extraction cannot assert on it.
- **Scope creep into content.** A redesign invites rewording; the out-of-scope line on new content is what holds it, and any wording change is raised as its own effort.
