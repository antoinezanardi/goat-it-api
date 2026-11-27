import { API_KEY_HEADER } from "@src/infrastructure/api/auth/constants/auth.constants";

import type { FetchOptions } from "ofetch";
import type { AppFetchOptions } from "@acceptance-support/types/app.types";

function createFetchHeaders(options: AppFetchOptions): Record<string, string> {
  const { locale = "*", apiKey, contentType, origin, accessControlRequestMethod, accessControlRequestHeaders, extraHeaders = {} } = options;
  const headers: Map<string, string> = new Map([["accept-language", locale]]);

  function setHeader(headerName: string, headerValue: string): void {
    headers.set(headerName.toLowerCase(), headerValue);
  }

  if (contentType !== undefined) {
    setHeader("Content-Type", contentType);
  }

  if (apiKey !== undefined) {
    setHeader(API_KEY_HEADER, apiKey);
  }

  if (origin !== undefined) {
    setHeader("Origin", origin);
  }

  if (accessControlRequestMethod !== undefined) {
    setHeader("Access-Control-Request-Method", accessControlRequestMethod);
  }

  if (accessControlRequestHeaders !== undefined) {
    setHeader("Access-Control-Request-Headers", accessControlRequestHeaders);
  }

  for (const [headerName, headerValue] of Object.entries(extraHeaders)) {
    setHeader(headerName, headerValue);
  }
  return Object.fromEntries(headers);
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