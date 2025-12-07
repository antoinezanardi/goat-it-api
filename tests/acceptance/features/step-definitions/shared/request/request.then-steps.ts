import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import type { ApiResponseExceptionValidationDetailsDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto";
import type { ApiResponseExceptionDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto";
import { API_RESPONSE_EXCEPTION_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto";

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

Then(/^the request should have failed with status code (?<statusCode>\d{3}) and the response should contain the following error:$/u, function(this: GoatItWorld, statusCode: string, errorDataTable: DataTable): void {
  const expectedStatus = Number.parseInt(statusCode);
  if (SUCCESS_HTTP_STATUSES.includes(expectedStatus)) {
    throw new Error(`The expected status code ${expectedStatus} is a success status code.`);
  }
  const errorRows = errorDataTable.hashes() as Record<keyof ApiResponseExceptionDto, string>[];
  if (errorRows.length === 0) {
    throw new Error("Error DataTable must contain at least one data row.");
  }
  const expectedError: Omit<ApiResponseExceptionDto, "validationDetails"> & { validationDetails?: ReturnType<typeof expect.any> } = {
    error: errorRows[0].error,
    message: errorRows[0].message,
    statusCode: Number.parseInt(errorRows[0].statusCode),
  };
  if (errorRows[0].validationDetails) {
    expectedError.validationDetails = expect.any(Array);
  }

  const { _data: errorData, status: errorStatusCode } = this.lastFetchResponse ?? {};

  expect(errorStatusCode).toBe(expectedStatus);
  expect(errorData).toStrictEqual(expectedError);
});

Then(/^the failed request's response should contain the following validation details:$/u, function(this: GoatItWorld, validationDetailsDataTable: DataTable): void {
  const { validationDetails } = this.expectLastResponseJson<ApiResponseExceptionDto>(API_RESPONSE_EXCEPTION_DTO);
  if (!validationDetails) {
    throw new Error("The response does not contain any validation details.");
  }
  const dataTableRows = validationDetailsDataTable.hashes() as Record<keyof ApiResponseExceptionValidationDetailsDto, string>[];

  expect(validationDetails).toHaveLength(dataTableRows.length);

  for (const [index, expectedValidationDetail] of dataTableRows.entries()) {
    const validationDetail = validationDetails[index];

    expect(validationDetail.code).toBe(expectedValidationDetail.code);
    expect(validationDetail.message).toBe(expectedValidationDetail.message);
    expect(validationDetail.expected).toBe(expectedValidationDetail.expected);
    const expectedPathSegments = expectedValidationDetail.path.split(",").map(segment => segment.trim());
    expect(validationDetail.path).toStrictEqual(expectedPathSegments);
  }
});