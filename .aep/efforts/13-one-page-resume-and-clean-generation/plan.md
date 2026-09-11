---
use-when: "building a ticket in this effort and the approach is not obvious from the spec"
---

# Architecture

Four defects, three of them mechanism and one of them fit. The mechanism is small and lands first; the fit is where the effort can fail, and the numbers it has to hit are measured below rather than guessed.

## How the generated document loses the browser's furniture

Measured before this was written ([[efforts/13-one-page-resume-and-clean-generation/evidence/prototypes/print-furniture-and-the-page-box]]): Chrome draws its header and footer inside the paper margin, laid out from the paper edge rather than from the text, and `page.pdf()` reads the same CSS page box a reader's dialog starts from. So the page box is the switch, and it is the only switch a page has.

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A. `@page resume { margin: 0 }`, the white space returned as padding on the resume's own article** (chosen) | one rule, in the stylesheet the resume's page box already lives in; the published render and a reader's own print move together, because both read this box; nothing is asked of the reader and nothing is added to the page | only works for a document that fits one page, because padding applies at the ends of a box rather than at every fragment of it, so the CV cannot have it | a reader who chooses a margin of their own in the dialog gets the furniture back; the document is right by default and that is the whole of what a page can promise | one declaration beside the one it replaces |
| B. A PDF library in the reader's browser, building the document rather than printing it | the file stops depending on the print dialog at all, and could be named directly | a dependency, a build step, and a second renderer to keep agreeing with the first; Arabic shaping and the bundled Naskh face would have to be reproduced in it; the site's whole design is that a document is the page a reader is already looking at | the two renderers drift and the generated document stops being the published one | a library, its font subset, and the drift |
| C. Ask the reader to untick "Headers and footers" in the print dialog | nothing to build | a manual step on every generation, invisible until it is forgotten, and gone again on a new machine or a new browser profile; the one reader this form exists for is the one person who would have to remember it every time | the document Saud sends is wrong whenever he is in a hurry | a sentence in the form that will be ignored |

**The CV keeps its furniture**, which `spec.md` records in Out of Scope. B is what would remove it, and B is refused above on its own terms rather than because of the CV.

## How a generated file gets the published file's name

Chrome names a printed PDF after `document.title` and appends `.pdf`, which is why the file Saud supplied is called `Resume - Saud Alnasser.pdf`. So the lever is the title, set for the duration of the print and put back.

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A. Set the title from the download control's own `href`** (chosen): `/saud-alnasser/resume.en.pdf` gives `resume.en`, and Chrome appends the extension | the name is not written down a second time; it is read off the published file the page already links, so the two cannot disagree, which is exactly what requirement 5 asks for | one more piece of state in the inline script, and it has to be put back on three paths the way the contact line already is | a title left behind renames the tab, the history entry, and anything bookmarked from it | none beyond the restore |
| B. A `data-document-file` attribute on the control | explicit | a second place the file name lives, in a repository that has twice paid for a value written twice (`scripts/form-marker.mjs`, `scripts/placeholder.mjs`) | the attribute and the href drift | one attribute per page |
| C. Leave the title alone and rename the published download to match it, with `download="Resume - Saud Alnasser.pdf"` | no script at all | puts Saud's name in a file name on a public site, and it is the direction he was asked about on 2026-09-11 and did not choose | none | none |

**The restore is three-way**, on the model of the contact line's `clear()` beside it: after `window.print()` returns, on `afterprint`, and before the dialog opens. Two of those are the same belt and braces the contact line already wears, and for the same reason: `afterprint` is not uniformly reliable, and the cost of missing it here is a tab that keeps calling itself `resume.en`.

## How the redesign is carried

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A. The stylesheet and the class strings in `CvDocument.astro`, with the markup untouched** (chosen) | every guarantee that rests on the document's shape holds by construction: the extraction groups, `documentHazards`, the exact `<p>` list `tests/resume.spec.ts` asserts on a resume project entry, the reading order, the parser-safety criterion of two prior efforts; the change is typographic, which is what was asked for | a heading cannot gain a decorative element, so the design has to be made of type, rule, and colour | none | the classes stay where they are |
| B. New markup per section: a header block, a heading with a decorative span, an entry as a two-column row | more design freedom | breaks the tests and checks above, and a two-column entry is the layout `spec.md` refuses outright | a parser reads the document differently and nobody notices until an application is screened out | two documents' markup |

