import { API_KEY_HMAC_SECRET_MINIMAL_LENGTH, API_KEY_MINIMAL_LENGTH } from "@src/infrastructure/api/auth/constants/auth.constants";
import {
  DEFAULT_ENV_CORS_ORIGIN,
  DEFAULT_ENV_FALLBACK_LOCALE,
  DEFAULT_ENV_MONGODB_DATABASE,
  DEFAULT_ENV_MONGODB_HOST,
  DEFAULT_ENV_MONGODB_PORT,
  DEFAULT_ENV_SENTRY_DSN,
  DEFAULT_ENV_SENTRY_ENVIRONMENT,
  DEFAULT_ENV_SERVER_HOST,
  DEFAULT_ENV_SERVER_PORT,
  DEFAULT_ENV_THROTTLER_DEFAULT_LIMIT,
  DEFAULT_ENV_THROTTLER_DEFAULT_TTL_SECONDS,
  DEFAULT_ENV_THROTTLER_SUSTAINED_LIMIT,
  DEFAULT_ENV_THROTTLER_SUSTAINED_TTL_SECONDS,
  IS_PROXY_TRUSTED_DEFAULT_ENV,
  IS_SENTRY_DISABLED_DEFAULT_ENV,
  MAX_PORT_NUMBER,
  MIN_PORT_NUMBER,
  MIN_THROTTLER_VALUE,
  SENTRY_DISABLED_IN_DEPLOYMENT_MESSAGE,
  SENTRY_DSN_REQUIRED_IN_DEPLOYMENT_MESSAGE,
  SENTRY_ENVIRONMENT_NOT_DEPLOYMENT_MESSAGE,
} from "@src/infrastructure/api/config/constants/env.constants";
import { APP_ENV_SCHEMA } from "@src/infrastructure/api/config/schemas/env.schema";

