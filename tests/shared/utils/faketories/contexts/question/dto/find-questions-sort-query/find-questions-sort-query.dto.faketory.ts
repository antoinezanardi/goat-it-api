import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/infrastructure/http/zod/constants/sort-order.constants";

import { QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";
import type { FindQuestionsSortQueryDto } from "@question/application/dto/find-questions-sort-query/find-questions-sort-query.dto.shape";

function createFakeFindQuestionsSortQueryDto(overrides: Partial<FindQuestionsSortQueryDto> = {}): FindQuestionsSortQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement([...QUESTION_SORTABLE_FIELDS]),
    "sort-order": faker.helpers.arrayElement([...SORT_ORDERS]),
    ...overrides,
  };
}

export { createFakeFindQuestionsSortQueryDto };