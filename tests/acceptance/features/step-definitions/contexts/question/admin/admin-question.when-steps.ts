import { When } from "@cucumber/cucumber";

import { ADMIN_QUESTION_QUERY_PARAMS_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/admin/datatables/admin-question.datatables.schemas";

import { APP_ADMIN_API_KEY } from "@acceptance-support/constants/app.constants";
import { buildQueryFromRow, validateDataTableAndGetFirstRow } from "@acceptance-support/helpers/datatable.helpers";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

When(/^the admin retrieves all questions(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse("/admin/questions", fetchOptions);
});

When(/^the admin retrieves all questions with the following query:$/u, async function(this: GoatItWorld, queryDataTable: DataTable) {
  const queryRow = validateDataTableAndGetFirstRow(queryDataTable, ADMIN_QUESTION_QUERY_PARAMS_SCHEMA);
  const fetchOptions = createFetchOptions({
    apiKey: APP_ADMIN_API_KEY,
    query: buildQueryFromRow(queryRow),
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