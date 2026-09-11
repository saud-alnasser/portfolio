// The mechanism behind "one source of content": a project added to
// src/content/projects/ appears on the work page, the CV page, the resume
// page, and resume.json in both languages, with no change to any file outside
// the content source, and disappears again when removed. A certificate added
// to src/content/certificates/ does the same on the education page, the CV
// page, and resume.json. A language added to src/content/languages/ reaches
// the CV page, the resume page, and resume.json, and no page of the site.
//
//   pnpm test:content
//
// The script writes a fixture project, a fixture certificate, and a fixture
// language, builds, asserts each fixture's name is in exactly its own outputs
// and nowhere else in dist/, removes the fixtures, builds again, and asserts
// the names are gone. At every step `git status` is compared with what it
// showed at the start: nothing outside src/content/ may differ during the
// run, and nothing at all may differ at the end. In CI the tree starts clean,
// so that is the literal assertion; on a developer's machine it tolerates
// their own uncommitted work while still catching a build that writes outside
// dist/.
//
// The fixture certificate names no document, so its card on the education
// page has nothing to open and must be neither a link nor a button. Every
// real certificate carries its document, so this is the one place that card
// is rendered and checked.
//
// The fixture project is finished and marked for the resume, so it reaches
// the resume page as well as the CV; the fixture certificate is a course and
// carries no marker, so it reaches the CV and stops there. Each takes the
// path a real entry takes through src/lib/shown.ts.
//
// The fixture language carries no test, so what it proves is the mechanism
// and not a score's format; the score's line is asserted by the browser tests
// and the dist check over the real entries.
//
// The fixture names start with `fixture-`, as src/content/README.md reserves for
// placeholders, and carry a suffix no real entry would. `render:pdf` is not
// run: the PDF is rendered from the CV page this script already asserts on.
// Exits non-zero with a named reason on the first failure, and removes the
// fixtures whatever happens.

import { execFile } from 'node:child_process';
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const contentDir = 'src/content/';

// Each fixture: its name, the file it is written to, what is written, and
// where the name must appear. The three names share no prefix beyond
// `fixture-`, so a search for one never finds another.
const project = {
  name: 'fixture-mechanism-probe-4f9c2e',
  file: path.join(root, contentDir, 'projects', 'fixture-mechanism-probe-4f9c2e.yaml'),
  outputs: [
    'en/work/index.html',
    'ar/work/index.html',
    'en/cv/index.html',
    'ar/cv/index.html',
    'en/resume/index.html',
    'ar/resume/index.html',
    'en/resume.json',
    'ar/resume.json',
  ],
};
project.text = `# Written by scripts/test-content-mechanism.mjs and removed by it. If this
# file is in the tree, that script was interrupted; delete it.
name: "${project.name}"
period:
  start: "2026-01"
  end: "2026-02"
role:
  en: "Fixture role"
  ar: "دور تجريبي"
summary:
  en: "A fixture project that proves content flows to every output."
  ar: "مشروع تجريبي يثبت أن المحتوى يصل إلى كل المخرجات."
technologies:
  - "Fixture"
links:
  repository: https://example.invalid/${project.name}
visibility: public
status: completed
resume: true
`;

const certificate = {
  name: 'fixture-certificate-without-document-7b1d0a',
  file: path.join(root, contentDir, 'certificates', 'fixture-certificate-without-document-7b1d0a.yaml'),
  outputs: ['en/education/index.html', 'ar/education/index.html', 'en/cv/index.html', 'ar/cv/index.html', 'en/resume.json', 'ar/resume.json'],
};
certificate.text = `# Written by scripts/test-content-mechanism.mjs and removed by it. If this
# file is in the tree, that script was interrupted; delete it.
name:
  en: "${certificate.name}"
  ar: "${certificate.name}"
issuer: "Fixture issuer"
kind: course
`;

const language = {
  name: 'fixture-language-probe-9e3d5c',
  file: path.join(root, contentDir, 'languages', 'fixture-language-probe-9e3d5c.yaml'),
  outputs: ['en/cv/index.html', 'ar/cv/index.html', 'en/resume/index.html', 'ar/resume/index.html', 'en/resume.json', 'ar/resume.json'],
};
language.text = `# Written by scripts/test-content-mechanism.mjs and removed by it. If this
# file is in the tree, that script was interrupted; delete it.
name:
  en: "${language.name}"
  ar: "${language.name}"
level:
  en: "Fixture level"
  ar: "مستوى تجريبي"
order: 99
`;

const fixtures = [project, certificate, language];

class Failure extends Error {
  constructor(reason, message) {
    super(message);
    this.reason = reason;
  }
}

