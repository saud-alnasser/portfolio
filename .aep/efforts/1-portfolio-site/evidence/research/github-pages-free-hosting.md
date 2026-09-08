---
use-when: "deciding how the portfolio is hosted and deployed on GitHub at no cost, or checking a Pages limit"
---

# Question

As of September 2026, what does GitHub Pages provide at no cost for a public
personal repository, and what limits or constraints does it impose that would
shape a personal portfolio site hosted there?

# Sources

All read on 2026-09-08. Every docs.github.com page below is the current
(GitHub.com, not Enterprise Server) version. None of the docs pages shows a
"last updated" date, so each finding is dated by the day it was read, not by
when GitHub wrote it.

Primary (the thing itself):

- S1. "What is GitHub Pages?" - https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
  Read twice: once through a summarising fetch, once as raw HTML (the
  summariser missed the "Who can use this feature?" box).
- S2. "GitHub Pages limits" - https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- S3. "Creating a GitHub Pages site" - https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- S4. "Configuring a publishing source for your GitHub Pages site" - https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- S5. "Using custom workflows with GitHub Pages" - https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- S6. "About custom domains and GitHub Pages" - https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
- S7. "Managing a custom domain for your GitHub Pages site" - https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- S8. "Securing your GitHub Pages site with HTTPS" - https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- S9. "About GitHub Pages and Jekyll" - https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll
- S10. "GitHub's plans" - https://docs.github.com/en/get-started/learning-about-github/githubs-plans
- S11. GitHub pricing page - https://github.com/pricing
- S12. "About billing for GitHub Actions" - https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/about-billing-for-github-actions
- S13. GitHub Terms for Additional Products and Features, "Pages" section - https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features
- S14. actions/deploy-pages README - https://github.com/actions/deploy-pages
- S15. actions/upload-pages-artifact README - https://github.com/actions/upload-pages-artifact
- S16. Changelog, 2024-12-05, "Deprecation notice: GitHub Pages actions to require artifacts actions v4 on GitHub.com" - https://github.blog/changelog/2024-12-05-deprecation-notice-github-pages-actions-to-require-artifacts-actions-v4-on-github-com/
- S17. GitHub blog, 2022-08-10, "GitHub Pages now uses Actions by default" - https://github.blog/news-insights/product-news/github-pages-now-uses-actions-by-default/
  (GitHub's own announcement, so primary for the deployment model; it is a
  blog post, so wording is less formal than the docs.)
- S18. Live HTTP responses from GitHub Pages hosts, observed with curl on
  2026-09-08: https://pages.github.com/versions.json,
  https://pages.github.com/robots.txt, https://octocat.github.io/,
  https://octocat.github.io/robots.txt, https://github.github.io/robots.txt,
  https://agopalareddy.github.io/files/reddy_resume.pdf (a third party's
  Pages site, used only to observe the header GitHub sends for a PDF).

Secondary or unusable:

- Web search snippets summarising a retired docs article "MIME types on
  GitHub Pages". The legacy URL https://docs.github.com/articles/mime-types-on-github-pages
  now 302-redirects to S1, which contains no MIME content. Treated as weak
  (finding F32).
- https://github.blog/changelog/label/pages/ and .../label/github-pages/
  both return 404, so no changelog label listing for Pages could be read.

# Findings

Labels: `source` is what the page says (quoted where the wording matters),
`observation` is what I saw with my own request, `interpretation` is what I
take it to mean, `conclusion` is what follows.

## Plans and repository visibility

F1. source (S1, raw HTML, "Who can use this feature?" box): "GitHub Pages is
available in public repositories with GitHub Free and GitHub Free for
organizations, and in public and private repositories with GitHub Pro, GitHub
Team, GitHub Enterprise Cloud, and GitHub Enterprise Server." True of
GitHub.com docs on 2026-09-08.

F2. source (S3): "If the account that owns the repository uses GitHub Free or
GitHub Free for organizations, the repository must be public."

F3. source (S10): GitHub Free for personal accounts lists "GitHub Pages in
public repositories". GitHub Pro lists "GitHub Pages" among tools available in
private repositories.

F4. observation (S11): the Free plan card's bullet list on the pricing page
does not mention Pages. The "Compare features" table has a row "Pages and
wikis" whose visible cell text is "Public repositories"; from the rendered
text I could not confirm which plan columns that cell spans.
interpretation: the pricing page is a marketing summary; S1, S3 and S10 are
the authoritative statements and they agree with each other.