**What changes, and what it is worth.** The band goes. It is a `background-color` with `px-2 py-1`, and what replaces it is the heading set in `--primary`, uppercase, at the same `tracking-[0.025em]` the extraction depends on, over a hairline `border-bottom`. Tracking stays where it is because `pdftotext -layout` turns wider tracking into spaces between letters. The header gains a heavier rule in the accent under the name and label; a period becomes muted tabular text rather than bold; a bullet takes the accent through `marker:`, which is a CSS marker and reaches no parser as content.

**It also removes the document's one dependency on the reader's print settings.** The band is the only thing on either document that needs `print-color-adjust: exact`, because a browser drops background colours when printing unless the page insists (`tests/theme.spec.ts` asserts exactly this). A border is not a background: it prints whatever the reader's background-graphics setting says. So the printed document stops depending on that setting at all, and the theme test changes from asserting that the band survives to asserting that nothing on the document needs to.

The `--band` token is retired with it, from both `:root` and `@theme inline`, since nothing else reads it.

## Where the one-page rule is enforced, and how a near miss is caught

The rule that exists counts pages, in `scripts/render-pdf.mjs` as it renders and in `scripts/check-dist.mjs` over what shipped. Tightening the budget from 2 to 1 is two constants. What the page count cannot see is a document that fits here by a hair and does not fit on the runner, which is precisely the failure that widened the budget on 2026-09-10: the English resume cleared Letter by about 16 pixels on Windows and took a second page on the runner, because the system font stack resolves to different faces on the two machines and Saud has twice declined to bundle a print face.

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A. Count pages, and refuse a last page with less than 10mm of unused height at Letter** (chosen), the free height reported on every render | catches the near miss on a developer's machine, which is the only failure this effort is likely to produce; the floor is derived from the one measurement the repository has rather than picked, and the message says so | a number that is a judgement; a document with 9mm free is refused although it renders perfectly here | a false refusal, whose remedy is the same content lever the real refusal has | one constant with its reason beside it |
| B. Report the free height and gate on the page count alone | no invented number; the log carries the evidence | the guard is then a human reading a log line, which is how 2026-09-10 happened; `[[skills/review]]`'s own rule is that a gate nothing checks from the outside stops gating quietly | the deploy breaks on the runner, which stops the site updating rather than merely failing a check | none |
| C. Page count alone, as today | nothing to build | the blind spot stays exactly where it was | the same red deploy | none |

**Why 10mm and not another number.** 16 pixels of headroom was not enough on 2026-09-10. 10mm is about 38 pixels at the resume's print size, more than twice the gap that failed, and about two and a half lines of body text. It is written as a constant with that sentence beside it, so the next person to move it knows what it was measured against.

## What has to be cut, and by how much

Measured on this machine, on the current `main`, by rendering `/en/resume/` and `/ar/resume/` at both papers and reading back where the text falls. **The resume is further from one page than the repository's own record says**: ticket 06 of effort 5 recorded the runner at one page for English on A4, and today it is two pages on both papers here, because effort 7 added a third project and a nationality line after that measurement was taken.

| | Pages, A4 | Pages, Letter | On the last page | Free under the last line of page 1 |
| --- | --- | --- | --- | --- |
| `resume.en.pdf` | 2 | 2 | 25.4mm at A4, 55.6mm at Letter | 12.4mm at A4, 34.9mm at Letter |
| `resume.ar.pdf` | 1 | 2 | 279.3mm at A4, 27.2mm at Letter | 18.1mm at A4, 19.7mm at Letter |

The filled copies measure identically to the published ones, at both papers in both languages, which retires the spec's assumption that the contact line might cost a line: it lands inside the line the header already has.

Letter binds, as it did in effort 5. Taking the 10mm page padding out of the free space, **English has to lose about 31mm and Arabic about 18mm**, which at the resume's print size is about 117 and 66 pixels.

The levers, in the order they are pulled, with what each is worth in English:

