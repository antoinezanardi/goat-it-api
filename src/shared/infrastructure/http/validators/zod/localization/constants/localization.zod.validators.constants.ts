import type { Locale } from "@shared/domain/value-objects/locale/locale.types";

const LOCALIZED_TEXT_ENTRY_MIN_LENGTH = 1;

const LOCALIZED_TEXT_ENTRY_MAX_LENGTH = 500;

const LOCALIZED_TEXTS_MIN_LENGTH = 1;

const LOCALIZED_TEXTS_MAX_LENGTH = 10;

const LOCALE_EXAMPLES: Record<Locale, string> = {
  en: "Example text in English.",
  fr: "Exemple de texte en français.",
  es: "Texto de ejemplo en español.",
  de: "Beispieltext auf Deutsch.",
  it: "Testo di esempio in italiano.",
  pt: "Texto de exemplo em português.",
} as const;

export {
  LOCALIZED_TEXT_ENTRY_MIN_LENGTH,
  LOCALIZED_TEXT_ENTRY_MAX_LENGTH,
  LOCALIZED_TEXTS_MIN_LENGTH,
  LOCALIZED_TEXTS_MAX_LENGTH,
  LOCALE_EXAMPLES,
};