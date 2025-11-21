import { faker } from "@faker-js/faker";

import type { LocalizedText, LocalizedTexts } from "@shared/domain/value-objects/locale/locale.types";

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
  createFakeLocalizedText,
  createFakeLocalizedTexts,
};