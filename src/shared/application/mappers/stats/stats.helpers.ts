function createZeroFilledRecord<T extends string>(keys: readonly T[]): Record<T, number> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries(keys.map(key => [key, 0])) as Record<T, number>;
}

export { createZeroFilledRecord };