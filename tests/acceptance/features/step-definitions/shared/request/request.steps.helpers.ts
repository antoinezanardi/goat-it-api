function tryParseOverriddenPayloadIntegerValue(payloadValue: string): number {
  const parsedInteger = Number.parseInt(payloadValue);
  if (Number.isNaN(parsedInteger)) {
    throw new TypeError(`Failed to parse overridden payload value as integer: ${payloadValue}`);
  }
  return parsedInteger;
}

function tryParseOverriddenPayloadFloatValue(payloadValue: string): number {
  const parsedFloat = Number.parseFloat(payloadValue);
  if (Number.isNaN(parsedFloat)) {
    throw new TypeError(`Failed to parse overridden payload value as float: ${payloadValue}`);
  }
  return parsedFloat;
}

function tryParseOverriddenPayloadValue(type: string, payloadValue: string): unknown {
  const parseValueMethods: Partial<Record<string, () => unknown>> = {
    string: (): string => payloadValue,
    integer: (): number => tryParseOverriddenPayloadIntegerValue(payloadValue),
    float: (): number => tryParseOverriddenPayloadFloatValue(payloadValue),
    boolean: (): boolean => payloadValue === "true",
    array: (): unknown => JSON.parse(payloadValue),
  };

  const parseValueMethod = parseValueMethods[type];
  if (parseValueMethod) {
    return parseValueMethod();
  }

  throw new Error(`Unsupported payload override type: ${type}. Please use integer or string.`);
}

export { tryParseOverriddenPayloadValue };