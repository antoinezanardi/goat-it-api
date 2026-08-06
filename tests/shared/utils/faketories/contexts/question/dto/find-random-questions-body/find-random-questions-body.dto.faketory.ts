import { faker } from "@faker-js/faker";

import {
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM,
} from "@question/application/dto/find-random-questions-body/constants/find-random-questions-body.dto.constants";
import { QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES } from "@question/domain/constants/question.constants";
import type { FindRandomQuestionsBodyDto } from "@question/application/dto/find-random-questions-body/find-random-questions-body.dto.shape";

function createFakeFindRandomQuestionsBodyDto(overrides: Partial<FindRandomQuestionsBodyDto> = {}): FindRandomQuestionsBodyDto {
  return {
    limit:
      faker.helpers.maybe(() => faker.number.int({ min: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM, max: FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM })) ??
      FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT,
    excludedIds: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    categories: faker.helpers.maybe(() => [faker.helpers.arrayElement(QUESTION_CATEGORIES)]),
    cognitiveDifficulties: faker.helpers.maybe(() => [faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES)]),
    themeIds: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    ...overrides,
  };
}

export { createFakeFindRandomQuestionsBodyDto };