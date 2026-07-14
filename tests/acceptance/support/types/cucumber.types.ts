import type { DataTable as DataTableValue } from "@cucumber/cucumber";

type DataTable = InstanceType<typeof DataTableValue>;

type TestCaseHookParameter = {
  pickle: { name: string };
  result?: { status: unknown };
};

export type { DataTable, TestCaseHookParameter };