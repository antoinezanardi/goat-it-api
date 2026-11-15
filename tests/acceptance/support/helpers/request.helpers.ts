import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";

import type { FetchOptions } from "ofetch";

import type { AppFetchOptions } from "@acceptance-support/types/app.types";

function createFetchHeaders(options: AppFetchOptions): Record<string, string> {
  const { locale = "*", apiKey, contentType } = options;
  const headers: Record<string, string> = {
    "Accept-Language": locale,
  };

  if (contentType !== undefined) {
    headers["Content-Type"] = contentType;
  }

  if (apiKey !== undefined) {
    headers[API_KEY_HEADER] = apiKey;
  }
  return headers;
}

function createFetchOptions(options: AppFetchOptions = {}): FetchOptions {
  return {
    headers: createFetchHeaders(options),
    method: options.method,
    body: options.rawBody ?? (options.body ? JSON.stringify(options.body) : undefined),
    query: options.query,
  };
}

export { createFetchOptions };