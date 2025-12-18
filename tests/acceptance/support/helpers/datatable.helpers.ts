import type { ZodType } from "zod";
import type { DataTable } from "@cucumber/cucumber";

function validateDataTableAndGetRows<T>(
  dataTable: DataTable,
  schema: ZodType<T>,
): T[] {
  const rows = dataTable.hashes();
  const parsedRows = schema.array().safeParse(rows);

  if (!parsedRows.success) {
    throw new Error(`Invalid DataTable:\n${parsedRows.error.message}`);
  }
  if (rows.length === 0) {
    throw new Error("DataTable must contain at least one data row.");
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
  validateDataTableAndGetRows,
  validateDataTableAndGetFirstRow,
};