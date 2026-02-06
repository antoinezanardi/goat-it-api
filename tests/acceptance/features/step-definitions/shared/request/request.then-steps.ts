import { Then } from "@cucumber/cucumber";
import { expect } from "expect";
import { shake } from "radashi";

import type { ApiResponseExceptionValidationDetailsDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception-validation-details/api-response-exception-validation-details.dto.shape";
import type { ApiResponseExceptionDto } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto.shape";
import { API_RESPONSE_EXCEPTION_DTO } from "@shared/infrastructure/http/dto/api-response-exception/api-response-exception.dto.shape";

import { REQUEST_ERROR_ROW_SCHEMA, REQUEST_VALIDATION_DETAILS_ROW_SCHEMA } from "@acceptance-features/step-definitions/shared/request/datatables/request.datatables";

import { validateDataTableAndGetFirstRow, validateDataTableAndGetRows } from "@acceptance-support/helpers/datatable.helpers";
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
  const requestError = validateDataTableAndGetFirstRow(errorDataTable, REQUEST_ERROR_ROW_SCHEMA);
  const expectedError: Omit<ApiResponseExceptionDto, "validationDetails"> & { validationDetails?: ReturnType<typeof expect.any> } = {
    error: requestError.error,
    message: requestError.message,
    statusCode: requestError.statusCode,
  };
  if (requestError.validationDetails !== undefined) {
    expectedError.validationDetails = expect.any(Array);
  }

  const { _data: errorData, status: errorStatusCode } = this.lastFetchResponse ?? {};

  expect(errorStatusCode).toBe(expectedStatus);
  expect(errorData).toStrictEqual(expectedError);
});

Then(/^the failed request's response should contain the following validation details:$/u, function(this: GoatItWorld, validationDetailsDataTable: DataTable): void {
  const { validationDetails: actualValidationDetails } = this.expectLastResponseJson<ApiResponseExceptionDto>(API_RESPONSE_EXCEPTION_DTO);
  if (!actualValidationDetails) {
    throw new Error("The response does not contain any validation details.");
  }
  const dataTableRows = validateDataTableAndGetRows(validationDetailsDataTable, REQUEST_VALIDATION_DETAILS_ROW_SCHEMA);

  expect(actualValidationDetails).toHaveLength(dataTableRows.length);

  for (const [index, validationDetailsEntry] of dataTableRows.entries()) {
    const actualValidationDetailsEntry = actualValidationDetails[index];
    const expectedValidationDetails: ApiResponseExceptionValidationDetailsDto = {
      code: validationDetailsEntry.code,
      message: validationDetailsEntry.message,
      path: validationDetailsEntry.path.split(".").map(segment => {
        const trimmedValue = segment.trim();

        return trimmedValue === "" || Number.isNaN(Number(trimmedValue)) ? trimmedValue : Number(trimmedValue);
      }).filter(value => value !== ""),
      expected: validationDetailsEntry.expected,
      origin: validationDetailsEntry.origin,
      format: validationDetailsEntry.format,
      pattern: validationDetailsEntry.pattern,
      minimum: validationDetailsEntry.minimum,
      maximum: validationDetailsEntry.maximum,
      inclusive: validationDetailsEntry.inclusive,
      keys: validationDetailsEntry.keys === undefined ? undefined : validationDetailsEntry.keys.split(",").map(key => key.trim()).filter(Boolean),
      values: validationDetailsEntry.values === undefined ? undefined : validationDetailsEntry.values.split(",").map(value => value.trim()).filter(Boolean),
    };
    const expectedValidationDetailsWithoutUndefinedFields = shake(expectedValidationDetails);

    expect(actualValidationDetailsEntry).toStrictEqual(expectedValidationDetailsWithoutUndefinedFields);
  }
});