import { API_KEY_HMAC_SECRET_MINIMAL_LENGTH, API_KEY_MINIMAL_LENGTH } from "@src/infrastructure/api/auth/constants/auth.constants";
import { getEnvFilePath, validateEnv } from "@src/infrastructure/api/config/helpers/env.helpers";
import { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/schemas/env.schema";

import { createFakeAppEnv } from "@faketories/infrastructure/api/config/env.faketory";

import type { AppEnv } from "@src/infrastructure/api/config/types/env.types";

describe(validateEnv, () => {
  const minimalValidEnv: Partial<AppEnv> = {
    API_KEY_HMAC_SECRET: "x".repeat(API_KEY_HMAC_SECRET_MINIMAL_LENGTH),
    ADMIN_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
    GAME_API_KEY: "y".repeat(API_KEY_MINIMAL_LENGTH),
  };

  const defaultEnv = Object.freeze(createFakeAppEnv({
    ...minimalValidEnv,
    SERVER_HOST: "0.0.0.0",
    SERVER_PORT: 3000,
    CORS_ORIGIN: "*",
    MONGODB_HOST: "0.0.0.0",
    MONGODB_PORT: 27_017,
    MONGODB_DATABASE: "goat-it",
    FALLBACK_LOCALE: "en",
    THROTTLER_DEFAULT_TTL_SECONDS: 1,
    THROTTLER_DEFAULT_LIMIT: 20,
    THROTTLER_SUSTAINED_TTL_SECONDS: 60,
    THROTTLER_SUSTAINED_LIMIT: 300,
    SENTRY_DSN: "",
    SENTRY_ENVIRONMENT: "development",
  }));

  const defaultEnvInput = Object.freeze({
    ...defaultEnv,
    TRUST_PROXY: "",
  });

  it("should return parsed env when config is valid with all fields.", () => {
    const config: Record<keyof AppEnv, unknown> = {
      SERVER_HOST: "192.168.1.1",
      SERVER_PORT: "4000",
      CORS_ORIGIN: "*",
      TRUST_PROXY: "127.0.0.1",
      MONGODB_HOST: "0.0.0.0",
      MONGODB_PORT: "27018",
      MONGODB_DATABASE: "goat-it-test",
      FALLBACK_LOCALE: "fr",
      THROTTLER_DEFAULT_TTL_SECONDS: "5",
      THROTTLER_DEFAULT_LIMIT: "50",
      THROTTLER_SUSTAINED_TTL_SECONDS: "120",
      THROTTLER_SUSTAINED_LIMIT: "600",
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "production",
      API_KEY_HMAC_SECRET: "valid-hmac-secret-of-sufficient-length-version-two",
      ADMIN_API_KEY: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      GAME_API_KEY: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    };
    const expectedConfig = createFakeAppEnv({
      SERVER_HOST: "192.168.1.1",
      SERVER_PORT: 4000,
      CORS_ORIGIN: "*",
      TRUST_PROXY: "127.0.0.1",
      MONGODB_HOST: "0.0.0.0",
      MONGODB_PORT: 27_018,
      MONGODB_DATABASE: "goat-it-test",
      FALLBACK_LOCALE: "fr",
      THROTTLER_DEFAULT_TTL_SECONDS: 5,
      THROTTLER_DEFAULT_LIMIT: 50,
      THROTTLER_SUSTAINED_TTL_SECONDS: 120,
      THROTTLER_SUSTAINED_LIMIT: 600,
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "production",
      API_KEY_HMAC_SECRET: "valid-hmac-secret-of-sufficient-length-version-two",
      ADMIN_API_KEY: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      GAME_API_KEY: "dddddddd-dddd-dddd-dddd-dddddddddddd",
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should return parsed env with all defaults when config only has optional fields missing.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
    };

    expect(validateEnv(config)).toStrictEqual(defaultEnv);
  });

  it("should coerce SERVER_PORT from string to number when SERVER_PORT is a valid numeric string.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      SERVER_PORT: "8080",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      SERVER_PORT: 8080,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should coerce SERVER_PORT from number to number when SERVER_PORT is already a number.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      SERVER_PORT: 9000,
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      SERVER_PORT: 9000,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it.each<{ host: string; description: string }>([
    { host: "192.168.0.10", description: "non-default valid IPv4" },
    { host: "mongo.example.com", description: "non-default valid hostname" },
    { host: "mongodb", description: "non-default docker hostname" },
  ])("should accept a $description for when MONGODB_HOST is an override.", ({ host }) => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      MONGODB_HOST: host,
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      MONGODB_HOST: host,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should accept a valid URL for CORS_ORIGIN when it is an override.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      CORS_ORIGIN: "https://example.com",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      CORS_ORIGIN: "https://example.com",
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should disable proxy trust when TRUST_PROXY is not provided.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      TRUST_PROXY: false,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should disable proxy trust when TRUST_PROXY is an empty string.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      TRUST_PROXY: "",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      TRUST_PROXY: false,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it.each<{ test: string; trustProxy: string }>([
    {
      test: "should accept an IPv4 address for TRUST_PROXY when it is an override.",
      trustProxy: "127.0.0.1",
    },
    {
      test: "should accept an IPv6 address for TRUST_PROXY when it is an override.",
      trustProxy: "::1",
    },
    {
      test: "should accept an IPv4 CIDR block for TRUST_PROXY when it is an override.",
      trustProxy: "10.0.0.0/8",
    },
    {
      test: "should accept an IPv6 CIDR block for TRUST_PROXY when it is an override.",
      trustProxy: "2001:db8::/32",
    },
  ])("$test", ({ trustProxy }) => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      TRUST_PROXY: trustProxy,
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      TRUST_PROXY: trustProxy,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should accept a valid MONGODB_PORT when it is an override.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      MONGODB_PORT: "28017",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      MONGODB_PORT: 28_017,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should accept a valid MONGODB_DATABASE name when it is an override.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      MONGODB_DATABASE: "my-database-1",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      MONGODB_DATABASE: "my-database-1",
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should accept a valid FALLBACK_LOCALE when it is an override.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...minimalValidEnv,
      FALLBACK_LOCALE: "es",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      FALLBACK_LOCALE: "es",
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should return parsed env when config contains additional properties.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> & { EXTRA_FIELD: string } = {
      ...minimalValidEnv,
      EXTRA_FIELD: "should be ignored",
    };

    expect(validateEnv(config)).toStrictEqual(defaultEnv);
  });

  it.each<{ test: string; envKey: keyof AppEnv; rawValue: string; expectedValue: number }>([
    {
      test: "should coerce THROTTLER_DEFAULT_TTL_SECONDS from string to number when it is a valid numeric string.",
      envKey: "THROTTLER_DEFAULT_TTL_SECONDS",
      rawValue: "2",
      expectedValue: 2,
    },
    {
      test: "should coerce THROTTLER_DEFAULT_LIMIT from string to number when it is a valid numeric string.",
      envKey: "THROTTLER_DEFAULT_LIMIT",
      rawValue: "40",
      expectedValue: 40,
    },
    {
      test: "should coerce THROTTLER_SUSTAINED_TTL_SECONDS from string to number when it is a valid numeric string.",
      envKey: "THROTTLER_SUSTAINED_TTL_SECONDS",
      rawValue: "90",
      expectedValue: 90,
    },
    {
      test: "should coerce THROTTLER_SUSTAINED_LIMIT from string to number when it is a valid numeric string.",
      envKey: "THROTTLER_SUSTAINED_LIMIT",
      rawValue: "900",
      expectedValue: 900,
    },
  ])("$test", ({ envKey, rawValue, expectedValue }) => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...defaultEnvInput,
      [envKey]: rawValue,
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      [envKey]: expectedValue,
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it.each<{ test: string; envKey: keyof AppEnv; invalidValue: string }>([
    {
      test: "should throw error when THROTTLER_DEFAULT_TTL_SECONDS is zero.",
      envKey: "THROTTLER_DEFAULT_TTL_SECONDS",
      invalidValue: "0",
    },
    {
      test: "should throw error when THROTTLER_DEFAULT_LIMIT is negative.",
      envKey: "THROTTLER_DEFAULT_LIMIT",
      invalidValue: "-1",
    },
    {
      test: "should throw error when THROTTLER_SUSTAINED_TTL_SECONDS is fractional.",
      envKey: "THROTTLER_SUSTAINED_TTL_SECONDS",
      invalidValue: "1.5",
    },
    {
      test: "should throw error when THROTTLER_SUSTAINED_LIMIT is not numeric.",
      envKey: "THROTTLER_SUSTAINED_LIMIT",
      invalidValue: "not_a_number",
    },
    {
      test: "should throw error when THROTTLER_SUSTAINED_LIMIT is an empty string.",
      envKey: "THROTTLER_SUSTAINED_LIMIT",
      invalidValue: "",
    },
  ])("$test", ({ envKey, invalidValue }) => {
    const config: Record<keyof AppEnv, unknown> = {
      ...defaultEnvInput,
      [envKey]: invalidValue,
    };

    expect(() => validateEnv(config)).toThrow("Invalid environment variables");
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
      test: "should throw error when TRUST_PROXY is a boolean string.",
      config: {
        TRUST_PROXY: "true",
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when TRUST_PROXY is a proxy hop count.",
      config: {
        TRUST_PROXY: "1",
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when TRUST_PROXY is a comma-separated list.",
      config: {
        TRUST_PROXY: "192.168.0.1,10.0.0.1",
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when TRUST_PROXY is a blank string with a space.",
      config: {
        TRUST_PROXY: " ",
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
    {
      test: "should throw error when API_KEY_HMAC_SECRET is missing.",
      config: {
        API_KEY_HMAC_SECRET: undefined,
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when API_KEY_HMAC_SECRET is too short.",
      config: {
        API_KEY_HMAC_SECRET: "short-secret",
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when ADMIN_API_KEY is missing.",
      config: {
        ADMIN_API_KEY: undefined,
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when ADMIN_API_KEY is too short.",
      config: {
        ADMIN_API_KEY: "short-key",
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when GAME_API_KEY is missing.",
      config: {
        GAME_API_KEY: undefined,
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when GAME_API_KEY is too short.",
      config: {
        GAME_API_KEY: "short-key",
      },
      errorMessage: "Invalid environment variables",
    },
    {
      test: "should throw error when ADMIN_API_KEY equals GAME_API_KEY.",
      config: {
        ADMIN_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
        GAME_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
      },
      errorMessage: "ADMIN_API_KEY and GAME_API_KEY must be different",
    },
  ])("$test", ({ config, errorMessage }) => {
    const fullConfig = {
      ...defaultEnvInput,
      ...config,
    };

    expect(() => validateEnv(fullConfig)).toThrow(errorMessage);
  });

  it("should accept a complete Sentry DSN when it is an override.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...defaultEnvInput,
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it("should accept a deployment Sentry environment when it is an override.", () => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...defaultEnvInput,
      SENTRY_ENVIRONMENT: "staging",
    };
    const expectedConfig = createFakeAppEnv({
      ...defaultEnv,
      SENTRY_ENVIRONMENT: "staging",
    });

    expect(validateEnv(config)).toStrictEqual(expectedConfig);
  });

  it.each<{ test: string; dsn: string }>([
    {
      test: "should throw error when SENTRY_DSN has no HTTPS scheme.",
      // Acceptable as this case must use plain HTTP to prove the schema rejects it
      // eslint-disable-next-line unicorn/prefer-https
      dsn: "http://publickey@sentry.io/42",
    },
    {
      test: "should throw error when SENTRY_DSN has no public key.",
      dsn: "https://sentry.io/42",
    },
    {
      test: "should throw error when SENTRY_DSN has no project id.",
      dsn: "https://publickey@sentry.io",
    },
    {
      test: "should throw error when SENTRY_DSN has a non-numeric project id.",
      dsn: "https://publickey@sentry.io/project",
    },
  ])("$test", ({ dsn }) => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...defaultEnvInput,
      SENTRY_DSN: dsn,
    };

    expect(() => validateEnv(config)).toThrow("Invalid environment variables");
  });

  it.each<{ test: string; sentryEnvironment: string }>([
    {
      test: "should throw error when SENTRY_ENVIRONMENT is not a supported environment.",
      sentryEnvironment: "staging-eu",
    },
    {
      test: "should throw error when SENTRY_ENVIRONMENT is an empty string.",
      sentryEnvironment: "",
    },
  ])("$test", ({ sentryEnvironment }) => {
    const config: Partial<Record<keyof AppEnv, unknown>> = {
      ...defaultEnvInput,
      SENTRY_ENVIRONMENT: sentryEnvironment,
    };

    expect(() => validateEnv(config)).toThrow("Invalid environment variables");
  });

  describe("deployment Sentry configuration", () => {
    const originalNodeEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it("should return parsed env when NODE_ENV is production and the Sentry configuration is deployable.", () => {
      process.env.NODE_ENV = "production";
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        ...defaultEnvInput,
        SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
        SENTRY_ENVIRONMENT: "staging",
      };
      const expectedConfig = createFakeAppEnv({
        ...defaultEnv,
        SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
        SENTRY_ENVIRONMENT: "staging",
      });

      expect(validateEnv(config)).toStrictEqual(expectedConfig);
    });

    it("should throw error when NODE_ENV is production and SENTRY_DSN is empty.", () => {
      process.env.NODE_ENV = "production";
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        ...defaultEnvInput,
        SENTRY_DSN: "",
      };

      expect(() => validateEnv(config)).toThrow("SENTRY_DSN must be set when NODE_ENV is production");
    });

    it.each<{ test: string; sentryEnvironment: string }>([
      {
        test: "should throw error when NODE_ENV is production and SENTRY_ENVIRONMENT is development.",
        sentryEnvironment: "development",
      },
      {
        test: "should throw error when NODE_ENV is production and SENTRY_ENVIRONMENT is test.",
        sentryEnvironment: "test",
      },
    ])("$test", ({ sentryEnvironment }) => {
      process.env.NODE_ENV = "production";
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        ...defaultEnvInput,
        SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
        SENTRY_ENVIRONMENT: sentryEnvironment,
      };

      expect(() => validateEnv(config)).toThrow("SENTRY_ENVIRONMENT must be staging or production when NODE_ENV is production");
    });

    it("should return parsed env when NODE_ENV is test and SENTRY_DSN is empty.", () => {
      process.env.NODE_ENV = "test";
      const config: Partial<Record<keyof AppEnv, unknown>> = {
        ...minimalValidEnv,
      };

      expect(validateEnv(config)).toStrictEqual(defaultEnv);
    });
  });
});

describe("APP_ENV_SCHEMA Shape", () => {
  it("should report the equality error on the GAME_API_KEY path when ADMIN_API_KEY equals GAME_API_KEY.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      API_KEY_HMAC_SECRET: "x".repeat(API_KEY_HMAC_SECRET_MINIMAL_LENGTH),
      ADMIN_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
      GAME_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["GAME_API_KEY"],
      message: "ADMIN_API_KEY and GAME_API_KEY must be different",
    }));
  });
});

describe(getEnvFilePath, () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("should return 'env/.env' when NODE_ENV is not set.", () => {
    delete process.env.NODE_ENV;

    expect(getEnvFilePath()).toBe("env/.env");
  });

  it.each<[string, string]>([
    ["development", "env/.env.development"],
    ["test", "env/.env.test"],
    ["production", "env/.env"],
  ])("should return the expected path when NODE_ENV is '%s'.", (nodeEnv, expected) => {
    process.env.NODE_ENV = nodeEnv;

    expect(getEnvFilePath()).toBe(expected);
  });
});