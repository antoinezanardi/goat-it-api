import { ConfigModule } from "@nestjs/config";

import { getEnvFileOptions, validateEnv } from "@src/infrastructure/api/config/helpers/env.helpers";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

type AppEnvStore = {
  validate: (config: Record<string, unknown>) => AppEnv;
  getAppEnv: () => AppEnv;
};

/**
 * Creates an environment store that keeps the first validated configuration for the composition root.
 *
 * `ConfigModule.forRoot()` writes the validator output back into `process.env`, so a boolean becomes the string `"false"`;
 * the store lets startup read the validated value instead of re-validating that mutated environment.
 */
function createAppEnvStore(): AppEnvStore {
  const store: { appEnv?: AppEnv } = {};

  function validateAndStoreAppEnv(config: Record<string, unknown>): AppEnv {
    const appEnv = validateEnv(config);
    store.appEnv = appEnv;

    return appEnv;
  }

  function getAppEnv(): AppEnv {
    if (store.appEnv === undefined) {
      throw new Error("The application environment is not loaded yet");
    }
    return store.appEnv;
  }
  return {
    validate: validateAndStoreAppEnv,
    getAppEnv,
  };
}

const APP_ENV_STORE = createAppEnvStore();

const APP_CONFIG_MODULE_READY = ConfigModule.forRoot({
  isGlobal: true,
  validate: APP_ENV_STORE.validate,
  ...getEnvFileOptions(),
});

/**
 * Returns the app environment validated by `APP_CONFIG_MODULE_READY`.
 *
 * @throws `Error` when the configuration module has not validated the environment yet.
 */
function getAppEnv(): AppEnv {
  return APP_ENV_STORE.getAppEnv();
}

export {
  APP_CONFIG_MODULE_READY,
  createAppEnvStore,
  getAppEnv,
};