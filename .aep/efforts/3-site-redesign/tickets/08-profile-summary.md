---
status: open
---

# feat(content): drop the degree sentence from the profile summary so the README stops repeating it

## Outcome
The profile summary in both languages ends after the work it describes; the sentence about the Saudi Electronic University course work and the pending certificate is gone from `src/content/profile.yaml`, and `pnpm readme` has rewritten the README's profile block from it. The education entry is untouched and keeps its status.

## Acceptance Criteria
- [ ] Neither `README.md`, the home page summary, nor the CV summary in either language contains "certificate pending", "pending", or a sentence about the degree; `pnpm readme --check` reports the README current (criterion 13).
- [ ] The Saudi Electronic University entry still renders its pending wording on the education page and the CV, and `pnpm check:dist` passes including the no-overclaim check (criterion 13).

## Relevant areas
`src/content/profile.yaml`, `README.md` (written by `scripts/readme-profile.mjs`).

## Constraints
- Only the last sentence of `summary` changes, in `en` and `ar`; nothing else in the profile.

## Notes
The plan's technical approach step 6. Independent of every other ticket.
