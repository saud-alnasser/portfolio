---
status: resolved
---

# feat(content): add the certificate documents to the content source with their previews and the script that renders them

## Outcome
Each certificate entry names its PDF through a `document` field the schema checks for existence, with the WebP preview beside it checked the same way; the 27 PDFs from Drive are under `src/content/certificates/files/` named by entry id, with their previews rendered by `scripts/certificate-previews.mjs` over pdfjs-dist, a prebuilt canvas, and sharp; `src/content/README.md` documents the field and `docs/development.md` the command. Nothing renders the documents yet; that is ticket 06.

## Acceptance Criteria
- [x] All 27 certificate entries carry `document`, the 27 PDFs and 27 previews exist under `files/`, and an entry naming a file that does not exist fails the build naming the file, checked once with a wrong name (criterion 7). Verified 2026-09-09: 27 `document` lines, 54 files under `files/` (27 PDFs byte-identical to Drive by `cmp`, 27 WebPs); `document: files/code-with-mosh-reactt.pdf` failed `pnpm build` naming both `files/code-with-mosh-reactt.pdf` and `files/code-with-mosh-reactt.webp` as not existing.
- [x] `pnpm certificates:previews` regenerates every preview at 1600 pixels wide as WebP, and running it twice changes nothing (criterion 7). Verified 2026-09-09: the script printed "1600 by ..." for every file and "27 previews written, 1600 pixels wide, WebP quality 80"; after a second run all 27 SHA-256 hashes were identical and `git status` was clean.
- [x] `pnpm check:dist` in CI reads the text of every PDF under `dist/` and finds no identifier; `pnpm scan:history` passes (criterion 7). Verified 2026-09-09 as far as this ticket can: `pnpm check:dist` passed locally over the two CV PDFs, since nothing imports the certificate files until ticket 06 puts them under `dist/`; the identifier patterns run over the 27 source PDFs printed "27 PDFs, 8 with text, 0 matching"; `pnpm scan:history` printed "26412 lines over 6 commits, no identifier pattern matches". The dist scan over the certificates is exercised by ticket 06.
- [x] `src/content/README.md` documents `document` and the preview command, and `docs/development.md` lists the command (criterion 7, and requirement 9 of the first effort). Verified 2026-09-09 by reading the diff: the content README gains the `document` row and a "The certificate documents" section with the command; `docs/development.md` lists `pnpm certificates:previews` and says the previews are committed and CI never runs it.

## Relevant areas
`src/content.config.ts`, `src/content/certificates/*.yaml`, new `src/content/certificates/files/`, new `scripts/certificate-previews.mjs`, `package.json`, `src/content/README.md`, `docs/development.md`.

## Constraints
- The mapping from Drive names to entry ids and the render pipeline are in the plan, "Data model" and "What the certificate overlay shows"; the source files are at `G:\My Drive\studies\online courses\certificates\` on Saud's machine, and one of them has a space before its extension.
- The three packages are devDependencies; the script never runs in CI.
- The PDFs are committed as they are; the plan's constraint on size holds because they total 2.5 MB.

## Notes
The plan's technical approach step 3, the content half, and step 5's documentation. Independent of ticket 01, so it may start at once.
