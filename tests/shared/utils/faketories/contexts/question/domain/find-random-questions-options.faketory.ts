import { faker } from "@faker-js/faker";

import { LOCALES } from "@shared/domain/value-objects/locale/locale.constants";

import { FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM, FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM } from "@question/application/dto/find-random-questions-body/constants/find-random-questions-body.dto.constants";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/constants/question.constants";
import type { QuestionCategory, QuestionCognitiveDifficulty } from "@question/domain/types/question.value-objects";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";

function createFakeFindRandomQuestionsOptions(overrides: Partial<FindRandomQuestionsOptions> = {}): FindRandomQuestionsOptions {
  return {
    limit: faker.number.int({ min: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM, max: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM }),
    excludedIds: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    categories: faker.helpers.maybe(() => [faker.helpers.arrayElement<QuestionCategory>(QUESTION_CATEGORIES)]),
    cognitiveDifficulties: faker.helpers.maybe(() => [faker.helpers.arrayElement<QuestionCognitiveDifficulty>(QUESTION_COGNITIVE_DIFFICULTIES)]),
    themeIds: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    locale: LOCALES[0],
    ...overrides,
  };
}

export { createFakeFindRandomQuestionsOptions };