import { ENV_SCHEMA } from "@src/infrastructure/api/config/constants/env.constants";

import type { Env } from "@src/infrastructure/api/config/types/env.types";

function validate(config: Record<string, unknown>): Env {
  const parsed = ENV_SCHEMA.safeParse(config);
  if (!parsed.success) {
    throw new Error(`Invalid environment variables ${parsed.error.message}`);
  }
  return parsed.data;
}

function getEnvFilePath(): string {
  let env = process.env.NODE_ENV ?? "";
  env = env === "production" ? "" : env;

  const envSuffix = env ? `.${env}` : "";

  return `env/.env${envSuffix}`;
}

export { validate, getEnvFilePath };