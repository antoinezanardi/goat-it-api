import type { FetchOptions } from "ofetch";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function createFetchOptions(locale?: Locale | "*", options: FetchOptions = {}): FetchOptions {
  return {
    headers: locale ? { "Accept-Language": locale } : {},
    ...options,
  };
}

export { createFetchOptions };