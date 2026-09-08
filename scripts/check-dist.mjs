// Checks over the built site in dist/. Run after `pnpm build`:
//
//   pnpm check:dist
//
// Each check is a function that receives the context below, returns the lines
// to print on success, and throws on failure. Adding a check means adding a
// function to `checks`; the runner prints the reason and exits non-zero on the
// first failure. The reader is a person watching CI, so failures name what was
// expected and what was found.

import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

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

const checks = [jsonResume];

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
