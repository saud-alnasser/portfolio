---
status: resolved
blocked-by: [01]
---

# docs(repo): the README links the CV page alone, and the profile summary names finished work only

## Outcome
The README's profile block carries the summary, the two portfolio links, one CV link to the CV page on the site, the email, and the skills block; the PDF and JSON Resume links are gone from the generator. The profile summary in both languages names the rent tracker, the persistent cache package, and the senior-project ticketing platform, and nothing whose status is `in-progress`. `pnpm readme` has rewritten the block and the result is committed.

## Acceptance Criteria
- [x] `README.md`'s profile block contains the summary, the two portfolio links, exactly one CV link whose address is `/en/cv/` on the site, and the email, and contains no `.pdf` and no `resume.json` address; the skills block follows it as today; `pnpm readme --check` passes and `pnpm check:dist` (`readmeProfile`) passes (criterion 13). Verified 2026-09-10 on the integrated effort branch: the generator's CV line is `- 📄 CV: [read it](${at('/en/cv/')})` and nothing else in it moved; `grep -nE "\.pdf|resume\.json" README.md` prints nothing; the block reads summary, `🌐 Portfolio` with both languages, one `📄 CV` line at `https://saud-alnasser.github.io/saud-alnasser/en/cv/`, `✉️ Email`, then `## 🧰 What I work with` inside the markers; `pnpm readme --check` printed `readme-profile: README.md carries the profile as src/content/ states it`; the child's `pnpm check:dist` ended `readme profile: README.md carries the profile as src/content/ states it` with every other check green.
- [x] The profile summary in `src/content/profile.yaml`, in both languages, names no project whose status is `in-progress`: a search of `README.md`, both home pages, both CV pages, and both resume pages for "Nova", "nexuscord", "ETG", "Trengo", "AEP", "programming language", "bot framework", and "engineering protocol" and their Arabic renderings finds nothing in the summary; recorded in the ticket (criterion 3). Verified in two halves. The implementer ran it on 2026-09-10 over the README, both home pages, and both CV pages, which were all that existed on its branch. The orchestrator repeated it on the integrated branch, over all seven files including the two resume pages ticket 03 added: `\bNova\b` returns 0 in every one of them, and there is no hit at all for nexuscord, ETG, Trengo, AEP, bot framework, engineering protocol, or the Arabic renderings. The only match anywhere is the skill group heading "Programming languages", which the resume prints as `<span class="font-medium">Programming languages</span>` in its skills block and is not the summary; the case-insensitive "nova" the implementer chased down is the substring inside `Renovate`, a tool in the same block. The summary itself renders as one text on all six pages, naming the rent tracker, the cache package, and the senior project.
- [x] Removing a link from the generator and running `pnpm readme --check` against the stale README fails naming the README, tried once, so the check still guards the block (criterion 13). Verified 2026-09-10 by the implementer, reconciled by the orchestrator: with the email line deleted from the generator and the README as committed, `pnpm readme --check` printed `readme-profile: README.md is behind src/content/ or astro.config.mjs; run \`pnpm readme\`` and exited 1; the generator restored, the check passed again and the diff was the one CV line.

## Relevant areas
`scripts/readme-profile.mjs`, `src/content/profile.yaml`, `README.md`, `docs/development.md` (the addresses table, if ticket 03 has not yet landed its row).

## Constraints
- The README line is the plan's "Interfaces": `- 📄 CV: [read it](<site>/en/cv/)`. The emoji style is the first effort's declared deviation and stays.
- The Arabic summary is a draft until Saud reads it on the published site, as the first effort's assumption states; write it beside the English.
- Only the summary changes in the profile; the label, the location, and the profiles do not.

## Notes
The plan's technical approach step 4. Stacks on 01, because the summary names projects by their confirmed status; gates nothing.
