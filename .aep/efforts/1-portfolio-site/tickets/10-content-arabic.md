---
status: open
blocked-by: [04, 05]
---

# feat(content): author the Arabic text for every entry and the UI strings

## Outcome
Every `localized` field in the content and every UI string has an `ar` value that Saud has read, so the Arabic pages and the Arabic CV carry no English fallback and the gap report is empty.

## Acceptance Criteria
- [ ] The build's gap report lists no missing `ar` text, and `dist/ar/**` contains no English fallback text where an Arabic value was expected (criterion 13).
- [ ] The Arabic education wording for `certificate-pending` states that course work is complete and the certificate is pending, and claims nothing stronger (requirement 4).
- [ ] Saud has read every Arabic string; the ticket's notes record the date and the commit he reviewed (requirement 13).
- [ ] `/ar/resume.json` validates and its text fields are Arabic (criterion 6, criterion 13).

## Relevant areas
`src/content/**` (`ar` keys only), `src/lib/i18n.ts`.

## Constraints
- An agent may draft; nothing lands as reviewed until Saud says so in the turn that lands it. This is a hiring document.
- Facts (dates, links, technologies) are not touched; only `ar` text keys are added.

## Notes
The plan's technical approach step 3, Arabic half, gated on the English content and the UI-strings file from ticket 05.
