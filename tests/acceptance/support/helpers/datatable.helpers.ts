import { z } from "zod";

import type { ZodType } from "zod";
import type { DataTable } from "@cucumber/cucumber";

function zCoerceOptionalBoolean(): ZodType<boolean | undefined> {
  return z.preprocess((value: unknown): boolean | undefined => (typeof value !== "string" || value === "" ? undefined : value.toLowerCase() === "true"), z.boolean().optional());
}

function zCoerceOptionalString(): ZodType<string | undefined> {
  return z.preprocess((value: unknown): string | undefined => (typeof value !== "string" || value === "" ? undefined : value), z.string().optional());
}

function zCoerceOptionalNumber(): ZodType<number | undefined> {
  return z.preprocess((value: unknown): number | undefined => (typeof value !== "string" || value === "" ? undefined : Number.parseInt(value)), z.number().optional());
}

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
  validateDataTableAndGetRows,
  validateDataTableAndGetFirstRow,
};