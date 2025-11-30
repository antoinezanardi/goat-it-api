import type { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { TupleToUnion } from "type-fest";

type Locale = TupleToUnion<typeof LOCALES>;

type LocalizationOptions = {
  locale: Locale;
  fallbackLocale: Locale;
};

type LocalizedText = Record<Locale, string>;

type LocalizedTexts = Record<Locale, string[]>;

export type {
  Locale,
  LocalizationOptions,
  LocalizedText,
  LocalizedTexts,
};