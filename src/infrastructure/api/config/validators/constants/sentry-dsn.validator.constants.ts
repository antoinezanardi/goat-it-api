import { z } from "zod";

import type { $ZodURLParams } from "zod/v4/core";

const SENTRY_DSN_URL_OPTIONS: $ZodURLParams = {
  protocol: /^https$/u,
};

const SENTRY_DSN_URL_SCHEMA = z.url(SENTRY_DSN_URL_OPTIONS);

const SENTRY_DSN_PROJECT_ID_REGEX = /^\d+$/u;

const SENTRY_DSN_PATH_SEGMENT_SEPARATOR = "/";

export {
  SENTRY_DSN_URL_SCHEMA,
  SENTRY_DSN_PROJECT_ID_REGEX,
  SENTRY_DSN_PATH_SEGMENT_SEPARATOR,
};