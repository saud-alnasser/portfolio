---
status: resolved
blocked-by: [04]
---

# test(cv): nothing inside the document is positioned, which is the clause of criterion 7 nobody checked

## Outcome
The document itself is proven to carry no fixed or absolute positioned element. `documentHazards` proves the table, the image, and the contact block's place in the flow; the fourth thing criterion 7 names has only ever been true by construction, and this effort made that weaker by putting a `<dialog>` on both document pages for the first time. A test asserts it over both documents in both languages, and it reads the document rather than the whole page, because the site's own accessible names are `sr-only`, which is `position: absolute`, and a page-wide rule would refuse them.

## Acceptance Criteria
- [x] A test asserts that no element inside `article.cv` on either document page in either language has a computed `position` of `fixed` or `absolute`, and it passes (criterion 7).
- [x] The test fails when an element inside the document is given `position: absolute`, tried once (criterion 7).
- [x] The reason the assertion is scoped to the document rather than the page is written beside it, naming `sr-only` and the dialog as the elements a page-wide rule would refuse (criterion 7).
- [x] `pnpm test` passes, and the rest of the gate is unchanged: `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test:content` (criterion 7).

## Relevant areas
`tests/resume.spec.ts`, beside the hazard assertions it already makes about the document; `scripts/check-dist.mjs` for the `documentHazards` comment, which lists what is proven where.

## Constraints
- The assertion belongs in a browser test rather than in the dist check. A computed `position` needs layout, and `scripts/check-dist.mjs` reads the built HTML as text.
- Scoped to `article.cv`, not to `body`. Measured on 2026-09-10, both document pages carry ten positioned elements and not one of them is inside the document: the skip link, five `sr-only` spans, the language menu, the download control's accessible name, and the dialog. A page-wide rule would fail on the site's own markup and would have failed before this effort.
- This ticket adds a check. A check that needs the site changed to pass is a finding to raise, not a change to make here.

## Notes
Appended by converge, round one of two. The gap it closes is a criterion of `spec.md` that no ticket named: criterion 7's clause about positioned elements. Stacks on 04, which introduced the dialog this guards against.
