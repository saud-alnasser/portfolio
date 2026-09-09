import { defineConfig, devices } from '@playwright/test';
import { base } from './astro.config.mjs';
import { joinBase } from './src/lib/paths';

// The browser tests under tests/ run against a static server of dist/, under
// the site's base path as Pages serves it, never the live site, so a pull
// request is judged on its own build. Run after `pnpm build`:
//
//   pnpm test
//
// Every test runs twice, once per colour scheme, because both palettes must
// meet the contrast criterion and the theme control has to work from either
// starting point.

const port = 4173;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'retain-on-failure',
  },
  webServer: {
    command: `node scripts/serve-dist.mjs ${port}`,
    url: `http://127.0.0.1:${port}${joinBase(base, '/en/')}`,
    reuseExistingServer: false,
    timeout: 10_000,
  },
  projects: [
    {
      name: 'light',
      use: { ...devices['Desktop Chrome'], colorScheme: 'light' },
    },
    {
      name: 'dark',
      use: { ...devices['Desktop Chrome'], colorScheme: 'dark' },
    },
  ],
});
