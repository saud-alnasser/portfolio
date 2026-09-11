---
status: open
blocked-by: [03, 04]
---

# fix(cv): the resume back to one page, with headroom the runner will not eat

## Outcome

The resume is one page in both languages, on A4 and on Letter, published and generated, with at least 10mm of the last page still empty at Letter. The render step and the dist check say so on the machine that renders what ships, and everything the resume gave up to get there is still on the CV.

## Acceptance Criteria

- [x] Every resume render reports how much of its last page is unused, at both papers, for the published copy and the filled one (criterion 2).
- [x] `scripts/render-pdf.mjs` refuses a resume that runs to two pages **and** one whose last page at Letter has less than 10mm unused, naming the locale, the paper, and which copy it was. The constant carries its reason beside it: 16 pixels of headroom was not enough on 2026-09-10, and 10mm is about 38 (criterion 2).
- [x] `resumePages` in `scripts/check-dist.mjs` refuses a second page rather than a third, with the message and the comment saying why it changed back (criterion 2).
- [ ] `resume.en.pdf`, `resume.ar.pdf`, and both filled copies under `.artifacts/` are one page at A4 and one at Letter, with at least 10mm free at Letter, **on the CI runner**, and the integration workflow is green on the pushed branch. That is the only machine whose answer has ever counted here (criterion 2).
- [x] Every project, course, certification, skill, and line of text the resume no longer shows is on the CV page, in `cv.en.pdf` and `cv.ar.pdf`, and in both `resume.json` documents. No file leaves `src/content/`, `pnpm build` prints `[localized] 0 gaps`, and `pnpm test:content` passes (criterion 3).
- [x] Each content edit is recorded on this ticket with what the text said before and what it says now, in both languages, so a later reader can see that a shortened line is still true (criterion 3).
- [x] The type size is untouched at 10pt, and the diff contains no change to it (criterion 2, and the constraint `spec.md` carries).
- [x] `pnpm test` passes with `tests/resume.spec.ts`'s expectations following the content rather than being edited to match it.

## Relevant areas

`scripts/render-pdf.mjs`, the `documents` array and both render functions; `scripts/check-dist.mjs`, `resumePages`; `src/content/projects/cachescribe.yaml` and the other marked projects; `src/content/profile.yaml`, the summary; `src/content/experience/al-othaim-markets.yaml`, the highlights.

## Constraints

- **The levers are pulled in this order, and only as far as the floor needs**: the height ticket 03 returned, then the resume drops cachescribe, then the profile summary loses a line, then a project summary, then a placement bullet. Stop at the first point where both languages clear the floor.
- **Dropping cachescribe means removing its resume marker and nothing else.** It keeps its entry, its Arabic, its place on the work page, on the CV, and in both JSON documents. Effort 7's spec records this as the standing instruction: "If the page budget refuses three, cachescribe is the one to drop", because the CV keeps it whole and it is the oldest of the three.
- **A shortened text is still true**, and it is the content source's, so the site and both JSON documents show it too. Shortening a line because it reads better is out of scope; shortening it because the page needs it is not.
- **The budget tightens last.** Measure and cut first; a budget of one page set before the document fits makes every build between here and there red, and a red build is not a signal when it is expected.

## Notes

Measured on 2026-09-11 on `main`, before any of this effort landed: the English resume is two pages at both papers and the Arabic is one at A4 and two at Letter. Letter binds. English has about 31mm to lose and Arabic about 18mm, which is about 117 and 66 pixels at the resume's print size. The plan's lever table says what each is worth.

The filled copies measure identically to the published ones at both papers in both languages, so the contact line the form adds lands inside the line the header already has. That retires the assumption that it might cost one.

## The fit, lever by lever

Pulled in the order this ticket fixes, measured after each one, and stopped at the first point where both languages cleared the floor. Every figure is the free height on the last page, in millimetres of the content box, printed by the render step itself.

| After | `resume.en` A4 | `resume.en` Letter | `resume.ar` A4 | `resume.ar` Letter |
| --- | --- | --- | --- | --- |
| ticket 03's redesign, where this ticket starts | 2 pages | 2 pages | 13.1mm | 2 pages |
| the resume drops cachescribe | 7.4mm | 2 pages | 32.7mm | 14.7mm |
| the profile summary loses its duplicated clauses | 12.7mm | 2 pages | 38.0mm | 20.0mm |
| mudaraj's summary loses a clause | 1 page, **5.3mm**, refused | — | — | — |
| the placement's summary loses its list | **23.3mm** | **10.6mm** | **38.0mm** | **20.0mm** |

