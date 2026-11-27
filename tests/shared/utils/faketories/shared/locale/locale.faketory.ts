import { faker } from "@faker-js/faker";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { Locale, LocalizationOptions, LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

function createFakeLocalizationOptions(localizationOptions: Partial<LocalizationOptions> = {}): LocalizationOptions {
  return {
    locale: faker.helpers.arrayElement(LOCALES),
    fallbackLocale: faker.helpers.arrayElement(LOCALES),
    ...localizationOptions,
  };
}

function createFakeLocalizedValues<TValue>(createValue: () => TValue): Record<Locale, TValue> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  const values = Object.fromEntries(LOCALES.map(locale => [locale, createValue()])) as Record<Locale, TValue>;

  return values;
}

function createFakeLocalizedText(localizedText: Partial<LocalizedText> = {}): LocalizedText {
  return {
    ...createFakeLocalizedValues(() => faker.word.sample()),
    ...localizedText,
  };
}

function createFakeLocalizedTexts(localizedTexts: Partial<LocalizedTexts> = {}): LocalizedTexts {
  return {
    ...createFakeLocalizedValues(() => faker.word.words(3).split(" ")),
    ...localizedTexts,
  };
}

export {
  createFakeLocalizationOptions,
  createFakeLocalizedText,
  createFakeLocalizedTexts,
};