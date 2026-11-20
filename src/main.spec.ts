import * as ConfigModuleHelpers from "@src/infrastructure/api/config/helpers/config-module.helpers";
import * as Server from "@src/infrastructure/api/server/server";

import { AppModule } from "@app/app.module";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { NestFastifyApplication } from "@nestjs/platform-fastify";

const environment = vi.hoisted(() => {
  const testEnvironmentVariables = {
    API_KEY_HMAC_SECRET: "test_hmac_secret_key_for_api_key_signing_1234",
    ADMIN_API_KEY: "test_admin_api_key_for_testing",
    GAME_API_KEY: "test_game_api_key_for_testing",
  };
  const originalVariables: Record<string, string | undefined> = {};

  for (const [name, value] of Object.entries(testEnvironmentVariables)) {
    originalVariables[name] = process.env[name];
    process.env[name] = value;
  }
  return { originalVariables };
});

const appEnv = createFakeAppEnv({ TRUST_PROXY: "127.0.0.1" });

const environmentError = new Error("The application environment is not loaded yet");

describe("Main", () => {
  describe("Root", () => {
    let observedBootstrapCalls: unknown[][];

    beforeAll(async() => {
      vi.spyOn(ConfigModuleHelpers, "getAppEnv").mockReturnValue(appEnv);
      const bootstrapSpy = vi.spyOn(Server, "bootstrap").mockResolvedValue({} as NestFastifyApplication);

      await import("@src/main");

      observedBootstrapCalls = bootstrapSpy.mock.calls;
    });

    afterAll(() => {
      for (const [name, value] of Object.entries(environment.originalVariables)) {
        if (value === undefined) {
          Reflect.deleteProperty(process.env, name);
        } else {
          process.env[name] = value;
        }
      }
    });

    it("should bootstrap the application with the app module and the env-file trust proxy when the file is imported.", () => {
      expect(observedBootstrapCalls).toStrictEqual([[AppModule, "127.0.0.1"]]);
    });

    it("should reject when the application environment is not available.", async() => {
      vi.spyOn(ConfigModuleHelpers, "getAppEnv").mockImplementation(() => {
        throw environmentError;
      });
      const { main } = await import("@src/main");

      await expect(main()).rejects.toThrow(environmentError);
    });

    it("should not bootstrap the application when the application environment is not available.", async() => {
      vi.spyOn(ConfigModuleHelpers, "getAppEnv").mockImplementation(() => {
        throw environmentError;
      });
      const bootstrapSpy = vi.spyOn(Server, "bootstrap").mockResolvedValue({} as NestFastifyApplication);
      const { main } = await import("@src/main");

      await Promise.allSettled([main()]);

      expect(bootstrapSpy).not.toHaveBeenCalled();
    });

    it("should read the application environment before bootstrapping the application when the composition root runs.", async() => {
      const getAppEnvSpy = vi.spyOn(ConfigModuleHelpers, "getAppEnv").mockReturnValue(appEnv);
      const bootstrapSpy = vi.spyOn(Server, "bootstrap").mockResolvedValue({} as NestFastifyApplication);
      const { main } = await import("@src/main");

      await main();

      expect(getAppEnvSpy.mock.invocationCallOrder[0]).toBeLessThan(bootstrapSpy.mock.invocationCallOrder[0]);
    });
  });
});