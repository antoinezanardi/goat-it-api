import { z } from "zod";

import { API_KEY_HMAC_SECRET_MINIMAL_LENGTH, API_KEY_MINIMAL_LENGTH } from "@src/infrastructure/api/auth/constants/auth.constants";
import { validateCorsOrigin } from "@src/infrastructure/api/config/helpers/env.helpers";
import { DEFAULT_ENV_SERVER_HOST, DEFAULT_ENV_SERVER_PORT, DEFAULT_ENV_CORS_ORIGIN, DEFAULT_ENV_MONGODB_DATABASE, DEFAULT_ENV_MONGODB_HOST, DEFAULT_ENV_MONGODB_PORT, MIN_PORT_NUMBER, MAX_PORT_NUMBER, MONGODB_DATABASE_REGEX, DEFAULT_ENV_FALLBACK_LOCALE } from "@src/infrastructure/api/config/types/env.constants";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

const APP_ENV_SCHEMA = z.object({
  SERVER_HOST: z.hostname()
    .default(DEFAULT_ENV_SERVER_HOST),
  SERVER_PORT: z.coerce.number()
    .min(MIN_PORT_NUMBER)
    .max(MAX_PORT_NUMBER)
    .default(DEFAULT_ENV_SERVER_PORT),
  CORS_ORIGIN: z.stringFormat("cors", validateCorsOrigin)
    .default(DEFAULT_ENV_CORS_ORIGIN),
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
  API_KEY_HMAC_SECRET: z.string()
    .min(API_KEY_HMAC_SECRET_MINIMAL_LENGTH, `API_KEY_HMAC_SECRET must be set and at least ${API_KEY_HMAC_SECRET_MINIMAL_LENGTH} characters long`),
  ADMIN_API_KEY: z.string()
    .min(API_KEY_MINIMAL_LENGTH, `ADMIN_API_KEY must be set and at least ${API_KEY_MINIMAL_LENGTH} characters long`),
  GAME_API_KEY: z.string()
    .min(API_KEY_MINIMAL_LENGTH, `GAME_API_KEY must be set and at least ${API_KEY_MINIMAL_LENGTH} characters long`),
});

export { APP_ENV_SCHEMA };