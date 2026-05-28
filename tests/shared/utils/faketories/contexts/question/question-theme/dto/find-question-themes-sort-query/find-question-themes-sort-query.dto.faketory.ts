import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/infrastructure/http/zod/constants/sort-order.constants";

import { QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";
import type { FindQuestionThemesSortQueryDto } from "@question/modules/question-theme/application/dto/find-question-themes-sort-query/find-question-themes-sort-query.dto.shape";

function createFakeFindQuestionThemesSortQueryDto(overrides: Partial<FindQuestionThemesSortQueryDto> = {}): FindQuestionThemesSortQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement([...QUESTION_THEME_SORTABLE_FIELDS]),
    "sort-order": faker.helpers.arrayElement([...SORT_ORDERS]),
    ...overrides,
  };
}

export { createFakeFindQuestionThemesSortQueryDto };