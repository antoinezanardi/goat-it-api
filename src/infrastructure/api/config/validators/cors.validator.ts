import { z } from "zod";

import type { $ZodURLParams } from "zod/v4/core";

function validateCorsOrigin(value: string): boolean {
  if (value === "*") {
    return true;
  }

  const urlOptions: $ZodURLParams = {
    protocol: /^https?$/u,
    hostname: z.regexes.domain,
  };

  return z.url(urlOptions).safeParse(value).success;
}

export { validateCorsOrigin };