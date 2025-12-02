import { getEnvFilePath, validate, validateCorsOrigin } from "@src/infrastructure/api/config/helpers/env.helpers";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

describe("Env Validation", () => {
  const defaultEnv = Object.freeze(createFakeAppEnv({
    SERVER_HOST: "0.0.0.0",
    SERVER_PORT: 3000,
    CORS_ORIGIN: "*",
    MONGODB_HOST: "0.0.0.0",
    MONGODB_PORT: 27_017,
    MONGODB_DATABASE: "goat-it",
    FALLBACK_LOCALE: "en",
  }));

  describe(validateCorsOrigin, () => {
    it.each<{
      test: string;
      value: string;
      isValid: boolean;
    }>([
      {
        test: "should return true for wildcard '*'.",
        value: "*",
        isValid: true,
      },
      {
        test: "should return true for valid domain 'http://example.com'.",
        value: "http://example.com",
        isValid: true,
      },
      {
        test: "should return true for valid domain with path 'https://example.com/path'.",
        value: "https://example.com/path",
        isValid: true,
      },
      {
        test: "should return true for valid domain with port 'http://example.com:8080'.",
        value: "http://example.com:8080",
        isValid: true,
      },
      {
        test: "should return false for invalid URL 'invalid_url'.",
        value: "invalid_url",
        isValid: false,
      },
      {
        test: "should return false for URL with unsupported protocol 'ftp://example.com'.",
        value: "ftp://example.com",
        isValid: false,
      },
      {
        test: "should return false for URL with unsupported protocol 'httpp://example.com'.",
        value: "httpp://example.com",
        isValid: false,
      },
      {
        test: "should return false for URL with unsupported protocol 'hhttp://example.com'.",
        value: "hhttp://example.com",
        isValid: false,
      },
      {
        test: "should return false for IP-based URL 'http://127.0.0.1:3000'.",
        value: "http://127.0.0.1:3000",
        isValid: false,
      },
      {
        test: "should return false for localhost URL 'http://localhost:8080'.",
        value: "http://localhost:8080",
        isValid: false,
      },
      {
        test: "should return false for empty string ''.",
        value: "",
        isValid: false,
      },
    ])("$test", ({ value, isValid }) => {
      expect(validateCorsOrigin(value)).toBe(isValid);
    });
  });

  describe(validate, () => {
    it("should return parsed env when config is valid with all fields.", () => {
      const config: Record<keyof AppEnv, unknown> = {
        SERVER_HOST: "192.168.1.1",
        SERVER_PORT: "4000",
        CORS_ORIGIN: "*",
        MONGODB_HOST: "0.0.0.0",
        MONGODB_PORT: "27018",
        MONGODB_DATABASE: "goat-it-test",
        FALLBACK_LOCALE: "fr",
      };
      const expectedConfig = createFakeAppEnv({
        SERVER_HOST: "192.168.1.1",
        SERVER_PORT: 4000,
        CORS_ORIGIN: "*",
        MONGODB_HOST: "0.0.0.0",
        MONGODB_PORT: 27_018,
        MONGODB_DATABASE: "goat-it-test",
        FALLBACK_LOCALE: "fr",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env with all defaults when config is empty.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {};

      expect(validate(config)).toStrictEqual<AppEnv>(defaultEnv);
    });

    it("should coerce SERVER_PORT from string to number when SERVER_PORT is a valid numeric string.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_PORT: "8080",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        SERVER_PORT: 8080,
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should coerce SERVER_PORT from number to number when SERVER_PORT is already a number.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        SERVER_PORT: 9000,
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        SERVER_PORT: 9000,
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should accept a non-default valid IPv4 for when MONGODB_HOST is an override.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        MONGODB_HOST: "192.168.0.10",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        MONGODB_HOST: "192.168.0.10",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should accept a valid URL for CORS_ORIGIN when it is an override.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        CORS_ORIGIN: "https://example.com",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        CORS_ORIGIN: "https://example.com",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should accept a valid MONGODB_PORT when it is an override.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        MONGODB_PORT: "28017",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        MONGODB_PORT: 28_017,
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should accept a valid MONGODB_DATABASE name when it is an override.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        MONGODB_DATABASE: "my-database-1",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        MONGODB_DATABASE: "my-database-1",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should accept a valid FALLBACK_LOCALE when it is an override.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        FALLBACK_LOCALE: "es",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        FALLBACK_LOCALE: "es",
      });

      expect(validate(config)).toStrictEqual<AppEnv>(expectedConfig);
    });

    it("should return parsed env when config contains additional properties.", () => {
      const config: Partial<Record<keyof AppEnv, unknown>> & { EXTRA_FIELD: string } = {
        EXTRA_FIELD: "should be ignored",
      };

      expect(validate(config)).toStrictEqual<AppEnv>(defaultEnv);
    });

    it.each<{
      test: string;
      config: Partial<Record<keyof AppEnv, unknown>>;
      errorMessage: string;
    }>([
      {
        test: "should throw error when SERVER_HOST is an invalid hostname.",
        config: {
          SERVER_HOST: "invalid_host_name!",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_HOST is not a valid IP address.",
        config: {
          SERVER_HOST: "aa.aaa?aaa",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_HOST is an empty string.",
        config: {
          SERVER_HOST: "",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_PORT is negative.",
        config: {
          SERVER_PORT: "-1",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_PORT is below minimum.",
        config: {
          SERVER_PORT: "0",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_PORT is above maximum.",
        config: {
          SERVER_PORT: "70000",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_PORT is a non-numeric string.",
        config: {
          SERVER_PORT: "not_a_number",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when SERVER_PORT is an empty string.",
        config: {
          SERVER_PORT: "",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when CORS_ORIGIN is not a valid URL and not '*'.",
        config: {
          CORS_ORIGIN: "invalid_url",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when CORS_ORIGIN is an empty string.",
        config: {
          CORS_ORIGIN: "",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_HOST is not a valid IPv4 address.",
        config: {
          MONGODB_HOST: "invalid_ip_address",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_HOST is localhost.",
        config: {
          MONGODB_HOST: "localhost",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_HOST is an empty string.",
        config: {
          MONGODB_HOST: "",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_PORT is negative.",
        config: {
          MONGODB_PORT: "-1",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_PORT is below minimum.",
        config: {
          MONGODB_PORT: "0",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_PORT is above maximum.",
        config: {
          MONGODB_PORT: "70000",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_PORT is a non-numeric string.",
        config: {
          MONGODB_PORT: "not_a_number",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_PORT is an empty string.",
        config: {
          MONGODB_PORT: "",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_DATABASE contains invalid characters.",
        config: {
          MONGODB_DATABASE: "invalid database name!",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_DATABASE ends with a hyphen.",
        config: {
          MONGODB_DATABASE: "invalid-database-",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when MONGODB_DATABASE is an empty string.",
        config: {
          MONGODB_DATABASE: "",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when FALLBACK_LOCALE is not in the supported locales.",
        config: {
          FALLBACK_LOCALE: "unknown",
        },
        errorMessage: "Invalid environment variables",
      },
      {
        test: "should throw error when FALLBACK_LOCALE is an empty string.",
        config: {
          FALLBACK_LOCALE: "",
        },
        errorMessage: "Invalid environment variables",
      },
    ])("$test", ({ config, errorMessage }) => {
      expect(() => validate(config)).toThrowError(errorMessage);
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