import { When } from "@cucumber/cucumber";

import { APP_ADMIN_API_KEY, APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
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

When(/^the admin retrieves all question themes$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)"(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, id: string, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});

When(/^the admin retrieves the question theme with id "(?<id>[^"]+)"$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin creates a new question theme with an empty payload$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: {},
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin creates a new question theme with the request payload$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin modifies the question theme with id "(?<id>[^"]+)" with an empty payload$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "PATCH",
    body: {},
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin modifies the question theme with id "(?<id>[^"]+)" with the request payload$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "PATCH",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin archives the question theme with id "(?<id>[^"]+)"$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}/archive`, fetchOptions);
});