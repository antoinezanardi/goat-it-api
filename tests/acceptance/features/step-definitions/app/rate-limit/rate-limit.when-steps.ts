import { When } from "@cucumber/cucumber";

import { RATE_LIMIT_FIRST_FORWARDED_CLIENT_IP, RATE_LIMIT_FORWARDED_CLIENT_IP_HEADER_NAME, RATE_LIMIT_QUESTIONS_ENDPOINT, RATE_LIMIT_SECOND_FORWARDED_CLIENT_IP } from "@acceptance-features/step-definitions/app/rate-limit/constants/rate-limit.constants";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

async function fetchQuestionsFromForwardedClient(world: GoatItWorld, clientIp: string): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    extraHeaders: { [RATE_LIMIT_FORWARDED_CLIENT_IP_HEADER_NAME]: clientIp },
  });

  await world.fetchAndStoreResponse(RATE_LIMIT_QUESTIONS_ENDPOINT, fetchOptions);
}

When(/^the client retrieves all questions from the first forwarded client IP$/u, async function(this: GoatItWorld): Promise<void> {
  await fetchQuestionsFromForwardedClient(this, RATE_LIMIT_FIRST_FORWARDED_CLIENT_IP);
});

When(/^the client retrieves all questions from the second forwarded client IP$/u, async function(this: GoatItWorld): Promise<void> {
  await fetchQuestionsFromForwardedClient(this, RATE_LIMIT_SECOND_FORWARDED_CLIENT_IP);
});