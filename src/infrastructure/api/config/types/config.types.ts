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

export type {
  ServerConfigFromEnv,
  CorsConfigFromEnv,
  MongoDatabaseConfigFromEnv,
  LocalizationConfigFromEnv,
};