| Lever | Worth | Where it comes from |
| --- | --- | --- |
| the band's vertical padding, gone with the band | about 40px | the redesign returns it; five headings at 8px each |
| the resume drops cachescribe | about 80px | effort 7's spec: "If the page budget refuses three, cachescribe is the one to drop", because the CV keeps it whole and it is the oldest of the three. Standing instruction, so it needs no second ask |
| the profile summary loses a line | about 20px | a content lever effort 5 already authorised, truthfully and no further than the fit needs |
| a project summary loses a line | about 20px each | the same |
| the placement's bullets | about 20px each | the last lever, and the one that costs the most evidence |

The first two carry English past 117px with nothing to spare, which is the state that failed on 2026-09-10, so the fit ticket pulls the third and as much of the fourth as the 10mm floor needs and stops there. **Nothing here touches the type size**, which `spec.md` fixes at 10pt, and nothing leaves the content source: a dropped project loses its resume marker and keeps everything else.

## Where the furniture check lives

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A. A third render in `scripts/render-pdf.mjs`, taken with `displayHeaderFooter: true`** (chosen), asserting the resume carries none of it and the CV still carries it | that file already owns what the document becomes as a PDF, already serves `dist/`, already has the browser open, and already fails with a named reason; the CV is the positive control, so the check is visibly capable of failing | one more render per language, which is a second or two | none | one function beside two that look like it |
| B. A Playwright test | tests are where behaviour is asserted | `page.pdf()` is headless-only, and the suite runs a project per palette, so it would render four PDFs to assert one thing about a page box that has no palette | a test that is skipped in a headed run and nobody notices | a browser-dependent test |
| C. Assert the compiled CSS contains the rule | trivial | asserts the source rather than the artifact; it would have passed on 2026-09-10 while the runner disagreed | a check that passes while the document is wrong | none |

# Components

| Part | Becomes responsible for |
| --- | --- |
| `src/styles/global.css` | the resume's page box at `margin: 0` and its white space as padding on `.cv-compact`; the heading as accent type over a rule in place of `.cv-band`; the header's rule; the retirement of `--band` |
| `src/components/CvDocument.astro` | the same markup with the redesigned class strings, and the comment block that describes the template, which currently describes the band |
| `src/layouts/Base.astro` | inside `documents()`, the title taken from the download control's `href` for the duration of the print, and put back on all three paths |
| `src/components/DocumentDownload.astro` | unchanged; the actions row still holds exactly one control (effort 7, criterion 1) |
| `src/pages/[locale]/cv.astro`, `src/pages/[locale]/resume.astro` | one line above the actions row saying what that document is for, carrying `[data-document-purpose]`, hidden in print |
| `src/lib/i18n.ts` | two strings per language for those lines |
| `scripts/render-pdf.mjs` | the resume budget at one page; the free height on the last page reported and floored at 10mm at Letter; the furniture render and its named failure |
| `scripts/check-dist.mjs` | `resumePages` at one page, with the message and the comment that carry the reason |
| `docs/development.md` | the budget as one page, and the furniture the generated resume no longer carries |
| `tests/theme.spec.ts` | the document needs no background to print correctly, in place of the band's `print-color-adjust` |
| `tests/document-form.spec.ts` | the title is the published file's name while printing and the page's own title afterwards, including after a dismissal |
| `tests/resume.spec.ts` | the purpose line on each document page, and the project set the resume now carries |
| `src/content/` | whichever texts the fit needs, and the resume marker on one project |
| `.aep/efforts/5-sections-and-resume/spec.md` | requirement 10, its constraint, its assumption, and its risk, saying one page and pointing here |

# Interfaces

Nothing gains a public contract. Two internal shapes change:

- `render-pdf.mjs`'s `documents` array: `pages: 2` becomes `pages: 1` on the resume, and the entry gains the free-height floor it is measured against. `RenderFailure` gains two reasons, `resume-has-no-headroom` and `print-furniture`, both naming the locale, the paper, and the number.
- `DocumentDownload.astro` keeps its props. The purpose line is a sibling of the actions row rather than a prop of it, because the row is asserted to hold exactly one element.

# Technical Approach

The order is fixed by two facts: the look is what spends and returns height, and every intermediate build has to stay green.

