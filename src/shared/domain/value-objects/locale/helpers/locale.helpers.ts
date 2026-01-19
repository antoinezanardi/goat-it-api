import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function isValidLocale(locale: string): locale is Locale {
  const localeSet: Set<string> = new Set(LOCALES);

  return localeSet.has(locale);
}

export {
  isValidLocale,
};