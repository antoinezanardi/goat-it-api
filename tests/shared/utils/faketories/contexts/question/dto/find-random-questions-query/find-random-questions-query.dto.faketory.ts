import { faker } from "@faker-js/faker";

import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";

import { RANDOM_QUESTIONS_LIMIT_DEFAULT, RANDOM_QUESTIONS_LIMIT_MAXIMUM, RANDOM_QUESTIONS_LIMIT_MINIMUM } from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";
import type { FindRandomQuestionsQueryDto } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";

function createFakeFindRandomQuestionsQueryDto(overrides: Partial<FindRandomQuestionsQueryDto> = {}): FindRandomQuestionsQueryDto {
  return {
    [LIMIT_QUERY_KEY]: faker.helpers.maybe(() => faker.number.int({ min: RANDOM_QUESTIONS_LIMIT_MINIMUM, max: RANDOM_QUESTIONS_LIMIT_MAXIMUM })) ?? RANDOM_QUESTIONS_LIMIT_DEFAULT,
    ...overrides,
  };
}

export { createFakeFindRandomQuestionsQueryDto };