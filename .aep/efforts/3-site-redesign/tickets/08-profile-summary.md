---
status: resolved
---

# feat(content): drop the degree sentence from the profile summary so the README stops repeating it

## Outcome
The profile summary in both languages ends after the work it describes; the sentence about the Saudi Electronic University course work and the pending certificate is gone from `src/content/profile.yaml`, and `pnpm readme` has rewritten the README's profile block from it. The education entry is untouched and keeps its status.

## Acceptance Criteria
- [x] Neither `README.md`, the home page summary, nor the CV summary in either language contains "certificate pending", "pending", or a sentence about the degree; `pnpm readme --check` reports the README current (criterion 13). Verified 2026-09-09: `pnpm readme --check` printed "README.md carries the profile as src/content/ states it"; occurrence counts of "pending", "Saudi Electronic", "Bachelor", "الشهادة", and "بكالوريوس" were 0 in `README.md`, `dist/en/index.html`, and `dist/ar/index.html`; in `dist/{en,ar}/cv/index.html` every hit sits in the education entry's `data-status="certificate-pending"` line and none in the summary paragraph.
- [x] The Saudi Electronic University entry still renders its pending wording on the education page and the CV, and `pnpm check:dist` passes including the no-overclaim check (criterion 13). Verified 2026-09-09: `dist/en/education/index.html` carries "Course work completed, certificate pending" and `dist/ar/education/index.html` "اكتملت المقررات الدراسية، ولم تصدر الشهادة بعد"; both `resume.json` files keep `"status":"certificate-pending"`; `pnpm build` (0 gaps), `pnpm render:pdf`, and `pnpm check:dist` passed, including "no overclaim" and "readme profile".

## Relevant areas
`src/content/profile.yaml`, `README.md` (written by `scripts/readme-profile.mjs`).

## Constraints
- Only the last sentence of `summary` changes, in `en` and `ar`; nothing else in the profile.

## Notes
The plan's technical approach step 6. Independent of every other ticket.
