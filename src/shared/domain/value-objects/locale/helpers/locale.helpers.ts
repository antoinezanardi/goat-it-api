import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

/**
 * Narrows a raw string to a supported locale.
 *
 * The match is exact and case-sensitive: `"EN"`, `"en-US"` and an empty string are rejected, because only the `LOCALES` values are accepted.
 */
function isValidLocale(locale: string): locale is Locale {
  const localeSet: Set<string> = new Set(LOCALES);

  return localeSet.has(locale);
}

export {
  isValidLocale,
};