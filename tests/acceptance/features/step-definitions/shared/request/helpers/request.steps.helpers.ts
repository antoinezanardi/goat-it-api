function tryParseOverriddenPayloadIntegerValue(payloadValue: string): number {
  const parsedInteger = Number.parseInt(payloadValue, 10);
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
    undefined: (): undefined => undefined,
  };

  const parseValueMethod = parseValueMethods[type];
  if (parseValueMethod) {
    return parseValueMethod();
  }

  throw new Error(`Unsupported payload override type: ${type}. Please use one of the supported types: ${Object.keys(parseValueMethods).join(", ")}`);
}

function normalizePathForOverride(path: string): string {
  return path.replaceAll(/\[(?<index>\d+)\]/gu, ".$1");
}

/**
 * Reconstructs a nested object from flat dot-notation keys, preserving undefined values.
 * Handles array indices like "themes[1].isPrimary" by converting them to "themes.1.isPrimary".
 * Unlike radashi's construct, this function preserves undefined values in the nested structure.
 */

function reconstructPayloadWithUndefined(flatObject: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flatObject)) {
    const normalizedKey = normalizePathForOverride(key);
    const parts = normalizedKey.split(".");

    let current = result;

    for (let index = 0; index < parts.length - 1; index++) {
      const part = parts[index];
      const nextPart = parts[index + 1];
      const isNextPartIndex = !Number.isNaN(Number(nextPart));

      if (!(part in current)) {
        current[part] = isNextPartIndex ? [] : {};
      }

      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      current = current[part] as Record<string, unknown>;
    }

    const lastIndex = parts.length - 1;
    const lastPart = parts[lastIndex];

    current[lastPart] = value;
  }
  return result;
}

export {
  tryParseOverriddenPayloadValue,
  normalizePathForOverride,
  reconstructPayloadWithUndefined,
};