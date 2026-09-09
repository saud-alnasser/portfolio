// Checks over the built site in dist/. Run after `pnpm build`:
//
//   pnpm check:dist
//
// Each check is a function that receives the context below, returns the lines
// to print on success, and throws on failure. Adding a check means adding a
// function to `checks`; the runner prints the reason and exits non-zero on the
// first failure. The reader is a person watching CI, so failures name what was
// expected and what was found.

import { execFile } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { parse as parseYaml } from 'yaml';
import { identifiersIn } from './identifiers.mjs';
// The site's own date wording and orders, so the expectation reads exactly
// what the CV page printed. Node strips the types on import.
import { formatPeriod, localeInfo, strings } from '../src/lib/i18n.ts';
import { gapReport, pick } from '../src/lib/localized.ts';
import { byStartAscending, byStartDescending } from '../src/lib/order.ts';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const context = {
  root,
  dist: path.join(root, 'dist'),
  content: path.join(root, 'src', 'content'),
  locales: ['en', 'ar'],
};

class CheckFailure extends Error {
  constructor(check, message) {
    super(message);
    this.check = check;
  }
}

// The YAML files of one collection that the site shows: every file that is not
// marked `visibility: hidden`. The key is top-level in every schema that has
// it, so a line-anchored match is enough and no YAML parser is needed.
async function visibleEntries(collection) {
  const dir = path.join(context.content, collection);
  const files = (await readdir(dir)).filter((name) => name.endsWith('.yaml')).sort();
  const entries = [];
  for (const file of files) {
    const text = await readFile(path.join(dir, file), 'utf8');
    const visibility = text.match(/^visibility:\s*(\S+)\s*$/m)?.[1];
    if (visibility === 'hidden') continue;
    entries.push({ file, text, visibility });
  }
  return entries;
}

// The `name:` of a project file, which is authored once and so is the same in
// every language's document.
function projectName(text) {
  return text.match(/^name:\s*(.+?)\s*$/m)?.[1];
}

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

// `@jsonresume/schema` validates with a callback; wrapped so a check can await
// it. On failure it hands back the validator's error list.
function validateResume(resume) {
  const { validate } = require('@jsonresume/schema');
  return new Promise((resolve) => {
    validate(resume, (errors, valid) => resolve({ valid, errors: errors ?? [] }));
  });
}

// The JSON Resume document per language: present, valid against the schema,
// and carrying exactly the entries the site shows.
async function jsonResume() {
  const name = 'json resume';
  const sections = {
    work: 'experience',
    education: 'education',
    certificates: 'certificates',
    skills: 'skills',
    projects: 'projects',
  };
  const expected = {};
  for (const [section, collection] of Object.entries(sections)) {
    expected[section] = await visibleEntries(collection);
  }
  const described = expected.projects.filter((entry) => entry.visibility === 'described').map((entry) => projectName(entry.text));

  const lines = [];
  for (const locale of context.locales) {
    const file = path.join(context.dist, locale, 'resume.json');
    let resume;
    try {
      resume = await readJson(file);
    } catch (error) {
      throw new CheckFailure(name, `${locale}: cannot read ${path.relative(root, file)}: ${error.message}`);
    }

    const { valid, errors } = await validateResume(resume);
    if (!valid) {
      const detail = errors.map((error) => `  ${error.property}: ${error.message}`).join('\n');
      throw new CheckFailure(name, `${locale}: the document does not validate against @jsonresume/schema\n${detail}`);
    }

    const counts = [];
    for (const [section, entries] of Object.entries(expected)) {
      const found = Array.isArray(resume[section]) ? resume[section].length : 0;
      if (found !== entries.length) {
        throw new CheckFailure(
          name,
          `${locale}: ${section} has ${found} entries, expected ${entries.length} from src/content/${sections[section]}/`,
        );
      }
      counts.push(`${section} ${found}`);
    }

    for (const project of resume.projects ?? []) {
      if (described.includes(project.name) && 'url' in project) {
        throw new CheckFailure(name, `${locale}: described project "${project.name}" carries a url key`);
      }
    }

    lines.push(`${locale}/resume.json: valid, ${counts.join(', ')}`);
  }
  return lines;
}

// One line of text with its whitespace normalised, so a run of spaces that
// `pdftotext -layout` inserts between two columns of a line reads as one.
function squash(text) {
  return text.replace(/\s+/g, ' ').trim();
}

