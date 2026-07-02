import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import { LIMIT_MINIMUM } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";

import { QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import type { FindQuestionsQueryDto } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";

function createFakeFindQuestionsQueryDto(overrides: Partial<FindQuestionsQueryDto> = {}): FindQuestionsQueryDto {
  return {
    [SORT_BY_QUERY_KEY]: faker.helpers.arrayElement(QUESTION_SORTABLE_FIELDS),
    [SORT_ORDER_QUERY_KEY]: faker.helpers.arrayElement(SORT_ORDERS),
    [LIMIT_QUERY_KEY]: faker.number.int({ min: LIMIT_MINIMUM }),
    [QUESTION_CATEGORY_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_CATEGORIES)),
    [QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES)),
    [QUESTION_AUTHOR_ROLE_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES)),
    [QUESTION_THEME_IDS_QUERY_KEY]: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    ...overrides,
  };
}

export { createFakeFindQuestionsQueryDto };