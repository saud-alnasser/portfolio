---
status: open
blocked-by: [05]
---

# docs(cv): nothing still says the resume may run to two pages

## Outcome

Every sentence in the repository that describes the resume's budget describes the one it now has. The places that record the two-page budget as history keep it and say it was history; everything else says one page. Effort 5's spec, which is where the budget was widened, says so where a later reader will hit it rather than being left to contradict this effort in silence.

## Acceptance Criteria

- [ ] A search across `scripts/`, `src/`, `docs/`, and `.aep/` for the two-page budget returns only sentences that record it as history. The search and its output are quoted in this ticket's outcome (criterion 8).
- [ ] `.aep/efforts/5-sections-and-resume/spec.md` requirement 10, its constraint on the resume's size, its assumption about headroom, and its risk about the page budget say one page and point here for why it changed back. That spec keeps its own record of what it built, and gains the line rather than being rewritten (criterion 8).
- [ ] `docs/development.md` says the resume is refused past one page, says the generated resume carries no header or footer, says the generated CV still does and why, and names the QR code as the route to the GitHub address (criterion 8).
- [ ] The comments in `src/styles/global.css`, `src/components/CvDocument.astro`, `scripts/render-pdf.mjs`, and `scripts/check-dist.mjs` describe the behaviour those files now have. A comment describing behaviour the code no longer has is the defect two review rounds of effort 5 named twice (criterion 8).
- [ ] `.aep/contexts/repository.md` and `AGENTS.md` describe the pair as it now is, or are confirmed to need no change and that is said (criterion 8).
- [ ] `pnpm check`, `pnpm build`, and `node .aep/scripts/validate.mjs` pass, and the AEP index is regenerated rather than edited.

## Relevant areas

`docs/development.md`, the addresses table and the contact-details section; `src/styles/global.css`; `src/components/CvDocument.astro`; `scripts/render-pdf.mjs`; `scripts/check-dist.mjs`; `.aep/efforts/5-sections-and-resume/spec.md`; `.aep/contexts/repository.md`; `AGENTS.md`.

## Notes

This ticket is last because until the budget is one page the prose saying two is still true. It is also where the reversal is recorded properly: effort 5 widened the budget on 2026-09-10 after the runner refused the branch, and a boundary left standing beside an effort that contradicts it is worse than no boundary.
