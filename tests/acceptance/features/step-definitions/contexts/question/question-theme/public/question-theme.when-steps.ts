import { When } from "@cucumber/cucumber";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

When(/^the client retrieves all question themes(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves all question themes without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves all question themes with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)"(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, id: string, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)" without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});