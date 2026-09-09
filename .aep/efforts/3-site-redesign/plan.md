---
use-when: "building a ticket in this effort and the approach is not obvious from the spec"
---

# Architecture

The redesign stays inside the shape the first effort built: Astro components over typed YAML collections, one global stylesheet with tokens, one inline script, static output. It adds a card component every entry type renders through, an icon component, two native disclosure patterns, one dialog, a certificate document field with the files beside the content, and a CV stylesheet after the template. Five decisions had more than one reasonable shape; each is settled here with what lost and why.

## MDX, or components over the collections

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **Astro components over the YAML collections** (chosen) | the cards, grids, folds, and menu are components taking the entries the pages already load; no second content format; the CV and the JSON Resume read the same plain text | none for this effort's surfaces | none new | one format to document, the one `src/content/README.md` already documents |
| MDX pages or MDX entry text | prose with components in it; formatting inside a summary | the collections are typed YAML shared by the pages, the CV page, the PDF, and `resume.json`; rich text in a summary needs a plain rendering for the JSON output and the PDF, so every summary would exist in two renderings; the site has no prose page to write | a summary formatted for the web reads wrong in the parser-safe CV | a second format beside YAML, with its own docs and its own gap in the Arabic fallback |

MDX loses because nothing in the spec needs rich text: every surface is a card or a grid over facts the collections hold, and the one output that would need a plain rendering is the one the first effort exists for. If a writing section ever comes, it comes as its own effort and MDX is the obvious answer there.

## Icons

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **One `Icon.astro` with a map of inline SVG paths** (chosen) | zero dependencies, zero requests, the exact set the site uses (about ten), the same markup in both themes | paths copied by hand from Lucide, with its ISC notice in the file | none | adding an icon is adding a path |
| `astro-icon` with `@iconify-json/lucide` | any icon by name | two dependencies and an integration for ten icons; Renovate churn | the integration's output changes across versions | dependency upkeep for no capability the site uses |
| an icon font | one file | a request, a flash of unstyled icons, an accessibility hazard the tests would have to guard against | the constraint on external requests | rejected outright |

Paths come from Lucide (ISC) for the sun, moon, languages, mail, file, download, external link, chevron, x, and check icons, and from Simple Icons (CC0) for the GitHub mark. Any profile whose network has no mark falls back to the link icon.

## The language menu

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **`<details>` and `<summary>`, with a script for dismissal** (chosen) | opens and closes with no script in every browser; the links inside are ordinary links, so with scripting off the other language is one click away; Escape and click-outside are ten lines added to the existing inline script | needs that script for dismissal, which the spec allows | none | none beyond the script |
| a button with the `popover` attribute | light dismiss and Escape with no script | in a browser without popover support the list renders open, and a button that does nothing leaves no path to the other language without script; Playwright covers only Chromium, so the failure would be invisible to the tests | the criterion on scripting unavailable fails silently on older browsers | none |
| a button and a script-built menu | full control | nothing works without script; fails the criterion | rejected outright |

## What the certificate overlay shows

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **a pre-rendered WebP of page one, with a link to the PDF** (chosen; [[efforts/3-site-redesign/evidence/prototypes/pdf-preview-render]]) | renders on every browser; 19 to 116 KB each as committed (the prototype measured two at 20 to 36 KB); loaded only when opened; the PDF stays the document of record one click away | one derived file per certificate, produced by a script and committed | a preview left stale after a PDF changes; the script regenerates all of them and the README says when to run it | a script and two devDependencies |
| the PDF in an `<iframe>` or `<object>` | no derived file | Android Chrome does not render a PDF inline and offers a download instead; iOS shows the first page only, unscrollable; the overlay would be a broken box on most phones | the criterion on the overlay fails on the devices recruiters use | none |
| render previews at build time in CI | nothing derived in git | every build depends on pdf.js and a native canvas, locally as well as in CI; the content mechanism test rebuilds twice; the build gets slower for a file that changes never | a build failure in a dependency that has nothing to do with the site | the same two dependencies, in the critical path |

## Where the documents live and how they are served

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **`src/content/certificates/files/`, served through Vite asset imports** (chosen) | the documents sit beside the entries, as the spec's requirement 7 says; the schema can check the file exists at build; Astro's image pipeline handles the WebP; the PDF gets a hashed URL under `_astro/` and the existing identifier check over `dist/**/*.pdf` scans it with no change | the PDF URL is hashed rather than readable | none | none |
| `public/certificates/` | readable URLs | the build cannot refuse a missing file; the documents sit apart from the content they belong to; a second place to keep in step | an entry naming a file that is not there ships a dead link | a check to write that the schema gives for free |

# Components

