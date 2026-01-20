import { z } from "zod";

import type { ZodType } from "zod";
import type { DataTable } from "@cucumber/cucumber";

/**
 * Coerces a value to an optional boolean. If the value is an empty string or not a string, it returns undefined. Only used in acceptance tests.
 */
function zCoerceOptionalBoolean(): ZodType<boolean | undefined> {
  return z.preprocess((value: unknown): boolean | undefined => (typeof value !== "string" || value === "" ? undefined : value.toLowerCase() === "true"), z.boolean().optional());
}

/**
 * Coerces a value to an optional string. If the value is an empty string or not a string, it returns undefined. Only used in acceptance tests.
 */
function zCoerceOptionalString(): ZodType<string | undefined> {
  return z.preprocess((value: unknown): string | undefined => (typeof value !== "string" || value === "" ? undefined : value), z.string().optional());
}

/**
 * Coerces a value to an optional number. If the value is an empty string or not a string, it returns undefined. Only used in acceptance tests.
 */
function zCoerceOptionalNumber(): ZodType<number | undefined> {
  return z.preprocess((value: unknown): number | undefined => (typeof value !== "string" || value === "" ? undefined : Number(value)), z.number().optional());
}

/**
 * Coerces a comma-separated string to an optional array of strings. If the value is an empty string or not a string, it returns undefined. Only used in acceptance tests.
 */
function zCoerceOptionalStringArray(): ZodType<string[] | undefined> {
  return z.preprocess((value: unknown): string[] | undefined => {
    if (typeof value !== "string" || value === "") {
      return undefined;
    }
    return value.split(",").map(item => item.trim());
  }, z.array(z.string()).optional());
}

/**
 * Validates the given Cucumber DataTable against the provided Zod schema and returns all rows. Only used in acceptance tests.
 * @param dataTable
 * @param schema
 */
function validateDataTableAndGetRows<T>(
  dataTable: DataTable,
  schema: ZodType<T>,
): T[] {
  const rows = dataTable.hashes();
  if (rows.length === 0) {
    throw new Error("DataTable must contain at least one data row.");
  }

  const parsedRows = schema.array().safeParse(rows);
  if (!parsedRows.success) {
    throw new Error(`Invalid DataTable:\n${parsedRows.error.message}`);
  }
  return parsedRows.data;
}

/**
 * Validates the given Cucumber DataTable against the provided Zod schema and returns the first row. Only used in acceptance tests.
 * @param dataTable
 * @param schema
 */
function validateDataTableAndGetFirstRow<T>(
  dataTable: DataTable,
  schema: ZodType<T>,
): T {
  return validateDataTableAndGetRows(dataTable, schema)[0];
}

export {
  zCoerceOptionalBoolean,
  zCoerceOptionalString,
  zCoerceOptionalNumber,
  zCoerceOptionalStringArray,
  validateDataTableAndGetRows,
  validateDataTableAndGetFirstRow,
};