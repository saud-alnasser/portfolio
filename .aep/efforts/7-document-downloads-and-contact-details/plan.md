---
use-when: "building a ticket in this effort and the approach is not obvious from the spec"
---

# Architecture

**The document page fills itself and prints itself.** The form writes the typed values into the contact line of the document already on screen, then calls `window.print()`. The browser's own print pipeline produces the PDF, which is the same pipeline `scripts/render-pdf.mjs` drives through Playwright's `page.pdf()` to produce the published files. There is one layout, one renderer, and one print stylesheet behind both the published document and the generated one.

Two properties fall out of that, and they are why this approach was chosen over the others:

- **Arabic works for nothing.** Shaping and bidi come from the browser, exactly as they already do for `resume.ar.pdf`. Every alternative would have had to reimplement them.
- **CI can produce the generated document.** `page.fill()` then `page.pdf()` is the same call the render step already makes, so the document a reader gets is a document the build can extract text from and count pages of. Requirement 7's check over a form-produced document is machinery that exists rather than machinery to invent.

**Rejected: building the PDF in the browser with a library.** pdf-lib or jsPDF would mean the document's layout exists twice, in Astro markup and in library primitives, and the two drift on the first change to either. Neither shapes Arabic or reorders bidirectional runs, so the Arabic document would render unshaped or backwards. The html2canvas variant rasterizes the page, which destroys the text layer and breaks the parser-safety the spec's requirement 7 exists to hold.

**Rejected: stamping the published PDF client-side.** Fetching `cv.<locale>.pdf` and drawing the contact line into a reserved gap keeps the shipped bytes and the page count, and it fails on the same Arabic problem: pdf-lib does no shaping. It also fails on its own terms, because a stamped line is a separate content stream whose position in extracted reading order is not guaranteed, and reading order at that position is precisely what the extraction check asserts. Revisit only if the print dialog proves unacceptable **and** an English-only path becomes acceptable, which requirement 8 currently forbids.

**Rejected earlier, at the spec: a local-only build.** Recorded here so it is not proposed again. It was put to Saud on 2026-09-10 as the option that keeps the number off every machine but his, and he chose the form instead, because the form works from any browser and needs nothing installed.

## The impersonation question, decided

The spec asked this file to decide what to do about a public page that generates a document in Saud's name carrying contact details somebody else typed. **Nothing, deliberately.** The form gives an attacker no capability they lack: anyone who wants a PDF that looks like someone's CV can make one in a word processor. What the site controls is which copies carry authority, and after this effort those are the published PDFs, which carry no contact details at all and are rendered by the runner from the content source. A watermark or a generated-copy notice was considered and rejected: it would print on the document Saud actually sends to employers, degrading the real use to inconvenience the imaginary one.

## Persistence, decided

**The form stores nothing.** No `localStorage`, no cookie, no query parameter. Chosen by Saud on 2026-09-10 over a remember-on-this-device checkbox. The values live in the page while it is open and are cleared when printing finishes. Revisit if retyping proves tedious in practice; the checkbox is a one-field addition and nothing in this plan forecloses it.

# Components

| Part | Becomes responsible for |
| --- | --- |
| `src/components/CvDocument.astro` | a contact line whose email and phone are empty, hidden slots the script fills, and which carries the nationality. It renders no email address, in either variant |
| `src/components/DocumentForm.astro`, new | the `<dialog>` holding the two fields, the generate button, and the plain-download link. Modelled on `src/components/CertificateDialog.astro`, which already gets Escape, the focus trap, and the backdrop from the native element |
| `src/layouts/Base.astro` | one more block in its existing inline script: open the dialog, fill the slots, print, clear. Its footer stops carrying an email line |
| `src/pages/[locale]/cv.astro`, `resume.astro` | one icon control each, in place of the actions row. With no script it is a plain `<a download>` to that page's published PDF, which is what requirement 4 rests on |
| `src/pages/[locale]/index.astro` | contact actions without the email action |
| `src/lib/resume.ts` | a `basics` block with no `email` |
| `scripts/readme-profile.mjs` | a profile block with no email line |
| `scripts/render-pdf.mjs` | one more render per locale per document, filled through the form, written outside `dist/` |
| `scripts/check-dist.mjs` | a new check that no published file carries a contact detail, a replaced proof that the contact block is in the document's flow, and extraction over the generated documents |

# Interfaces

**The contact line's slots.** The line becomes a list whose first two items are optional and hidden, in the order requirement 3 fixes:

