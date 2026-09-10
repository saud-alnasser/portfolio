---
status: resolved
blocked-by: [02]
---

# docs(cv): the four places that still say the control presents the form

## Outcome
No file left in the repository tells a reader that using the download control presents the form. `src/content/README.md` states the one way contact details reach a document as it now works, `src/lib/i18n.ts` and `src/pages/[locale]/index.astro` say where the form opens, and the two document pages stop describing the control as the thing that opens it. Each is one sentence or one clause; nothing about the content contract, the strings, or the pages themselves changes.

## Acceptance Criteria
- [x] `src/content/README.md`'s paragraph under the profile table describes the path a document carrying contact details actually takes, naming the marked address, and keeps every other claim it makes: nothing typed is stored, sent or committed, the published PDFs carry no contact detail, and the field stays (criterion 9).
- [x] The comment above `form:` in `src/lib/i18n.ts` says the form opens at the marked address rather than wherever script runs, and **no string in that file changes**, so the gap report cannot move (criterion 9).
- [x] The comment in `src/pages/[locale]/index.astro` above `actions` no longer tells a reader of the home page that a document page offers them the form (criterion 9).
- [x] `src/pages/[locale]/cv.astro` and `src/pages/[locale]/resume.astro` describe what each page renders without claiming the control opens the form (criterion 9).
- [x] `pnpm check`, `pnpm build` with `[localized] 0 gaps`, `pnpm test`, `pnpm check:dist` and `pnpm test:content` all pass, and `node .aep/scripts/validate.mjs` reports no failures (criterion 9).

## Relevant areas
`src/content/README.md`, the paragraph beginning "The email is held here and published nowhere". `src/lib/i18n.ts:176`, the comment above `form:`. `src/pages/[locale]/index.astro:33`, the comment above `actions`. `src/pages/[locale]/cv.astro:14` and `src/pages/[locale]/resume.astro:14`, the identical clause "the download control, the document, and the form that control opens".

## Constraints
- **Comments and prose only.** No string in `src/lib/i18n.ts`, no field in the content contract, and no markup. A diff that changes behaviour here is the wrong diff.
- `src/content/README.md` is written for whoever adds content next, not for Saud. It already explains why the email is held and rendered nowhere, and that reason is unchanged; what changed is the path a document carrying one takes.
- The two document pages' clause is one phrase in each and the same phrase in both. Keep them identical to each other, as they are today.

## Notes
Found by the first converge round of this effort, reading the whole diff rather than a ticket: [[efforts/11-private-download-form/spec]] requirement 9 and criterion 9 are about `docs/development.md`, and ticket 03 satisfied them, but four other files carried the same claim and the change falsified all four. Correcting them here rather than in a later effort is what keeps the change and the thing it contradicts from landing apart.
