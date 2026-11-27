import { When } from "@cucumber/cucumber";

import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the client sends a CORS preflight request for the application metadata$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    method: "OPTIONS",
    origin: "https://game.goat-it.fr",
    accessControlRequestMethod: "GET",
    accessControlRequestHeaders: "goat-it-api-key, content-type",
  });

  await this.fetchAndStoreResponse("/", fetchOptions);
});