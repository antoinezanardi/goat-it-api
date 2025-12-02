import { z } from "zod";

import { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/types/env.schema";

import type { $ZodURLParams } from "zod/v4/core";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

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

function validate(config: Record<string, unknown>): AppEnv {
  const parsed = APP_ENV_SCHEMA.safeParse(config);
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

export {
  validateCorsOrigin,
  validate,
  getEnvFilePath,
};