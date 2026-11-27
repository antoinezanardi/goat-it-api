import { ConfigModule } from "@nestjs/config";

import { APP_CONFIG_MODULE_READY, createAppEnvStore, getAppEnv } from "@src/infrastructure/api/config/helpers/config-module.helpers";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

describe(createAppEnvStore, () => {
  it("should throw when the environment has not been validated yet.", () => {
    const store = createAppEnvStore();

    expect(() => store.getAppEnv()).toThrow("The application environment is not loaded yet");
  });

  it("should return the validated environment when it has been validated.", () => {
    const store = createAppEnvStore();
    const appEnv = store.validate({
      ...createFakeAppEnv({
        SERVER_HOST: "0.0.0.0",
        CORS_ORIGIN: "*",
        TRUST_PROXY: "127.0.0.1",
        MONGODB_HOST: "0.0.0.0",
        MONGODB_DATABASE: "goat-it-test",
      }),
      SENTRY_DISABLED: "false",
    });

    expect(store.getAppEnv()).toStrictEqual(appEnv);
  });

  it("should keep the validated proxy trust when the raw environment would serialize it as a string.", () => {
    const store = createAppEnvStore();
    store.validate({
      ...createFakeAppEnv({
        SERVER_HOST: "0.0.0.0",
        CORS_ORIGIN: "*",
        TRUST_PROXY: "",
        MONGODB_HOST: "0.0.0.0",
        MONGODB_DATABASE: "goat-it-test",
      }),
      SENTRY_DISABLED: "false",
    });

    expect(store.getAppEnv().TRUST_PROXY).toBe(false);
  });
});

describe("APP_CONFIG_MODULE_READY promise", () => {
  it("should resolve to the global config module when the module is loaded.", async() => {
    const dynamicModule = await APP_CONFIG_MODULE_READY;

    expect(dynamicModule).toStrictEqual(expect.objectContaining({
      global: true,
      module: ConfigModule,
    }));
  });

  it("should expose the validated environment when the config module is ready.", async() => {
    await APP_CONFIG_MODULE_READY;

    expect(getAppEnv().SERVER_PORT).toBe(4242);
  });
});