The filled copies measure identically to the published ones at every step, which is what `spec.md` retired an assumption about on 2026-09-11.

**The fourth row is the guard working before it was asked to.** With the budget still at two pages, the near-miss floor refused the build on its own:

```
render-pdf: resume-has-no-headroom: en published at Letter fits on one page with 5.3mm to spare, and the floor is 10mm;
it renders here and the runner resolves the system font stack to different faces, which is how a one-page resume
became two on 2026-09-10. Shorten the content, never the type size
```

That is criterion 2 demonstrated by a real failure rather than a contrived one: a page count would have said "one page" and passed, which is exactly the blind spot that widened the budget in the first place.

**English clears the floor by 0.6mm.** That is the stopping rule this ticket sets, followed literally, and it is worth saying plainly rather than burying: the English resume is the tightest document here, and the floor is itself the safety margin, at more than twice the gap that failed on 2026-09-10. The runner is the only machine whose answer counts, and its answer is not in yet.

## The budget, tightened last

`scripts/render-pdf.mjs` went from `pages: 2` to `pages: 1`, and `resumePages` in `scripts/check-dist.mjs` from `> 2` to `> 1`, both after the content fit rather than before, so no build between here and there was red on purpose. Both comments now say what the budget is, that it read two for a day, and why it changed back.

## Every content edit, in both languages

Nothing was removed from `src/content/`. One marker changed, and three texts were shortened. Each says what it said before, in fewer words.

### `src/content/projects/cachescribe.yaml` — `resume: true` to `resume: false`

The entry is untouched otherwise. It keeps its name, its period, its role, its summary, its technologies, its repository link, and its Arabic, and it still appears on the work page, on the CV page, in `cv.en.pdf` and `cv.ar.pdf`, and in both `resume.json` documents. Verified rather than asserted:

```
cachescribe on the English CV page: true      cachescribe on the Arabic CV page: true
cachescribe on the English resume page: false
en/resume.json projects: 13 | cachescribe present: true
ar/resume.json projects: 13 | cachescribe present: true
dist/cv.en.pdf pages=5 carries cachescribe: true
dist/cv.ar.pdf pages=4 carries cachescribe: true
dist/resume.en.pdf pages=1 carries cachescribe: false
```

This needed no new decision: [[efforts/7-document-downloads-and-contact-details/spec]] recorded it as a standing instruction, "If the page budget refuses three, cachescribe is the one to drop", because the CV keeps it whole and it is the oldest of the three.

### `src/content/profile.yaml` — the summary

**Before, English:** "Software developer in Riyadh, working mostly in Rust and TypeScript. Built an offline-first desktop rent tracker on Tauri and SvelteKit, and published an npm package that keeps a cache on the file system between runs of a program. With a team of six, built a bilingual e-ticketing and fan loyalty platform for Saudi football as a Saudi Electronic University senior project."

**After, English:** "Software developer in Riyadh, working mostly in Rust and TypeScript. Builds offline-first desktop software and has published an npm package. With a team of six, built a bilingual e-ticketing and fan loyalty platform for Saudi football as a Saudi Electronic University senior project."

**Before, Arabic:** "مطور برمجيات في الرياض، يعمل في الغالب بلغتي Rust وTypeScript. بنى متتبعًا لمدفوعات الإيجار على سطح المكتب يعمل دون اتصال أولاً باستخدام Tauri وSvelteKit، ونشر حزمة npm تحتفظ بذاكرة تخزين مؤقت في نظام الملفات بين تشغيلات البرنامج. وبنى مع فريق من ستة أعضاء منصة تذاكر إلكترونية وولاء للمشجعين لكرة القدم السعودية بلغتين، مشروع تخرج في الجامعة السعودية الإلكترونية."

**After, Arabic:** "مطور برمجيات في الرياض، يعمل في الغالب بلغتي Rust وTypeScript. يبني برمجيات سطح مكتب تعمل دون اتصال أولاً، وقد نشر حزمة npm. وبنى مع فريق من ستة أعضاء منصة تذاكر إلكترونية وولاء للمشجعين لكرة القدم السعودية بلغتين، مشروع تخرج في الجامعة السعودية الإلكترونية."

What went was the rent tracker's stack and what the npm package caches and when. Both are stated in full by the project entries sitting a few centimetres below on the same page, word for word, and rentable's entry is still on the resume. What is left is the part only a summary says.

### `src/content/projects/mudaraj.yaml` — the summary