// The text of a PDF as `pdftotext -layout` lays it out, or null when the tool
// is not on the PATH. UTF-8 is asked for explicitly because xpdf's build
// writes Latin-1 by default and drops everything outside it.
async function extractText(file) {
  try {
    const { stdout } = await promisify(execFile)('pdftotext', ['-enc', 'UTF-8', '-layout', file, '-'], {
      maxBuffer: 16 * 1024 * 1024,
    });
    return stdout;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

// The PDFs the render step writes: one per language, present, small enough to
// attach to an application, and the English one yielding the lines criterion 5
// names, in reading order (.aep/efforts/1-portfolio-site/spec.md). The Arabic
// PDF is checked by eye, because right-to-left extraction is not reliable
// enough to assert on.
async function cvPdf() {
  const name = 'cv pdf';
  const limit = 1_000_000;
  const lines = [];

  const sizes = {};
  for (const locale of context.locales) {
    const file = path.join(context.dist, `cv.${locale}.pdf`);
    try {
      sizes[locale] = (await stat(file)).size;
    } catch {
      throw new CheckFailure(name, `${path.relative(root, file)} does not exist; run \`pnpm render:pdf\` after the build`);
    }
    if (sizes[locale] >= limit) {
      throw new CheckFailure(name, `${path.relative(root, file)} is ${sizes[locale]} bytes, expected under ${limit}`);
    }
  }

  // What the English CV page prints, from the content it prints it from: the
  // name, the email, then each experience entry's organisation, position, and
  // period, then each education entry's institution, degree, and period, in
  // the page's own order (src/pages/[locale]/cv.astro).
  const locale = 'en';
  const t = strings[locale];
  const profile = parseYaml(await readFile(path.join(context.content, 'profile.yaml'), 'utf8')).profile;
  const experience = (await visibleEntries('experience')).map((entry) => parseYaml(entry.text)).sort(byStartDescending);
  const education = (await visibleEntries('education')).map((entry) => parseYaml(entry.text)).sort(byStartAscending);
  const expected = [profile.name[locale], profile.email];
  for (const entry of experience) {
    expected.push(entry.organisation[locale], entry.position[locale], formatPeriod(locale, entry.period));
  }
  for (const entry of education) {
    expected.push(
      entry.institution[locale],
      `${entry.studyType[locale]}${t.listSeparator}${entry.area[locale]}`,
      formatPeriod(locale, entry.period),
    );
  }

  const file = path.join(context.dist, `cv.${locale}.pdf`);
  const text = await extractText(file);
  if (text === null) {
    lines.push(`cv.${locale}.pdf: ${sizes[locale]} bytes; pdftotext is not on the PATH, so the text was not checked`);
  } else {
    const found = text.split(/\r?\n/).map(squash);
    let cursor = 0;
    for (const item of expected) {
      const index = found.findIndex((line, i) => i >= cursor && line.includes(squash(item)));
      if (index === -1) {
        throw new CheckFailure(
          name,
          `cv.${locale}.pdf: "${item}" is not on its own line after line ${cursor} of the extracted text`,
        );
      }
      cursor = index + 1;
    }
    lines.push(`cv.${locale}.pdf: ${sizes[locale]} bytes, ${expected.length} expected lines found in reading order`);
  }
  for (const other of context.locales.filter((l) => l !== locale)) {
    lines.push(`cv.${other}.pdf: ${sizes[other]} bytes`);
  }
  return lines;
}

// Every file under a directory, recursively, as paths relative to it with
// forward slashes, so a route reads the same on every platform.
async function walk(directory, prefix = '') {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await walk(path.join(directory, entry.name), relative)));
    else files.push(relative);
  }
  return files;
}

// The routes one language publishes, as "/", "/work/", and so on: every
// index.html under dist/<locale>/, without the locale prefix.
async function routes(locale) {
  const files = await walk(path.join(context.dist, locale));
  return files
    .filter((file) => file === 'index.html' || file.endsWith('/index.html'))
    .map((file) => `/${file.slice(0, -'index.html'.length)}`);
}

// Every HTML file of the site, as paths relative to dist/.
async function htmlFiles() {
  return (await walk(context.dist)).filter((file) => file.endsWith('.html'));
}

