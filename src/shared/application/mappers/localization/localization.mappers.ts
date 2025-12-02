import type { Locale, LocalizationOptions, LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

function getUnknownLocaleWarningMessage(localizationConfig: LocalizationOptions): string {
  const { locale, fallbackLocale } = localizationConfig;

  return `⚠️ No Translation found for desired locale (${locale}) and fallback locale (${fallbackLocale})`;
}

function pickLocalizedValue<T>(localizedValue: Partial<Record<Locale, T>>, localizationConfig: LocalizationOptions): T | undefined {
  const { locale, fallbackLocale } = localizationConfig;

  return localizedValue[locale] ?? localizedValue[fallbackLocale];
}

function createTranslationFromLocalizedText(localizedText: Partial<LocalizedText>, localizationConfig: LocalizationOptions): string {
  return pickLocalizedValue(localizedText, localizationConfig) ?? getUnknownLocaleWarningMessage(localizationConfig);
}

function createTranslationsFromLocalizedTexts(localizedTexts: Partial<LocalizedTexts>, localizationConfig: LocalizationOptions): string[] {
  return pickLocalizedValue(localizedTexts, localizationConfig) ?? [getUnknownLocaleWarningMessage(localizationConfig)];
}

export {
  getUnknownLocaleWarningMessage,
  createTranslationFromLocalizedText,
  createTranslationsFromLocalizedTexts,
};