F5. source (S12): "GitHub Actions usage is free for self-hosted runners and
for public repositories that use standard GitHub-hosted runners." The same
page lists standard GitHub-hosted runner use as free "In public repositories,
For GitHub Pages, For Dependabot". The Free plan includes 2,000 minutes per
month and 500 MB artifact storage for private repositories, storage "shared
with GitHub Packages".

F6. source (S17, 2022-08-10): "building and deploying a GitHub Pages site on a
private or internal repository consumes GitHub Actions minutes."

F7. conclusion (from F1 to F6): on a personal GitHub Free account, Pages is
available at no charge for a public repository, and the Actions used to build
and deploy it on standard GitHub-hosted runners are also free because the
repository is public. A private repository cannot use Pages on Free at all.

F8. source (S3, warning box, raw HTML): "GitHub Pages sites are publicly
available on the internet, even if the repository for the site is private (if
your plan or organization allows it). If you have sensitive data in your
site's repository, you may want to remove the data before publishing."

## User site vs project site

F9. source (S1, comparison table): user and organization sites are served at
"http(s)://<owner>.github.io" and "Must be stored in a repository named
<owner>.github.io"; project sites are served at
"http(s)://<owner>.github.io/<repositoryname>". "Maximum of one pages site per
account" for user/org sites and "Maximum of one pages site per repository"
for project sites.

F10. source (S3): "If you're creating a user or organization site, your
repository must be named <user>.github.io or <organization>.github.io. If your
user or organization name contains uppercase letters, you must lowercase the
letters."

F11. source (S3): GitHub Pages recognises "an index.html, index.md, or
README.md file as the entry file for your site."

F12. source (S3): "It can take up to 10 minutes for changes to your site to
publish after you push the changes to GitHub."

## Publishing sources and build

F13. source (S4): two publishing sources. Branch: "Whenever changes are pushed
to the source branch, the changes in the source folder will be published to
your GitHub Pages site." The folder "can either be the root of the repository
(/) on the source branch or a /docs folder on the source branch." Custom
workflow: for when "you want to use a build process other than Jekyll or you
do not want a dedicated branch to hold your compiled static files."
observation: the page does not label branch publishing legacy or deprecated.

F14. source (S5): "Custom workflows allow GitHub Pages sites to be built via
the use of GitHub Actions." The three actions are configure-pages,
upload-pages-artifact and deploy-pages. "This action helps support deployment
from any static site generator to GitHub Pages." "The job must have a minimum
of pages: write and id-token: write permissions." "The default environment is
github-pages." Workflow templates exist "for some of the most widely used
static site generators."

F15. source (S5, S15): "The GitHub Pages artifact should be a compressed gzip
archive containing a single tar file. The tar file must be under 10GB in size
and should not contain any symbolic or hard links." S15 adds: "The GitHub
Pages officially supported maximum size limit is 1GB" and "There is also an
unofficial absolute maximum size limit of 10GB". upload-pages-artifact
defaults: input `path` is `_site/`, artifact `name` is `github-pages`,
`retention-days` is 1.

F16. source (S14): deploy-pages "is used to deploy Actions artifacts to GitHub
Pages", takes the artifact "previously uploaded as an artifact (e.g. using
actions/upload-pages-artifact)", default artifact name "github-pages", needs
`pages: write` and `id-token: write`, runs in the `github-pages` environment,
and the README's example uses `actions/deploy-pages@v4`.

F17. source (S16, 2024-12-05): custom Pages workflows on GitHub.com had to
move to `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`
before 2025-01-30; older artifact actions are no longer supported.
interpretation: any example workflow found elsewhere that pins
upload-pages-artifact v2 or deploy-pages v3 or earlier is stale.

F18. source (S17, 2022-08-10): "All sites now build and deploy with GitHub
Actions." Pages "are now tracking deployments instead of builds" and
deployments happen inside an environment, `github-pages` by default. Branch
publishing still works with no user action ("this change is transparent").

F19. source (S3, S9): to use a generator other than Jekyll while publishing
from a branch, "disable the Jekyll build process by creating an empty file
called .nojekyll" in the publishing source root. Jekyll by default skips files
and folders that "Are located in a folder called /node_modules or /vendor;
Start with _, ., or #; End with ~". S9 lists nine plugins "enabled by default
and cannot be disabled"; jekyll-sitemap and jekyll-seo-tag are not among
them, but both appear in the supported dependency list served at
https://pages.github.com/versions.json (observed: "jekyll-sitemap":"1.4.0",
Jekyll 3.10.0).
interpretation: with a custom Actions workflow the artifact is deployed as-is,
so .nojekyll is a branch-publishing concern only; S5 does not mention it.

