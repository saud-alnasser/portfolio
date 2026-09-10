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
pnpm render:pdf   # writes the four document PDFs; fails if a resume runs past two pages (needs Playwright's Chromium)
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
