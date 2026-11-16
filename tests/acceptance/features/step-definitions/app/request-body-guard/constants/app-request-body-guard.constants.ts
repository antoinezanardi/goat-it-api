import { FASTIFY_BODY_LIMIT_BYTES } from "@src/infrastructure/api/server/fastify/constants/fastify.constants";

const RANDOM_QUESTIONS_ENDPOINT = "/questions/search/random";

const RANDOM_QUESTIONS_LIMIT = 2;

const JSON_CONTENT_TYPE = "application/json";

const VALID_JSON_BODY = { limit: RANDOM_QUESTIONS_LIMIT };

const OVERSIZED_JSON_BODY = JSON.stringify({ limit: RANDOM_QUESTIONS_LIMIT, padding: "x".repeat(FASTIFY_BODY_LIMIT_BYTES) });

const FORM_ENCODED_BODY = `limit=${RANDOM_QUESTIONS_LIMIT}`;

const MALFORMED_JSON_BODY = "{";

export {
  RANDOM_QUESTIONS_ENDPOINT,
  JSON_CONTENT_TYPE,
  VALID_JSON_BODY,
  OVERSIZED_JSON_BODY,
  FORM_ENCODED_BODY,
  MALFORMED_JSON_BODY,
};