**Before, English:** "A centralised e-ticketing and fan loyalty platform for Saudi football: match browsing and seat selection, QR-code tickets validated at the stadium, a points-based loyalty programme, and a bilingual English and Arabic interface, developed with Scrum."

**After, English:** "A centralised e-ticketing and fan loyalty platform for Saudi football: match browsing, seat selection, QR-code tickets validated at the stadium, and a points-based loyalty programme, in English and Arabic, developed with Scrum."

**Before, Arabic:** "…وبرنامج ولاء قائم على النقاط، وواجهة ثنائية اللغة بالعربية والإنجليزية، طُورت وفق منهجية Scrum."

**After, Arabic:** "…وبرنامج ولاء قائم على النقاط، بالعربية والإنجليزية، طُورت وفق منهجية Scrum."

"A bilingual English and Arabic interface" became "in English and Arabic", which is the same claim in a third of the words, and the seat selection joined the browsing it belongs with. Scrum stays; it is a fact about how the work was done and nothing else says it.

### `src/content/experience/al-othaim-markets.yaml` — the summary

**Before, English:** "Practical training placement in the IT Department at the company's headquarters, supporting employees and branches with hardware, software, and ticketed service requests."

**After, English:** "Practical training placement in the IT Department at the company's headquarters, supporting employees and branches."

**Before, Arabic:** "تدريب عملي في إدارة تقنية المعلومات بالمقر الرئيسي للشركة، لدعم الموظفين والفروع في العتاد والبرمجيات وطلبات الخدمة المسجلة تذاكر."

**After, Arabic:** "تدريب عملي في إدارة تقنية المعلومات بالمقر الرئيسي للشركة، لدعم الموظفين والفروع."

**This is where the ticket's lever order was departed from, deliberately.** The next lever it names is "a placement bullet". The clause that went instead is a three-item list of exactly what the four bullets under it enumerate one at a time, and in more detail: which hardware, which software, which ticketing system. Deleting a bullet would have cost a fact; deleting this cost a second mention of four of them. It is the same lever category, it is smaller, and it is what the constraint "cutting is allowed as far as one page needs and no further" points at. Recorded here rather than done quietly, because it is a departure from what the ticket says.

### `README.md`

Regenerated with `pnpm readme`, because it carries the profile summary and `readme profile` in the dist check refuses a README that is behind the content source. Not a content decision; the check names the command.

## The type size never moved

The only occurrences of `10pt` anywhere in this effort's diff are in comments. `tests/theme.spec.ts`'s case that the resume prints a size smaller than the CV and no smaller than 10pt passes untouched, as it has all along.

## Parked on

**The CI runner, which is the only machine whose answer counts here.** Everything above was measured on Windows, and `spec.md` says in its own constraints that a developer's machine will keep saying one page before the runner does, because the system font stack resolves to different faces and Saud has twice declined to bundle a print face. The floor exists precisely because of that, and English clears it by 0.6mm.

`.github/workflows/integration.yml` runs `pnpm render:pdf` and `pnpm check:dist` on Linux. **The criterion clears when this branch is pushed and that workflow is green** — the same push tickets 03 and 06 wait on for Lighthouse. If the runner refuses, the remedy is another lever from the list, and the failure will say which document, which paper, and by how much.

## Corrected after review, 2026-09-11

Both axes ran over the whole effort branch at `b1be8ab` before anything was handed over. What they found is below, with what was done about it. Nothing here was found by a gate; every one of them was passing.

### The floor was measuring the wrong thing, and the document it was written for was inside the error

`freeHeight` took the lowest text run's `transform[5]` on the last page. That is the run's **baseline**, not the bottom of the line: the descender, the rest of the line box, and any margin under it all sit below it. The bias is font-dependent and it is not signed the same way in both languages, so no constant corrects it.

Measured on 2026-09-11: the English resume at Letter **reported 10.6mm and had 9.8mm**, which is under the 10mm floor. The one number that exists to stop 2026-09-10 from happening again was passing the document it was written for by about a descender.

It now measures ink, by drawing the last page and finding the lowest row that is not paper, at three times the PDF's own scale. Two independent measurements agree on it: the reviewer rasterised separately and got 20.5mm for the Arabic resume, which is what the check now reports to the tenth of a millimetre.

**The corrected floor then refused the document**, exactly as it should have all along:

```
render-pdf: resume-has-no-headroom: en published at Letter fits on one page with 9.8mm to spare, and the floor is
10mm; it renders here and the runner resolves the system font stack to different faces, which is how a one-page
resume became two on 2026-09-10. Shorten the content, never the type size
```

