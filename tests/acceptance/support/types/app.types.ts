import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

type AppFetchOptions = {
  locale?: Locale | "*";
  apiKey?: string;
  method?: "GET" | "HEAD" | "POST" | "PATCH" | "DELETE";
  body?: Record<string, unknown>;
  query?: Record<string, string | string[]>;
};

export type { AppFetchOptions };