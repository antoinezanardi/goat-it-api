import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

import { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import type { AdminFindQuestionsSortQueryDto } from "@question/application/dto/admin-find-questions-sort-query/admin-find-questions-sort-query.dto.shape";

function createFakeAdminFindQuestionsSortQueryDto(overrides: Partial<AdminFindQuestionsSortQueryDto> = {}): AdminFindQuestionsSortQueryDto {
  return {
    [SORT_BY_QUERY_KEY]: faker.helpers.arrayElement(ADMIN_QUESTION_SORTABLE_FIELDS),
    [SORT_ORDER_QUERY_KEY]: faker.helpers.arrayElement(SORT_ORDERS),
    ...overrides,
  };
}

export { createFakeAdminFindQuestionsSortQueryDto };