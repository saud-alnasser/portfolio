---
status: accepted
---

# Problem

[[efforts/7-document-downloads-and-contact-details/spec]] took every contact detail off the site and put a form in front of both download controls, so that a document carrying an email and a phone number is produced in a browser rather than published. It shipped, and the form sits on the public path for every reader.

- **Only one person can fill the form in.** The contact line it writes into is the candidate's own. A recruiter who opens `/en/cv/` has no email address or phone number of Saud's to type, because the point of that effort was that the site publishes neither. The form asks every reader for something only Saud has.
- **So for every other reader it is a dialog between them and the PDF.** `src/layouts/Base.astro:200` cancels the download for everyone and opens the dialog instead. A reader who wanted the file gets a form, reads a note about print dialogs, and has to find the plain-download link inside the dialog to get the thing the icon promised. One click became three and a decision.
- **And it is a one-click impersonation surface.** That effort named it as a risk in its own Risks section: anyone can produce a document that looks like Saud's CV carrying a phone number and an email that are not his. Nothing about the published page makes that harder than clicking the icon on the front door.

# Goal

A reader who clicks the download icon gets the published PDF, immediately, the way the icon says. The form still exists, still stores nothing, still sends nothing, and is reachable only from an address Saud keeps: the document page with `#me` on the end. Every guarantee the four prior efforts made still holds, including the checks that run over a form-produced document, which reach it through the same address a reader does rather than through a door opened for tests.

# Scope

- What the download control does on a click, on both document pages, in both languages.
- Where the dialog's markup lives and when the script binds to it.
- The address that opens the form, and where that address is written down for the person who has to remember it.
- The PDF render step and the form's tests, which drive the form in CI and have to reach it.
- The part of [[efforts/7-document-downloads-and-contact-details/spec]] that this supersedes, marked where a later reader will hit it.

# Requirements

1. **The download icon downloads.** On both document pages, in both languages, a click on the control with no marker present downloads that page's published PDF and opens nothing. No dialog appears, and the reader is not asked for anything.
2. **The form opens only at the marked address.** Where the page's address carries the fragment `#me`, the control behaves as it does today: it opens the dialog, and generating fills the contact line and prints. The marker is a fragment rather than a query parameter because a fragment is never sent in the request, never appears in a referrer header, and never becomes a second indexable address for the same page. It is the same ASCII token in both languages, so it can be typed and bookmarked without switching keyboard. The token is `me` rather than `contact` because `src/pages/[locale]/index.astro:132` already carries `id="contact"` as the home page's contact heading, and one word naming a heading on one page and a behaviour on another is a collision waiting for somebody to trip on it.
3. **The form survives the page it was opened on.** Once a document page has been opened at the marked address, the form stays reachable for the life of that page, whatever the fragment becomes afterwards. The skip link at `src/layouts/Base.astro:274` points at `#content` and is the first focusable element in the body, so the reader this form belongs to, using a keyboard, replaces the fragment before reaching anything else. A gate that reads the address at the moment of the click would be off by then, and silently: the icon would simply download.
4. **Nothing about the marker is remembered.** No `localStorage`, no cookie, no query parameter, no server. The marker lives in the address and nowhere else, so a reader who arrives without it is a reader without the form, on every visit and on every device.
5. **The no-script guarantee is untouched.** With no script, both document pages render in full and the control is the plain link to the published PDF it already is, marker or no marker. Nothing about reaching either document or its PDF requires script.
6. **The checks still fire, through the same door a reader uses.** The render step that produces the filled document for the extraction check, and the tests that drive the form, reach it by navigating to the marked address. No test-only flag, no build-time switch, and no hook that exists solely so a check can pass.
7. **The ungated path is itself checked.** A test asserts that a click on the unmarked page downloads and opens no dialog. A gate nothing tests from the outside is a gate that can stop gating without anything going red.
8. **The superseded requirement says so where it is written.** [[efforts/7-document-downloads-and-contact-details/spec]] requirement 3 and its criteria 3 and 4 state that activating the control presents the form, which stops being true when this lands. That spec keeps its text as the record of what it built, and gains a line pointing here.
9. **The address is documented for the person who needs it.** `docs/development.md`, which already describes the form and the filled render, says which address opens it and that the render step navigates there.

# Acceptance Criteria

1. On `/en/cv/`, `/ar/cv/`, `/en/resume/` and `/ar/resume/`, with script running, a click on `[data-document-download]` downloads that page's PDF and `[data-document-dialog]` never gains its `open` attribute.
2. On the same four pages with `#me` on the address, a click opens the dialog; entering an email and a phone and generating produces a document whose contact line carries both, in that order, at the position effort 7 put them; entering one carries the one. Both behaviours hold in both themes and both directions, and the dialog stays reachable and completable by keyboard alone.
3. On a document page opened at the marked address, the control still opens the dialog after the reader has followed the skip link, and after the fragment has been replaced by any other in-page target. A build where it does not is a build where the keyboard path to the form is broken.
4. After a visit to the marked address, a fresh visit to the unmarked address in the same browser opens no dialog. Nothing the page writes survives the visit: no cookie, no `localStorage` entry, no `sessionStorage` entry.
5. With JavaScript disabled, all four pages render in full and the control resolves to the published PDF, at both the marked and the unmarked address, and neither PDF carries a contact detail.
6. `scripts/render-pdf.mjs` produces the filled document by navigating to the marked address and driving the same controls, and the extraction check over it still finds the name, every experience entry's position, period and organisation, and every education entry's degree, period and institution, in reading order, and still fails on a missing line. Searching the repository for a test-only escape hatch around the gate finds none.
7. A test fails if the gate is removed, and a different test fails if the gate never lets the form open. Both live in `tests/document-form.spec.ts` beside the cases effort 7 left.
8. `.aep/efforts/7-document-downloads-and-contact-details/spec.md` carries a line at requirement 3 naming this effort as what changed it, and its `status` is unchanged.
9. `docs/development.md` names the marked address in the section that describes the form, and `pnpm check` and the integration gate pass with the Lighthouse, contrast, reduced-motion, keyboard and no-script criteria of the prior efforts intact.

