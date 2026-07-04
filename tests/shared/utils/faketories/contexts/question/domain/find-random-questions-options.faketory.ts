import { faker } from "@faker-js/faker";

import { RANDOM_QUESTIONS_LIMIT_MAXIMUM, RANDOM_QUESTIONS_LIMIT_MINIMUM } from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/constants/question.constants";
import type { QuestionCategory, QuestionCognitiveDifficulty } from "@question/domain/types/question.value-objects";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";

function createFakeFindRandomQuestionsOptions(overrides: Partial<FindRandomQuestionsOptions> = {}): FindRandomQuestionsOptions {
  return {
    limit: faker.number.int({ min: RANDOM_QUESTIONS_LIMIT_MINIMUM, max: RANDOM_QUESTIONS_LIMIT_MAXIMUM }),
    excludedIds: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    categories: faker.helpers.maybe(() => [faker.helpers.arrayElement<QuestionCategory>(QUESTION_CATEGORIES)]),
    cognitiveDifficulties: faker.helpers.maybe(() => [faker.helpers.arrayElement<QuestionCognitiveDifficulty>(QUESTION_COGNITIVE_DIFFICULTIES)]),
    themeIds: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    ...overrides,
  };
}

export { createFakeFindRandomQuestionsOptions };