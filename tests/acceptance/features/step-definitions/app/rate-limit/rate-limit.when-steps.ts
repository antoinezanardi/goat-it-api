import { When } from "@cucumber/cucumber";

import { RATE_LIMIT_AUTHENTICATED_BUSINESS_ENDPOINT, RATE_LIMIT_BUSINESS_HANDLER_ENDPOINTS } from "@acceptance-features/step-definitions/app/rate-limit/constants/rate-limit.constants";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

function getBusinessHandlerEndpoint(handlerName: string): string {
  const endpointsByHandlerName: Map<string, string> = new Map(Object.entries(RATE_LIMIT_BUSINESS_HANDLER_ENDPOINTS));
  const endpoint = endpointsByHandlerName.get(handlerName);

  if (endpoint === undefined) {
    throw new Error(`Unknown business handler "${handlerName}". Known handlers are: ${Object.keys(RATE_LIMIT_BUSINESS_HANDLER_ENDPOINTS).join(", ")}.`);
  }
  return endpoint;
}

When(/^the client sends an authenticated business request$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    retry: false,
  });

  await this.fetchAndStoreResponse(RATE_LIMIT_AUTHENTICATED_BUSINESS_ENDPOINT, fetchOptions);
});

When(/^the client sends a business request to the "(?<handler>[^"]+)" handler without an API key$/u, async function(this: GoatItWorld, handlerName: string): Promise<void> {
  const fetchOptions = createFetchOptions({ retry: false });

  await this.fetchAndStoreResponse(getBusinessHandlerEndpoint(handlerName), fetchOptions);
});