import { ConfigModule } from "@nestjs/config";
import { Reflector } from "@nestjs/core";
import { Test } from "@nestjs/testing";

import { AppConfigModule } from "@src/infrastructure/api/config/config.module";
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

describe(AppConfigModule, () => {
  let module: TestingModule;

  beforeAll(async() => {
    await ConfigModule.envVariablesLoaded;
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