// Writes the profile block of README.md, the page GitHub shows for the
// account, from the content source and the site config: the summary, the
// site and CV addresses, the contact, and the skill groups. Who Saud is stays
// authored once, in src/content/, and the profile page repeats it without a
// second hand-written copy. Run after editing the profile or the skills:
//
//   pnpm readme           # rewrites the block between the markers
//   pnpm readme --check   # exits non-zero when the README is behind
//
// The block sits between <!-- profile --> and <!-- /profile --> in README.md;
// everything outside the markers is written by hand. The dist check runs the
// check, so CI fails when the content changed and the README did not.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { base, site } from '../astro.config.mjs';
import { byOrderThenName } from '../src/lib/order.ts';
import { joinBase } from '../src/lib/paths.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readmeFile = path.join(root, 'README.md');
const content = path.join(root, 'src', 'content');
const open = '<!-- profile -->';
const close = '<!-- /profile -->';

// Prose wrapped at the width the README's other paragraphs use.
function wrap(text, width = 76) {
  const lines = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && line.length + 1 + word.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.join('\n');
}

// A full address on the site, from the same `site` and `base` the build uses.
const at = (sitePath) => new URL(joinBase(base, sitePath), site).href;

// The block as the content says it should read.
export async function renderProfile() {
  const { profile } = parseYaml(await readFile(path.join(content, 'profile.yaml'), 'utf8'));
  const skillsDir = path.join(content, 'skills');
  const skills = [];
  for (const file of (await readdir(skillsDir)).filter((name) => name.endsWith('.yaml')).sort()) {
    skills.push(parseYaml(await readFile(path.join(skillsDir, file), 'utf8')));
  }
  skills.sort(byOrderThenName);

  const home = at('/');
  const lines = [
    open,
    wrap(profile.summary.en),
    '',
    `- 🌐 Portfolio: [${home.replace(/^https?:\/\//, '')}](${at('/en/')}) · [بالعربية](${at('/ar/')})`,
    `- 📄 CV: [read it](${at('/en/cv/')})`,
    ...profile.profiles
      .filter((entry) => entry.network !== 'GitHub')
      .map((entry) => `- 🔗 ${entry.network}: [${entry.username}](${entry.url})`),
    '',
    '## 🧰 What I work with',
    '',
    ...skills.map((group) => `- **${group.name.en}:** ${group.keywords.join(', ')}`),
    close,
  ];
  return lines.join('\n');
}

// The README as it is and as it should be with the block current.
export async function readmeWithProfile() {
  const current = await readFile(readmeFile, 'utf8');
  const start = current.indexOf(open);
  const end = current.indexOf(close);
  if (start < 0 || end < start) {
    throw new Error(`README.md: the ${open} and ${close} markers are missing or out of order`);
  }
  const next = current.slice(0, start) + (await renderProfile()) + current.slice(end + close.length);
  return { current, next };
}

const runDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (runDirectly) {
  try {
    const { current, next } = await readmeWithProfile();
    if (process.argv.includes('--check')) {
      if (current !== next) {
        console.error('readme-profile: README.md is behind src/content/ or astro.config.mjs; run `pnpm readme`');
        process.exit(1);
      }
      console.log('readme-profile: README.md carries the profile as src/content/ states it');
    } else if (current === next) {
      console.log('readme-profile: README.md already current');
    } else {
      await writeFile(readmeFile, next);
      console.log('readme-profile: README.md rewritten from src/content/ and astro.config.mjs');
    }
  } catch (error) {
    console.error(`readme-profile: ${error.message}`);
    process.exit(1);
  }
}
