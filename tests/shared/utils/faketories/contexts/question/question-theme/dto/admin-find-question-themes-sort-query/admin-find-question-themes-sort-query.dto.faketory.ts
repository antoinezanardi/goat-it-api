import { faker } from "@faker-js/faker";

import { SORT_ORDERS } from "@shared/domain/constants/sort-order.constants";

import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";
import type { AdminFindQuestionThemesSortQueryDto } from "@question/modules/question-theme/application/dto/admin-find-question-themes-sort-query/admin-find-question-themes-sort-query.dto.shape";

function createFakeAdminFindQuestionThemesSortQueryDto(overrides: Partial<AdminFindQuestionThemesSortQueryDto> = {}): AdminFindQuestionThemesSortQueryDto {
  return {
    "sort-by": faker.helpers.arrayElement(ADMIN_QUESTION_THEME_SORTABLE_FIELDS),
    "sort-order": faker.helpers.arrayElement(SORT_ORDERS),
    ...overrides,
  };
}

export { createFakeAdminFindQuestionThemesSortQueryDto };