// The attributes of the first tag with this name, as a map. The pages are
// generated, so a regular expression over the tag is enough.
function attributesOf(html, tag) {
  const match = html.match(new RegExp(`<${tag}\\b([^>]*)>`, 'i'));
  if (!match) return null;
  const attributes = {};
  for (const [, name, , value] of match[1].matchAll(/([\w:-]+)(?:=(["'])(.*?)\2)?/g)) {
    attributes[name.toLowerCase()] = value ?? '';
  }
  return attributes;
}

// The content of the <meta> carrying this name or property, or null.
function metaContent(html, key, value) {
  for (const [, attributes] of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const map = attributesOf(`<meta${attributes}>`, 'meta');
    if (map?.[key] === value) return map.content ?? '';
  }
  return null;
}

// A page that asks not to be indexed: the root redirect to /en/, which is not
// a page of the site so much as its doorway. The checks over titles and the
// sitemap leave it out, on purpose.
function isNoindex(html) {
  return metaContent(html, 'name', 'robots')?.includes('noindex') ?? false;
}

// Every route of one language exists in the other, and each page's <html>
// says which language it is and which way it reads (criterion 13).
async function localeTwins() {
  const name = 'locale twins';
  const [en, ar] = await Promise.all(context.locales.map(routes));
  for (const route of en) {
    if (!ar.includes(route)) throw new CheckFailure(name, `dist/en${route}index.html has no twin at dist/ar${route}index.html`);
  }
  for (const route of ar) {
    if (!en.includes(route)) throw new CheckFailure(name, `dist/ar${route}index.html has no twin at dist/en${route}index.html`);
  }
  if (en.length === 0) throw new CheckFailure(name, 'dist/en/ has no index.html under it; was the site built?');

  for (const locale of context.locales) {
    const { dir } = localeInfo(locale);
    for (const route of await routes(locale)) {
      const file = `dist/${locale}${route}index.html`;
      const html = await readFile(path.join(context.root, file), 'utf8');
      const attributes = attributesOf(html, 'html');
      if (!attributes) throw new CheckFailure(name, `${file} has no <html> tag`);
      if (attributes.lang !== locale) {
        throw new CheckFailure(name, `${file}: <html> has lang="${attributes.lang ?? ''}", expected lang="${locale}"`);
      }
      if (attributes.dir !== dir) {
        throw new CheckFailure(name, `${file}: <html> has dir="${attributes.dir ?? ''}", expected dir="${dir}"`);
      }
    }
  }
  return [`locale twins: ${en.length} routes in each language, lang and dir as expected: ${en.join(' ')}`];
}

// No link that goes nowhere: an `href=""` or an `href="undefined"` is what a
// template prints when an optional link was read without checking it
// (criterion 3).
async function hrefs() {
  const name = 'hrefs';
  const files = await htmlFiles();
  let count = 0;
  for (const file of files) {
    const html = await readFile(path.join(context.dist, file), 'utf8');
    const bad = html.match(/href=(?:""|''|"undefined"|'undefined')/);
    if (bad) throw new CheckFailure(name, `dist/${file} contains ${bad[0]}; a missing link is omitted, never printed empty`);
    count += (html.match(/\bhref=/g) ?? []).length;
  }
  return [`hrefs: ${count} links in ${files.length} pages, none empty or undefined`];
}

// Every page a visitor lands on carries a title, a description, and the
// Open Graph fields a social preview reads (criterion 10). Titles are unique
// across the site, since two pages sharing one are one page to a search
// result.
async function metadata() {
  const name = 'metadata';
  const required = ['og:title', 'og:description', 'og:url', 'og:locale'];
  const titles = new Map();
  let count = 0;
  for (const file of await htmlFiles()) {
    const html = await readFile(path.join(context.dist, file), 'utf8');
    if (isNoindex(html)) continue;
    count += 1;
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1].trim() ?? '';
    if (!title) throw new CheckFailure(name, `dist/${file} has no <title>, or an empty one`);
    if (titles.has(title)) {
      throw new CheckFailure(name, `dist/${file} has the title "${title}", which dist/${titles.get(title)} already carries`);
    }
    titles.set(title, file);
    const description = metaContent(html, 'name', 'description');
    if (!description) throw new CheckFailure(name, `dist/${file} has no <meta name="description">, or an empty one`);
    for (const property of required) {
      if (!metaContent(html, 'property', property)) {
        throw new CheckFailure(name, `dist/${file} has no <meta property="${property}">, or an empty one`);
      }
    }
  }
  return [`metadata: ${count} pages with a unique title, a description, and ${required.join(', ')}`];
}

// The <loc> values of a sitemap file.
function locations(xml) {
  return [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1].trim());
}

// sitemap-index.xml points at sitemaps that exist, and between them they list
// every page of both languages and nothing else (criterion 10). The root
// redirect is noindex and stays out.
async function sitemap() {
  const name = 'sitemap';
  const indexFile = 'sitemap-index.xml';
  let index;
  try {
    index = await readFile(path.join(context.dist, indexFile), 'utf8');
  } catch {
    throw new CheckFailure(name, `dist/${indexFile} does not exist`);
  }
  const sitemaps = locations(index);
  if (sitemaps.length === 0) throw new CheckFailure(name, `dist/${indexFile} names no sitemap`);

  const listed = new Set();
  for (const url of sitemaps) {
    const file = new URL(url).pathname.slice(1);
    let xml;
    try {
      xml = await readFile(path.join(context.dist, file), 'utf8');
    } catch {
      throw new CheckFailure(name, `dist/${indexFile} points at ${url}, but dist/${file} does not exist`);
    }
    for (const location of locations(xml)) listed.add(location);
  }

  const origin = new URL(sitemaps[0]).origin;
  const expected = new Set();
  for (const locale of context.locales) {
    for (const route of await routes(locale)) expected.add(`${origin}/${locale}${route}`);
  }
  for (const url of expected) {
    if (!listed.has(url)) throw new CheckFailure(name, `${url} is a page but no sitemap under dist/${indexFile} lists it`);
  }
  for (const url of listed) {
    if (!expected.has(url)) throw new CheckFailure(name, `a sitemap under dist/${indexFile} lists ${url}, which is not a page`);
  }
  return [`sitemap: ${sitemaps.length} sitemap(s) listing all ${expected.size} pages`];
}

// robots.txt permits indexing: no line disallows the whole site (criterion
// 10).
async function robots() {
  const name = 'robots';
  let text;
  try {
    text = await readFile(path.join(context.dist, 'robots.txt'), 'utf8');
  } catch {
    throw new CheckFailure(name, 'dist/robots.txt does not exist');
  }
  const disallow = text.split(/\r?\n/).find((line) => /^\s*Disallow:\s*\/\s*$/i.test(line));
  if (disallow) throw new CheckFailure(name, `dist/robots.txt has the line "${disallow.trim()}", which forbids indexing the site`);
  return ['robots.txt: no "Disallow: /" line'];
}

// No identifier in anything the site publishes: every HTML, JSON, XML, and
// text file under dist/, and the text of each PDF where pdftotext is on the
// PATH (criterion 12). The patterns are scripts/identifiers.mjs.
async function identifiers() {
  const name = 'identifiers';
  const textual = ['.html', '.json', '.xml', '.txt'];
  const files = (await walk(context.dist)).filter((file) => textual.includes(path.extname(file)));
  for (const file of files) {
    const text = await readFile(path.join(context.dist, file), 'utf8');
    const found = identifiersIn(text);
    if (found.length > 0) throw new CheckFailure(name, `dist/${file} matches the pattern of a ${found.join(' and a ')}`);
  }
  const pdfs = (await walk(context.dist)).filter((file) => file.endsWith('.pdf'));
  let extracted = 0;
  for (const file of pdfs) {
    const text = await extractText(path.join(context.dist, file));
    if (text === null) break;
    extracted += 1;
    const found = identifiersIn(text);
    if (found.length > 0) throw new CheckFailure(name, `the text of dist/${file} matches the pattern of a ${found.join(' and a ')}`);
  }
  const pdfNote =
    pdfs.length === 0 ? '' : extracted === pdfs.length ? ` and the text of ${pdfs.length} PDFs` : ` (pdftotext is not on the PATH, so ${pdfs.length} PDFs were not read)`;
  return [`identifiers: no pattern matches in ${files.length} text files${pdfNote}`];
}

// The language gap report: every per-language field whose Arabic is missing,
// in the same words the build prints. It is recomputed here from the content
// with the site's own fallback (src/lib/localized.ts), because the build's
// line went to a log this script cannot read back; the rule and the wording
// are the one function, so the two reports cannot differ (criterion 13).
async function gaps() {
  const walkValue = (value, collection, id, field) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => walkValue(item, collection, id, `${field}[${index}]`));
    } else if (value && typeof value === 'object') {
      if (typeof value.en === 'string') pick(value, 'ar', { collection, id, field });
      else for (const [key, item] of Object.entries(value)) walkValue(item, collection, id, field ? `${field}.${key}` : key);
    }
  };
  const profile = parseYaml(await readFile(path.join(context.content, 'profile.yaml'), 'utf8'));
  walkValue(profile.profile, 'profile', 'profile', '');
  for (const collection of ['projects', 'experience', 'education', 'certificates', 'skills']) {
    const dir = path.join(context.content, collection);
    for (const file of (await readdir(dir)).filter((entry) => entry.endsWith('.yaml')).sort()) {
      const entry = parseYaml(await readFile(path.join(dir, file), 'utf8'));
      // A hidden project is never rendered, so the build records no gap for it.
      if (entry.visibility === 'hidden') continue;
      walkValue(entry, collection, file.slice(0, -'.yaml'.length), '');
    }
  }
  return [gapReport()];
}

const checks = [jsonResume, cvPdf, localeTwins, hrefs, metadata, sitemap, robots, identifiers, gaps];

for (const check of checks) {
  try {
    const lines = await check(context);
    for (const line of lines) console.log(line);
  } catch (error) {
    if (error instanceof CheckFailure) {
      console.error(`check-dist: ${error.check}: ${error.message}`);
    } else {
      console.error(`check-dist: ${check.name}: ${error.stack ?? error}`);
    }
    process.exit(1);
  }
}
