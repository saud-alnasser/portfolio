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
