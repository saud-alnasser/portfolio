---
use-when: "building a ticket in this effort and the approach is not obvious from the spec"
---

# Architecture

The gate is one boolean inside `documents()` in the inline script at `src/layouts/Base.astro`, and the click handler returns before `event.preventDefault()` where it is false. The anchor then does what `src/components/DocumentDownload.astro` already makes it do, which is download the published PDF. Nothing is added to the markup, nothing is removed from it, and the dialog ships to every reader as inert markup exactly as it does today.

The boolean is latched. It is set from `location.hash` when the script binds, and a `hashchange` listener can only ever set it, never clear it. That asymmetry is the whole design decision, and the reason is in the spec's requirement 3: the skip link is the first focusable element in the body and points at `#content`, so the keyboard reader this form belongs to replaces the fragment before reaching anything else.

**What lost, and why.** The spec's Out of Scope records the alternatives to the fragment itself, and this file does not repeat them. What was decided here is narrower:

| | Advantages | Disadvantages | Risks | Maintenance |
| --- | --- | --- | --- | --- |
| **A one-way latch, chosen** | A bookmark works. Typing the fragment onto a page already open works, where a fragment change is not a navigation and a reload would otherwise be needed. The skip link cannot revoke it | A listener and three lines more than reading the address once | A latch that only turns on reads as odd until the skip link is the explanation, so the comment beside it has to carry that reason | One function and one listener, with the reason in the comment |
| Read the address once at bind time | Smallest sufficient version: the bookmark works and the skip link is harmless | Typing the fragment onto a loaded page does nothing until a reload, which is a papercut for the one reader the form is for | None found | Lowest |
| Read the address at click time | Smallest diff of the three | Wrong: tabbing to the skip link and pressing Enter replaces the fragment, and the control silently reverts to downloading | The failure is invisible. The icon behaves correctly, so the conclusion is that the gate broke rather than that the fragment moved | The next person to add an in-page fragment link breaks the form without knowing |

The token is written once in `scripts/form-marker.mjs`, on the model of `scripts/placeholder.mjs`, because the render step and the tests both navigate to it and two copies disagree the first time either changes. **The inline script cannot import it**, so the token exists in exactly two places: that module, and the script. They are held together behaviourally rather than by a check: every gated case in `tests/document-form.spec.ts` navigates with the module's token and asserts the dialog opens, so a script whose token differs fails all of them.

# Components

| What | Becomes responsible for |
| --- | --- |
| `src/layouts/Base.astro`, `documents()` | reading the marker, latching it, and returning from the click handler where it is false. The function's existing early return on a missing dialog, a missing contact line, or a browser with no modal dialog is unchanged, and **must not** gain the marker check: the handlers have to be bound for the latch to be able to fire later |
| `src/layouts/Base.astro`, the comment above `<script>` | saying that the control becomes the form only at the marked address, since that block is what a reader of the layout reads first |
| `src/components/DocumentDownload.astro`, its comment | saying the link is what every reader gets rather than only a reader with no script. Its claim that the element is a link for the no-script guarantee is now half the reason |
| `src/components/DocumentForm.astro`, its comment | saying the dialog opens only at the marked address |
| `scripts/form-marker.mjs`, new | the token, and why it is written once |
| `scripts/render-pdf.mjs`, `renderFilled()` | navigating to the marked address |
| `tests/document-form.spec.ts` | both paths: the gated cases it already has, moved to the marked address, and the ungated ones the spec's criteria 1 and 3 add |
| `tests/resume.spec.ts` | the keyboard case at `:166`, which presses Enter and expects the dialog, moved to the marked address |
| `docs/development.md` | the address, in the paragraph that already describes the form |
| `.aep/efforts/7-document-downloads-and-contact-details/spec.md` | one line at its requirement 3 pointing here |

# Interfaces

The script's contract, which is the whole of what the implementer has to get right:

```js
// inside documents(), before the handlers are bound
function mine() {
  return location.hash.toLowerCase() === '#me';
}
var marked = mine();
window.addEventListener('hashchange', function () {
  if (mine()) marked = true;
});
```

and in the existing click handler, after the control has been found and **before** `event.preventDefault()`:

```js
if (!marked) return;
```

The comparison is lowercased so a fragment typed as `#ME` still works. The guard sits after the control lookup rather than at the top of the handler because it is a fact about that control rather than about the document: unmarked, the control does what its `href` says.

`scripts/form-marker.mjs` exports one value:

```js
export const marker = '#me';
```

Both consumers build the address by appending it to a finished address rather than passing it through a path join: `at(route) + marker` in `scripts/render-pdf.mjs`, and `` `${url}${marker}` `` in the tests. `joinBase()` in `src/lib/paths.ts` normalises slashes and has no reason to learn about fragments.

# Technical Approach

**The drivers move before the gate exists, and that is what keeps every branch green.** The integration gate renders the filled document on every pull request, and that render drives the form, so a branch that gates the form while `renderFilled()` still navigates to the plain address fails with `form-did-not-fill`. The order below inverts that rather than absorbing it into one large change: an ungated form opens at any address, so moving every driver to the marked address first changes no behaviour and passes on its own.