F20. observation (S9): the page has no mention of search engines or SEO. The
legacy "Sitemaps for GitHub Pages" article URL 302-redirects to S9.

## Usage limits (S2, all true of GitHub.com docs on 2026-09-08)

F21. source: "GitHub Pages source repositories have a recommended limit of
1 GB." Published sites "may be no larger than 1 GB." Deployments "will timeout
if they take longer than 10 minutes." A "soft bandwidth limit of 100 GB per
month." A "soft limit of 10 builds per hour. This limit does not apply if you
build and publish your site with a custom GitHub Actions workflow." "Rate
limits may apply" and a client that exceeds them gets HTTP 429. If a site
exceeds the quotas, GitHub "may not be able to serve your site, or you may
receive a polite email from GitHub Support."

F22. interpretation: a personal portfolio (a few MB of HTML, CSS, images, one
PDF, some JSON) sits several orders of magnitude under every one of these.
The 10-minute deployment timeout bounds the build step of an Actions
workflow, not the site's runtime.

## Custom domains and HTTPS

F23. source (S6, S7): "GitHub Pages works with two types of domains:
subdomains and apex domains." Subdomains use "a CNAME record" pointing at
"<user>.github.io or <organization>.github.io" (no repository name); an apex
domain uses "an A, ALIAS, or ANAME record". Apex A records:
185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; AAAA:
2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153,
2606:50c0:8003::153. "DNS changes can take up to 24 hours to propagate."
Wildcard DNS records are warned against as "an immediate risk of domain
takeovers"; GitHub recommends verifying the domain before adding it.

F24. source (S7): when publishing from a branch a CNAME file is written to
the source root; "if you are publishing from a custom GitHub Actions workflow,
no CNAME file is created, and any existing CNAME file is ignored and is not
required" (the custom domain is set in repository settings).

