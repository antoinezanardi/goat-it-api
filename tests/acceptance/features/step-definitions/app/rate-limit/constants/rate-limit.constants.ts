const RATE_LIMIT_BUSINESS_HANDLER_ENDPOINTS = {
  "questions": "/questions",
  "question-themes": "/question-themes",
} as const;

const RATE_LIMIT_AUTHENTICATED_BUSINESS_ENDPOINT = RATE_LIMIT_BUSINESS_HANDLER_ENDPOINTS["question-themes"];

const RATE_LIMIT_DEFAULT_TIER_HEADER_NAMES = [
  "x-ratelimit-limit",
  "x-ratelimit-remaining",
  "x-ratelimit-reset",
] as const;

const RATE_LIMIT_SUSTAINED_TIER_HEADER_NAMES = [
  "x-ratelimit-limit-sustained",
  "x-ratelimit-remaining-sustained",
  "x-ratelimit-reset-sustained",
] as const;

const RATE_LIMIT_RETRY_AFTER_HEADER_NAME = "retry-after";

const RATE_LIMIT_ALL_HEADER_NAMES = [
  ...RATE_LIMIT_DEFAULT_TIER_HEADER_NAMES,
  ...RATE_LIMIT_SUSTAINED_TIER_HEADER_NAMES,
  RATE_LIMIT_RETRY_AFTER_HEADER_NAME,
] as const;

const RATE_LIMIT_RESET_HEADER_NAMES = [
  "x-ratelimit-reset",
  "x-ratelimit-reset-sustained",
] as const;

const RATE_LIMIT_SECONDS_HEADER_VALUE_PATTERN = /^\d+$/u;

export {
  RATE_LIMIT_BUSINESS_HANDLER_ENDPOINTS,
  RATE_LIMIT_AUTHENTICATED_BUSINESS_ENDPOINT,
  RATE_LIMIT_DEFAULT_TIER_HEADER_NAMES,
  RATE_LIMIT_SUSTAINED_TIER_HEADER_NAMES,
  RATE_LIMIT_ALL_HEADER_NAMES,
  RATE_LIMIT_RETRY_AFTER_HEADER_NAME,
  RATE_LIMIT_RESET_HEADER_NAMES,
  RATE_LIMIT_SECONDS_HEADER_VALUE_PATTERN,
};