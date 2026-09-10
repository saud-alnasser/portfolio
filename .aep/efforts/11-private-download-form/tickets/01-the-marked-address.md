---
status: open
---

# refactor(cv): the marker token in one place, and every driver navigating to the marked address

## Outcome
The token exists once, in a new `scripts/form-marker.mjs`, and everything that drives the download form reaches it by navigating to the marked address: the filled render in `scripts/render-pdf.mjs`, and every case in `tests/document-form.spec.ts` and `tests/resume.spec.ts` that expects the dialog to open. Nothing under `src/` is touched, so the built site is unchanged and the fragment is inert. This is the step that lets the gate arrive on a green branch instead of a red one.

## Acceptance Criteria
- [ ] `scripts/form-marker.mjs` exports the token once, with a comment saying why it lives there rather than in each consumer, on the model of `scripts/placeholder.mjs` (criterion 6).
- [ ] `renderFilled()` in `scripts/render-pdf.mjs` navigates to the marked address, and the filled render still passes its own `form-did-not-fill` check and still produces a document the extraction check reads (criterion 6).
- [ ] Every case in `tests/document-form.spec.ts` that expects the dialog navigates to the marked address, built from the module's token (criterion 2).
- [ ] The keyboard case at `tests/resume.spec.ts:166` navigates to the marked address, and its comment says which half of the keyboard path it covers (criterion 2).
- [ ] `pnpm build`, `pnpm render:pdf`, `pnpm test` and `pnpm check` pass, and the diff touches no file under `src/` (criterion 6).

## Relevant areas
New `scripts/form-marker.mjs`, beside `scripts/placeholder.mjs` which is the model for a value two consumers share. `scripts/render-pdf.mjs`, `renderFilled()` at `:177` and its `ready()` at `:186`. `tests/document-form.spec.ts`, whose `url` constant at `:61` every case navigates to. `tests/resume.spec.ts:166`, the keyboard case that presses Enter and expects the dialog.

## Constraints
- **The marker does not go into a shared `beforeEach` or into the `url` constant.** The plain address keeps its own identifier and each case that wants the marked one names it. This is the failure the spec's requirement 7 exists to prevent, and it is the first thing a reviewer should look for.
- **Do not add the gate here.** A branch that gates the form in this ticket is the red branch the ordering exists to avoid.
- Build the marked address by appending the token to a finished address, never by passing a fragment through `joinBase()`.

## Notes
The plan's technical approach, step 1, which also says why this lands before the gate: an ungated form opens at any address, and nothing under `tests/` pins a page address.