# Constraints

- **Everything the four prior efforts constrain still binds:** free static hosting, one content source, two languages with one set of facts, two themes, parser-safe documents, no tracking, no external request, progressive script, stacked changes through Graphite.
- **The gate is not a privacy mechanism, and must not be mistaken for one.** Effort 7's constraint stands unchanged: privacy comes from absence, not from access control. Saud's email and phone number are still in no published file, no commit, and no build output, and the only reason they are safe is that they are never written down here. The fragment keeps the form out of a visitor's way. It protects nothing, and a spec that later treats it as protection has misread this line.
- **The gate is readable by anyone.** The dialog's markup and the inline script ship to every reader, and the token is in the source of a public repository. What this removes is the one-click path to a document in Saud's name, not the capability.
- **A check may not be satisfied by arranging that it cannot run.** The filled-document extraction check is the only place the contact line still exists, and effort 7 added it because removing the email cost the published check one of its anchors. It keeps running over a document produced the way a reader produces one.
- **The template, the type size, and what the form collects do not change.** Two fields, both optional, the same two slots in the contact line, the same white and blue template at the size [[efforts/5-sections-and-resume/spec]] fixed.

# Out of Scope

- **Any real authentication.** No password, no token check, no private deployment, no serverless function that decides who is asking. The site is static files on GitHub Pages and there is nothing to authenticate against, which is why the requirement above is written as a marker rather than as identity.
- **Remembering the marker on a device.** Put to Saud on 2026-09-11 against the four-bookmark cost, and not chosen. A stored flag would mean one visit per device instead of a bookmark, at the cost of a browser that keeps showing the form to whoever uses that machine next.
- **Opening the form by a modifier key or from a second page.** Both were on the table on 2026-09-11. Alt-click leaves nothing in the address to bookmark and has no equivalent on a phone; a second route costs four pages, sitemap and robots exclusions, and dist checks, and its address is no more private than the fragment.
- **Prefilling the form from the content source.** The phone number stays uncommitted and ungitignored-and-unread, exactly as effort 7 fixed. The browser's own autocomplete is as close to a prefill as this gets, and it is the browser's store rather than the site's.
- **Hiding the form from the page source.** Not attempted, not achievable on a static site, and not the point.
- **Changing what the form collects, what the document carries, or where the contact line sits.** Two fields and two slots, as they are.
- **The published PDFs, the JSON Resume documents, and the README.** Unchanged by this, and still carrying no contact detail.
- **A contact form or any means of reaching Saud from the site**, which effort 7 already excluded and this does not revisit.
- **New content.** No project, job, course or credential is added or re-marked.

# Assumptions

- **The form has exactly one legitimate user.** Nobody but Saud has details of his to type into it, so narrowing it to him costs no reader anything. This is the load-bearing assumption of the whole effort: if a reader did have a reason to fill it in, the right change would be a clearer dialog rather than a gate.
- **A fragment is enough of a marker.** It survives a bookmark, it is absent from every address any reader reaches by following a link on the site, and no crawler turns it into a second page. A share flow that rewrites or drops fragments would hand Saud the visitor behaviour, which he would notice immediately and which costs him a retyped address.
- **A fragment naming no element scrolls nowhere**, so the marked page looks identical to the unmarked one at the moment it loads.
- **CI passes the gate by navigating**, because a fragment is part of the address Playwright is given and is present before the script runs. If that turns out to need anything more, requirement 6 is the one to come back to rather than the place to add a flag.
- **Effort 7's other criteria survive untouched.** Its contact-detail absence checks, its nothing-positioned check, and its page budget are about published files, which this does not touch.

# Risks

- **Saud forgets the address and reads the form as broken.** It is the direct cost of storing nothing, and it shows up as him clicking the icon, getting a PDF without his phone number on it, and sending that. Requirement 9 is the mitigation and it is a weak one, because documentation is only read by someone who suspects there is something to read.
- **The tests drift to the marked address everywhere.** Twenty-odd cases in `tests/document-form.spec.ts` drive the form, and the cheapest way to keep them green is to put the marker in the shared setup. Do that for all of them and the ungated behaviour, which is what every real visitor gets, is tested nowhere. Requirement 7 exists because this is the likely failure rather than a theoretical one.
- **A reader who does want a document with their own details typed in loses the ability quietly.** If the assumption above is wrong, the symptom is silence: no error, no report, just a reader who downloaded the plain PDF instead. Nothing in the build can catch this, and the only evidence would be someone saying so.
