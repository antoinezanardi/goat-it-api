import { When } from "@cucumber/cucumber";

import { APP_METADATA_ENDPOINT, CALLER_SUPPLIED_REQUEST_ID, CALLER_SUPPLIED_REQUEST_ID_HEADER_NAME, REQUEST_ID_RESPONSE_HEADER_NAME } from "@acceptance-features/step-definitions/app/request-id/constants/request-id.constants";

import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the client retrieves the application metadata with a caller-supplied request ID$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    extraHeaders: {
      [CALLER_SUPPLIED_REQUEST_ID_HEADER_NAME]: CALLER_SUPPLIED_REQUEST_ID,
      [REQUEST_ID_RESPONSE_HEADER_NAME]: CALLER_SUPPLIED_REQUEST_ID,
    },
  });

  await this.fetchAndStoreResponse(APP_METADATA_ENDPOINT, fetchOptions);
});