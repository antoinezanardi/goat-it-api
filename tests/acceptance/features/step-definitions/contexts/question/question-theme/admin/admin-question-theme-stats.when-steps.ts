import { When } from "@cucumber/cucumber";

import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the admin retrieves question theme statistics$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
  });
  await this.fetchAndStoreResponse("/admin/question-themes/stats", fetchOptions);
});

When(/^the admin retrieves question theme statistics without an API key$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse("/admin/question-themes/stats", fetchOptions);
});

When(/^the admin retrieves question theme statistics with an invalid API key$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse("/admin/question-themes/stats", fetchOptions);
});