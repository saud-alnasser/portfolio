---
status: open
blocked-by: [01]
---

# feat(cv): both documents redesigned as one pair, in type rather than in markup

## Outcome

The CV and the resume stop looking like a form and start looking like a document somebody designed. The grey band across every heading is gone, replaced by the heading set in the accent over a hairline rule; the header has a hierarchy; a period is quiet tabular text rather than bold. The markup does not move, so every guarantee that rests on the document's shape holds without being re-earned, and the resume's share of the change returns height to the fit rather than spending it.

## Acceptance Criteria

- [x] The diff over `src/components/CvDocument.astro` touches class strings and comments only. No element is added, removed, or reordered, and `tests/resume.spec.ts`'s project-entry case, the extraction groups in `scripts/check-dist.mjs`, and `documentHazards` all pass without being edited (criterion 4).
- [x] `.cv-band` is gone and the `--band` token with it, from `:root` and from `@theme inline`. A section heading is accent type over a hairline rule, still uppercase and still at `tracking-[0.025em]`, because `pdftotext -layout` turns wider tracking into spaces between the letters (criterion 4).
- [x] The gap between a heading and the block under it stays at 20px on the resume, and the extraction still puts the first entry's dates beside its title rather than on the heading's line. Checked by reading the extracted text, not by reading the rule (criterion 4).
- [x] `tests/theme.spec.ts` asserts the new state of affairs rather than the band's: nothing inside either document's article declares a background colour, so the printed document no longer depends on the reader's background-graphics setting at all (criterion 4).
- [x] Every text and background pair on all six pages meets WCAG AA in both palettes, and axe finds no violation. The contrast tests measure computed colours on the live page, so every colour introduced here is covered without being named (criterion 4).
- [ ] Lighthouse reports at least 90 on the three categories for the home, CV, and resume pages in both languages on the mobile profile (criterion 4).
- [x] The resume's rendered height on `/en/resume/` and `/ar/resume/` is measured before and after, and the ticket records what the change returned. The fit in ticket 05 is budgeted against that number (criterion 2, which ticket 05 owns).
- [x] `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm check`, and `pnpm test:content` pass.

## Relevant areas

`src/styles/global.css`, the CV block and the `@media print` block; `src/components/CvDocument.astro`, the `band`, `row`, `period`, `muted`, and `link` constants and the header block; `tests/theme.spec.ts`; `tests/contrast.spec.ts` and `tests/contrast.ts`, which need no edit and are the check.

## Constraints

- **The type size floor is 10pt and does not move**, as `spec.md` and two prior efforts fix it. A design that needs smaller text is a design this repository refuses.
- **No new markup, and nothing positioned.** `spec.md` refuses a sidebar, a two-column body, an icon standing in for a word, and a skill drawn as a bar. The design is made of type, rule, and colour.
- **The CV takes the same treatment as the resume**, which is Saud's choice of 2026-09-11: the two are one pair and a restyle of one alone makes them read as two unrelated documents.
- The heading must stay a real `<h2>` with real text. Nothing about the look may reach a parser as anything else.

## Notes

The band is the only thing on either document that needs `print-color-adjust: exact`, which `tests/theme.spec.ts` exists to pin. A border is not a background and prints whatever the reader's setting says, so removing the band removes a dependency rather than a decoration, and the test changes to say so.

## What the redesign returned

Measured on the built pages under `media: print`, on the document's own article, before and after. Print is the medium that matters, and the article is the box the fit has to make.

| Page | Before | After | Returned |
| --- | --- | --- | --- |
| `/en/resume/` | 1052.9px | 1033.9px | **19.0px** |
| `/ar/resume/` | 1032.9px | 1013.9px | **19.0px** |
| `/en/cv/` | 3578.5px | 3560.9px | 17.6px |
| `/ar/cv/` | 3534.5px | 3516.9px | 17.6px |

Root size unchanged at 13.33px on the resume and 14.67px on the CV, so the type size did not move and none of this was bought with it.

**This is less than half of what `plan.md` budgeted.** The lever table put the band's vertical padding at about 40px, on the reasoning that five headings carried 8px each. Two things make the real number 19px. The `py-1` the band carried was 4px above the text and 4px below, and only the top 4px is a straight saving: the bottom 4px sat inside the gap that `.cv-compact .cv-heading + *` pins at 20px for the extraction, so closing it moved the block up and the pinned gap put it straight back. And a heading needs a little air between its text and the rule under it, which is `pb-1` on the CV and, on the resume, 2px from the compact rule this ticket adds.

**Ticket 05 is therefore budgeted against 19px, not 40px.** `spec.md`'s measurement stands otherwise: the English resume had about 31mm, roughly 117px, to lose at Letter, and the Arabic about 18mm. After this ticket, English has about 98px left to find and Arabic about 47px. The assumption in `spec.md` that "the first two levers carry English past it with nothing to spare" was written against the 40px estimate and is now 21px weaker, which makes the third lever, a project summary, load-bearing rather than a reserve.

## What changed, and what it looks like

- **The section heading.** The full-width tinted band became the heading set in `--primary`, uppercase, at the same `tracking-[0.025em]`, over a hairline `border-b` in the accent at 40 percent. Tracking did not move, because `pdftotext -layout` turns wider tracking into spaces between the letters.
- **The name block.** The rule under the name, the label, and the contact line went from `border-border` to `border-b-2 border-primary`: heavier than a section heading's rule and in the same accent, so the document's strongest line reads as its strongest line.
- **A period.** `font-semibold` became `text-muted-foreground`, still `tabular-nums`. It is the date on an entry's line, not a second title.
- **A bullet.** `marker:text-primary` on the experience highlights and on the CV's keyword columns. A CSS marker reaches no parser as content.
- **`--band` is retired** from `:root` and from `@theme inline`, and `.cv-band` is gone from the stylesheet. Nothing else read either.

## What it also removed

**The document's last dependency on the reader's print settings.** The band was the only thing on either document declaring a `background-color`, and a browser drops background colours when printing unless the page insists with `print-color-adjust: exact`. A border is not a background, so the declaration went with the band and the printed document now looks the same whether or not the reader has background graphics switched on.

`tests/theme.spec.ts` changed to say so. It used to assert the band kept `print-color-adjust: exact` and painted `rgb(221, 232, 240)`; it now walks the document's article and every element inside it and asserts that not one of them computes a non-transparent `background-color`. The absence is the guarantee, so the absence is what is asserted.

`scripts/render-pdf.mjs` keeps `printBackground: true`, and its comment now says why: it no longer carries a tint, it paints the page itself white rather than leaving it transparent, and a renderer told not to print backgrounds is one whose output depends on nothing ever declaring one again.

## Parked on

**Lighthouse, which this machine cannot run.** Every other criterion is verified and the work is landed. `pnpm lighthouse` dies inside chrome-launcher's `destroyTmp` with `EPERM` on the first audited URL, the English home page, which this ticket does not touch; reproduced in three separate worktrees, so it is the platform rather than the page. Its venue is `.github/workflows/integration.yml`, and the criterion clears when the effort branch is pushed and that workflow is green. The same clause parks ticket 06.

What stands behind it in the meantime: `tests/contrast.spec.ts` runs the full axe WCAG 2 A and AA rule set, contrast included, over the six pages in both palettes and measures computed colours on the live page, so every colour this ticket introduces is covered without being named. It passes, which is the accessibility half of what Lighthouse would have reported.
