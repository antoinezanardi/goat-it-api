const LOCALES = ["en", "fr", "es", "de", "it", "pt"] as const;

const LOCALE_LABELS: Record<typeof LOCALES[number], string> = {
  en: "English",
  fr: "French",
  es: "Spanish",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
} as const;

export {
  LOCALES,
  LOCALE_LABELS,
};