import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

type AppFetchOptions = {
  locale?: Locale | "*";
  apiKey?: string;
  method?: "GET" | "HEAD" | "POST" | "PATCH" | "DELETE" | "OPTIONS";
  body?: Record<string, unknown>;
  rawBody?: string;
  contentType?: string;
  query?: Record<string, string | string[]>;
  origin?: string;
  accessControlRequestMethod?: string;
  accessControlRequestHeaders?: string;
  retry?: number | false;
};

export type { AppFetchOptions };