---

---

# Hypothesis

Chrome draws its print header and footer inside the paper margin the page box
asks for, so a document whose `@page` margin is zero has nowhere for the
furniture to go and prints without it. If that holds, the title line and the
address line on the resume Saud generated through the form are removable in CSS
alone, with no library, no second renderer, and nothing asked of the reader's
print dialog.

The second half of the hypothesis is about the render step: `page.pdf()` in
`scripts/render-pdf.mjs` passes no margin option, and the comment in
`src/styles/global.css` claims the CSS page box is therefore what both a browser
print and the published render read. If that claim is wrong, changing the page
box would move the browser print and leave the published PDF where it is, and
the two documents would stop matching.

# Falsifier

Either of these refutes it:

- the furniture still appears at `@page { margin: 0 }` when the renderer is
  asked to display it, clipped at the paper edge or overlapping the content;
- the text sits at the same distance from the paper edge whatever the `@page`
  margin says, which would mean `page.pdf()` ignores the page box and the
  published PDFs never read the rule the stylesheet writes.

# Experiment

A throwaway script at the repository root, run with the Playwright Chromium the
render step already uses. One page of content with a known first line and a
known last line, `body { margin: 0 }` so nothing but the page box moves the
text, and a `<title>` that would show up in the header if one were drawn. The
same content rendered at three page boxes, `16mm 18mm` (the CV's), `10mm` (the
resume's), and `0`, each once with `displayHeaderFooter: false` and once with
it on, which is the switch the print dialog's own header and footer checkbox
ends up at. Every text run read back through pdfjs-dist with the y coordinate
it was placed at, on A4, 842 points tall.

# Observation

```
margin=16mm 18mm  off  TOPLINE@51,775  BOTTOMLINE@51,63
margin=16mm 18mm  on   TOPLINE@51,775  BOTTOMLINE@51,63
                       9/11/26, 3:44 AM@24,820  PROBE TITLE@317,820
                       about:blank@24,16  1/1@561,16
margin=10mm       off  TOPLINE@28,792  BOTTOMLINE@28,79
margin=10mm       on   TOPLINE@28,792  BOTTOMLINE@28,79
                       9/11/26, 3:44 AM@24,820  PROBE TITLE@317,820
                       about:blank@24,16  1/1@561,16
margin=0          off  TOPLINE@0,820   BOTTOMLINE@0,108
margin=0          on   TOPLINE@0,820   BOTTOMLINE@0,108
```

The first line starts at y=775 under a 16mm top margin, at y=792 under 10mm, and
at y=820 under none, which is the page box moving the text and nothing else. At
both non-zero boxes the furniture is drawn at y=820 and y=16, in the margin,
outside the text: the date and the document title along the top, the address and
the page number along the bottom. That is the line Saud's file carries.

At `margin: 0` the two renders are identical. The furniture is not clipped and
not overlaid. It is not drawn at all.

What surprised me: the furniture is laid out from the paper edge rather than
from the edge of the text, so a small margin does not produce a small header. It
is present or it is absent, and the page box is the switch.

# Result

Confirmed, on both halves. The furniture lives in the margin and a zero page box
removes it. The page box is read by `page.pdf()`, so the published render and a
reader's own print see the same rule, which is what the stylesheet's comment
already claimed and what nothing had checked.

# Conclusion

Requirement 1 of the spec is reachable in the stylesheet: give the resume a page
box with no margin and put the white space back as padding on the document
itself. The resume can do this because it is one page, and padding on a single
box is a margin on a single page.

The CV cannot, and this is what the spec records as out of scope rather than as
an oversight. It runs to five pages, padding applies at the start and the end of
a box rather than at every fragment of it, and a zero page box would print its
second page hard against the paper edge, inside the border a desktop printer
cannot reach. A generated CV keeps the furniture until something other than the
page box removes it.

# Disposition of the code

Deleted. What is promoted is one idea, that the resume's page box carries no
margin and its white space is the document's own padding. The rule that ships is
written in `src/styles/global.css` against the resume's existing named page,
never lifted from the probe.
