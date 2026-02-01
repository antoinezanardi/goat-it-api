function prettyJsonStringify(object: unknown): string {
  const spaceCount = 2;

  return JSON.stringify(object, undefined, spaceCount);
}

export { prettyJsonStringify };