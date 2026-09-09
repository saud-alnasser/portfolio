// The identifier patterns nothing in this repository may carry: a Saudi
// national ID (ten digits starting with 1), an SEU student ID (nine digits
// starting with 2), and a Saudi mobile number with or without the country
// code (.aep/efforts/1-portfolio-site/spec.md, requirement 12). Written once
// here and read by the dist check and the history scan, so the two never
// disagree about what an identifier looks like, or about what is exempt.

export const identifierPatterns = [
  { name: 'national id', source: '1[0-9]{9}' },
  { name: 'student id', source: '2[0-9]{8}' },
  { name: 'mobile number with country code', source: '\\+?9665[0-9]{8}' },
  { name: 'mobile number', source: '05[0-9]{8}' },
];

// The one exemption: digits inside a URL token are not read. It exists
// because the research evidence cites support articles by address, and an
// article number (the nine digits at the end of a Greenhouse support address,
// and the like) reads like a student id. The spec's criterion is about an
// identifier standing in the text, which a number inside an address is not.
// This must never grow into a list of exceptions: a match anywhere else is a
// finding to report, and the remedy is removing the identifier, not adding a
// rule here.
const urlToken = /https?:\/\/\S+/g;

export function withoutUrls(text) {
  return text.replace(urlToken, '');
}

// Which patterns a piece of text matches, by name, or an empty list.
export function identifiersIn(text) {
  const scanned = withoutUrls(text);
  return identifierPatterns.filter((pattern) => new RegExp(pattern.source).test(scanned)).map((pattern) => pattern.name);
}
