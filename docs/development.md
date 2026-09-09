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
| `/en/cv/`, `/ar/cv/` | the CV page, printable |
| `/cv.en.pdf`, `/cv.ar.pdf` | the CV as a PDF, rendered at build time |
| `/en/resume.json`, `/ar/resume.json` | the CV as a JSON Resume document |
| `/sitemap.xml`, `/robots.txt` | the sitemap, linked from every page as well; `robots.txt` exists so the site does not break at a host root, since crawlers read it there rather than under a base path |

## Development

```sh
pnpm install
pnpm dev          # local server
pnpm check        # type and template checks
pnpm build        # writes dist/
pnpm render:pdf   # writes dist/cv.en.pdf and dist/cv.ar.pdf (needs Playwright's Chromium)
pnpm check:dist   # the checks CI runs over dist/
pnpm test         # the Playwright tests, against a static server of dist/
pnpm test:content # adds a temporary project, rebuilds, and checks it shows everywhere
pnpm lighthouse   # Lighthouse on the home and CV pages, mobile profile
pnpm check:live <address>  # asks a served site for its pages and downloads; the deploy job runs it last
pnpm readme       # rewrites the profile block of README.md from src/content/ and the config
pnpm scan:history # the identifier scan over the whole git history
```

Node 22.12 or later (CI uses 24) and pnpm 12. The site is static files only.

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
