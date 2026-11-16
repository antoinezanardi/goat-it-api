import { When } from "@cucumber/cucumber";

import { FORM_ENCODED_BODY, JSON_CONTENT_TYPE, MALFORMED_JSON_BODY, OVERSIZED_JSON_BODY, RANDOM_QUESTIONS_ENDPOINT, VALID_JSON_BODY } from "@acceptance-features/step-definitions/app/request-body-guard/constants/app-request-body-guard.constants";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

When(/^the client searches random questions with a valid JSON body$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
    body: VALID_JSON_BODY,
  });

  await this.fetchAndStoreResponse(RANDOM_QUESTIONS_ENDPOINT, fetchOptions);
});

When(/^the client searches random questions with a JSON body larger than the limit$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
    rawBody: OVERSIZED_JSON_BODY,
    contentType: JSON_CONTENT_TYPE,
  });

  await this.fetchAndStoreResponse(RANDOM_QUESTIONS_ENDPOINT, fetchOptions);
});

When(/^the client searches random questions with the "(?<contentType>[^"]+)" content type$/u, async function(this: GoatItWorld, contentType: string): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
    rawBody: FORM_ENCODED_BODY,
    contentType,
  });

  await this.fetchAndStoreResponse(RANDOM_QUESTIONS_ENDPOINT, fetchOptions);
});

When(/^the client searches random questions with an empty JSON body$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
    rawBody: "",
    contentType: JSON_CONTENT_TYPE,
  });

  await this.fetchAndStoreResponse(RANDOM_QUESTIONS_ENDPOINT, fetchOptions);
});

When(/^the client searches random questions with a malformed JSON body$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
    rawBody: MALFORMED_JSON_BODY,
    contentType: JSON_CONTENT_TYPE,
  });

  await this.fetchAndStoreResponse(RANDOM_QUESTIONS_ENDPOINT, fetchOptions);
});

When(/^the client searches random questions without a body and without a content type$/u, async function(this: GoatItWorld): Promise<void> {
  const fetchOptions = createFetchOptions({
    apiKey: APP_GAME_API_KEY,
    method: "POST",
  });

  await this.fetchAndStoreResponse(RANDOM_QUESTIONS_ENDPOINT, fetchOptions);
});