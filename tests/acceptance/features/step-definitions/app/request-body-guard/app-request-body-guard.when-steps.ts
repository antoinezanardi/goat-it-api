import { When } from "@cucumber/cucumber";

import { FASTIFY_BODY_LIMIT_BYTES } from "@src/infrastructure/api/server/fastify/constants/fastify.constants";

import { APP_GAME_API_KEY } from "@acceptance-support/constants/app.constants";
import { createFetchOptions } from "@acceptance-support/helpers/request.helpers";

import type { GoatItWorld } from "@acceptance-support/types/world.types";

const RANDOM_QUESTIONS_ENDPOINT = "/questions/search/random";

const RANDOM_QUESTIONS_LIMIT = 2;

const JSON_CONTENT_TYPE = "application/json";

const VALID_JSON_BODY = { limit: RANDOM_QUESTIONS_LIMIT };

const OVERSIZED_JSON_BODY = JSON.stringify({ limit: RANDOM_QUESTIONS_LIMIT, padding: "x".repeat(FASTIFY_BODY_LIMIT_BYTES) });

const FORM_ENCODED_BODY = `limit=${RANDOM_QUESTIONS_LIMIT}`;

const MALFORMED_JSON_BODY = "{";

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