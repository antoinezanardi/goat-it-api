import { z } from "zod";

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
  MONGODB_HOST: z.ipv4()
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
});

export { APP_ENV_SCHEMA };