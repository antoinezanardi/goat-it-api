import { getEnvFilePath, validate } from "@src/infrastructure/api/config/helpers/env.helpers";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

describe("Env Validation", () => {
  describe(validate, () => {
    it("should return parsed env when config is valid with all fields.", () => {
      const config: Record<keyof AppEnv, unknown> = {
        SERVER_HOST: "192.168.1.1",
        SERVER_PORT: "4000",
        CORS_ORIGIN: "*",
        MONGODB_HOST: "127.0.0.1",
        MONGODB_PORT: "27018",
        MONGODB_DATABASE: "goat-it-test",
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "192.168.1.1",
        SERVER_PORT: 4000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "127.0.0.1",
        MONGODB_PORT: 27_018,
        MONGODB_DATABASE: "goat-it-test",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with default SERVER_PORT when SERVER_PORT is not provided.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_HOST: "192.168.1.1",
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "192.168.1.1",
        SERVER_PORT: 3000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "localhost",
        MONGODB_PORT: 27_017,
        MONGODB_DATABASE: "goat-it",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with default SERVER_HOST when SERVER_HOST is not provided.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_PORT: "5000",
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: 5000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "localhost",
        MONGODB_PORT: 27_017,
        MONGODB_DATABASE: "goat-it",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with all defaults when config is empty.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {};
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: 3000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "localhost",
        MONGODB_PORT: 27_017,
        MONGODB_DATABASE: "goat-it",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should coerce SERVER_PORT from string to number when SERVER_PORT is a valid numeric string.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: "8080",
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: 8080,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "localhost",
        MONGODB_PORT: 27_017,
        MONGODB_DATABASE: "goat-it",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should coerce SERVER_PORT from number to number when SERVER_PORT is already a number.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: 9000,
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: 9000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "localhost",
        MONGODB_PORT: 27_017,
        MONGODB_DATABASE: "goat-it",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should throw error when SERVER_PORT is not a valid number.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_HOST: "0.0.0.0",
        SERVER_PORT: "invalid",
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should throw error when SERVER_HOST is not a string.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_HOST: 12_345,
        SERVER_PORT: "3000",
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should throw error when config contains invalid types for both SERVER_PORT and SERVER_HOST.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_HOST: true,
        SERVER_PORT: "not-a-number",
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should return parsed env when config contains additional properties.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> & { EXTRA_FIELD: string } = {
        SERVER_HOST: "http://localhost",
        SERVER_PORT: "3000",
        EXTRA_FIELD: "should be ignored",
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "http://localhost",
        SERVER_PORT: 3000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "localhost",
        MONGODB_PORT: 27_017,
        MONGODB_DATABASE: "goat-it",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });
  });

  describe(getEnvFilePath, () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("should return '.env' when NODE_ENV is not set.", () => {
      delete process.env.NODE_ENV;

      expect(getEnvFilePath()).toBe("env/.env");
    });

    it("should return '.env.development' when NODE_ENV is 'development'.", () => {
      process.env.NODE_ENV = "development";

      expect(getEnvFilePath()).toBe("env/.env.development");
    });

    it("should return '.env.test' when NODE_ENV is 'test'.", () => {
      process.env.NODE_ENV = "test";

      expect(getEnvFilePath()).toBe("env/.env.test");
    });

    it("should return '.env' when NODE_ENV is 'production'.", () => {
      process.env.NODE_ENV = "production";

      expect(getEnvFilePath()).toBe("env/.env");
    });
  });
});