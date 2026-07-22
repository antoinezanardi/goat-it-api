function createStatsZeroFilledRecord<T extends string>(
  keys: readonly T[],
  existingValues?: Partial<Record<T, number>>,
): Record<T, number> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const zeroFilled = Object.fromEntries(keys.map(key => [key, 0])) as Record<T, number>;

  return { ...zeroFilled, ...existingValues };
}

export { createStatsZeroFilledRecord };