F25. source (S8): "All GitHub Pages sites, including sites that are correctly
configured with a custom domain, support HTTPS and HTTPS enforcement." Sites
on github.io created after 2016-06-15 "are served over HTTPS automatically."
"You can enforce HTTPS for your GitHub Pages site to transparently redirect
all HTTP requests to HTTPS." For a custom domain GitHub requests "a TLS
certificate from Let's Encrypt"; the Enforce HTTPS option "can take up to 24
hours before this option is available" after the domain is added. Mixed
content (assets referenced over http://) is called out as the user's problem
to fix.
observation: no docs page (S6, S7, S8) mentions any charge for custom domains
or certificates. The absence of a price is the only evidence they are free;
no page says "free" in so many words.

## What Pages cannot do, and content rules

F26. source (S1): "GitHub Pages is a static site hosting service that takes
HTML, CSS, and JavaScript files straight from a repository on GitHub,
optionally runs the files through a build process, and publishes a website."
observation: I looked on S1, S2 and the Enterprise Server 3.16 "About GitHub
Pages" page for the sentence that used to say Pages "does not support
server-side languages such as PHP, Ruby, or Python" and did not find it on any
of them. interpretation: the restriction to static files is stated positively
(what Pages serves) rather than as a list of unsupported runtimes; nothing on
any page read describes any way to run code on the server.

F27. source (S2, S13): Pages "is not intended for or allowed to be used as a
free web hosting service to run your online business, e-commerce site, or any
other website that is primarily directed at either facilitating commercial
transactions or providing commercial software as a service (SaaS)." "Some
monetization efforts are permitted on Pages, such as donation buttons and
crowdfunding links." Sites "shouldn't be used for sensitive transactions like
sending passwords or credit card numbers." S13 says Pages "is intended to
host static web pages, but primarily as a showcase for personal and
organizational projects" and is subject to the Acceptable Use Policies.
interpretation: a personal portfolio that presents work and links to contact
channels is the use S13 names as the primary intent.

## Search engine indexing

F28. observation (S18): GitHub does not inject a robots.txt. Requests for
https://octocat.github.io/robots.txt and https://github.github.io/robots.txt
returned 404 with `Server: GitHub.com`; https://pages.github.com/robots.txt
returned 200 with a single line `Sitemap: https://pages.github.com/sitemap.xml`,
which is that site's own file. No `X-Robots-Tag` header appeared on any
response inspected (HTML, JSON, PDF).

F29. observation: no current docs page read (S1 to S9) documents whether
Pages sites are indexed, or any robots or noindex behaviour. The only
SEO-adjacent facility in the docs is the Jekyll sitemap plugin (F19).

F30. interpretation (from F28, F29): nothing GitHub serves prevents crawling;
indexing is therefore whatever search engines do with any public site, and
robots.txt, meta robots and sitemap.xml are entirely the site's own files.
This is inferred from absence, not from a GitHub statement.

## Serving a PDF and JSON

F31. observation (S18, 2026-09-08): a `.json` file on a Pages host was served
with `Content-Type: application/json; charset=utf-8` and
`Access-Control-Allow-Origin: *`; the same header pair appeared with an
explicit `Origin: https://example.com` request header. A `.pdf` on a
github.io host was served with `Content-Type: application/pdf` and
`Access-Control-Allow-Origin: *`; no `Content-Disposition` header, so the
browser decides between inline display and download. An HTML page was served
`text/html; charset=utf-8` with the same CORS header. All responses carried
`Server: GitHub.com`, `Cache-Control: max-age=600` and were fronted by Fastly
(`Via: 1.1 varnish`).

F32. observation: no current docs.github.com page documents MIME type
mapping, CORS headers, or cache behaviour for Pages. The legacy MIME article
is retired (redirects to S1). Search-result snippets of the retired article
said Pages supports "more than 750 MIME types" generated from mime-db and that
per-file custom MIME types cannot be set; this is secondary and may be stale,
so treat it as weaker than F31.

F33. interpretation: MIME type is determined by file extension on the server
side (F31 is consistent with the retired article's description); nothing in
the current docs offers a way to set headers, redirects, or content
disposition per file. A download link that must force "save as" would need
the HTML `download` attribute on the anchor, which is browser behaviour, not
a Pages feature; I did not test this.

# Conclusion

Findings, not a decision.

On a personal GitHub Free account, a public repository gets GitHub Pages at no
charge, and building and deploying it with a custom GitHub Actions workflow on
standard GitHub-hosted runners is also free because the repository is public
(F1 to F7). A private repository cannot use Pages on Free (F1, F2). A user
site lives in a repository named exactly `<user>.github.io` (lowercased) and
is served at `https://<user>.github.io`; any other repository gets a project
site at `https://<user>.github.io/<repo>` (F9, F10). Any static site generator
is supported via the configure-pages, upload-pages-artifact (v3) and
deploy-pages (v4) flow with `pages: write` and `id-token: write` in the
`github-pages` environment (F14 to F17). Published size is capped at 1 GB,
bandwidth soft-limited to 100 GB per month, deployments time out at 10
minutes, and the 10-builds-per-hour soft limit does not apply to custom
Actions workflows (F21). Custom apex and subdomains are supported with
Let's Encrypt HTTPS and an Enforce HTTPS redirect; no charge is documented
(F23 to F25). Pages serves static files only and forbids commercial
transaction and SaaS sites while naming personal project showcases as its
intended use (F26, F27). Nothing GitHub serves blocks crawlers; robots.txt and
sitemaps are the site's own files (F28 to F30). JSON and PDF files are served
with correct Content-Type and `Access-Control-Allow-Origin: *`, observed but
undocumented (F31, F32).

Confidence: high for plans, URLs, publishing flow, limits, domains and HTTPS
(all quoted from current docs). Medium for CORS and MIME behaviour (observed
live, not documented). Low-to-medium for indexing (inferred from absence).

# Not checked

- Whether the Free plan's 2,000 Actions minutes would ever matter: only
  relevant to private repositories, which cannot use Pages on Free anyway.
- Actual CORS or MIME behaviour for other extensions (e.g. `.webmanifest`,
  `.woff2`, `.wasm`, `.txt`): only `.html`, `.json` and `.pdf` were observed.
- Whether `Access-Control-Allow-Origin: *` is guaranteed or merely current
  behaviour: undocumented, so it could change without notice.
- The exact plan-column layout of the pricing page's "Pages and wikis" row
  (F4); the docs were used instead.
- Any changelog entry about Pages after 2024-12-05: label pages are 404 and
  searches surfaced nothing newer. Absence of a search hit is not proof
  nothing changed.
- HTTP to HTTPS redirect behaviour, HSTS headers, and HTTP/2 or HTTP/3
  support on Pages hosts.
- The behaviour of the `download` attribute on Pages-hosted links (F33).
- The GitHub Acceptable Use Policies themselves (S13 references them; I did
  not read them).
- Immutable or custom cache headers, redirect files, custom 404 pages beyond
  the existence of `404.html`, and custom response headers: none appear in
  the pages read, so they are presumed unsupported but this was not verified.
- Enterprise Cloud-only features (private Pages sites, access control): out
  of scope for a Free personal account.
