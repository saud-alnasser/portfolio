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
// The site's own date wording and orders, so the expectation reads exactly
// what the CV page printed. Node strips the types on import.
import { formatPeriod, strings } from '../src/lib/i18n.ts';
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

const checks = [jsonResume, cvPdf];

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
