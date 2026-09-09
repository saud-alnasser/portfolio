// What the tests share: the routes the site publishes and the palette values
// they assert on, taken from src/styles/global.css so a failure names the
// colour that was expected.

export const locales = ['en', 'ar'] as const;
export const routes = ['/', '/work/', '/education/', '/cv/'] as const;

// Every page of the site, as "/en/", "/ar/work/", and so on.
export const pages = locales.flatMap((locale) => routes.map((route) => `/${locale}${route}`));

// The `--background` token of each palette, as a browser reports it.
export const background = {
  light: 'rgb(255, 255, 255)',
  dark: 'rgb(18, 22, 28)',
} as const;

// The key and the control the inline script in src/layouts/Base.astro uses.
export const storageKey = 'theme';
export const control = '[data-theme-toggle]';
