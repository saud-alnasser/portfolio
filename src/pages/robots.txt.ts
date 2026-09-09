import type { APIRoute } from 'astro';
import { absolute } from '../lib/paths';

// robots.txt, written at build time so that its sitemap line carries the
// site's address under the base path from astro.config.mjs rather than a
// copy of it. Indexing is permitted: nothing on the site is private.
//
// A crawler reads robots.txt at the root of the host, and this site is a
// project site under its base path, so the file is not where a crawler will
// look for it; every page also announces the sitemap with a <link
// rel="sitemap">, and the sitemap can be submitted to a search console
// directly. The file still exists because the site must not break at the
// root of a host, which is where a custom domain would put it.

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error('robots.txt: `site` must be set in astro.config.mjs');
  const lines = ['User-agent: *', 'Allow: /', '', `Sitemap: ${absolute('/sitemap-index.xml', site)}`, ''];
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
