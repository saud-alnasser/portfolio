// Lighthouse on the home and CV pages of both languages, against a static
// server of dist/ under the site's base path, so the audited pages are the
// ones Pages will serve. Run after `pnpm build`:
//
//   pnpm lighthouse
//
// It serves dist/ on an ephemeral port, hands the four addresses to
// `lhci autorun` (the thresholds and the run count are in lighthouserc.json),
// and closes the server when Lighthouse is done. Lighthouse's exit code is
// this script's, so a score under a threshold fails the run the same way it
// did when the addresses were in the config file.

import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from './serve-dist.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const pages = ['/en/', '/ar/', '/en/cv/', '/ar/cv/'];

let server;
try {
  server = await serve(dist);
} catch (error) {
  console.error(`lighthouse: ${error.message}`);
  process.exit(1);
}

const urls = pages.map((page) => server.at(page));
console.log(`lighthouse: auditing ${urls.join(' ')}`);

// `lhci` is on the PATH when this runs through `pnpm lighthouse`; on Windows
// it is a .cmd shim, which only a shell can start.
const lhci = spawn('lhci', ['autorun', ...urls.map((url) => `--collect.url=${url}`)], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const code = await new Promise((resolve, reject) => {
  lhci.on('error', reject);
  lhci.on('close', resolve);
}).catch((error) => {
  console.error(`lighthouse: could not start lhci: ${error.message}`);
  return 1;
});

await server.close();
process.exitCode = code ?? 1;
