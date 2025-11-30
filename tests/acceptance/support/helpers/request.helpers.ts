import type { FetchOptions } from "ofetch";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function createFetchOptions(locale?: Locale | "*"): FetchOptions {
  return {
    headers: locale ? { "Accept-Language": locale } : {},
  };
}

export { createFetchOptions };