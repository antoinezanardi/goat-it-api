import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

import { ADMIN_QUESTION_SORTABLE_FIELDS, QUESTION_AUTHOR_ROLES, QUESTION_CATEGORIES, QUESTION_COGNITIVE_DIFFICULTIES, QUESTION_STATUSES } from "@question/domain/constants/question.constants";
import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_STATUS_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import type { AdminFindQuestionsQueryDto } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";

function createFakeAdminFindQuestionsQueryDto(overrides: Partial<AdminFindQuestionsQueryDto> = {}): AdminFindQuestionsQueryDto {
  return {
    [SORT_BY_QUERY_KEY]: faker.helpers.arrayElement(ADMIN_QUESTION_SORTABLE_FIELDS),
    [SORT_ORDER_QUERY_KEY]: faker.helpers.arrayElement(SORT_ORDERS),
    [QUESTION_STATUS_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_STATUSES)),
    [QUESTION_CATEGORY_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_CATEGORIES)),
    [QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_COGNITIVE_DIFFICULTIES)),
    [QUESTION_AUTHOR_ROLE_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_AUTHOR_ROLES)),
    [QUESTION_THEME_IDS_QUERY_KEY]: faker.helpers.maybe(() => [faker.database.mongodbObjectId()]),
    ...overrides,
  };
}

export { createFakeAdminFindQuestionsQueryDto };