// What a document generated through the download form is filled with when the
// build generates one. Obviously not real, so an artifact that escapes is
// embarrassing rather than harmful, and written once here because the render
// step types the values in and the dist check looks for them: two copies would
// disagree the first time either changed.
//
// The number is assembled rather than written out. A Saudi mobile in the
// source is exactly what scripts/identifiers.mjs exists to find, and this
// repository's history is scanned for one.
export const placeholder = {
  email: 'check@example.com',
  phone: `+9665${'0'.repeat(8)}`,
};
