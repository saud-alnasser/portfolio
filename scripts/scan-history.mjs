// Scans the whole git history for the identifier patterns in
// scripts/identifiers.mjs: every line `git log -p --all` prints, added or
// removed, in any branch. Run it in a clone with full history:
//
//   pnpm scan:history
//
// A match is a finding to report, since an identifier in any past commit is
// public the moment the repository is, and the remedy is rewriting history
// rather than filtering the scan. The one exemption, digits inside a URL, is
// scripts/identifiers.mjs's and is explained there. Exits non-zero naming the
// commit and the line when anything matches.

import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { identifiersIn } from './identifiers.mjs';

const git = spawn('git', ['log', '-p', '--all', '--no-color', '--format=commit %H'], { stdio: ['ignore', 'pipe', 'inherit'] });
const lines = createInterface({ input: git.stdout, crlfDelay: Infinity });

let commit = '(none)';
let scanned = 0;
let commits = 0;
const findings = [];

for await (const line of lines) {
  scanned += 1;
  if (line.startsWith('commit ')) {
    commit = line.slice('commit '.length);
    commits += 1;
    continue;
  }
  const patterns = identifiersIn(line);
  if (patterns.length > 0) findings.push({ commit, line, patterns });
}

const status = await new Promise((resolve) => git.on('close', resolve));
if (status !== 0) {
  console.error(`scan-history: git log exited ${status}; the scan did not run`);
  process.exit(1);
}
if (commits === 0) {
  console.error('scan-history: git log printed no commit; is the history fetched?');
  process.exit(1);
}

if (findings.length > 0) {
  console.error(`scan-history: ${findings.length} line(s) in the history match an identifier pattern`);
  for (const { commit, line, patterns } of findings) {
    console.error(`  ${commit.slice(0, 12)}  ${patterns.join(', ')}: ${line.length > 160 ? `${line.slice(0, 160)}...` : line}`);
  }
  process.exit(1);
}

console.log(`scan-history: ${scanned} lines over ${commits} commits, no identifier pattern matches`);
