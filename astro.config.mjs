// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // A user site: served at the root of the address, so no `base`. The address
  // requires the repository to be named `saud-alnasser.github.io`, which is a
  // separate step (.aep/efforts/1-portfolio-site/tickets/02-user-site-address.md).
  site: 'https://saud-alnasser.github.io',
  output: 'static',

  // Every page lives under `/en/` or `/ar/`, so the two languages are symmetrical.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ar'],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  // The root is a static page carrying a meta refresh to the default language,
  // since there is no server to redirect. Astro's own i18n redirect for `/` only
  // runs in server output, so it is declared here.
  redirects: {
    '/': '/en/',
  },

  integrations: [sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },
});
