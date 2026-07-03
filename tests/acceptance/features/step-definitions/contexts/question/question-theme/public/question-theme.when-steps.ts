import { When } from "@cucumber/cucumber";
import { z } from "zod";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { buildQueryFromRow, validateDataTableAndGetFirstRow, zCoerceOptionalString } from "@acceptance-support/helpers/datatable.helpers";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { DataTable } from "@cucumber/cucumber";

import type { GoatItWorld } from "@acceptance-support/types/world.types";
import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

const PUBLIC_QUESTION_THEME_QUERY_PARAMS_SCHEMA = z.object({
  "sort-by": zCoerceOptionalString(),
  "sort-order": zCoerceOptionalString(),
  "limit": zCoerceOptionalString(),
});

When(/^the client retrieves all question themes(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves all question themes with the following query:$/u, async function(this: GoatItWorld, queryDataTable: DataTable) {
  const queryRow = validateDataTableAndGetFirstRow(queryDataTable, PUBLIC_QUESTION_THEME_QUERY_PARAMS_SCHEMA);
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    query: buildQueryFromRow(queryRow),
  });
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves all question themes sorted by "(?<sortBy>[^"]+)" in "(?<sortOrder>[^"]+)" order$/u, async function(this: GoatItWorld, sortBy: string, sortOrder: string) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    query: { "sort-by": sortBy, "sort-order": sortOrder },
  });
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves all question themes without an API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves all question themes with an invalid API key$/u, async function(this: GoatItWorld) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse("/question-themes", fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)"(?: in locale "(?<locale>[^"]+)")?$/u, async function(this: GoatItWorld, id: string, locale: Locale | null) {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    locale: locale ?? undefined,
  });
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)" without an API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions();
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});

When(/^the client retrieves the question theme with id "(?<id>[^"]+)" with an invalid API key$/u, async function(this: GoatItWorld, id: string) {
  const fetchOptions = createFetchOptions({
    apiKey: "invalid-api-key",
  });
  await this.fetchAndStoreResponse(`/question-themes/${id}`, fetchOptions);
});