// The identifier patterns nothing in this repository may carry: a Saudi
// national ID (ten digits starting with 1), an SEU student ID (nine digits
// starting with 2), and a Saudi mobile number with or without the country
// code. Written once here and read by the dist check and the history scan,
// so the two never disagree about what an identifier looks like, or about
// what is exempt.

// Each pattern is bounded by non-digits: an identifier is a whole run of
// digits, and a longer run (a millisecond timestamp, a hash) that happens to
// contain one is not an identifier.
export const identifierPatterns = [
  { name: 'national id', source: '(?<![0-9])1[0-9]{9}(?![0-9])' },
  { name: 'student id', source: '(?<![0-9])2[0-9]{8}(?![0-9])' },
  { name: 'mobile number with country code', source: '(?<![0-9])\\+?9665[0-9]{8}(?![0-9])' },
  { name: 'mobile number', source: '(?<![0-9])05[0-9]{8}(?![0-9])' },
];

// The one exemption: digits inside a URL token are not read. It exists
// because the research evidence cites support articles by address, and an
// article number (the nine digits at the end of a Greenhouse support address,
// and the like) reads like a student id. The spec's criterion is about an
// identifier standing in the text, which a number inside an address is not.
// This must never grow into a list of exceptions: a match anywhere else is a
// finding to report, and the remedy is removing the identifier, not adding a
// rule here.
// A URL runs to the first character that cannot be part of one, so a number
// glued to it in compressed HTML or JSON (a closing quote and tag, then the
// digits) is still read. No example digits here: this file is scanned too.
const urlToken = /https?:\/\/[^\s"'<>()\[\]]+/g;

export function withoutUrls(text) {
  return text.replace(urlToken, '');
}

// Arabic text may carry Eastern Arabic digits (U+0660 to U+0669) or the
// Persian forms (U+06F0 to U+06F9); an identifier written in them is the
// same identifier, so they are read as their ASCII values.
const easternDigits = /[\u0660-\u0669\u06F0-\u06F9]/g;

export function withAsciiDigits(text) {
  return text.replace(easternDigits, (digit) => String((digit.codePointAt(0) - (digit <= '\u0669' ? 0x0660 : 0x06f0))));
}

// Which patterns a piece of text matches, by name, or an empty list.
export function identifiersIn(text) {
  const scanned = withAsciiDigits(withoutUrls(text));
  return identifierPatterns.filter((pattern) => new RegExp(pattern.source).test(scanned)).map((pattern) => pattern.name);
}
