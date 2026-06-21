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