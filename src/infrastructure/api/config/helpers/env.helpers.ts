import { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/schemas/env.schema";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

/**
 * Parses the merged environment through the Zod schema and returns the typed configuration.
 *
 * @throws `Error` when any variable is missing or invalid; the message carries the Zod issues and startup fails before the first request.
 */
function validate(config: Record<string, unknown>): AppEnv {
  const parsed = APP_ENV_SCHEMA.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables ${parsed.error.message}`);
  }
  return parsed.data;
}

/**
 * Returns `env/.env` in production and `env/.env.<NODE_ENV>` otherwise, falling back to `env/.env` when `NODE_ENV` is unset.
 */
function getEnvFilePath(): string {
  let env = process.env.NODE_ENV ?? "";
  env = env === "production" ? "" : env;

  const envSuffix = env ? `.${env}` : "";

  return `env/.env${envSuffix}`;
}

export {
  validate,
  getEnvFilePath,
};