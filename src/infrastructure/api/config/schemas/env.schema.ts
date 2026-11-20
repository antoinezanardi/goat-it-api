import { z } from "zod";

import { API_KEY_HMAC_SECRET_MINIMAL_LENGTH, API_KEY_MINIMAL_LENGTH } from "@src/infrastructure/api/auth/constants/auth.constants";
import { isCorsOriginValid } from "@src/infrastructure/api/config/validators/cors.validator";
import { isSentryDsnValid } from "@src/infrastructure/api/config/validators/sentry-dsn.validator";
import { DEFAULT_ENV_SERVER_HOST, DEFAULT_ENV_SERVER_PORT, DEFAULT_ENV_CORS_ORIGIN, DEFAULT_ENV_MONGODB_DATABASE, DEFAULT_ENV_MONGODB_HOST, DEFAULT_ENV_MONGODB_PORT, MIN_PORT_NUMBER, MAX_PORT_NUMBER, MONGODB_DATABASE_REGEX, DEFAULT_ENV_FALLBACK_LOCALE, DEFAULT_ENV_THROTTLER_DEFAULT_TTL_SECONDS, DEFAULT_ENV_THROTTLER_DEFAULT_LIMIT, DEFAULT_ENV_THROTTLER_SUSTAINED_TTL_SECONDS, DEFAULT_ENV_THROTTLER_SUSTAINED_LIMIT, MIN_THROTTLER_VALUE, IS_PROXY_TRUSTED_DEFAULT_ENV, SENTRY_ENVIRONMENTS, DEFAULT_ENV_SENTRY_DSN, DEFAULT_ENV_SENTRY_ENVIRONMENT } from "@src/infrastructure/api/config/constants/env.constants";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

const APP_ENV_SCHEMA = z.object({
  SERVER_HOST: z.hostname()
    .default(DEFAULT_ENV_SERVER_HOST),
  SERVER_PORT: z.coerce.number()
    .min(MIN_PORT_NUMBER)
    .max(MAX_PORT_NUMBER)
    .default(DEFAULT_ENV_SERVER_PORT),
  CORS_ORIGIN: z.stringFormat("cors", isCorsOriginValid)
    .default(DEFAULT_ENV_CORS_ORIGIN),
  TRUST_PROXY: z.union([z.literal(""), z.ipv4(), z.cidrv4(), z.ipv6(), z.cidrv6()], { error: "TRUST_PROXY must be empty or a single IP address or CIDR block" })
    .transform(trustProxy => (trustProxy === "" ? false : trustProxy))
    .default(IS_PROXY_TRUSTED_DEFAULT_ENV),
  MONGODB_HOST: z.hostname()
    .default(DEFAULT_ENV_MONGODB_HOST),
  MONGODB_PORT: z.coerce.number()
    .min(MIN_PORT_NUMBER)
    .max(MAX_PORT_NUMBER)
    .default(DEFAULT_ENV_MONGODB_PORT),
  MONGODB_DATABASE: z.string()
    .regex(MONGODB_DATABASE_REGEX)
    .default(DEFAULT_ENV_MONGODB_DATABASE),
  FALLBACK_LOCALE: z.enum(LOCALES)
    .default(DEFAULT_ENV_FALLBACK_LOCALE),
  THROTTLER_DEFAULT_TTL_SECONDS: z.coerce.number()
    .int()
    .min(MIN_THROTTLER_VALUE)
    .default(DEFAULT_ENV_THROTTLER_DEFAULT_TTL_SECONDS),
  THROTTLER_DEFAULT_LIMIT: z.coerce.number()
    .int()
    .min(MIN_THROTTLER_VALUE)
    .default(DEFAULT_ENV_THROTTLER_DEFAULT_LIMIT),
  THROTTLER_SUSTAINED_TTL_SECONDS: z.coerce.number()
    .int()
    .min(MIN_THROTTLER_VALUE)
    .default(DEFAULT_ENV_THROTTLER_SUSTAINED_TTL_SECONDS),
  THROTTLER_SUSTAINED_LIMIT: z.coerce.number()
    .int()
    .min(MIN_THROTTLER_VALUE)
    .default(DEFAULT_ENV_THROTTLER_SUSTAINED_LIMIT),
  SENTRY_DSN: z.union([z.literal(DEFAULT_ENV_SENTRY_DSN), z.stringFormat("sentry-dsn", isSentryDsnValid)])
    .default(DEFAULT_ENV_SENTRY_DSN),
  SENTRY_ENVIRONMENT: z.enum(SENTRY_ENVIRONMENTS)
    .default(DEFAULT_ENV_SENTRY_ENVIRONMENT),
  API_KEY_HMAC_SECRET: z.string()
    .min(API_KEY_HMAC_SECRET_MINIMAL_LENGTH, `API_KEY_HMAC_SECRET must be set and at least ${API_KEY_HMAC_SECRET_MINIMAL_LENGTH} characters long`),
  ADMIN_API_KEY: z.string()
    .min(API_KEY_MINIMAL_LENGTH, `ADMIN_API_KEY must be set and at least ${API_KEY_MINIMAL_LENGTH} characters long`),
  GAME_API_KEY: z.string()
    .min(API_KEY_MINIMAL_LENGTH, `GAME_API_KEY must be set and at least ${API_KEY_MINIMAL_LENGTH} characters long`),
})
  .refine(
    env => env.ADMIN_API_KEY !== env.GAME_API_KEY,
    {
      error: "ADMIN_API_KEY and GAME_API_KEY must be different",
      path: ["GAME_API_KEY"],
    },
  );

export { APP_ENV_SCHEMA };