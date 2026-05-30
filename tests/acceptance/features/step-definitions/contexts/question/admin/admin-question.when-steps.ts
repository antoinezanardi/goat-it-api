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

When(/^the admin retrieves all questions sorted by "(?<sortBy>[^"]+)" in "(?<sortOrder>[^"]+)" order$/u, async function(this: GoatItWorld, sortBy: string, sortOrder: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    query: { "sort-by": sortBy, "sort-order": sortOrder },
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin retrieves all questions with filter "(?<filterKey>[^"]+)" set to "(?<filterValue>[^"]+)"$/u, async function(this: GoatItWorld, filterKey: string, filterValue: string) {
  const query: Record<string, string | string[]> = {
    [filterKey]: filterKey === "theme-ids" ? filterValue.split(",") : filterValue,
  };
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    query,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin retrieves all questions with filters "(?<key1>[^"]+)" set to "(?<value1>[^"]+)" and "(?<key2>[^"]+)" set to "(?<value2>[^"]+)"$/u, async function(this: GoatItWorld, key1: string, value1: string, key2: string, value2: string) {
  const query: Record<string, string | string[]> = {
    [key1]: key1 === "theme-ids" ? value1.split(",") : value1,
    [key2]: key2 === "theme-ids" ? value2.split(",") : value2,
  };
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    query,
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

When(/^the admin archives the question with id "(?<id>[^"]+)"$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${id}/archive`, fetchOptions);
});

When(/^the admin modifies the question with id "(?<id>[^"]+)" with the request payload$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "PATCH",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${id}`, fetchOptions);
});

When(/^the admin modifies the question with id "(?<id>[^"]+)" with the request payload but without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    method: "PATCH",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${id}`, fetchOptions);
});

When(/^the admin modifies the question with id "(?<id>[^"]+)" with the request payload but with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
    method: "PATCH",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${id}`, fetchOptions);
});

When(/^the admin archives the question with id "(?<id>[^"]+)" without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${id}/archive`, fetchOptions);
});

When(/^the admin archives the question with id "(?<id>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${id}/archive`, fetchOptions);
});