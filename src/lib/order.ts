// How the collections are ordered wherever they are listed, so the pages, the
// CV, and the resume endpoint agree.

interface Dated {
  period: { start: string };
}

interface Ordered {
  order?: number;
}

// ISO dates of the form YYYY, YYYY-MM, or YYYY-MM-DD compare correctly as
// text once padded to the same length, and a shorter one sorts as its start.
function key(date: string): string {
  return date.padEnd(10, '0');
}

export function byStartAscending<T extends Dated>(a: T, b: T): number {
  return key(a.period.start).localeCompare(key(b.period.start));
}

export function byStartDescending<T extends Dated>(a: T, b: T): number {
  return byStartAscending(b, a);
}

// Entries with an `order` come first, lowest first; the rest follow by start
// date, newest first (README.md, "projects").
export function byOrderThenStartDescending<T extends Dated & Ordered>(a: T, b: T): number {
  if (a.order !== undefined && b.order !== undefined && a.order !== b.order) return a.order - b.order;
  if (a.order !== undefined && b.order === undefined) return -1;
  if (a.order === undefined && b.order !== undefined) return 1;
  return byStartDescending(a, b);
}

export function byOrderThenName<T extends Ordered & { name: { en: string } }>(a: T, b: T): number {
  if (a.order !== undefined && b.order !== undefined && a.order !== b.order) return a.order - b.order;
  if (a.order !== undefined && b.order === undefined) return -1;
  if (a.order === undefined && b.order !== undefined) return 1;
  return a.name.en.localeCompare(b.name.en);
}

// Undated certificates sort last.
export function byDateAscending<T extends { date?: string }>(a: T, b: T): number {
  if (a.date === undefined && b.date === undefined) return 0;
  if (a.date === undefined) return 1;
  if (b.date === undefined) return -1;
  return key(a.date).localeCompare(key(b.date));
}
