import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { SUCCESS_HTTP_STATUSES } from "@acceptance-support/constants/http.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the request should have succeeded with status code (?<statusCode>\d{3})$/u, function(this: GoatItWorld, statusCode: string): void {
  const expectedStatus = Number.parseInt(statusCode);
  if (!SUCCESS_HTTP_STATUSES.includes(expectedStatus)) {
    throw new Error(`The expected status code ${expectedStatus} is not a success status code.`);
  }
  expect(this.lastFetchResponse?.status).toBe(Number.parseInt(statusCode));
});

Then(/^the request should have failed with status code (?<statusCode>\d{3})$/u, function(this: GoatItWorld, statusCode: string): void {
  const expectedStatus = Number.parseInt(statusCode);
  if (SUCCESS_HTTP_STATUSES.includes(expectedStatus)) {
    throw new Error(`The expected status code ${expectedStatus} is a success status code.`);
  }
  expect(this.lastFetchResponse?.status).toBe(Number.parseInt(statusCode));
});