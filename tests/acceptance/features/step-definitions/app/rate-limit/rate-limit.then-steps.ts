import { Then } from "@cucumber/cucumber";

import { RATE_LIMIT_ALL_HEADER_NAMES, RATE_LIMIT_DEFAULT_TIER_HEADER_NAMES, RATE_LIMIT_RESET_HEADER_MAXIMUM_SECONDS_BY_HEADER_NAME, RATE_LIMIT_RETRY_AFTER_HEADER_NAME, RATE_LIMIT_RETRY_AFTER_MAXIMUM_SECONDS, RATE_LIMIT_SECONDS_HEADER_VALUE_PATTERN, RATE_LIMIT_SUSTAINED_TIER_HEADER_NAMES } from "@acceptance-features/step-definitions/app/rate-limit/constants/rate-limit.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

function expectRateLimitHeadersPresent(world: GoatItWorld, headerNames: readonly string[]): void {
  for (const headerName of headerNames) {
    world.expectLastResponseHeaderToBePresent(headerName);
  }
}

function expectHeaderToBeSecondsWithinBounds(world: GoatItWorld, headerName: string, maximumSeconds: number): void {
  const headerValue = world.lastFetchResponse?.headers.get(headerName) ?? "";
  const headerValueInSeconds = Number(headerValue);

  if (!RATE_LIMIT_SECONDS_HEADER_VALUE_PATTERN.test(headerValue) || headerValueInSeconds < 1 || headerValueInSeconds > maximumSeconds) {
    throw new Error(`Expected the "${headerName}" header to be a whole number of seconds between 1 and ${maximumSeconds}, but received: "${headerValue}".`);
  }
}

Then(/^the response should expose the default rate-limit headers$/u, function(this: GoatItWorld): void {
  expectRateLimitHeadersPresent(this, RATE_LIMIT_DEFAULT_TIER_HEADER_NAMES);
});

Then(/^the response should expose the sustained rate-limit headers$/u, function(this: GoatItWorld): void {
  expectRateLimitHeadersPresent(this, RATE_LIMIT_SUSTAINED_TIER_HEADER_NAMES);
});

Then(/^the rate-limit resets should be expressed in seconds$/u, function(this: GoatItWorld): void {
  for (const [headerName, maximumSeconds] of Object.entries(RATE_LIMIT_RESET_HEADER_MAXIMUM_SECONDS_BY_HEADER_NAME)) {
    expectHeaderToBeSecondsWithinBounds(this, headerName, maximumSeconds);
  }
});

Then(/^the response should contain a plain "Retry-After" header in seconds$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderToBePresent(RATE_LIMIT_RETRY_AFTER_HEADER_NAME);
  expectHeaderToBeSecondsWithinBounds(this, RATE_LIMIT_RETRY_AFTER_HEADER_NAME, RATE_LIMIT_RETRY_AFTER_MAXIMUM_SECONDS);
});

Then(/^the response should not expose any rate-limit headers$/u, function(this: GoatItWorld): void {
  for (const headerName of RATE_LIMIT_ALL_HEADER_NAMES) {
    this.expectLastResponseHeaderToBeAbsent(headerName);
  }
});