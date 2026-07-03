import { When } from "@cucumber/cucumber";

import { ADMIN_QUESTION_THEME_QUERY_PARAMS_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/question-theme/admin/datatables/admin-question-theme.datatables.schemas";

import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";
import { buildQueryFromRow, validateDataTableAndGetFirstRow } from "@acceptance-support/helpers/datatable.helpers";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the admin retrieves all question themes$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin retrieves all question themes with the following query:$/u, async function(this: GoatItWorld, queryDataTable: DataTable) {
  const queryRow = validateDataTableAndGetFirstRow(queryDataTable, ADMIN_QUESTION_THEME_QUERY_PARAMS_SCHEMA);
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    query: buildQueryFromRow(queryRow),
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin retrieves all question themes without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin retrieves all question themes with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin retrieves the question theme with id "(?<id>[^"]+)"$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin retrieves the question theme with id "(?<id>[^"]+)" without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin retrieves the question theme with id "(?<id>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
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

When(/^the admin creates a new question theme with the request payload but without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    method: "POST",
    body: this.payload,
  });
  await this.fetchAndStoreResponse("/admin/question-themes", fetchOptions);
});

When(/^the admin creates a new question theme with the request payload with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
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

When(/^the admin modifies the question theme with id "(?<id>[^"]+)" with the request payload but without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    method: "PATCH",
    body: this.payload,
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}`, fetchOptions);
});

When(/^the admin modifies the question theme with id "(?<id>[^"]+)" with the request payload with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
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

When(/^the admin archives the question theme with id "(?<id>[^"]+)" without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}/archive`, fetchOptions);
});

When(/^the admin archives the question theme with id "(?<id>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
    method: "POST",
  });
  await this.fetchAndStoreResponse(`/admin/question-themes/${id}/archive`, fetchOptions);
});