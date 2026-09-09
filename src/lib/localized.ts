// Picks the text for one language out of a `{ en, ar? }` map, falling back to
// English when the Arabic is missing, and records every fallback so the build
// can print one report of the gaps.
//
// Exports other pages and endpoints rely on:
//   localized(locale, collection, id)  returns text(field, value): string
//   pick(value, locale, source)        the same, in one call
//   gapReport()                        one line naming every recorded gap
//
// The gaps are kept on globalThis rather than in a module variable because the
// pages run inside Astro's server bundle and the report is printed by an
// integration in astro.config.mjs, which is a second instance of this module
// in the same process. Both instances see the same store.

import type { Locale } from './i18n';

export interface Localized {
  en: string;
  ar?: string;
}

export interface Source {
  collection: string;
  id: string;
  field: string;
}

const store = globalThis as typeof globalThis & { __localizedGaps?: Map<string, Source> };
const gaps = (store.__localizedGaps ??= new Map<string, Source>());

export function pick(value: Localized, locale: Locale, source: Source): string {
  const text = value[locale];
  if (text) return text;
  gaps.set(`${source.collection}/${source.id}.${source.field}`, source);
  return value.en;
}

// A page renders many fields of one entry, so it binds the entry once.
export function localized(locale: Locale, collection: string, id: string) {
  return (field: string, value: Localized): string => pick(value, locale, { collection, id, field });
}

// "[localized] 0 gaps", or "[localized] 2 gaps: projects/nova.summary, ...".
export function gapReport(): string {
  const keys = [...gaps.keys()].sort();
  const count = `${keys.length} ${keys.length === 1 ? 'gap' : 'gaps'}`;
  return keys.length === 0 ? `[localized] ${count}` : `[localized] ${count}: ${keys.join(', ')}`;
}
