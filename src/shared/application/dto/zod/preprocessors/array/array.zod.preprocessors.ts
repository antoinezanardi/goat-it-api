/**
 * Normalizes a single string value to an array containing that string.
 * Passes through non-string values unchanged (arrays, undefined, etc.).
 * Used as a Zod preprocessor for query params that accept both a single value and an array.
 */
function normalizeToArray(value: unknown): unknown {
  return typeof value === "string" ? [value] : value;
}

export { normalizeToArray };