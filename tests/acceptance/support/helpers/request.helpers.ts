import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";

import type { FetchOptions } from "ofetch";

import type { AppFetchOptions } from "@acceptance-support/types/app.types";

function createFetchHeaders(options: AppFetchOptions): Record<string, string> {
  const { locale = "*", apiKey, contentType, origin, accessControlRequestMethod, accessControlRequestHeaders, extraHeaders } = options;
  const headers: Record<string, string> = {
    "Accept-Language": locale,
  };

  if (contentType !== undefined) {
    headers["Content-Type"] = contentType;
  }

  if (apiKey !== undefined) {
    headers[API_KEY_HEADER] = apiKey;
  }

  if (origin !== undefined) {
    headers.Origin = origin;
  }

  if (accessControlRequestMethod !== undefined) {
    headers["Access-Control-Request-Method"] = accessControlRequestMethod;
  }

  if (accessControlRequestHeaders !== undefined) {
    headers["Access-Control-Request-Headers"] = accessControlRequestHeaders;
  }
  return { ...headers, ...extraHeaders };
}

function createFetchOptions(options: AppFetchOptions = {}): FetchOptions {
  return {
    headers: createFetchHeaders(options),
    method: options.method,
    body: options.rawBody ?? (options.body ? JSON.stringify(options.body) : undefined),
    query: options.query,
    retry: options.retry ?? (options.method === "OPTIONS" ? 0 : undefined),
  };
}

export { createFetchOptions };