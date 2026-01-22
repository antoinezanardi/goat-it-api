function areValuesUniqueFromStrings(array: string[]): boolean {
  const uniqueValues = new Set(array);

  return uniqueValues.size === array.length;
}

function areValuesUniqueByKey<T extends Record<string, unknown>>(array: T[], key: keyof T): boolean {
  const values = array.map(item => String(item[key]));

  return areValuesUniqueFromStrings(values);
}

function hasExactlyOneByKey<T extends Record<string, unknown>>(array: T[], key: keyof T, value: unknown): boolean {
  const matchingItems = array.filter(item => item[key] === value);

  return matchingItems.length === 1;
}

export {
  areValuesUniqueFromStrings,
  areValuesUniqueByKey,
  hasExactlyOneByKey,
};