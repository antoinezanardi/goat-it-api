import { When } from "@cucumber/cucumber";

import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

When(/^the admin retrieves all questions(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin retrieves all questions without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin retrieves all questions with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});