| Part | Becomes responsible for |
| --- | --- |
| `src/components/Icon.astro` | one inline SVG by name, `aria-hidden` unless given a label; the Lucide and Simple Icons notices sit in its header |
| `src/components/Card.astro` | the card shell: surface, border, radius, padding, the hover and focus treatment; takes an optional `href` (the whole card is a link) and an optional `as` |
| `src/components/Fold.astro` | a `<details>` inside a card with a summary of the form "21 courses"; the chevron icon turns with the open state |
| `src/components/LanguageMenu.astro` | the `<details>` menu in the header: the languages icon, the current language's code, the list with `aria-current` on the current one |
| `src/components/ThemeToggle.astro` | the existing button, keeping `data-theme-toggle` and the two `theme-when-*` spans, now holding the sun and moon icons with their labels in `sr-only` text |
| `src/components/Project.astro`, `Experience.astro`, `Education.astro`, `Certificate.astro`, `Skills.astro` | each entry as a card; `Experience` and `Education` fold their highlights and courses; `Skills` becomes one card per group in a grid |
| `src/components/CertificateDialog.astro` | the one `<dialog>` a page holds: an image, a caption, the link to the PDF, the close control |
| `src/components/SectionCard.astro` | the home page's card per section, with its count line |
| `src/layouts/Base.astro` | takes `column: 'document' \| 'grid'`; header, main, and footer share the width it chooses |
| `src/pages/[locale]/index.astro` | hero, contact actions, skill grid, section cards |
| `src/pages/[locale]/work/index.astro` | project grid, experience grid |
| `src/pages/[locale]/education/index.astro` | the timeline of institutions with one node for the online-courses phase, then the certificate grid and the dialog |
| `src/pages/[locale]/cv.astro` | the template's layout, in the same document order the extraction check expects |
| `src/styles/global.css` | the `--band` and `--card` tokens, the card and menu rules, the CV band and print rules |
| `src/content.config.ts` | the certificates' `document` field and its existence check |
| `scripts/certificate-previews.mjs` | renders every `files/*.pdf` to `files/*.webp` |
| `scripts/render-pdf.mjs` | prints backgrounds |
| `scripts/check-dist.mjs` | the amended CV extraction expectation |
| `tests/` | the widened layout expectation and the new menu, dialog, and no-script tests |

# Interfaces

**The content contract.** A certificate entry gains `document`, optional: the file name of its PDF relative to the certificates directory, as `files/code-with-mosh-react.pdf`. The schema refines it: the PDF exists, and `files/<same name>.webp` exists beside it, or the build refuses the entry naming the missing file. `src/content/README.md` documents the field and the preview command.

**Serving the files.** `Certificate.astro` reads two globs once: `import.meta.glob('../content/certificates/files/*.pdf', { query: '?url', import: 'default', eager: true })` for the PDF addresses and `import.meta.glob('../content/certificates/files/*.webp', { import: 'default', eager: true })` for the previews, served as committed (a derived copy through `getImage()` was tried and dropped in review, because Astro emitted the original beside it). Both are keyed by the `document` value. The card carries `data-preview`, `data-document`, and `data-caption` attributes and is an `<a href={document}>` so that, without script, it opens the PDF; the script turns a click into the dialog.

**The dialog.** One `<dialog data-certificate-dialog>` per page, opened with `showModal()` by the inline script, which sets the image's `src` from the clicked card, the caption, and the link, and returns focus to the card on close. Native `<dialog>` handles Escape and the focus trap.

**The scripts.** The inline script in `Base.astro` stays the only script and gains three handlers: menu dismissal (click outside, Escape), dialog open and close, and nothing else. Folds need none.

