import { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/schemas/env.schema";

import type { ConfigModuleOptions } from "@nestjs/config";
import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

/**
 * Parses the merged environment through the Zod schema and returns the typed configuration.
 *
 * @throws `Error` when any variable is missing or invalid; the message carries the Zod issues and startup fails before the first request.
 */
function validateEnv(config: Record<string, unknown>): AppEnv {
  const parsed = APP_ENV_SCHEMA.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables ${parsed.error.message}`);
  }
  return parsed.data;
}

/**
 * Returns the `@nestjs/config` env-file options: production ignores env files entirely, other environments load `env/.env.<NODE_ENV>` and fall back to `env/.env` when `NODE_ENV` is unset.
 */
function getEnvFileOptions(): Pick<ConfigModuleOptions, "envFilePath" | "ignoreEnvFile"> {
  const nodeEnv = process.env.NODE_ENV ?? "";
  if (nodeEnv === "production") {
    return { ignoreEnvFile: true };
  }

  const envSuffix = nodeEnv ? `.${nodeEnv}` : "";

  return { envFilePath: `env/.env${envSuffix}` };
}

export {
  validateEnv,
  getEnvFileOptions,
};