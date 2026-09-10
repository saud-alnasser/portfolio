---
status: open
---

# feat(content): a nationality on the profile, Mudaraj on the resume, and the email recorded as unrendered

## Outcome
The profile schema carries a localized `nationality` and `src/content/profile.yaml` carries its value in both languages. `src/content/projects/mudaraj.yaml` carries `resume: true`, so the resume's project set becomes Mudaraj, rentable, and cachescribe. `src/content/README.md` documents the new field and says plainly that the `email` in the content source is not rendered by the site, so that a later reader does not helpfully put it back. Nothing renders the nationality yet; that is ticket 02, which rewrites the contact line.

## Acceptance Criteria
- [ ] The profile schema requires `nationality` as a localized field, the build refuses a profile without it, and `src/content/profile.yaml` carries it in English and Arabic (criterion 5).
- [ ] The resume page in each language shows Mudaraj, rentable, and cachescribe and no other project, and the projects section of the site and the CV are unchanged by the marker; removing `resume: true` from any one of the three removes it from the resume alone, tried once (criterion 6).
- [ ] `src/content/README.md` documents the nationality field and states that the email is held but not rendered, naming what renders contact details instead; `pnpm test:content` passes (criterion 9).
- [ ] `pnpm check` reports no error and the build's gap report does not grow (criterion 8).

## Relevant areas
`src/content.config.ts` (the profile collection), `src/content/profile.yaml`, `src/content/projects/mudaraj.yaml`, `src/content/README.md`, `scripts/test-content-mechanism.mjs`, `tests/resume.spec.ts` which derives its project expectation from the content source.

## Constraints
- The nationality is authored as a fact on a hiring document, per the spec's last constraint. "Saudi" and its Arabic, nothing inferred from the location.
- The email stays in the content source. Removing it is not this ticket's job and is not any ticket's job; the spec's assumptions say why, and criterion 9 exists so the reason is written where the next author will look.
- The resume's project set may not fit the two-page budget. That is ticket 05's check and ticket 04's page, not this one's: author the marker, and if a later ticket finds three projects will not fit, the spec's assumption names cachescribe as the one to drop.

## Notes
The plan's technical approach step 1. Nothing gates it.
