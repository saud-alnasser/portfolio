import type { APIRoute } from 'astro';
import { locales, resumeFor, type Locale } from '../../lib/resume';

// The machine-readable CV, one document per language, at /en/resume.json and
// /ar/resume.json. Written once at build time; there is no server.

export function getStaticPaths() {
  return locales.map((locale) => ({ params: { locale } }));
}

export const GET: APIRoute = async ({ params, site }) => {
  if (!site) throw new Error('resume.json: `site` must be set in astro.config.mjs');
  const resume = await resumeFor(params.locale as Locale, site);
  return new Response(JSON.stringify(resume, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
