---
status: resolved
blocked-by: [01]
---

# feat(cv): the download icon downloads, and the form opens only at the marked address

## Outcome
A click on the download control downloads that page's published PDF, on both document pages in both languages, with no dialog and nothing asked. At the marked address the control opens the form exactly as it does today. The gate is the latched boolean in the plan's Interfaces, living inside `documents()` in the layout's inline script, and both paths have tests of their own.

## Acceptance Criteria
- [x] On all four document pages, a click on the control at the plain address downloads that page's PDF and `[data-document-dialog]` never gains `open` (criterion 1).
- [x] On all four pages at the marked address, the form opens, carries what was typed into the contact line in order, carries the one value where one was typed, and prints once, in both themes and both directions and by keyboard alone (criterion 2).
- [x] After the skip link has replaced the fragment with `#content`, and after the fragment is set to any other in-page target, the control still opens the dialog (criterion 3).
- [x] A visit to the marked address leaves nothing behind: a later visit to the plain address downloads, and the only storage entry anywhere is the theme key (criterion 4).
- [x] With JavaScript disabled, all four pages render in full and the control is the plain link to the published PDF at both the plain and the marked address (criterion 5).
- [x] Removing the guard fails the case for criterion 1, and a guard that never passes fails the cases for criterion 2 (criterion 7).
- [x] No new string enters `src/lib/i18n.ts`, the gap report does not grow, and the Lighthouse, contrast, reduced-motion and keyboard gates pass as they do today (criterion 9).

## Relevant areas
`src/layouts/Base.astro`: `documents()` at `:169`, its click handler at `:200`, and the comment above `<script>` at `:70`. `src/components/DocumentDownload.astro` and `src/components/DocumentForm.astro`, for their comments. `tests/document-form.spec.ts`, where the new cases sit beside the ones effort 7 left, and `:256` for the no-script case that gains a second address. The skip link the criterion 3 case drives is at `src/layouts/Base.astro:274`.

## Constraints
- **The early return at the top of `documents()` does not gain the marker check.** The handlers have to be bound for the latch to be able to fire later, so the guard goes inside the click handler, after the control lookup and before `preventDefault()`. A marker check at the top of the function looks tidier and breaks the latch.
- **The latch only ever turns on.** A `hashchange` that is not the marker leaves it alone. The comment beside it carries the reason, which is the skip link.
- **Drive `location.hash` the way a reader does** in the criterion 3 case. `history.replaceState` fires no `hashchange` and would read as a broken latch.
- The three comments say what is true afterwards: the layout's script block, and both components. The download control's comment currently explains itself as a link for the no-script guarantee, which is now half the reason.
- Nothing in the markup is added or removed, and the dialog still ships to every reader.

## Notes
The plan's Interfaces section is the contract, down to the lowercased comparison and where the guard sits. Its technical approach step 2 says why this is the first point at which the site behaves differently.
