# Developing the site

How the portfolio site is built, checked, and deployed. The content format is
in [src/content/README.md](../src/content/README.md), and the repository's
`README.md` is the GitHub profile page, written in part from that content.

## Addresses

Everything the site publishes is under
`https://saud-alnasser.github.io/saud-alnasser/`:

| Path | What |
| --- | --- |
| `/en/`, `/ar/` | the site, in each language |
| `/en/cv/`, `/ar/cv/` | the CV page, printable: everything the site shows |
| `/cv.en.pdf`, `/cv.ar.pdf` | the CV as a PDF, rendered at build time |
| `/en/resume/`, `/ar/resume/` | the resume page, printable: the short document an application takes |
| `/resume.en.pdf`, `/resume.ar.pdf` | the resume as a PDF, rendered at build time and refused past two pages |
| `/en/resume.json`, `/ar/resume.json` | the CV as a JSON Resume document |
| `/sitemap.xml`, `/robots.txt` | the sitemap, linked from every page as well; `robots.txt` exists so the site does not break at a host root, since crawlers read it there rather than under a base path |

## Development

```sh
pnpm install
pnpm dev          # local server
pnpm check        # type and template checks
pnpm build        # writes dist/
pnpm render:pdf   # writes the four document PDFs to dist/ and four filled ones to .artifacts/; fails if a resume runs past two pages (needs Playwright's Chromium)
pnpm check:dist   # the checks CI runs over dist/
pnpm test         # the Playwright tests, against a static server of dist/
pnpm test:content # adds a temporary project and a temporary certificate, rebuilds, and checks each shows everywhere it should
pnpm lighthouse   # Lighthouse on the home, CV, and resume pages, mobile profile
pnpm check:live <address>  # asks a served site for its pages and downloads; the deploy job runs it last
pnpm readme       # rewrites the profile block of README.md from src/content/ and the config
pnpm scan:history # the identifier scan over the whole git history
pnpm certificates:previews # renders the preview image beside every certificate PDF under src/content/certificates/files/
```

Node 22.12 or later (CI uses 24) and pnpm 12. The site is static files only.

## Contact details, and the documents that carry them

The site publishes no email address and no phone number, anywhere: not on a
page, not in either `resume.json`, not in a rendered PDF, and not in
`README.md`, which is what GitHub shows on the profile. It is a static site
built from a public repository, so there is no server to hand one reader a
file another does not get, and the only thing that keeps a contact detail
private is that it is never built into a published file. The address stays in
`src/content/profile.yaml` because it is a fact about Saud that another output
may want; nothing renders it, and `no contact details` in
`scripts/check-dist.mjs` fails the build if anything starts to.

A reader who wants a document carrying contact details opens a document page at
the address below and types them into the form the control there offers. The
values go into the contact line of the page already on screen, the page prints
itself, and the reader saves the result as a PDF. Nothing is stored and nothing
is sent.

**That form opens at one address: the document page's own with `#me` on the
end**, as in `/en/cv/#me`, `/ar/cv/#me`, `/en/resume/#me` and `/ar/resume/#me`.
The fragment is compared in lower case, so `#ME` typed on a phone keyboard works
too. Everywhere else a click on the download control downloads the published
PDF, which is what the icon says and what every reader of the site gets. The form asks for an email address and a phone number that the
site publishes nowhere, so the one person who has anything to type into it is
the person whose details they are, and the marked address is what he
bookmarks. The token is written once in `scripts/form-marker.mjs`, and once
more in the inline script in `src/layouts/Base.astro`, which cannot import it.

It is a marker and not a lock. The dialog's markup and that script ship to
every reader and the token is in the source of a public repository: what the
address removes is a dialog in a visitor's way and the one-click path to a
document in Saud's name carrying somebody else's number. Nothing about it is
remembered either, by design, so a bookmark or a typed fragment is the whole of
how it is reached.

**The marker latches**, and that asymmetry is the one thing to know before
changing it. The address is read when the script binds and again on every
`hashchange`, and a fragment that is not the marker never switches the form
back off. So typing `#me` onto a page already open works, with no reload, and
the skip link at the top of every page, which points at `#content` and is the
first thing a keyboard reaches, cannot take the form away again. Reading the
address at the moment of the click instead would break exactly that reader,
and silently: the icon would simply download.

`pnpm render:pdf` produces that document too, once per document per language,
by **navigating to the marked address** and driving the same form, and writes
it to **`.artifacts/`**. That directory is gitignored and outside `dist/`,
deliberately: the deploy uploads `dist/` and nothing else, so a document
carrying contact details written there would publish the very thing this
arrangement exists to keep out. The filled copies exist so the extraction check
and the page budget run over the document a reader actually gets; the
placeholder values they carry are in `scripts/placeholder.mjs`, obviously not
real, and written once because both the render step and the check read them.

The certificate previews are committed with their PDFs, so `pnpm
certificates:previews` runs on a developer's machine after a PDF is added or
replaced, never in CI; the build only checks that the preview each entry
needs exists. The content format, including the `document` field, is in
[src/content/README.md](../src/content/README.md).

## Deployment

GitHub Pages serves this repository as a project site, under the repository's
name, at `https://saud-alnasser.github.io/saud-alnasser/`. That base path is
`base` in `astro.config.mjs`, and every path the site publishes is joined
to it through `src/lib/paths.ts`; the dist checks fail a page that links
outside it. A push to `main` runs `.github/workflows/deploy.yml`, which
builds the site, renders the PDFs, runs the checks, deploys `dist/` through
the Pages actions, and then asks the live address for every page and
download, failing by address when one is missing. The repository's Pages
source is set to GitHub Actions, once, in the repository settings. Nothing
else is configured anywhere: no custom domain, no server, no paid service. A
custom domain, if one is ever added, sets `base` to `/` and changes nothing
else.
