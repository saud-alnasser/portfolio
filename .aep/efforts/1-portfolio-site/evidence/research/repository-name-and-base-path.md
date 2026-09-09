---
use-when: "deciding or checking the address the site is served at, or what a base path changes in the build"
---

# Question

As of 2026-09-09, what is the repository named on GitHub, what address does
GitHub Pages give a repository of that name, and what in the built site
changes when Astro is given that address's base path?

# Sources

- S1. `gh repo view --json name,nameWithOwner,isUserConfigurationRepository`
  and `gh api repos/saud-alnasser/portfolio`, run on 2026-09-09. The thing
  itself.
- S2. `gh api repos/saud-alnasser/saud-alnasser/pages` and
  `gh api repos/saud-alnasser/saud-alnasser.github.io`, run on 2026-09-09.
- S3. [[efforts/1-portfolio-site/evidence/research/github-pages-free-hosting]],
  findings F9 to F11, which quote docs.github.com as read on 2026-09-08.
- S4. A build of the branch at 15f4b0e with `base: '/saud-alnasser'` added
  through a temporary config passed to `astro build --config`, on Astro 7.3.2
  with `@astrojs/sitemap` 3.7.4, on 2026-09-09; and the integration's own
  source at `node_modules/@astrojs/sitemap/dist/index.js`.
- S5. Saud, in the session of 2026-09-09.

# Findings

F1. observation (S1): the repository is `saud-alnasser/saud-alnasser`, and the
API reports `isUserConfigurationRepository: true`, which marks the repository
whose README GitHub shows on the profile page. The old name
`saud-alnasser/portfolio` redirects to it, for the API and for git.

F2. observation (S2): no repository `saud-alnasser/saud-alnasser.github.io`
exists, and the Pages API answers 404 for `saud-alnasser/saud-alnasser`, so
Pages is not enabled on it.

F3. source (S3, F9 and F10): only a repository named `<user>.github.io` is
served at `https://<user>.github.io`; every other repository is a project site
at `https://<user>.github.io/<repositoryname>`. This repository's address is
therefore `https://saud-alnasser.github.io/saud-alnasser/`.

F4. source (S5): Saud keeps the name `saud-alnasser` on purpose, so that one
repository is the profile README and the site's source.

F5. observation (S4): with `base: '/saud-alnasser'`, Astro still writes the
pages at `dist/en/index.html` and so on, with no base directory under `dist/`.
It prefixes what it emits itself: the stylesheet link
(`/saud-alnasser/_astro/Base.HEhomE8V.css`), the font URLs inside that
stylesheet (`url(/saud-alnasser/fonts/NotoNaskhArabic-Regular.ttf)`), and
every `<loc>` in the sitemaps
(`https://saud-alnasser.github.io/saud-alnasser/en/`), which the integration
builds as `new URL(config.base, config.site)`.

F6. observation (S4): it prefixes nothing the templates wrote. The navigation
and language-switch hrefs stayed `/en/`, `/ar/`, and `/en/cv/`;
`<link rel="sitemap" href="/sitemap-index.xml">` stayed; the canonical,
`hreflang`, and `og:url` addresses, built with `new URL(path, Astro.site)`,
stayed `https://saud-alnasser.github.io/en/`, because `Astro.site` carries no
base; the CV page's download links stayed `/cv.en.pdf` and `/en/resume.json`;
`meta.canonical` and `basics.url` in `resume.json` stayed without the base.

F7. observation (S4): the root redirect declared as `redirects: { '/': '/en/' }`
was written as `<meta http-equiv="refresh" content="0;url=/en/">` with the
text "Redirecting from /saud-alnasser/ to /en/": the source is read under the
base and the target is written as given.

F8. observation (S4): `public/robots.txt` is copied unchanged, so its
`Sitemap:` line still names `https://saud-alnasser.github.io/sitemap-index.xml`.

F9. interpretation (S4, and a reading of the scripts): the local checks were
written for a site at the root. `scripts/serve-dist.mjs` serves `dist/` at
`/`, so a built page's stylesheet at `/saud-alnasser/_astro/...` would answer
404 under it; `lighthouserc.json` uses `staticDistDir`, which serves the same
way; the Playwright tests and `scripts/render-pdf.mjs` open `/en/...` routes;
`scripts/check-dist.mjs` expects every sitemap entry at
`<origin>/<locale><route>` and resolves a sitemap URL's pathname straight to a
file under `dist/`.

# Conclusion

The site's address is `https://saud-alnasser.github.io/saud-alnasser/` (F1 to
F4). Under that base Astro handles its own assets and the sitemap, and every
other path the site or its checks name (F6 to F9) has to be derived from the
base by this repository. Pages is still to be enabled (F2).

# Not checked

Whether GitHub answers anything at `https://saud-alnasser.github.io/` while no
user-site repository exists; nothing here depends on it. Whether
`astro:i18n`'s `getRelativeLocaleUrl` and `getAbsoluteLocaleUrl` prefix the
base; the plan joins paths to `import.meta.env.BASE_URL` itself and does not
rely on them.
