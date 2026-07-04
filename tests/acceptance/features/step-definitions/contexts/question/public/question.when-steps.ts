import { When } from "@cucumber/cucumber";

import { PUBLIC_QUESTION_QUERY_PARAMS_SCHEMA, RANDOM_QUESTION_QUERY_PARAMS_SCHEMA } from "@acceptance-features/step-definitions/contexts/question/public/datatables/question.datatables.schemas";

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
  const queryRow = validateDataTableAndGetFirstRow(queryDataTable, PUBLIC_QUESTION_QUERY_PARAMS_SCHEMA);
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

When(/^the game client retrieves random questions(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse("/questions/random", fetchOptions);
});

When(/^the game client retrieves random questions with the following query:$/u, async function(this: GoatItWorld, queryDataTable: DataTable) {
  const queryRow = validateDataTableAndGetFirstRow(queryDataTable, RANDOM_QUESTION_QUERY_PARAMS_SCHEMA);
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    query: buildQueryFromRow(queryRow),
  });
  await this.fetchAndStoreResponse("/questions/random", fetchOptions);
});