1. **The token module, and every driver navigating to the marked address.** `scripts/form-marker.mjs`, `renderFilled()` in `scripts/render-pdf.mjs`, and the gated cases in `tests/document-form.spec.ts` and `tests/resume.spec.ts`. The fragment is inert until step 2, so this lands green and nothing about the site changes. Nothing in the suite pins a page address, which is what makes that true: `page.url()` appears nowhere under `tests/`.
2. **The gate, and the tests that prove both paths.** The boolean and the latch in `src/layouts/Base.astro`, the three comments, and the new cases for a visitor's click, the skip link, and the no-script path at both addresses. Every driver already reaches the form through the marked address, so this is the first point at which the site behaves differently, and it is green on arrival.
3. **The documentation and the supersession line.** `docs/development.md` and the line in effort 7's spec describe behaviour that step 2 creates, so they follow it and block nothing.

**Written as one step until the tickets were cut**, which is when the inversion became visible: the constraint is real and the conclusion drawn from it was wrong, because it assumed the gate had to arrive first.

# Testing Strategy

Every criterion in `spec.md` maps to a check. The existing cases keep their names and their reasons; what changes is the address they navigate to.

| Criterion | Checked by |
| --- | --- |
| 1, the icon downloads | a new case per locale per variant in `tests/document-form.spec.ts`: navigate to the plain address, click the control inside `page.waitForEvent('download')`, assert the download's URL is that page's PDF and that the dialog never gained `open`. The download assertion has a model at `:185`, which already waits on one from the dialog's own way out |
| 2, the form at the marked address | the cases effort 7 left, navigating to `` `${url}${marker}` ``. **The plain `url` constant keeps its meaning**, and each gated case names the marked one explicitly. Putting the marker into the shared setup is the failure the spec's requirement 7 exists to prevent, because it leaves the ungated path tested nowhere |
| 3, the form survives the page | a new case: open the marked address, activate the skip link so the fragment becomes `#content`, then click the control and assert the dialog opens. A second assertion sets the fragment to something else through `location.hash` and opens it again |
| 4, nothing is remembered | a new case: visit the marked address, open the dialog, then navigate to the plain address and assert the control downloads. Read `document.cookie`, `localStorage` and `sessionStorage` in the page and assert the only entry anywhere is the theme key that `tests/pages.ts` already names |
| 5, no script | the case at `:256`, parameterised over the plain and the marked address, asserting the same plain link at both |
| 6, the render step and the extraction check | `pnpm render:pdf` followed by the existing extraction check, unchanged except for the address. `renderFilled()` already refuses to capture a page whose slots did not fill, so a gate that locked CI out fails loudly rather than publishing the wrong document under the filled name |
| 7, the gate fails in both directions | criterion 1's case fails if the guard is removed, and criterion 2's cases fail if the guard never passes. Both live beside each other, which is what makes the pair legible as a pair |
| 8, the supersession line | read effort 7's spec and confirm the line is at its requirement 3 and its `status:` is untouched |
| 9, the documentation and the gates | `pnpm check`, the integration gate, and Lighthouse as they run today. No new string enters `src/lib/i18n.ts`, so the gap report cannot grow: the dialog's text is unchanged and the gate has no text of its own |

# Operational Considerations

**What Saud does by hand:** bookmark `/en/cv/#me`, `/ar/cv/#me`, `/en/resume/#me` and `/ar/resume/#me`, or type the fragment when he needs it. The latch means typing it onto a page he already has open works without a reload.

**The browser's print header.** A reader who has headers and footers switched on in their print dialog gets the page address printed on the document, which now ends in `#me`. That is true of the address today without the fragment, the fragment carries nothing private, and the band and the contact line are unaffected. Cosmetic, and named here so it is not discovered as a surprise.

**Nothing to roll back.** The change is one boolean in a page's own script. Reverting the commit restores the previous behaviour completely, and no data, no stored state, and no published file is involved either way.

# Technical Risks

- **The marker ends up in the shared test setup.** The cheapest way to make twenty-odd existing cases pass is one edit in `beforeEach`, and it would leave every assertion about a visitor's click untested while the suite stayed green. It shows up as a suite that passes against a build with no gate at all. The spec's requirement 7 and the pairing in the table above are the defence, and a reviewer should check this specific thing first.
- **`hashchange` not firing where the fragment is set programmatically.** The event fires for a user navigation and for an assignment to `location.hash`, which is what the criterion 3 case uses, but a test that mutates the URL through `history.replaceState` would see no event and read as a broken latch. The case has to drive it the way a reader does.
- **An `id="me"` arriving later.** Nothing carries that id today, so the marked address scrolls nowhere and looks identical to the plain one. An element with that id added later would make the marked address jump to it, which is cosmetic and harmless, but it is the kind of thing that reads as a bug in the gate rather than as a fragment doing what fragments do.
