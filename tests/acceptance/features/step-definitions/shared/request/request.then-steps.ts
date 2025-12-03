import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { SUCCESS_HTTP_STATUSES } from "@acceptance-support/constants/http.constants";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the request should have succeeded with status code (?<statusCode>\d{3})$/u, function(this: GoatItWorld, statusCode: string): void {
  const expectedStatus = Number.parseInt(statusCode);
  if (!SUCCESS_HTTP_STATUSES.includes(expectedStatus)) {
    throw new Error(`The expected status code ${expectedStatus} is not a success status code.`);
  }
  expect(this.lastFetchResponse?.status).toBe(expectedStatus);
});

Then(/^the request should have failed with status code (?<statusCode>\d{3}) and contain the following error:$/u, function(this: GoatItWorld, statusCode: string, errorDataTable: DataTable): void {
  const expectedStatus = Number.parseInt(statusCode);
  if (SUCCESS_HTTP_STATUSES.includes(expectedStatus)) {
    throw new Error(`The expected status code ${expectedStatus} is a success status code.`);
  }
  const errorRows = errorDataTable.hashes() as Record<"error" | "message" | "statusCode", string>[];
  const expectedError = {
    error: errorRows[0].error,
    message: errorRows[0].message,
    statusCode: Number.parseInt(errorRows[0].statusCode),
  };

  const { _data: errorData, status: errorStatusCode } = this.lastFetchResponse ?? {};

  expect(errorStatusCode).toBe(expectedStatus);
  expect(errorData).toStrictEqual(expectedError);
});