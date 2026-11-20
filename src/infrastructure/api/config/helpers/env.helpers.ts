import { DEFAULT_ENV_SENTRY_DSN, DEPLOYMENT_NODE_ENV, DEPLOYMENT_SENTRY_ENVIRONMENTS, SENTRY_DSN_REQUIRED_IN_DEPLOYMENT_MESSAGE, SENTRY_ENVIRONMENT_NOT_DEPLOYMENT_MESSAGE } from "@src/infrastructure/api/config/constants/env.constants";
import { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/schemas/env.schema";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

/**
 * Tells whether an environment name is allowed on a deployment host.
 */
function isDeploymentSentryEnvironment(environment: AppEnv["SENTRY_ENVIRONMENT"]): boolean {
  return DEPLOYMENT_SENTRY_ENVIRONMENTS.some(deploymentEnvironment => deploymentEnvironment === environment);
}

/**
 * Rejects a deployment host that would run unmonitored.
 *
 * @throws `Error` when `NODE_ENV` is `production` and either `SENTRY_DSN` is empty or `SENTRY_ENVIRONMENT` is not a deployment value; the messages never contain the DSN.
 */
function ensureDeploymentSentryConfiguration(appEnv: AppEnv): void {
  if (process.env.NODE_ENV !== DEPLOYMENT_NODE_ENV) {
    return;
  }
  if (appEnv.SENTRY_DSN === DEFAULT_ENV_SENTRY_DSN) {
    throw new Error(SENTRY_DSN_REQUIRED_IN_DEPLOYMENT_MESSAGE);
  }
  if (!isDeploymentSentryEnvironment(appEnv.SENTRY_ENVIRONMENT)) {
    throw new Error(SENTRY_ENVIRONMENT_NOT_DEPLOYMENT_MESSAGE);
  }
}

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
  ensureDeploymentSentryConfiguration(parsed.data);

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
  validateEnv,
  getEnvFilePath,
};