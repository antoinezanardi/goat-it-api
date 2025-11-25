import { getEnvFilePath, validate } from "@src/infrastructure/api/config/helpers/env.helpers";

import { createFakeAppEnv } from "@factories/infrastructure/api/config/env.factory";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

describe("Env Validation", () => {
  describe(validate, () => {
    it("should return parsed env when config is valid with all fields.", () => {
      const config = {
        PORT: "4000",
        HOST: "192.168.1.1",
      };
      const expectedConfig = createFakeAppEnv({
        PORT: 4000,
        HOST: "192.168.1.1",
        CORS_ORIGIN: "*",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with default PORT when PORT is not provided.", () => {
      const config = {
        HOST: "192.168.1.1",
      };
      const expectedConfig = createFakeAppEnv({
        PORT: 3000,
        HOST: "192.168.1.1",
        CORS_ORIGIN: "*",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with default HOST when HOST is not provided.", () => {
      const config = {
        PORT: "5000",
      };
      const expectedConfig = createFakeAppEnv({
        PORT: 5000,
        HOST: "0.0.0.0",
        CORS_ORIGIN: "*",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with all defaults when config is empty.", () => {
      const config = {};
      const expectedConfig = createFakeAppEnv({
        PORT: 3000,
        HOST: "0.0.0.0",
        CORS_ORIGIN: "*",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should coerce PORT from string to number when PORT is a valid numeric string.", () => {
      const config = {
        PORT: "8080",
        HOST: "0.0.0.0",
      };
      const expectedConfig = createFakeAppEnv({
        PORT: 8080,
        HOST: "0.0.0.0",
        CORS_ORIGIN: "*",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should coerce PORT from number to number when PORT is already a number.", () => {
      const config = {
        PORT: 9000,
        HOST: "0.0.0.0",
      };
      const expectedConfig = createFakeAppEnv({
        PORT: 9000,
        HOST: "0.0.0.0",
        CORS_ORIGIN: "*",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should throw error when PORT is not a valid number.", () => {
      const config = {
        PORT: "invalid",
        HOST: "0.0.0.0",
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should throw error when HOST is not a string.", () => {
      const config = {
        PORT: "3000",
        HOST: 12_345,
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should throw error when config contains invalid types for both PORT and HOST.", () => {
      const config = {
        PORT: "not-a-number",
        HOST: true,
      };

      expect(() => validate(config)).toThrow("Invalid environment variables");
    });

    it("should return parsed env when config contains additional properties.", () => {
      const config = {
        PORT: "3000",
        HOST: "http://localhost",
        EXTRA_FIELD: "should be ignored",
      };
      const expectedConfig = createFakeAppEnv({
        PORT: 3000,
        HOST: "http://localhost",
        CORS_ORIGIN: "*",
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