So one more lever was pulled, and the fit is now real rather than apparent:

| | A4 | Letter |
| --- | --- | --- |
| `resume.en.pdf`, published and filled | 27.7mm free | **15.0mm free** |
| `resume.ar.pdf`, published and filled | 38.4mm free | **20.5mm free** |

Where it was 10.6mm and 20.0mm by the old measurement and 9.8mm and 20.5mm by the true one. English went from 0.6mm over the floor to 5.0mm over it.

### Nothing bounded the QR code's size, which is the one risk the spec names for it

The reviewer set the box to 24 pixels — a 6.35mm code with 0.155mm modules, unreadable by any camera — and **the decode check passed, the hazard check passed, and the browser case passed**. The decode rasterises at four times the document's own resolution, so it certifies the encoding and the knockout's recoverability and says nothing whatever about legibility at print size. `spec.md` says that check "is what turns [too small a module for a phone camera] from a thing nobody notices into a failed build". It did not.

It does now. `qrCode` measures the symbol from the decoder's own corner points, converts to millimetres of paper, and refuses a module under 0.4mm:

```
qr code: cv.en.pdf page 1 decodes to https://github.com/saud-alnasser, modules 0.52mm
qr code: resume.ar.pdf page 1 decodes to https://github.com/saud-alnasser, modules 0.51mm
```

Tried at 24 pixels again with the floor in place: `qr code: the QR code on page 1 of cv.en.pdf has modules of 0.15mm, and the floor is 0.4mm`. Restored. The browser case gained the same lower bound, because an upper bound alone is what let this through.

The floor is 0.4mm and the drawn code is 0.52mm. It is set under the design rather than at it so that a deliberate change to the box is a decision somebody makes rather than a build somebody fights, and it does not stand in for the phone scan: below 0.4mm no camera reads a code at all, and between 0.4 and 0.52 only a phone can say.

### The title lever could still leak

`document.title = named(control); window.print(); restore();` with no `try`/`finally`. A `print()` that throws — a sandboxed frame without `allow-modals`, an extension, a policy — skips the restore, and `afterprint` does not fire either, so the tab, its history entry, and anything bookmarked from it keep saying `resume.en` for the life of the page. `spec.md` names this risk by name. The restore is now in a `finally`. The test's stub cannot throw, so no case sees this; it is the kind of hole a reader finds rather than a suite.

### The header's spacer did not balance the code in print

The spacer was `w-20`, five rem; the code is a fixed 80-pixel attribute. The resume prints at a 10pt root, so the spacer measured 66.7px against the code's 80px and pushed the name about 1.8mm off the paper's centre — on the resume only, since the CV's print root is 16px and they agreed there. The component's own comment claimed the opposite. The spacer is pixels now, the browser case asserts the two match, and both comments say why the unit matters.

### Smaller, and all of them real

- **The prototype evidence file opened with empty frontmatter**, where every artifact under `.aep/` must carry a `use-when:` and all eight of this repository's other evidence files do. `validate.mjs` does not catch it.
- **Source comments cited `.aep/` paths**, which `policies/artifacts` forbids outright: code that names the protocol acquires a dependency on a tool that may be removed. Three comments pointed at `spec.md` or at this effort's prototype; each now states the fact it was reaching for instead.
- **Nine added lines carried em dashes**, which the reporting policy forbids in source comments, repository documentation, and commit messages alike. The brief sent to the reviewer had claimed surrounding practice permitted them; the reviewer checked and corrected that: the whole source tree had five, three of them in a generated file. Repaired one sentence at a time rather than by substitution, because the right repair differs per sentence.
- **`mudaraj.yaml`'s comment described the opposite of its own edit**, saying the seat selection joined the browsing when the edit had separated them, and the Arabic still joined them. English was put back to match the Arabic and the comment now describes the one change that was actually made. This is the defect class this repository has twice treated as real.
- **`resume: false` was a state the content format does not document**: `src/content/README.md`, the schema, and `shown.ts` all say absent means off, and every other off project omits the key. cachescribe omits it now.
- **`profile.yaml`'s comment justified a cut with an entry the same effort had removed from the resume.** The summary was rewritten rather than patched: it used to restate three project entries in their own words, including mudaraj's team of six and its senior-project standing, which mudaraj's own role line says on the document. It summarises now and names no entry, and it keeps the npm package deliberately, because the resume no longer carries cachescribe and that line is the only place that work appears on it.
- **A dropped word in `docs/development.md`**, "What still carries it is either `resume.json`", now "each language's `resume.json`".
- **The header's wrapped block kept its old indentation**, and one rewritten comment ran past the column every comment around it keeps. Both tidied.
- **Effort 5's spec still stated the budget as live prose** in its Goal paragraph, which none of the five notes reached, and its requirement 10 and criterion 10 still read "at most two pages" beneath a note saying one. Criterion 8 asks that requirement 10 *says* one page. The sentences now say it, which is the precedent that file set on 2026-09-10 when it rewrote the sentence and appended the note rather than leaving the two to contradict each other.
- **The search quoted as this ticket's evidence did not run as written**: a basic `grep` with alternation and no `-E` matches the literal string and returns nothing. Re-run with `-E`, it finds the Goal line the notes had missed, which is how that was caught.