describe("APP_ENV_SCHEMA Shape", () => {
  const minimalValidEnvInput = {
    API_KEY_HMAC_SECRET: "x".repeat(API_KEY_HMAC_SECRET_MINIMAL_LENGTH),
    ADMIN_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
    GAME_API_KEY: "y".repeat(API_KEY_MINIMAL_LENGTH),
  };

  const originalNodeEnv: { value?: string } = {};

  beforeEach(() => {
    originalNodeEnv.value = process.env.NODE_ENV;
  });

  afterEach(() => {
    if (originalNodeEnv.value === undefined) {
      Reflect.deleteProperty(process.env, "NODE_ENV");
    } else {
      process.env.NODE_ENV = originalNodeEnv.value;
    }
  });

  it("should apply every documented default when only the required keys are provided.", () => {
    const parsedEnv = APP_ENV_SCHEMA.parse(minimalValidEnvInput);

    expect(parsedEnv).toStrictEqual({
      ...minimalValidEnvInput,
      SERVER_HOST: DEFAULT_ENV_SERVER_HOST,
      SERVER_PORT: DEFAULT_ENV_SERVER_PORT,
      CORS_ORIGIN: DEFAULT_ENV_CORS_ORIGIN,
      TRUST_PROXY: IS_PROXY_TRUSTED_DEFAULT_ENV,
      MONGODB_HOST: DEFAULT_ENV_MONGODB_HOST,
      MONGODB_PORT: DEFAULT_ENV_MONGODB_PORT,
      MONGODB_DATABASE: DEFAULT_ENV_MONGODB_DATABASE,
      FALLBACK_LOCALE: DEFAULT_ENV_FALLBACK_LOCALE,
      THROTTLER_DEFAULT_TTL_SECONDS: DEFAULT_ENV_THROTTLER_DEFAULT_TTL_SECONDS,
      THROTTLER_DEFAULT_LIMIT: DEFAULT_ENV_THROTTLER_DEFAULT_LIMIT,
      THROTTLER_SUSTAINED_TTL_SECONDS: DEFAULT_ENV_THROTTLER_SUSTAINED_TTL_SECONDS,
      THROTTLER_SUSTAINED_LIMIT: DEFAULT_ENV_THROTTLER_SUSTAINED_LIMIT,
      SENTRY_DISABLED: IS_SENTRY_DISABLED_DEFAULT_ENV,
      SENTRY_DSN: DEFAULT_ENV_SENTRY_DSN,
      SENTRY_ENVIRONMENT: DEFAULT_ENV_SENTRY_ENVIRONMENT,
    });
  });

  it.each<number>([MIN_PORT_NUMBER - 1, MAX_PORT_NUMBER + 1])("should reject SERVER_PORT when it is %d.", serverPort => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      SERVER_PORT: serverPort,
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["SERVER_PORT"] }));
  });

  it.each<number>([MIN_PORT_NUMBER - 1, MAX_PORT_NUMBER + 1])("should reject MONGODB_PORT when it is %d.", mongoDatabasePort => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      MONGODB_PORT: mongoDatabasePort,
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["MONGODB_PORT"] }));
  });

  it("should reject MONGODB_DATABASE when it does not match the documented pattern.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      MONGODB_DATABASE: "database with spaces",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["MONGODB_DATABASE"] }));
  });

  it("should resolve TRUST_PROXY to false when it is empty.", () => {
    const parsedEnv = APP_ENV_SCHEMA.parse({
      ...minimalValidEnvInput,
      TRUST_PROXY: "",
    });

    expect(parsedEnv.TRUST_PROXY).toBe(IS_PROXY_TRUSTED_DEFAULT_ENV);
  });

  it("should keep TRUST_PROXY when it is a single IPv4 address.", () => {
    const parsedEnv = APP_ENV_SCHEMA.parse({
      ...minimalValidEnvInput,
      TRUST_PROXY: "127.0.0.1",
    });

    expect(parsedEnv.TRUST_PROXY).toBe("127.0.0.1");
  });

  it("should reject TRUST_PROXY when it lists more than one address.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      TRUST_PROXY: "127.0.0.1, 10.0.0.1",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["TRUST_PROXY"] }));
  });

  it("should reject CORS_ORIGIN when it is neither a wildcard nor an HTTP origin.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      CORS_ORIGIN: "example.com",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["CORS_ORIGIN"] }));
  });

  it("should reject FALLBACK_LOCALE when it is not a supported locale.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      FALLBACK_LOCALE: "jp",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["FALLBACK_LOCALE"] }));
  });

  it.each<string>(["THROTTLER_DEFAULT_TTL_SECONDS", "THROTTLER_DEFAULT_LIMIT", "THROTTLER_SUSTAINED_TTL_SECONDS", "THROTTLER_SUSTAINED_LIMIT"])(
    "should reject %s when it is below the minimum.",
    throttlerKey => {
      const result = APP_ENV_SCHEMA.safeParse({
        ...minimalValidEnvInput,
        [throttlerKey]: MIN_THROTTLER_VALUE - 1,
      });

      expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: [throttlerKey] }));
    },
  );

  it("should reject API_KEY_HMAC_SECRET when it is shorter than the minimum length.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      API_KEY_HMAC_SECRET: "x".repeat(API_KEY_HMAC_SECRET_MINIMAL_LENGTH - 1),
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["API_KEY_HMAC_SECRET"] }));
  });

  it("should reject ADMIN_API_KEY when it is shorter than the minimum length.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      ADMIN_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH - 1),
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["ADMIN_API_KEY"] }));
  });

  it("should reject GAME_API_KEY when it is shorter than the minimum length.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      GAME_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH - 1),
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["GAME_API_KEY"] }));
  });

  it("should report the equality error on the GAME_API_KEY path when ADMIN_API_KEY equals GAME_API_KEY.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      ADMIN_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
      GAME_API_KEY: "x".repeat(API_KEY_MINIMAL_LENGTH),
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["GAME_API_KEY"],
      message: "ADMIN_API_KEY and GAME_API_KEY must be different",
    }));
  });

  it("should report the missing DSN error on the SENTRY_DSN path when SENTRY_ENVIRONMENT is staging.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      SENTRY_ENVIRONMENT: "staging",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["SENTRY_DSN"],
      message: SENTRY_DSN_REQUIRED_IN_DEPLOYMENT_MESSAGE,
    }));
  });

  it("should report the disabled tracker error on the SENTRY_DISABLED path when SENTRY_ENVIRONMENT is staging.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      SENTRY_DISABLED: "true",
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "staging",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["SENTRY_DISABLED"],
      message: SENTRY_DISABLED_IN_DEPLOYMENT_MESSAGE,
    }));
  });

  it("should report the non-deployment environment error on the SENTRY_ENVIRONMENT path when NODE_ENV is production.", () => {
    process.env.NODE_ENV = "production";
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      SENTRY_DSN: "https://0123456789abcdef0123456789abcdef@sentry.io/42",
      SENTRY_ENVIRONMENT: "development",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({
      path: ["SENTRY_ENVIRONMENT"],
      message: SENTRY_ENVIRONMENT_NOT_DEPLOYMENT_MESSAGE,
    }));
  });

  it("should reject SENTRY_DSN when it is not a Sentry DSN.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      SENTRY_DSN: "not-a-sentry-dsn",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["SENTRY_DSN"] }));
  });

  it("should reject SENTRY_ENVIRONMENT when it is not a supported environment.", () => {
    const result = APP_ENV_SCHEMA.safeParse({
      ...minimalValidEnvInput,
      SENTRY_ENVIRONMENT: "preproduction",
    });

    expect(result.error?.issues).toContainEqual(expect.objectContaining({ path: ["SENTRY_ENVIRONMENT"] }));
  });
});