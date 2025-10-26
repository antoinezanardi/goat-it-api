import { Then } from "@cucumber/cucumber";
import { expect } from "expect";

import { SUCCESS_HTTP_STATUSES } from "@acceptance-support/constants/http.constants";

import type { CustomWorld } from "@acceptance-support/world/world.types";

Then(/^the request should have succeeded with status code (?<statusCode>\d{3})$/u, function(this: CustomWorld, statusCode: string): void {
  expect(SUCCESS_HTTP_STATUSES.includes(this.response.status)).toBe(true);
  expect(this.response.status).toBe(Number.parseInt(statusCode));
});

Then(/^the request should have failed with status code (?<statusCode>\d{3})$/u, function(this: CustomWorld, statusCode: string): void {
  expect(SUCCESS_HTTP_STATUSES.includes(this.response.status)).toBe(false);
  expect(this.response.status).toBe(Number.parseInt(statusCode));
});