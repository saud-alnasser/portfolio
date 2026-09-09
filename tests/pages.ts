// What the tests share: the routes the site publishes, under the base path
// the config gives it, and the palette values they assert on, taken from
// src/styles/global.css so a failure names the colour that was expected.

import { base } from '../astro.config.mjs';
import { joinBase } from '../src/lib/paths';

export const locales = ['en', 'ar'] as const;
export const routes = ['/', '/work/', '/education/', '/cv/'] as const;

// A path on the site as the server publishes it, under the base path from
// astro.config.mjs: at("/en/") is "/saud-alnasser/en/".
export const at = (path: string) => joinBase(base, path);

// Every page of the site, as at("/en/"), at("/ar/work/"), and so on.
export const pages = locales.flatMap((locale) => routes.map((route) => at(`/${locale}${route}`)));

// The `--background` token of each palette, as a browser reports it.
export const background = {
  light: 'rgb(255, 255, 255)',
  dark: 'rgb(18, 22, 28)',
} as const;

// The key and the control the inline script in src/layouts/Base.astro uses.
export const storageKey = 'theme';
export const control = '[data-theme-toggle]';