**The strings.** New keys in `src/lib/i18n.ts`, both languages: `nav.language` (the menu's accessible name), `fold.show` and `fold.hide` with `{count}` and a noun key, `certificate.open`, `certificate.close`, `certificate.document`, `home.counts.*`, `cv.experience` ("Work experience"), `cv.skills` ("Key skills"). The existing `certificate.view` is replaced by `certificate.open`.

**Test hooks.** The theme test's `[data-theme-toggle]` selector is kept. The menu is `[data-language-menu]`, the dialog `[data-certificate-dialog]`, the certificate cards `[data-document]`. `tests/pages.ts` gains the expected `main` width per route.

# Data model

Only the certificate `document` field above. The 27 files are added under `src/content/certificates/files/` with the entry id as the file name, matched from the Drive names:

| Drive file | Entry |
| --- | --- |
| `cert-codewithmosh-aspnetmvc5.pdf` | `code-with-mosh-aspnet-mvc-5` |
| `cert-codewithmosh-csharp-{basics,intermediate,advanced}.pdf` | `code-with-mosh-csharp-{basics,intermediate,advanced}` |
| `cert-codewithmosh-csharp-unit-tests.pdf` | `code-with-mosh-csharp-unit-testing` |
| `cert-codewithmosh-datastructures-part{1,2,3}.pdf` | `code-with-mosh-data-structures-part-{1,2,3}` |
| `cert-codewithmosh-designpatterns-part{1,2,3}.pdf` | `code-with-mosh-design-patterns-part-{1,2,3}` |
| `cert-codewithmosh-{docker,git,react,refactoring}.pdf` | `code-with-mosh-{docker,git,react,refactoring}` |
| `cert-codewithmosh-entityframework6.pdf` | `code-with-mosh-entity-framework-6` |
| `cert-codewithmosh-html-fundamentals.pdf` | `code-with-mosh-html-fundamentals` |
| `cert-codewithmosh-python-developers.pdf` | `code-with-mosh-python-for-developers` |
| `cert-codewithmosh-sqlmastery.pdf` | `code-with-mosh-sql-mastery` |
| `cert-sololearn-{csharp,html,javascript}.pdf` | `sololearn-{csharp,html,javascript}` |
| `cert-sololearn-python-beginners .pdf` (the space is in the source name) | `sololearn-python-for-beginners` |
| `cert-sololearn-pythoncore.pdf` | `sololearn-python-core` |
| `cert-sololearn-python-datastructures.pdf` | `sololearn-python-data-structures` |
| `cert-sololearn-python-intermediate.pdf` | `sololearn-intermediate-python` |
| `cert-typing-speed.pdf` | `typing-com-advanced-assessment` |

All 27 were scanned on 2026-09-09 with `pdftotext` and `scripts/identifiers.mjs`: 15 have no text layer, 12 have text, none matches an identifier pattern. The typing certificate's verification address carries digits inside a URL, which the patterns exempt by design.

# Technical approach

1. **Foundation.** Tokens (`--band`, `--card`), `Icon`, `Card`, `Fold`, the `column` prop on `Base`, the header with `LanguageMenu` and `ThemeToggle`, the script's menu handler, the new strings, and the tests for the menu and for scripting off. Everything else renders through these, so they land first and alone.
2. **The pages as cards.** Home, then work, then the education timeline, each a ticket, all on the foundation and independent of each other.
3. **Certificates.** The schema field, the files, the preview script and its two devDependencies, the certificate grid, the dialog, the dialog handler, the content README, and the dialog test. Depends on the foundation only.
4. **The CV.** The template layout, the CV strings, `printBackground: true` in the render script, `print-color-adjust: exact` on the band, the amended extraction check, and the widened layout test. Depends on the foundation for the tokens and the `column` prop, on nothing else.
5. **Documentation.** `docs/development.md` gains the preview command; the content README gains the `document` field. Lands with steps 3 and 4 rather than after them, so the docs never describe a field that does not exist.
6. **The profile summary.** The last sentence of `profile.summary` leaves both languages in `src/content/profile.yaml`, and `pnpm readme` rewrites the README block; the dist check's `readmeProfile` fails until it has. Independent of everything above and small enough to land first or last.

Steps 2, 3, and 4 stack on 1 and may proceed in any order; under Graphite each is a branch on the effort branch.

**The CV's document order** is what the extraction check reads, so it is fixed here: name, label, contact line; summary; each experience entry as the position and the period on one line, then the organisation and location on the next, then bullets; each education entry as the degree and area with the period on one line, then the institution, then the status, then the courses; skills; certifications; projects. The check's expectation follows the same order: for experience, position and period (one line), then organisation; for education, degree and period (one line), then institution.

**Capitals.** The name is set in capitals with `text-transform`, so the extracted text is capitals; the check compares the name without case. Letter spacing on it stays at or under `0.025em`, because `pdftotext -layout` turns wide tracking into spaces between letters.

**Widths.** `column: 'grid'` is `max-w-5xl` (64 rem, 1024 pixels); `column: 'document'` stays `max-w-3xl` (768 pixels) and the CV page uses it. The layout test asserts 1024 on the three pages and 768 on the CV.

**The band.** `--band: light-dark(#dde8f0, #1f2b38)`, with `--foreground` on it: 13.0:1 in light and 11.6:1 in dark by the WCAG formula, computed on 2026-09-09, both over AA; `--muted-foreground` on it reaches 5.0:1 and 5.7:1, so a date in the muted colour may sit on the band too. Print forces the light side as it forces the palette today.

**The timeline node.** The education timeline keeps its order rule from ticket 12 of the first effort: institutions by start, and the online-courses phase where undated certificates used to go, before the most recent institution. The node shows the count and the date range of the dated certificates and links to the grid's heading, so the page still reads high school, courses, university.

# Integration

- `scripts/check-dist.mjs`: `cvPdf` takes an expectation of groups (items in a group may share a line) and compares without case; `identifiers` already walks `dist/**/*.pdf`, which now includes the 27 certificates under `_astro/`, so their text is scanned in CI where poppler is installed; `cvHazards` is unchanged and keeps passing because the CV has no image.
- `scripts/render-pdf.mjs`: `printBackground: true`.
- `scripts/test-content-mechanism.mjs`: unchanged; the fixture's name still appears in exactly the six outputs, since the home page shows counts rather than names.
- `tests/layout.spec.ts`: the width per route; `tests/theme.spec.ts`: unchanged; `tests/contrast.spec.ts`: unchanged and now covers the cards, the band, and the open menu (it audits the closed state; the menu test opens it and runs axe once more).
- `.github/workflows/`: unchanged. The preview script is not a CI step; the previews are committed.
- `package.json`: `pdfjs-dist`, `@napi-rs/canvas`, and `sharp` as devDependencies, and `certificates:previews` as a script. Renovate will propose updates to all three; they affect only the preview script.
- `README.md`: unchanged; `pnpm readme` reads the profile and the skills, neither of which changes.

# Migration

Nothing on the live site breaks: every route stays, every address stays, the JSON Resume documents are byte-for-byte the same. The `certificate.view` string is removed with its one use. The certificate timeline entries move into the grid, and the anchor `#certificates` moves with them to the grid's heading, so an inbound link to it still lands on the certificates.

# Testing strategy

| Criterion | Checked by |
| --- | --- |
| 1 | `tests/contrast.spec.ts` (axe, every page, both palettes) fails on a control without a name; `tests/theme.spec.ts` gains an assertion that the visible icon changes with the theme |
| 2 | new `tests/menu.spec.ts`: open with click and with Enter, the two items and `aria-current`, navigation to the twin route on every route, Escape and outside click close it; a context with `javaScriptEnabled: false` reaches the other language through the summary's list |
| 3 | `tests/layout.spec.ts` at 360 (one column, no horizontal scroll) and at 1440, and the per-page specs `tests/home.spec.ts`, `tests/work.spec.ts`, `tests/education.spec.ts`, and `tests/certificates.spec.ts` (column count via `getComputedStyle(grid).gridTemplateColumns`) |
| 4 | new `tests/education.spec.ts`: the SEU card's status text and its fold listing 21 items; the content mechanism test still finds the fixture in six outputs |
| 5 | new `tests/home.spec.ts`: the home page's reading order and the counts against the collections, read from `src/content/` as the dist check reads them |
| 6 | new `tests/certificates.spec.ts`: click a card, the dialog is open with the preview `src` set and the PDF link, Escape closes it and focus is on the card; a card without `data-document` is neither a link nor a button; 27 cards carry `data-document` |
| 7 | the build (a missing file fails the schema, checked once by hand with a wrong name); `pnpm check:dist` scans the PDFs in CI; `pnpm scan:history` runs in CI as today |
| 8 | `pnpm render:pdf` then a look at both PDFs; the print-emulation test in `tests/theme.spec.ts` gains an assertion that the band's background prints; A4 and Letter by hand from a browser, as the first effort did |
| 9 | `pnpm check:dist` (`cvHazards` and the amended `cvPdf`); a deliberate removal of one expected line to see the check fail |
| 10 | `tests/contrast.spec.ts` on every page in both palettes; the Arabic pages by eye at 360 and 1440 |
| 11 | `pnpm lighthouse`; the existing tests; a keyboard-only pass by hand; the no-script context in `tests/menu.spec.ts` also asserts every page's `main` text is non-empty |
| 12 | `pnpm check` (the `Strings` type refuses a key missing from `ar`); the gap report line in `pnpm check:dist` unchanged |

# Technical risks

- **`pdftotext -layout` and the two-column line.** A title on the left and a date on the right come out as one line with a run of spaces, which `squash()` already collapses. If Chromium's PDF puts them on separate lines instead, the group still passes because the group allows either. If the date extracts before the title, the check fails and the layout uses a flex row rather than a float; either way the check names the line.
- **Lazy images in a closed dialog.** The dialog's `<img>` has no `src` until opened, so nothing depends on how a browser treats lazy images inside `display: none`.
- **`showModal()` and the reveal animation.** The page's `motion-safe:animate-reveal` on `main` creates a containing block for nothing, but a transform on an ancestor of a `<dialog>` breaks its top-layer positioning in some browsers; the dialog sits outside `main`, as a child of `body`.
- **Sharp's binary in CI.** Astro already installs sharp for its image service and the build already runs it in CI, so importing it in the preview script adds no new native dependency to the build; the preview script itself does not run in CI.
- **Renovate on the preview dependencies.** Three new packages, updated by bot pull requests that touch a script CI never runs; the labeler marks them `flag: dependencies` and nothing else is affected.
