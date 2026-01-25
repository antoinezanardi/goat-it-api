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

When(/^the admin retrieves the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}`, fetchOptions);
});

When(/^the admin retrieves the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}`, fetchOptions);
});

When(/^the admin retrieves the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}`, fetchOptions);
});

When(/^the admin creates a new question with an empty payload$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: {},
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin creates a new question with the request payload$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin creates a new question with the request payload but without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin creates a new question with the request payload but with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});