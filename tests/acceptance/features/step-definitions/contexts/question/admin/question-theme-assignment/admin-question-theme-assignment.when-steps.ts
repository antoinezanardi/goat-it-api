import { When } from "@cucumber/cucumber";

import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the admin assigns the theme with the request payload to the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes`, fetchOptions);
});

When(/^the admin assigns the theme with an empty request payload to the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "POST",
    body: {},
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes`, fetchOptions);
});

When(/^the admin assigns the theme with the request payload to the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes`, fetchOptions);
});

When(/^the admin assigns the theme with the request payload to the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes`, fetchOptions);
});

When(/^the admin removes the theme with id "(?<themeId>[^"]+)" from the question with id "(?<questionId>[^"]+)"$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    method: "DELETE",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes/${themeId}`, fetchOptions);
});

When(/^the admin removes the theme with id "(?<themeId>[^"]+)" from the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  const fetchOptions = createFetchOptions({
    method: "DELETE",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes/${themeId}`, fetchOptions);
});

When(/^the admin removes the theme with id "(?<themeId>[^"]+)" from the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, themeId: string, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
    method: "DELETE",
  });
  await this.fetchAndStoreResponse(`/admin/questions/${questionId}/themes/${themeId}`, fetchOptions);
});