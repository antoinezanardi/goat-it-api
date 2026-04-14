import type { ApiResponseExceptionValidationDetailsDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto.shape";

import type { REQUEST_VALIDATION_DETAILS_ROW_SCHEMA } from "@acceptance-features/step-definitions/shared/request/datatables/request.datatables";

import { coerceStringToPrimitive } from "@acceptance-support/helpers/datatable.helpers";

import type { z } from "zod";

type ValidationDetailsRow = z.infer<typeof REQUEST_VALIDATION_DETAILS_ROW_SCHEMA>;

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
  return path.replaceAll(/\[(?<index>\d+)\]/gu, ".$<index>");
}

/**
 * Reconstructs a nested object from flat dot-notation keys, preserving undefined values.
 * Handles array indices like "themes[1].isPrimary" by converting them to "themes.1.isPrimary".
 * Unlike radashi's construct, this function preserves undefined values in the nested structure.
 */
function reconstructPayloadWithUndefined(flatObject: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(flatObject)) {
    const parts = normalizePathForOverride(key).split(".");
    const leafPart = parts[parts.length - 1];

    let current = result;
    for (const [index, part] of parts.slice(0, -1).entries()) {
      const isNextPartIndex = !Number.isNaN(Number(parts[index + 1]));
      if (!(part in current)) {
        current[part] = isNextPartIndex ? [] : {};
      }
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      current = current[part] as Record<string, unknown>;
    }

    current[leafPart] = value;
  }
  return result;
}

function mapDataTableRowToValidationDetails(row: ValidationDetailsRow): ApiResponseExceptionValidationDetailsDto {
  return {
    code: row.code,
    message: row.message,
    path: row.path.split(".").map(segment => {
      const trimmedValue = segment.trim();

      return trimmedValue === "" || Number.isNaN(Number(trimmedValue)) ? trimmedValue : Number(trimmedValue);
    }).filter(value => value !== ""),
    expected: row.expected,
    origin: row.origin,
    format: row.format,
    pattern: row.pattern,
    minimum: row.minimum,
    maximum: row.maximum,
    inclusive: row.inclusive,
    keys: row.keys === undefined ? undefined : row.keys.split(",").map(key => key.trim()).filter(Boolean),
    values: row.values === undefined ? undefined : row.values.split(",").map(value => coerceStringToPrimitive(value.trim())).filter(value => value !== ""),
  };
}

export {
  mapDataTableRowToValidationDetails,
  tryParseOverriddenPayloadValue,
  normalizePathForOverride,
  reconstructPayloadWithUndefined,
};