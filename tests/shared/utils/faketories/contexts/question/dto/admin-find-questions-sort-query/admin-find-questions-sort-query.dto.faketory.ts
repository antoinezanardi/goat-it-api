import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/infrastructure/http/zod/constants/sort-order.constants";

import { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";
import type { AdminFindQuestionsSortQueryDto } from "@question/application/dto/admin-find-questions-sort-query/admin-find-questions-sort-query.dto.shape";

function createFakeAdminFindQuestionsSortQueryDto(overrides: Partial<AdminFindQuestionsSortQueryDto> = {}): AdminFindQuestionsSortQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement([...ADMIN_QUESTION_SORTABLE_FIELDS]),
    "sort-order": faker.helpers.arrayElement([...SORT_ORDERS]),
    ...overrides,
  };
}

export { createFakeAdminFindQuestionsSortQueryDto };