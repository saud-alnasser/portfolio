---
status: resolved
blocked-by: [05]
---

# feat(site): order the studies page as one timeline, courses between school and university

## Outcome
The education page presents studies in order of time as requirement 2 states: high school, then the online courses, then university. Institutions and certificates are one timeline sorted by date, so the 2021 course certificates read before the 2023 degree instead of after it. The CV page keeps its separate Education and Certifications sections, which is the layout resume parsers expect (requirement 5).

## Acceptance Criteria
- [x] On `/en/education/` and `/ar/education/`, every item with a date (an institution by its start, a certificate by its date) appears in ascending order, and a certificate dated before an institution's start renders above that institution (requirement 2, criterion 2).
  Verified 2026-09-09 with a temporary high-school entry (`start: 2018`, a bare year) beside the real content: the rendered order of headings and dates on `/en/education/` began `[2018 to Jun 2021] Probe High School, Python for Beginners [7 Nov 2021], C# [11 Nov 2021], Intermediate Python [26 Nov 2021], ...` and the positions satisfied probe < SoloLearn < Code with Mosh < Saudi Electronic University (`true true true`). The build, `pnpm render:pdf`, and `pnpm check:dist` all exited 0 with the probe present, which also proves the bare-year crash the review found is gone; the probe was removed afterwards.
- [x] Certificates with no date render immediately before the most recent institution, so they sit in the online-courses phase between school and university whatever dated certificates exist, and the page carries a "Certificates" heading at the first certificate so the section the spec names exists here as well as on the CV (requirement 2, criterion 2).
  Verified 2026-09-09 after the second review round, which showed the first rule (after the last dated certificate) would move every undated certificate after university once one certificate dated during the degree existed: with a probe certificate dated `2024-03-01` beside the real content, the 19 undated Code with Mosh certificates still rendered before the Saudi Electronic University entry and the probe rendered after it; without the probe the order is the eight dated 2021 certificates, the 19 undated, then the university, in both locales. `dist/en/education/index.html` carries `<h3 id="certificates">Certificates</h3>` before the first certificate. `README.md`, "education/", documents the rule.
- [x] The CV page's section order is unchanged and `pnpm check:dist`, `pnpm test`, and the education-order probe from ticket 05 (a temporary 2018 high-school entry renders first) still pass (requirement 5, criterion 2).
  Verified: `dist/en/cv/index.html` still carries the `h2` sequence Summary, Experience, Education, Skills, Certifications, Projects and `pnpm check:dist` prints `cv hazards: en/cv/ has no table or image, and its contact block is in the flow` for both locales; `pnpm test` printed `74 passed`; the 2018 probe above rendered first.

## Relevant areas
`src/pages/[locale]/education/index.astro`, `src/components/Education.astro`, `src/components/Certificate.astro`, `src/lib/order.ts`.

## Constraints
- One timeline, one ordering helper; no second list of dates.
- No change to the CV page, the content, or the contract.

## Notes
Raised by the correctness review on 2026-09-09: criterion 2 as worded (education entries ascending) was met, but requirement 2's timeline puts the online courses between high school and university, and the page rendered every certificate after the degree. Built by the orchestrator as a wave of one. The undated rule: an undated certificate follows the last dated certificate; with no dated certificate at all it goes before the last institution. `src/lib/order.ts` now completes a bare year to its first day before comparing, so `2023` sorts before `2023-09` rather than after it, and stringifies a number a YAML parser hands over.
