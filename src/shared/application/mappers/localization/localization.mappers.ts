import type { Locale, LocalizationOptions, LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

/**
 * Builds the warning text returned when neither the requested locale nor the fallback locale has a translation.
 */
function getUnknownLocaleWarningMessage(localizationConfig: LocalizationOptions): string {
  const { locale, fallbackLocale } = localizationConfig;

  return `⚠️ No Translation found for desired locale (${locale}) and fallback locale (${fallbackLocale})`;
}

function pickLocalizedValue<T>(localizedValue: Partial<Record<Locale, T>>, localizationConfig: LocalizationOptions): T | undefined {
  const { locale, fallbackLocale } = localizationConfig;

  return localizedValue[locale] ?? localizedValue[fallbackLocale];
}

/**
 * Maps one localized text to a single string for the requested locale.
 *
 * Falls back to `fallbackLocale`, then to a warning message, so a missing translation never yields an empty string.
 */
function createTranslationFromLocalizedText(localizedText: Partial<LocalizedText>, localizationConfig: LocalizationOptions): string {
  return pickLocalizedValue(localizedText, localizationConfig) ?? getUnknownLocaleWarningMessage(localizationConfig);
}

/**
 * Maps a localized text collection to a string array for the requested locale, falling back to `fallbackLocale` and then to a one-element warning array.
 */
function createTranslationsFromLocalizedTexts(localizedTexts: Partial<LocalizedTexts>, localizationConfig: LocalizationOptions): string[] {
  return pickLocalizedValue(localizedTexts, localizationConfig) ?? [getUnknownLocaleWarningMessage(localizationConfig)];
}

export {
  getUnknownLocaleWarningMessage,
  createTranslationFromLocalizedText,
  createTranslationsFromLocalizedTexts,
};