/**
 * Keeps only the entries whose value is defined, so an absent filter is never forwarded as an explicit `undefined` query condition.
 *
 * Returns `undefined` when no entry is left, letting callers distinguish "no filter" from "empty filter"; the copy is shallow.
 */
function pickDefinedValues<T extends Record<string, unknown>>(object: T): Partial<T> | undefined {
  const entries = Object.entries(object).filter(([, value]) => value !== undefined);

  if (entries.length === 0) {
    return undefined;
  }
  // Acceptable as Object.fromEntries returns filtered subset of T entries
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries(entries) as Partial<T>;
}

export { pickDefinedValues };