async function gitStatus() {
  const { stdout } = await run('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: root });
  return stdout.split(/\r?\n/).filter(Boolean).sort();
}

// The status lines that differ from the baseline, in either direction.
function statusDelta(baseline, current) {
  return [...current.filter((line) => !baseline.includes(line)), ...baseline.filter((line) => !current.includes(line))];
}

// A porcelain line's path: after the two status columns and a space, and
// after " -> " for a rename.
function pathOf(line) {
  const file = line.slice(3);
  return file.includes(' -> ') ? file.split(' -> ')[1] : file;
}

async function assertTreeUntouched(step, baseline, { allowContent }) {
  const delta = statusDelta(baseline, await gitStatus());
  const outside = allowContent ? delta.filter((line) => !pathOf(line).startsWith(contentDir)) : delta;
  if (outside.length > 0) {
    const where = allowContent ? `outside ${contentDir}` : 'at all';
    throw new Failure('tree-changed', `${step}: git status changed ${where}:\n${outside.map((line) => `  ${line}`).join('\n')}`);
  }
}

// `astro build`, through node and astro's own entry so no shell or package
// manager shim is needed. The entry is not in astro's exports map, so it is
// found by path.
async function build(step) {
  const astro = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
  try {
    await stat(astro);
  } catch {
    throw new Failure('astro-missing', `${path.relative(root, astro)} does not exist; run \`pnpm install\` first`);
  }
  try {
    const { stdout } = await run(process.execPath, [astro, 'build'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
    const gaps = stdout.split(/\r?\n/).find((line) => line.includes('[localized]'));
    console.log(`${step}: built${gaps ? `, ${gaps.trim()}` : ''}`);
  } catch (error) {
    throw new Failure('build-failed', `${step}: astro build exited ${error.code ?? 'non-zero'}\n${error.stderr ?? ''}`);
  }
}

// Every file under dist/ whose text mentions a name.
async function mentions(name) {
  const found = [];
  const walk = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.(html|json|xml|txt|js|css)$/.test(entry.name) && (await readFile(file, 'utf8')).includes(name)) {
        found.push(path.relative(dist, file).split(path.sep).join('/'));
      }
    }
  };
  await walk(dist);
  return found.sort();
}

async function assertPresent(fixture) {
  const found = await mentions(fixture.name);
  for (const output of fixture.outputs) {
    if (!found.includes(output)) throw new Failure('fixture-missing', `dist/${output} does not mention "${fixture.name}" after the build`);
  }
  const elsewhere = found.filter((file) => !fixture.outputs.includes(file));
  if (elsewhere.length > 0) {
    throw new Failure('fixture-leaked', `"${fixture.name}" also appears in ${elsewhere.map((file) => `dist/${file}`).join(', ')}, outside its ${fixture.outputs.length} outputs`);
  }
  console.log(`present: "${fixture.name}" in ${fixture.outputs.map((file) => `dist/${file}`).join(', ')} and nowhere else`);
}

// The project's link reaches the JSON Resume document as its url.
async function assertProjectLinked() {
  for (const locale of ['en', 'ar']) {
    const resume = JSON.parse(await readFile(path.join(dist, locale, 'resume.json'), 'utf8'));
    const entry = (resume.projects ?? []).find((item) => item.name === project.name);
    if (!entry) throw new Failure('fixture-missing', `dist/${locale}/resume.json has no project named "${project.name}"`);
    if (entry.url !== `https://example.invalid/${project.name}`) {
      throw new Failure('fixture-wrong', `dist/${locale}/resume.json: the fixture's url is ${JSON.stringify(entry.url)}, expected the repository link`);
    }
  }
}

// The certificate's card on the education page is neither a link nor a
// button and carries no document, because the entry names none. The card is
// the nearest element before the name that is marked as a course entry, the
// kind the fixture carries; its opening tag says what it is.
async function assertCardUnopenable() {
  for (const locale of ['en', 'ar']) {
    const file = `${locale}/education/index.html`;
    const html = await readFile(path.join(dist, file), 'utf8');
    const at = html.indexOf(certificate.name);
    const marker = html.lastIndexOf('data-entry="course"', at);
    if (at === -1 || marker === -1) throw new Failure('fixture-missing', `dist/${file} has no certificate card named "${certificate.name}"`);
    const tag = html.slice(html.lastIndexOf('<', marker), html.indexOf('>', marker) + 1);
    const element = /^<([a-z0-9-]+)/i.exec(tag)?.[1]?.toLowerCase();
    if (element === 'a' || element === 'button' || /\s(href|data-document|data-preview)=/.test(tag)) {
      throw new Failure('card-opens-nothing', `dist/${file}: the card for "${certificate.name}", which names no document, is ${tag}; expected neither a link nor a button`);
    }
    console.log(`unopenable: dist/${file} renders "${certificate.name}" as <${element}> with no link and no document`);
  }
}

async function assertAbsent(fixture) {
  const found = await mentions(fixture.name);
  if (found.length > 0) {
    throw new Failure('fixture-remains', `"${fixture.name}" is still in ${found.map((file) => `dist/${file}`).join(', ')} after its removal`);
  }
  console.log(`absent: "${fixture.name}" is in no file under dist/`);
}

try {
  for (const fixture of fixtures) {
    try {
      await stat(fixture.file);
      throw new Failure('fixture-exists', `${path.relative(root, fixture.file)} already exists; a previous run was interrupted, delete it`);
    } catch (error) {
      if (error instanceof Failure) throw error;
    }
  }

  const baseline = await gitStatus();
  if (baseline.length > 0) console.log(`baseline: git status shows ${baseline.length} uncommitted path(s); the run must leave them as they are`);

  try {
    for (const fixture of fixtures) await writeFile(fixture.file, fixture.text, 'utf8');
    await assertTreeUntouched('after writing the fixtures', baseline, { allowContent: true });
    await build('with the fixtures');
    await assertTreeUntouched('after the build with the fixtures', baseline, { allowContent: true });
    for (const fixture of fixtures) await assertPresent(fixture);
    await assertProjectLinked();
    await assertCardUnopenable();
  } finally {
    for (const fixture of fixtures) await rm(fixture.file, { force: true });
  }

  await assertTreeUntouched('after removing the fixtures', baseline, { allowContent: false });
  await build('without the fixtures');
  await assertTreeUntouched('after the build without the fixtures', baseline, { allowContent: false });
  for (const fixture of fixtures) await assertAbsent(fixture);
  console.log('test-content-mechanism: passed');
} catch (error) {
  if (error instanceof Failure) {
    console.error(`test-content-mechanism: ${error.reason}: ${error.message}`);
  } else {
    console.error(`test-content-mechanism: unexpected: ${error.stack ?? error}`);
  }
  process.exit(1);
}
