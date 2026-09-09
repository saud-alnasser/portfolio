// Writes the README's opening paragraph from the profile entry, so that who
// Saud is stays authored once, in src/content/profile.yaml, and the profile
// page GitHub shows for the account repeats it without a second hand-written
// copy. Run after editing the profile:
//
//   pnpm readme           # rewrites the block between the markers
//   pnpm readme --check   # exits non-zero when the README is behind the profile
//
// The block sits between <!-- profile --> and <!-- /profile --> in README.md;
// everything outside the markers is written by hand. The dist check runs the
// check, so CI fails when the profile changed and the README did not.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readmeFile = path.join(root, 'README.md');
const profileFile = path.join(root, 'src', 'content', 'profile.yaml');
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

// The block as the profile says it should read: the English summary.
export async function renderProfile() {
  const { profile } = parseYaml(await readFile(profileFile, 'utf8'));
  return `${open}\n${wrap(profile.summary.en)}\n${close}`;
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
        console.error('readme-profile: README.md is behind src/content/profile.yaml; run `pnpm readme`');
        process.exit(1);
      }
      console.log('readme-profile: README.md carries the profile as src/content/profile.yaml states it');
    } else if (current === next) {
      console.log('readme-profile: README.md already current');
    } else {
      await writeFile(readmeFile, next);
      console.log('readme-profile: README.md rewritten from src/content/profile.yaml');
    }
  } catch (error) {
    console.error(`readme-profile: ${error.message}`);
    process.exit(1);
  }
}
