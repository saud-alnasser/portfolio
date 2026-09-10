// The fragment that marks a document page's address as the one the download
// form opens at. The form fills the contact line with an email address and a
// phone number, and the site publishes neither, so the only reader with
// anything to type into it is the one whose details they are: he navigates to
// the marked address, and everybody else gets the published PDF.
//
// Written once here because two things navigate to it, the filled render in
// scripts/render-pdf.mjs and the tests that open the form, and two copies
// would disagree the first time either changed. That is the same reason
// scripts/placeholder.mjs exists.
//
// The inline script in src/layouts/Base.astro cannot import this, so the token
// does live in one other place. The two are held together behaviourally
// rather than by a check: every test that opens the form navigates with this
// value, so a script reading a different one fails all of them.
//
// `me` rather than `contact`, because src/pages/[locale]/index.astro already
// carries id="contact" as the home page's contact heading, and one word naming
// a heading on one page and a behaviour on another is a collision waiting for
// somebody.
export const marker = '#me';
