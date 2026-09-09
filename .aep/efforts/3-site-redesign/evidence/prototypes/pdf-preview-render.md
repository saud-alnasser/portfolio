---
use-when: "deciding how the certificate cards show their documents, or regenerating the certificate previews"
---

# Hypothesis

A certificate PDF, including the image-only ones Code with Mosh issues, can be rendered to a small WebP image in Node with npm packages alone, so the overlay can show an image on every browser and the repository needs no system tool such as poppler to produce it.

# Falsifier

Either kind of PDF renders blank or wrong under pdf.js in Node, the render needs a native canvas that does not install on Windows, or a legible preview comes out over 150 KB, which would make 27 of them heavier than the site.

# Experiment

Run on 2026-09-09 in a scratch directory outside the repository, Node 24, with `pdfjs-dist@6.3.289`, `@napi-rs/canvas@1.0.8`, and `sharp@0.35.4` installed from npm. A 40-line script opened each PDF with `pdfjs-dist/legacy/build/pdf.mjs`, rendered page 1 into a `@napi-rs/canvas` canvas at a scale giving 1600 pixels of width, took the PNG buffer, and passed it through sharp to WebP at quality 80. Two inputs: `cert-codewithmosh-react.pdf` (image-only, no extractable text) and `cert-sololearn-csharp.pdf` (text and vector).

# Observation

Both rendered on the first run with no configuration: the Code with Mosh one at 1600 by 1027 pixels and 19,806 bytes, the SoloLearn one at 1600 by 1130 pixels and 35,724 bytes. The Code with Mosh image, viewed, shows the logo, the name, the course title, the date 2022-01-12, and a serial. Install took 2.5 seconds; `@napi-rs/canvas` ships a prebuilt binary for Windows and needs no build step. Nothing surprised except how small the WebPs came out.

The rendered Code with Mosh certificate carries the issuer's own words "certificate of graduation" and "awarded to". They are pixels in an image and the no-overclaim check reads pages, not images, so the check is unaffected; the words describe a course, not the degree.

# Result

Confirmed against the falsifier: both kinds render correctly, the toolchain installs on Windows from npm, and each preview is under 40 KB.

# Conclusion

The overlay shows a pre-rendered WebP with a link to the PDF, not an inline PDF, and the previews are produced by a repository script over these three packages, committed beside the PDFs. Rendering at build time was not needed and would have made every build depend on the render; rendering by hand with poppler was not needed either, and poppler is not installed on this machine (xpdf's `pdftotext` is, without `pdftoppm`).

# Disposition of the code

Deleted. The idea promoted is the pipeline pdf.js to canvas to sharp at 1600 pixels wide and WebP quality 80; the shipped script is written under `[[skills/implement]]` with the repository's own error handling and naming. The promotion is recorded in [[efforts/3-site-redesign/spec]], "Assumptions".
