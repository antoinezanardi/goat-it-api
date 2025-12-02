import { faker } from "@faker-js/faker";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import type { LocalizationOptions, LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

function createFakeLocalizationOptions(localizationOptions: Partial<LocalizationOptions> = {}): LocalizationOptions {
  return {
    locale: faker.helpers.arrayElement(LOCALES),
    fallbackLocale: faker.helpers.arrayElement(LOCALES),
    ...localizationOptions,
  };
}

function createFakeLocalizedText(localizedText: Partial<LocalizedText> = {}): LocalizedText {
  return {
    en: faker.word.sample(),
    de: faker.word.sample(),
    es: faker.word.sample(),
    fr: faker.word.sample(),
    it: faker.word.sample(),
    pt: faker.word.sample(),
    ...localizedText,
  };
}

function createFakeLocalizedTexts(localizedTexts: Partial<LocalizedTexts> = {}): LocalizedTexts {
  return {
    en: faker.word.words(3).split(" "),
    de: faker.word.words(3).split(" "),
    es: faker.word.words(3).split(" "),
    fr: faker.word.words(3).split(" "),
    it: faker.word.words(3).split(" "),
    pt: faker.word.words(3).split(" "),
    ...localizedTexts,
  };
}

export {
  createFakeLocalizationOptions,
  createFakeLocalizedText,
  createFakeLocalizedTexts,
};