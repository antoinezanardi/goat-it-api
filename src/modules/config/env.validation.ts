import { ENV_SCHEMA } from "@src/modules/config/env.constants";

import type { Env } from "@modules/config/env.types";

function validate(config: Record<string, unknown>): Env {
  const parsed = ENV_SCHEMA.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables ${parsed.error.message}`);
  }
  return parsed.data;
}

export { validate };