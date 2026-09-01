import { When } from "@cucumber/cucumber";

import { PUBLIC_QUESTION_QUERY_PARAMS_DATATABLE_ROW_SCHEMA, RANDOM_QUESTION_BODY_DATATABLE_ROW_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/public/datatables/question.datatables.schemas";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { buildQueryFromRow, validateDataTableAndGetFirstRow } from "@acceptance-support/helpers/datatable.helpers";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

When(/^the client retrieves all questions(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse("/questions", fetchOptions);
});

When(/^the client retrieves all questions with the following query:$/u, async function(this: GoatItWorld, queryDataTable: DataTable) {
  const queryRow = validateDataTableAndGetFirstRow(queryDataTable, PUBLIC_QUESTION_QUERY_PARAMS_DATATABLE_ROW_SCHEMA);
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    query: buildQueryFromRow(queryRow),
  });
  await this.fetchAndStoreResponse("/questions", fetchOptions);
});

When(/^the client retrieves all questions without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse("/questions", fetchOptions);
});

When(/^the client retrieves all questions with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse("/questions", fetchOptions);
});

When(/^the client retrieves the question with id "(?<questionId>[^"]+)"(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, questionId: string, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse(`/questions/${questionId}`, fetchOptions);
});

When(/^the client retrieves the question with id "(?<questionId>[^"]+)" without an API key$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse(`/questions/${questionId}`, fetchOptions);
});

When(/^the client retrieves the question with id "(?<questionId>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, questionId: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse(`/questions/${questionId}`, fetchOptions);
});

When(/^the client retrieves random questions(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
    method: "POST",
    body: {},
  });
  await this.fetchAndStoreResponse("/questions/search/random", fetchOptions);
});

When(/^the client retrieves random questions with the following body:$/u, async function(this: GoatItWorld, bodyDataTable: DataTable) {
  const bodyRow = validateDataTableAndGetFirstRow(bodyDataTable, RANDOM_QUESTION_BODY_DATATABLE_ROW_SCHEMA);
  const body: Record<string, unknown> = {
    limit: bodyRow.limit === undefined ? undefined : Number(bodyRow.limit),
    excludedIds: bodyRow.excludedIds,
    categories: bodyRow.categories,
    cognitiveDifficulties: bodyRow.cognitiveDifficulties,
    themeIds: bodyRow.themeIds,
  };
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
    body,
  });
  await this.fetchAndStoreResponse("/questions/search/random", fetchOptions);
});