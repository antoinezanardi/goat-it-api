import type { createApiKeyValidator } from "@src/infrastructure/api/auth/helpers/auth.helpers";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

type ServerConfigFromEnv = {
  host: string;
  port: number;
};

type CorsConfigFromEnv = {
  origin: string;
};

type MongoDatabaseConfigFromEnv = {
  host: string;
  port: number;
  database: string;
};

type LocalizationConfigFromEnv = {
  fallbackLocale: Locale;
};

type AuthenticationConfigFromEnv = {
  admin: {
    apiKeyValidator: ReturnType<typeof createApiKeyValidator>;
  };
  game: {
    apiKeyValidator: ReturnType<typeof createApiKeyValidator>;
  };
};

export type {
  ServerConfigFromEnv,
  CorsConfigFromEnv,
  MongoDatabaseConfigFromEnv,
  LocalizationConfigFromEnv,
  AuthenticationConfigFromEnv,
};