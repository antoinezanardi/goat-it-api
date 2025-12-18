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

function tryParseOverriddenPayloadBooleanValue(payloadValue: string): boolean {
  if (payloadValue === "true") {
    return true;
  }
  if (payloadValue === "false") {
    return false;
  }
  throw new TypeError(`Failed to parse overridden payload value as boolean: ${payloadValue}. Expected "true" or "false".`);
}

function tryParseOverriddenPayloadArrayValue(payloadValue: string): unknown[] {
  const parsedValue = JSON.parse(payloadValue) as unknown;
  if (!Array.isArray(parsedValue)) {
    throw new TypeError(`Failed to parse overridden payload value as array: ${payloadValue}. Expected an array.`);
  }
  return parsedValue;
}

function tryParseOverriddenPayloadStringValue(payloadValue: string): string {
  if (payloadValue.startsWith("\"") && payloadValue.endsWith("\"") ||
    payloadValue.startsWith("'") && payloadValue.endsWith("'")) {
    return payloadValue.slice(1, -1);
  }
  return payloadValue;
}

function tryParseOverriddenPayloadValue(type: string, payloadValue: string): unknown {
  const parseValueMethods: Partial<Record<string, () => unknown>> = {
    string: (): string => tryParseOverriddenPayloadStringValue(payloadValue),
    integer: (): number => tryParseOverriddenPayloadIntegerValue(payloadValue),
    float: (): number => tryParseOverriddenPayloadFloatValue(payloadValue),
    boolean: (): boolean => tryParseOverriddenPayloadBooleanValue(payloadValue),
    array: (): unknown => tryParseOverriddenPayloadArrayValue(payloadValue),
  };

  const parseValueMethod = parseValueMethods[type];
  if (parseValueMethod) {
    return parseValueMethod();
  }

  throw new Error(`Unsupported payload override type: ${type}. Please use one of the supported types: ${Object.keys(parseValueMethods).join(", ")}`);
}

export { tryParseOverriddenPayloadValue };