---
status: open
blocked-by: [04]
---

# test(cv): no published file carries a contact detail, and the generated document extracts

## Outcome
Two guarantees become checks the build runs. `scripts/check-dist.mjs` gains `noContactDetails`, which reads the address from `src/content/profile.yaml` and refuses to find it, or a `mailto:`, or a phone-shaped digit run, anywhere under `dist/`, in the extracted text of all four published PDFs, or in `README.md`. And `scripts/render-pdf.mjs` renders each document a second time per language through the form, with values that are obviously not real, to `.artifacts/` rather than `dist/`, so the extraction check can assert that a reader's document carries the typed details at the head of its reading order and still runs within the two-page budget.

## Acceptance Criteria
- [ ] `noContactDetails` passes over a built tree and fails when the email, a `mailto:`, or a phone number is put back into any published file, tried once for each of the three (criterion 2).
- [ ] `noContactDetails` fails loudly when `src/content/profile.yaml` holds no email at all, rather than passing because it had nothing to look for, tried once (criterion 2).
- [ ] The render step writes a filled document per document per language to `.artifacts/`, and `.artifacts/` is gitignored and absent from what the deploy uploads (criterion 7).
- [ ] The extraction check runs over `.artifacts/<document>.en.filled.pdf` and finds the placeholder email and phone at the head of the reading order, then the name, every experience entry's position, period, and organisation, and every education entry's degree, period, and institution, in reading order, and fails on a missing line, tried once (criterion 7).
- [ ] Both published PDFs still extract as they did, and the resume, published and filled, has no more than two pages in each language at A4 and at Letter; the render step and the dist check each fail if one has more, tried once (criterion 7).
- [ ] The full gate passes: `pnpm build`, `pnpm render:pdf`, `pnpm check:dist`, `pnpm test`, `pnpm test:content` (criterion 2, criterion 7).

## Relevant areas
`scripts/check-dist.mjs` (`noContactDetails` beside `noOverclaim`, and `documentPdfs` extended), `scripts/render-pdf.mjs` (the filled render), `.gitignore`, `.github/workflows` (the integration gate, if the filled render needs a step of its own), `docs/development.md`.

## Constraints
- A generated document must never be written into `dist/`. `dist/` is what the deploy uploads (`.github/workflows/deploy.yml:78`), so a filled document written there would publish the contact details this whole effort exists to keep out. `.artifacts/` is new for exactly this reason.
- The placeholder values are `check@example.com` and `+966500000000`, obviously not real, so a filled artifact that escapes is embarrassing rather than harmful.
- `noContactDetails` reads the email from the content source rather than a literal, which is what keeps it true if the address ever changes. The plan names the failure mode this avoids.
- This ticket adds checks; it does not change what the site renders. A check that needs the site changed to pass is a finding to raise, not a change to make here.

## Notes
The plan's technical approach step 5, last because it checks the four before it. Stacks on 04.
