function areValuesUnique(array: unknown[]): boolean {
  const uniqueValues = new Set(array);

  return uniqueValues.size === array.length;
}

export {
  areValuesUnique,
};