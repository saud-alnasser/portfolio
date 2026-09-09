---
status: resolved
blocked-by: [04, 05]
---

# feat(content): author the Arabic text for every entry and the UI strings

## Outcome
Every `localized` field in the content and every UI string has an `ar` value, so the Arabic pages and the Arabic CV carry no English fallback and the gap report is empty. Saud reads the Arabic on the published site, and any correction is a later effort.

## Acceptance Criteria
- [x] The build's gap report lists no missing `ar` text, and `dist/ar/**` contains no English fallback text where an Arabic value was expected (criterion 13).
  Verified 2026-09-09 after integration: `pnpm build` printed `[localized] 0 gaps` and built 8 pages; the child grepped 34 English content and UI values over `dist/ar/**/*.html` and matched nothing. Eight certificate names are product names with no Arabic rendering (Docker, Git, React, C#, and so on) and carry the Latin name as their `ar` value on purpose.
- [x] The Arabic education wording for `certificate-pending` states that course work is complete and the certificate is pending, and claims nothing stronger (requirement 4).
  Verified: `dist/ar/cv/index.html` renders `اكتملت المقررات الدراسية، ولم تصدر الشهادة بعد`; a grep of `dist/ar` for `تخرج` and `حاصل على` finds the root only in the course name `مشروع التخرج` (Senior Project) and in the Mudaraj project's role, never about the degree.
- [x] Saud has read every Arabic string, or has decided in writing when he reads it and the ticket's notes record the decision and the commit the strings are at (requirement 13).
  Verified 2026-09-09: Saud decided to read the Arabic on the published site, after the merge, and to carry any correction as a later effort ("cannot view it now until it's merged into main work tree so for now run /aep:implement so we can merge they if changes needed we do another effort"); the spec's assumption on Arabic records that decision. The strings he will read are the ones drafted at d67d72a: a diff of the Arabic lines in `src/content/**` and `src/lib/i18n.ts` between d67d72a and this head is empty. The criterion first read "Saud has read every Arabic string"; it was reworded to what the spec now assumes, and nothing here is claimed as reviewed by him.
- [x] `/ar/resume.json` validates and its text fields are Arabic (criterion 6, criterion 13).
  Verified: `pnpm check:dist` printed `ar/resume.json: valid, work 1, education 1, certificates 27, skills 7, projects 19`; `basics.name` is `سعود الناصر`, `basics.label` `مطور برمجيات`, `education[0].institution` `الجامعة السعودية الإلكترونية`, `work[0].name` `أسواق العثيم`; the child's field audit found 108 text fields with `meta.language: ar` and only the eight product names without Arabic letters.

## Relevant areas
`src/content/**` (`ar` keys only), `src/lib/i18n.ts`.

## Constraints
- An agent may draft; nothing lands as reviewed until Saud says so. This is a hiring document.
- Facts (dates, links, technologies) are not touched; only `ar` text keys are added.

## Notes
The plan's technical approach step 3, Arabic half, gated on the English content and the UI-strings file from ticket 05.

Drafted 2026-09-09 by a dispatched implementer and integrated as a draft: 115 `ar` lines added across 56 content files with no fact or English text changed, and six UI strings in `src/lib/i18n.ts` corrected (`period.present`, `cv.description`, the `certificate-pending` wording, `home.location`, `experience.highlights`, `project.live`). Nothing is published by this: the site deploys only when the effort merges.

**Unread by Saud at the close.** The reading copy is the review sheet the child wrote (one table per file, English beside Arabic, 153 rows), handed to Saud twice in the sessions of 2026-09-09; he chose to read the Arabic on the published site instead and to correct it, if needed, in a later effort. Until that reading every Arabic string on the site and in the Arabic CV is a draft an agent wrote.
