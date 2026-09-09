// The mechanism behind "one source of content" (.aep/efforts/1-portfolio-site/spec.md,
// criteria 1 and 9): a project added to src/content/projects/ appears on the
// work page, the CV page, and resume.json in both languages, with no change
// to any file outside the content source, and disappears again when removed.
//
//   pnpm test:content
//
// The script writes a fixture project, builds, asserts the fixture's name is
// in exactly the six outputs and nowhere else in dist/, removes the fixture,
// builds again, and asserts the name is gone. At every step `git status` is
// compared with what it showed at the start: nothing outside src/content/
// may differ during the run, and nothing at all may differ at the end. In CI
// the tree starts clean, so that is the literal assertion; on a developer's
// machine it tolerates their own uncommitted work while still catching a
// build that writes outside dist/.
//
// The fixture name starts with `fixture-`, as README.md reserves for
// placeholders, and carries a suffix no real entry would. `render:pdf` is not
// run: the PDF is rendered from the CV page this script already asserts on.
// Exits non-zero with a named reason on the first failure, and removes the
// fixture whatever happens.

import { execFile } from 'node:child_process';
import { readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const contentDir = 'src/content/';

const fixtureName = 'fixture-mechanism-probe-4f9c2e';
const fixtureFile = path.join(root, contentDir, 'projects', `${fixtureName}.yaml`);
const fixture = `# Written by scripts/test-content-mechanism.mjs and removed by it. If this
# file is in the tree, that script was interrupted; delete it.
name: "${fixtureName}"
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
  repository: https://example.invalid/${fixtureName}
visibility: public
`;

// Where the name must appear: the work page, the CV page, and the JSON Resume
// document, in each language.
const outputs = ['en/work/index.html', 'ar/work/index.html', 'en/cv/index.html', 'ar/cv/index.html', 'en/resume.json', 'ar/resume.json'];

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

// Every file under dist/ whose text mentions the fixture name.
async function mentions() {
  const found = [];
  const walk = async (directory) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) await walk(file);
      else if (/\.(html|json|xml|txt|js|css)$/.test(entry.name) && (await readFile(file, 'utf8')).includes(fixtureName)) {
        found.push(path.relative(dist, file).split(path.sep).join('/'));
      }
    }
  };
  await walk(dist);
  return found.sort();
}

async function assertPresent() {
  const found = await mentions();
  for (const output of outputs) {
    if (!found.includes(output)) throw new Failure('fixture-missing', `dist/${output} does not mention "${fixtureName}" after the build`);
  }
  const elsewhere = found.filter((file) => !outputs.includes(file));
  if (elsewhere.length > 0) {
    throw new Failure('fixture-leaked', `"${fixtureName}" also appears in ${elsewhere.map((file) => `dist/${file}`).join(', ')}, outside the three outputs`);
  }
  for (const locale of ['en', 'ar']) {
    const resume = JSON.parse(await readFile(path.join(dist, locale, 'resume.json'), 'utf8'));
    const project = (resume.projects ?? []).find((entry) => entry.name === fixtureName);
    if (!project) throw new Failure('fixture-missing', `dist/${locale}/resume.json has no project named "${fixtureName}"`);
    if (project.url !== `https://example.invalid/${fixtureName}`) {
      throw new Failure('fixture-wrong', `dist/${locale}/resume.json: the fixture's url is ${JSON.stringify(project.url)}, expected the repository link`);
    }
  }
  console.log(`present: "${fixtureName}" in ${outputs.map((file) => `dist/${file}`).join(', ')} and nowhere else`);
}

async function assertAbsent() {
  const found = await mentions();
  if (found.length > 0) {
    throw new Failure('fixture-remains', `"${fixtureName}" is still in ${found.map((file) => `dist/${file}`).join(', ')} after its removal`);
  }
  console.log(`absent: "${fixtureName}" is in no file under dist/`);
}

try {
  try {
    await stat(fixtureFile);
    throw new Failure('fixture-exists', `${path.relative(root, fixtureFile)} already exists; a previous run was interrupted, delete it`);
  } catch (error) {
    if (error instanceof Failure) throw error;
  }

  const baseline = await gitStatus();
  if (baseline.length > 0) console.log(`baseline: git status shows ${baseline.length} uncommitted path(s); the run must leave them as they are`);

  try {
    await writeFile(fixtureFile, fixture, 'utf8');
    await assertTreeUntouched('after writing the fixture', baseline, { allowContent: true });
    await build('with the fixture');
    await assertTreeUntouched('after the build with the fixture', baseline, { allowContent: true });
    await assertPresent();
  } finally {
    await rm(fixtureFile, { force: true });
  }

  await assertTreeUntouched('after removing the fixture', baseline, { allowContent: false });
  await build('without the fixture');
  await assertTreeUntouched('after the build without the fixture', baseline, { allowContent: false });
  await assertAbsent();
  console.log('test-content-mechanism: passed');
} catch (error) {
  if (error instanceof Failure) {
    console.error(`test-content-mechanism: ${error.reason}: ${error.message}`);
  } else {
    console.error(`test-content-mechanism: unexpected: ${error.stack ?? error}`);
  }
  process.exit(1);
}