1. **The page box and the file name.** The two defects Saud reported that are pure mechanism. Neither touches content or look, both are provable on their own, and the furniture check lands with them, with the CV as its control.
2. **The redesign of both documents.** Lands next because it returns about 40px of the fit, and because a fit done before it would be undone by it.
3. **The fit.** Measure, pull the levers in the order above, stop at the 10mm floor, and only then tighten the budget to one page in the render step and the dist check. **The budget tightens last**: doing it first makes every build between here and there red, and a red build is not a signal when it is expected.
4. **The purpose line**, which is independent of all of the above and is the smallest piece.
5. **The prose.** `docs/development.md`, the comments in the stylesheet, the document component and both scripts, and effort 5's spec, whose requirement 10 this reverses. It goes last because until the budget is one page, the prose saying two is still true.

# Integration

What this touches that it does not own:

- **The extraction check.** It reads groups from the content and asserts reading order over both documents and their filled copies. The markup does not move, so the groups do not, but the gap under a heading is load-bearing: `.cv-compact .cv-band + *` carries 20px because `pdftotext -layout` groups two rows into one extracted line below about 16px, which would put the first entry's dates on the heading's line. **That rule survives the rename and keeps its 20px**, and the comment explaining it moves with it.
- **The theme test**, which asserts the band's print background and its `print-color-adjust`. It changes rather than disappears.
- **The deploy.** `.github/workflows/deploy.yml` runs the same render step, so a resume that misses the floor stops the site updating rather than merely failing a check.
- **The worktrees.** Each ticket's surface needs its own `pnpm install`; the store makes it fast, but it is not free and it is not obvious.

# Testing Strategy

| Criterion | Checked by |
| --- | --- |
| 1, no furniture | the furniture render in `scripts/render-pdf.mjs`: each resume page rendered with the header and footer switched on and refused if the extracted text carries the title, the address, a page number, or a date stamp, and each CV page rendered the same way and refused if it does not carry them |
| 2, one page | `pages: 1` in the render step over four renders per language, published and filled at both papers, plus the 10mm floor on the last page at Letter; `resumePages` in `check-dist.mjs` over what shipped; both green on the CI runner, which is the only measurement that has ever disagreed |
| 3, nothing lost | `pnpm test:content`, the JSON Resume check, and `tests/resume.spec.ts`, which reads the expectation out of `src/content/` so a document that drifts from the source fails; `[localized] 0 gaps` on the build |
| 4, parser-safe and designed | `documentHazards`, the extraction check over four PDFs, `tests/resume.spec.ts`'s positioned-element case, the contrast tests, which measure computed colours on the live page and so cover every colour the redesign introduces without being told about it, and Lighthouse over six pages |
| 5, the file name | a case in `tests/document-form.spec.ts` reading `document.title` at the moment `window.print()` is called, which the suite already stubs and counts, and again after `afterprint`, and a second case that dismisses the dialog and asserts the title never moved |
| 6, the purpose line | a case per document page asserting the line and its absence from every rendered PDF, which the extraction check's text already gives us |
| 7, the prose | a search across `scripts/`, `src/`, `docs/`, and `.aep/`, run in the ticket and quoted in its outcome |

# Technical Risks

- **The fit is measured here and decided on the runner.** Everything above is arithmetic on this machine's fonts. The 10mm floor is the answer to it, and the first pushed branch is what confirms the answer. If the runner still says two pages with 10mm free here, the floor was too low and the next lever is pulled rather than the budget widened.
- **The redesign can spend what it returns.** Air between entries is what makes a document look considered, and this document has none to give. The free height reported on every render is the feedback loop, and step 3 exists because of it.
- **The title lever leaks into the tab.** A print that never fires `afterprint`, a dismissed dialog, a browser that keeps the tab open: each leaves the page calling itself `resume.en` until something puts it back. Three restores, and a test for the dismissal path specifically, because a test that only ever generates will not see it.
- **The band's removal is the one change that touches the CV's look without touching its content.** The CV is a five-page document whose headings currently carry a tint that makes it scannable; a hairline rule is quieter. It is the pair reading as one pair, which is what Saud chose on 2026-09-11, and it is reversible in one class string.
