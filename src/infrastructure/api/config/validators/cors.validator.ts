import { z } from "zod";

import type { $ZodURLParams } from "zod/v4/core";

const CORS_URL_OPTIONS: $ZodURLParams = {
  protocol: /^https?$/u,
  hostname: z.regexes.domain,
};

const CORS_URL_SCHEMA = z.url(CORS_URL_OPTIONS);

function validateCorsOrigin(value: string): boolean {
  if (value === "*") {
    return true;
  }
  return CORS_URL_SCHEMA.validate(value);
}

export { validateCorsOrigin };