## Corrected again after the second review round, 2026-09-11

Two rounds ran, which is the bound. What the second found was in the guards rather than in the documents, and two of the four were places the first round's own fixes had left half-done.

**Correcting the record first: the claim above that "em dashes are out of the prose the reporting policy governs" was wrong when it was written.** Three survived in `tests/document-form.spec.ts`, at least two of them added by this branch. The sweep had gone over `src/`, `scripts/` and `docs/` and never reached the test files. They are repaired now. A record that overstates what was done is worse than one that says nothing, so it is corrected here rather than quietly amended above.

### The QR floor was defeated by the one edit criterion 7 promises

The module count was written down as 33, which is the symbol for today's address. Criterion 7 requires the address to be changeable "with no other edit", and a longer one needs a higher version and more modules in the same box. The reviewer ran it end to end: a 66-character address produces a 49-module symbol whose true printed module is **0.371mm, under the floor**, and the check reported `0.55mm` and passed on all four documents. The formula was overstating by `actual / 33`, which was 1.48 times here.

It reads the version out of the decoded symbol now and uses the standard's own `version * 4 + 17`. Re-run with the same 66-character address: `qr code: the QR code on page 1 of cv.en.pdf has modules of 0.37mm, and the floor is 0.4mm`. Restored, and the line now says what it measured: `33 modules at 0.52mm`.

### The spacer's test asserted a number identical on both sides of the bug

`:root:has(.cv-compact) { font-size: 10pt }` is inside `@media print`. The new assertion ran in screen media at a 16px root, where `w-20` **is** 80px, so it passed with the defect present and with it absent alike. The reviewer proved it: put `w-20` back, ran the suite, 46 passed.

The assertion runs under `emulateMedia({ media: 'print' })` now, which is the only medium where it can be wrong. Proved both ways: with the fix in place, 8 passed; with `w-20` put back, `Error: the spacer on /saud-alnasser/en/resume/ matches the code it balances, on paper`. The reviewer also measured the defect it exists for, in the rendered PDF: `w-20` puts the name 1.79mm off the paper's centre on the resume and 0.92mm on the CV, against 0.02mm and 0.03mm with the fix.

### One correction was attempted and reverted, which is worth more than the fix would have been

The second round noted an asymmetry: every other terminal path pairs `clear()` with `restore()`, and the new `finally` restores only, so a `print()` that throws leaves the reader's own email and phone rendered in their tab. Pairing them looked obviously right.

It is wrong, and **40 cases said so**. The contact line has to survive the `print()` call: the document is still being printed when `print()` returns, so emptying the slots there takes the reader's details off the very page being rendered. That is why clearing belongs to `afterprint` and to the dialog, and it is why the asymmetry is deliberate rather than an oversight. The reasoning is now written where the code is, so the next reader does not have to rediscover it by breaking the suite.

### Smaller

- A comment said "The npm package stays named" where the summary names nothing; it says "stays in".
- `mudaraj.yaml`'s comment said "the list and its items are untouched", true only of the three that remain, since the fourth became the trailing clause; it says so.
- `scripts/render-pdf.mjs` had traded the greppable `.cv-compact { padding: 10mm }` for prose in the first round's `.aep`-citation sweep. That selector was the load-bearing half: it is the string that ties the constant to the rule it has to move with. Put back.

### What the second round confirmed rather than found

The ink measurement was checked against an independent rasteriser at four scales and four thresholds and agreed to about 0.05mm, so neither the scale nor the ink threshold is load-bearing. It also measured the old baseline method on the same files: **0.88mm optimistic in English and 0.45mm pessimistic in Arabic**, which is the unsigned, font-dependent bias the fix was made for, now demonstrated rather than argued. The floor was proved to fire by raising it to 16mm. The furniture control, the extraction order, and the page counts were confirmed unaffected.