```
<ul data-cv-contact>
  <li data-contact-slot="email" hidden>…</li>
  <li data-contact-slot="phone" hidden>…</li>
  <li>nationality</li>
  <li>location</li>
  <li>profile url</li>       <- always last, always present
</ul>
```

**The separator bars move to the trailing edge of each item.** Today each item after the first carries a leading bar, which breaks the moment the first item can be hidden. Every item instead carries a trailing bar and the last child's is hidden in CSS. This works because the only optional items are at the front and the profile URL is always last. An implementer who adds an optional item at the end has to revisit this, and that is the reason it is written here.

**The control.** `<a href="/cv.<locale>.pdf" download data-document-download>` with an `Icon` and an `sr-only` name saying which document it downloads, plus a `title` for the hover tooltip. The script intercepts the click and opens the dialog; without script the link downloads the published PDF, unintercepted.

**The script's contract.** On generate: write both values into their slots, unset `hidden`, close the dialog, call `window.print()`. On `afterprint`: clear both slots and set `hidden` again, so the page returns to the state the published document is in and a second reader of the same tab sees nothing. The submit handler calls `preventDefault()` and the dialog's form uses `method="dialog"`, so nothing is ever sent anywhere, which is what criterion 3's last sentence asserts.

# Data Model

`src/content.config.ts`, the profile schema, gains `nationality: localized`. `src/content/profile.yaml` gains the value in both languages. `email` stays in both, unrendered, per the spec's assumption; `src/content/README.md` says so, which is requirement 9's whole purpose.

`src/content/projects/mudaraj.yaml` gains `resume: true`. Nothing else in the content changes.

The JSON Resume documents lose `basics.email` and gain nothing. No field in the schema is required (`[[efforts/1-portfolio-site/evidence/research/json-resume-schema]]`, finding B3), so the documents still validate, and the `jsonResume` check compares section counts rather than `basics`, so it is unaffected.

# Technical Approach

The order is chosen so that every step lands with its own checks passing, and so that the check that would fail loudest lands last.

1. **The content contract and the content.** Nationality on the profile, the resume marker on Mudaraj, the content documentation. Nothing renders differently yet except that the nationality appears and the resume gains a project, both of which existing tests read from the content source rather than from a fixture.
2. **The contact details leave every output.** The layout footer, the home page's actions, the document contact line, `src/lib/resume.ts`, and `scripts/readme-profile.mjs`, with `README.md` regenerated and committed in the same change. This is the step that inverts `documentHazards`: the proof that the contact block sits in the document's flow stops being a `mailto:` inside `<main>` and becomes `[data-cv-contact]` inside `<main>`. **It has to precede the form**, because otherwise the new no-contact-details check would be written against a tree that still fails it.
3. **The control becomes one icon.** Both document pages, the strings that go with it, and the tests that assert the actions row. The cross-document link disappears from the row here, and the header navigation, which already carries both documents, is what replaces it.
4. **The form and the generation path.** The dialog component, the inline script block, the print rules for the filled slots. This is the first step with any script in it, and the no-script test is what holds step 3's guarantee while it lands.
5. **The verification machinery.** The generated document rendered in CI, the extraction check over it, and the new `noContactDetails` check. Last because it is checking the four steps above, and a check written before the thing it checks passes for the wrong reason.

# Integration

**The deploy uploads `dist/` and nothing else** (`.github/workflows/deploy.yml:78`), which is what makes it safe to render a document carrying contact details during the build. The generated documents go to `.artifacts/`, gitignored and outside `dist/`, rendered with values that are obviously not real: `check@example.com` and a Saudi mobile that is all zeros after the prefix. The number is assembled in `scripts/placeholder.mjs` rather than written out anywhere, because a mobile in the source is what `scripts/identifiers.mjs` exists to find and this repository's history is scanned for one. A generated document must never be written into `dist/`, and that sentence is the reason the directory is new rather than reusing the one beside the published files.

**Lighthouse** measures the home, CV, and resume pages. The addition is one block in an inline script that already exists and one `<dialog>` that holds no image, so no request is added to any page.

**`scripts/scan-history.mjs`** scans the repository's history. The email is not being removed from the content source, so no history rewrite is implied and none is in scope.

# Migration

**`README.md` is regenerated and committed in step 2.** It is what GitHub renders on the profile page, so the moment that change merges the email is gone from the profile. `pnpm readme --check` is what fails if the file is behind, and the `readmeProfile` dist check already runs it.

**Both published `resume.json` documents change shape.** Anything consuming `basics.email` from them gets nothing. Nothing in this repository consumes it, and the effort's spec records that the machine-readable document follows the CV.

