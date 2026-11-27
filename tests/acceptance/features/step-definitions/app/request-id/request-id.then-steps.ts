import { Then } from "@cucumber/cucumber";

import { CALLER_SUPPLIED_REQUEST_ID, REQUEST_ID_RESPONSE_HEADER_NAME, REQUEST_ID_UUID_V4_PATTERN } from "@acceptance-features/step-definitions/app/request-id/constants/request-id.constants";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

Then(/^the response should expose a server-generated request ID$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderToMatch(REQUEST_ID_RESPONSE_HEADER_NAME, REQUEST_ID_UUID_V4_PATTERN);
});

Then(/^the response should not echo the caller-supplied request ID$/u, function(this: GoatItWorld): void {
  this.expectLastResponseHeaderNotToBe(REQUEST_ID_RESPONSE_HEADER_NAME, CALLER_SUPPLIED_REQUEST_ID);
});