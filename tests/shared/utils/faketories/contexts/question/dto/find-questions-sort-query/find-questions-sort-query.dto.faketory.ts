import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

import { QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";
import type { FindQuestionsSortQueryDto } from "@question/application/dto/find-questions-sort-query/find-questions-sort-query.dto.shape";

function createFakeFindQuestionsSortQueryDto(overrides: Partial<FindQuestionsSortQueryDto> = {}): FindQuestionsSortQueryDto {
  return {
    [SORT_BY_QUERY_KEY]: faker.helpers.arrayElement(QUESTION_SORTABLE_FIELDS),
    [SORT_ORDER_QUERY_KEY]: faker.helpers.arrayElement(SORT_ORDERS),
    ...overrides,
  };
}

export { createFakeFindQuestionsSortQueryDto };