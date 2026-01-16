import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

function isValidLocale(locale: string): locale is Locale {
  // This is acceptable because we are checking the value against a known list of valid locales
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return LOCALES.includes(locale as Locale);
}

export {
  isValidLocale,
};