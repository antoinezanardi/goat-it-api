import { config as loadEnvConfig } from "dotenv";

import { APP_ENV_TEST_PATH } from "@acceptance-support/constants/app.constants";

export function loadEnvTestConfig(): void {
  const envLoadResult = loadEnvConfig({
    path: APP_ENV_TEST_PATH,
    quiet: true,
  });
  if (envLoadResult.error) {
    throw new Error(`Failed to load environment variables from ${APP_ENV_TEST_PATH}: ${envLoadResult.error.message}`);
  }
}