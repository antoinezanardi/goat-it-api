import { faker } from "@faker-js/faker";

import { QUESTION_CATEGORIES } from "@question/domain/value-objects/question-category/question-category.constants";
import { QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/value-objects/question-cognitive-difficulty/question-cognitive-difficulty.constants";
import type { QuestionContentModificationDto } from "@question/application/dto/question-modification/question-content-modification/question-content-modification.dto.shape";
import type { QuestionModificationDto } from "@question/application/dto/question-modification/question-modification.dto.shape";

import { createFakeLocalizedText, createFakeLocalizedTexts } from "@faketories/shared/locale/locale.faketory";

function createFakeQuestionContentModificationDto(overrides: Partial<QuestionContentModificationDto> = {}): QuestionContentModificationDto {
  return {
    statement: faker.helpers.maybe(createFakeLocalizedText),
    answer: faker.helpers.maybe(createFakeLocalizedText),
    context: faker.helpers.maybe(createFakeLocalizedText),
    trivia: faker.helpers.maybe(createFakeLocalizedTexts),
    ...overrides,
  };
}

function createFakeQuestionModificationDto(overrides: Partial<QuestionModificationDto> = {}): QuestionModificationDto {
  return {
    category: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_CATEGORIES)),
    cognitiveDifficulty: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES)),
    sourceUrls: faker.helpers.maybe(() => [faker.internet.url(), faker.internet.url()]),
    content: faker.helpers.maybe(createFakeQuestionContentModificationDto),
    ...overrides,
  };
}

export {
  createFakeQuestionContentModificationDto,
  createFakeQuestionModificationDto,
};