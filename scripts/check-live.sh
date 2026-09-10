#!/usr/bin/env bash
# Asks the live site for the addresses a deploy must serve, so the deploy job
# ends green only when the site actually answers. Run with the site's root,
# trailing slash included:
#
#   pnpm check:live https://saud-alnasser.github.io/saud-alnasser/
#
# It is the one shell script beside the Node ones because the deploy job
# runs no setup step, and a shell script with curl needs none.
#
# The root must serve the redirect page, each language its home, and the CV
# and resume pages their downloads. Pages can take a moment to serve a fresh
# deployment,
# so each address is retried for up to two minutes before the script fails
# naming the address and the status it got. A green run says the addresses
# answer; on a deploy after the first, the CDN may still be answering from
# the previous deployment for a short while, so it does not say this build
# is what answered. Against the local server
# (scripts/serve-dist.mjs) the same addresses are checked, which is how the
# script is exercised before it runs on a deploy.

set -eu

# The root address, with exactly one trailing slash whatever was passed.
site="${1:?the root address of the site}"
while [ "${site%/}" != "$site" ]; do site="${site%/}"; done
site="$site/"

# Twelve attempts ten seconds apart on a deploy; a local run sets both lower.
attempts="${CHECK_LIVE_ATTEMPTS:-12}"
delay="${CHECK_LIVE_DELAY:-10}"

# Fails unless the address answers with the status expected, retrying.
expect() {
  address="$1"
  wanted="$2"
  attempt=0
  while :; do
    attempt=$((attempt + 1))
    code=$(curl -s -o /dev/null -w '%{http_code}' "$address" || echo 000)
    if [ "$code" = "$wanted" ]; then
      echo "$address -> $code"
      return 0
    fi
    if [ "$attempt" -ge "$attempts" ]; then
      echo "$address -> $code, expected $wanted after $attempt attempts" >&2
      return 1
    fi
    sleep "$delay"
  done
}

expect "${site}" 200
expect "${site}en/" 200
expect "${site}ar/" 200
expect "${site}en/cv/" 200
expect "${site}ar/cv/" 200
expect "${site}en/resume/" 200
expect "${site}ar/resume/" 200
expect "${site}en/resume.json" 200
expect "${site}ar/resume.json" 200
expect "${site}cv.en.pdf" 200
expect "${site}cv.ar.pdf" 200
expect "${site}resume.en.pdf" 200
expect "${site}resume.ar.pdf" 200
expect "${site}sitemap.xml" 200

# The root is the redirect page to the default language, not a blank.
if curl -s "${site}" | grep -q 'http-equiv="refresh"'; then
  echo "${site} carries the redirect to the default language"
else
  echo "${site} does not carry the meta refresh to the default language" >&2
  exit 1
fi