# Testing Strategy

Each criterion in `spec.md` against the thing that checks it.

| Criterion | Checked by |
| --- | --- |
| 1, one icon control per page | `tests/resume.spec.ts`, rewriting the actions-row test: exactly one element in the row, its accessible name naming its document, its `href` resolving to that page's PDF, no `resume.json` link and no cross-document link on either page, and the header navigation still carrying both |
| 2, no contact details published | a new `noContactDetails` check in `scripts/check-dist.mjs`, modelled on `noOverclaim`: over every HTML, JSON, XML, and text file under `dist/`, over the extracted text of all four published PDFs, and over `README.md`, for the email as `src/content/profile.yaml` authors it, for `mailto:`, and for a digit-run pattern that catches a phone number. Reading the address from the content source rather than a literal is what keeps the check true if the address changes |
| 3, the generated document carries what was typed | a Playwright test filling the dialog and asserting both values in `[data-cv-contact]` in order, plus the extraction check in the table row below. A network assertion that the page issues no request while generating covers the last sentence |
| 4, no script and dismissal | the existing no-script test extended: with JavaScript disabled both document pages render and the control is a plain link to the published PDF; with script, dismissing the dialog leaves the contact slots hidden |
| 5, nationality on the documents only | a Playwright assertion on both document pages in both languages, and the `noContactDetails` check's sibling assertion that the nationality string is absent from the home page, `README.md`, and both `resume.json` documents |
| 6, the resume's three projects | `tests/resume.spec.ts` already derives its expectation from the content source, so the marker on Mudaraj is the whole change; the named-projects assertion covers "and no other" |
| 7, hazards, extraction, budget | `documentHazards` with its new flow proof; `scripts/render-pdf.mjs` for the two-page budget at A4 and Letter, unchanged; and the extraction check extended to run over `.artifacts/<document>.en.filled.pdf`, asserting the placeholder email and phone at the head of the reading order before the facts it already asserts |
| 8, languages, themes, keyboard, gates | the gap report and `pnpm check` for the strings; a dialog keyboard test modelled on `tests/certificates.spec.ts`, which already covers Escape, focus return, and the backdrop for the certificate dialog; `tests/theme.spec.ts` and `tests/contrast.spec.ts` extended to the dialog's surface; Lighthouse unchanged |
| 9, the content format documented | `src/content/README.md`, and `scripts/test-content-mechanism.mjs` which already asserts the documented mechanism |

# Operational Considerations

**The reader completes a print dialog, and that is the one manual step.** Chrome and Edge offer Save as PDF as a destination; Safari offers it from the share menu on iOS. Nothing about this is automatable from the page, and the dialog's text says what to expect rather than leaving a reader to guess why a print dialog opened.

**Background graphics are the reader's setting, not the page's.** The published PDFs are rendered with `printBackground: true`, so the section bands print. A reader's print dialog may have background graphics off by default, in which case the bands print as plain headings. `print-color-adjust: exact` is already on `.cv-band` and may or may not override that setting depending on the browser; the first ticket to touch the print rules should find out and record what it found. Either outcome is acceptable, because the bands are the template's one tint and the document is legible and parseable without them, but the answer belongs in the repository rather than in somebody's memory.

# Technical Risks

- **The generated document's page count is the reader's browser's, not the runner's.** The effort at `[[efforts/5-sections-and-resume/spec]]` established that the same resume takes one page under the fonts Windows resolves and two under the runner's. The budget is checked on the runner over both the published and the generated document; a reader on another machine may get a different count and nothing in the build can prevent that. It shows up as a resume that runs a page longer than expected on somebody else's laptop.
- **The `afterprint` event is not uniformly reliable.** Where it does not fire, the contact slots would stay filled in the open tab. The remedy is to clear on both `afterprint` and the dialog's `close`, and to treat the filled state as transient rather than as the page's state. It shows up as a contact detail still on screen after a print is cancelled.
- **The no-contact-details check can pass for the wrong reason.** A check that greps for an address the content source no longer holds finds nothing and reports success. Reading the address from `src/content/profile.yaml` is what prevents it, and the check should fail loudly if that file has no email at all rather than quietly finding nothing to look for.
- **Two hidden list items at the head of a line is a layout the print stylesheet has never seen.** The separator-bar inversion is the part most likely to be wrong in a way that only shows on paper, in Arabic, where the bars mirror. The extraction check catches a missing fact but not a doubled bar; that one is checked by eye, as the Arabic PDFs already are.
