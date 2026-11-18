import { ConfigModule } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";

import { APP_CONFIG_MODULE_READY, AppConfigModule } from "@src/infrastructure/api/config/config.module";
import * as envHelpers from "@src/infrastructure/api/config/helpers/env.helpers";
import { AppConfigService } from "@src/infrastructure/api/config/providers/services/app-config.service";

import type { TestingModule } from "@nestjs/testing";

const originalEnvironmentVariables = vi.hoisted(() => {
  const testEnvironmentVariables = {
    SERVER_HOST: "0.0.0.0",
    SERVER_PORT: "4242",
    CORS_ORIGIN: "*",
    MONGODB_HOST: "0.0.0.0",
    MONGODB_PORT: "27017",
    MONGODB_DATABASE: "goat-it-test",
    FALLBACK_LOCALE: "en",
    API_KEY_HMAC_SECRET: "test_hmac_secret_key_for_api_key_signing_1234",
    ADMIN_API_KEY: "test_admin_api_key_for_testing",
    GAME_API_KEY: "test_game_api_key_for_testing",
  };
  const originalVariables: Record<string, string | undefined> = {};

  for (const [name, value] of Object.entries(testEnvironmentVariables)) {
    originalVariables[name] = process.env[name];
    process.env[name] = value;
  }
  return originalVariables;
});

vi.mock(import("@src/infrastructure/api/config/helpers/env.helpers"), async importOriginal => {
  const actual = await importOriginal<typeof import("@src/infrastructure/api/config/helpers/env.helpers")>();

  return {
    ...actual,
    validate: vi.fn<typeof actual.validate>(actual.validate),
    getEnvFilePath: vi.fn<typeof actual.getEnvFilePath>(actual.getEnvFilePath),
  };
});

describe(AppConfigModule, () => {
  let module: TestingModule;
  let observedLoaderCalls: {
    validateCallCount: number;
    environmentFilePathCallCount: number;
    environmentFilePath: unknown;
  };

  beforeAll(async() => {
    await APP_CONFIG_MODULE_READY;

    observedLoaderCalls = {
      validateCallCount: vi.mocked(envHelpers.validate).mock.calls.length,
      environmentFilePathCallCount: vi.mocked(envHelpers.getEnvFilePath).mock.calls.length,
      environmentFilePath: vi.mocked(envHelpers.getEnvFilePath).mock.results[0]?.value,
    };
  });

  beforeEach(async() => {
    module = await Test.createTestingModule({ imports: [AppConfigModule] }).compile();
  });

  afterEach(async() => {
    await module.close();
  });

  afterAll(() => {
    for (const [name, value] of Object.entries(originalEnvironmentVariables)) {
      if (value === undefined) {
        Reflect.deleteProperty(process.env, name);
      } else {
        process.env[name] = value;
      }
    }
  });

  it("should create the shared config module promise with the global flag when the module is loaded.", async() => {
    const appConfigModule = await APP_CONFIG_MODULE_READY;

    expect(appConfigModule.global).toBeTruthy();
  });

  it("should create the shared config module promise for the nest config module when the module is loaded.", async() => {
    const appConfigModule = await APP_CONFIG_MODULE_READY;

    expect(appConfigModule.module).toBe(ConfigModule);
  });

  it("should validate the merged environment once when the shared config module promise is created.", () => {
    expect(observedLoaderCalls.validateCallCount).toBe(1);
  });

  it("should read the environment file path once when the shared config module promise is created.", () => {
    expect(observedLoaderCalls.environmentFilePathCallCount).toBe(1);
  });

  it("should pass the test environment file path to the config module when the shared config module promise is created.", () => {
    expect(observedLoaderCalls.environmentFilePath).toBe("env/.env.test");
  });

  it("should resolve the app config service when the module graph is compiled.", () => {
    expect(module.get(AppConfigService)).toBeInstanceOf(AppConfigService);
  });

  it("should register the app config service as a provider when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("providers", AppConfigModule)).toContainEqual(AppConfigService);
  });

  it("should export the app config service when the module metadata is read.", () => {
    const reflector = new Reflector();

    expect(reflector.get("exports", AppConfigModule)).toContainEqual(AppConfigService);
  });
});