import { faker } from "@faker-js/faker";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/constants/question.constants";
import type { QuestionContentModificationContract, QuestionModificationContract } from "@question/domain/types/question.contracts";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeQuestionContentModificationContract(overrides: Partial<QuestionContentModificationContract> = {}): QuestionContentModificationContract {
  return {
    statement: faker.helpers.maybe(createFakeLocalizedText),
    answer: faker.helpers.maybe(createFakeLocalizedText),
    context: faker.helpers.maybe(createFakeLocalizedText),
    trivia: faker.helpers.maybe(createFakeLocalizedTexts),
    ...overrides,
  };
}

function createFakeQuestionModificationContract(overrides: Partial<QuestionModificationContract> = {}): QuestionModificationContract {
  return {
    category: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_CATEGORIES)),
    cognitiveDifficulty: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES)),
    sourceUrls: faker.helpers.uniqueArray(() => faker.internet.url(), 2),
    content: faker.helpers.maybe(createFakeQuestionContentModificationContract),
    applicableLocales: faker.helpers.maybe(() => faker.helpers.arrayElements(LOCALES, { min: 1, max: LOCALES.length })),
    ...overrides,
  };
}

export {
  createFakeQuestionContentModificationContract,
  createFakeQuestionModificationContract,
};