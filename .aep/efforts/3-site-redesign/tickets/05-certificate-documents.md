---
status: open
---

# feat(content): add the certificate documents to the content source with their previews and the script that renders them

## Outcome
Each certificate entry names its PDF through a `document` field the schema checks for existence, with the WebP preview beside it checked the same way; the 27 PDFs from Drive are under `src/content/certificates/files/` named by entry id, with their previews rendered by `scripts/certificate-previews.mjs` over pdfjs-dist, a prebuilt canvas, and sharp; `src/content/README.md` documents the field and `docs/development.md` the command. Nothing renders the documents yet; that is ticket 06.

## Acceptance Criteria
- [ ] All 27 certificate entries carry `document`, the 27 PDFs and 27 previews exist under `files/`, and an entry naming a file that does not exist fails the build naming the file, checked once with a wrong name (criterion 7).
- [ ] `pnpm certificates:previews` regenerates every preview at 1600 pixels wide as WebP, and running it twice changes nothing (criterion 7).
- [ ] `pnpm check:dist` in CI reads the text of every PDF under `dist/` and finds no identifier; `pnpm scan:history` passes (criterion 7).
- [ ] `src/content/README.md` documents `document` and the preview command, and `docs/development.md` lists the command (criterion 7, and requirement 9 of the first effort).

## Relevant areas
`src/content.config.ts`, `src/content/certificates/*.yaml`, new `src/content/certificates/files/`, new `scripts/certificate-previews.mjs`, `package.json`, `src/content/README.md`, `docs/development.md`.

## Constraints
- The mapping from Drive names to entry ids and the render pipeline are in the plan, "Data model" and "What the certificate overlay shows"; the source files are at `G:\My Drive\studies\online courses\certificates\` on Saud's machine, and one of them has a space before its extension.
- The three packages are devDependencies; the script never runs in CI.
- The PDFs are committed as they are; the plan's constraint on size holds because they total 2.5 MB.

## Notes
The plan's technical approach step 3, the content half, and step 5's documentation. Independent of ticket 01, so it may start at once.
