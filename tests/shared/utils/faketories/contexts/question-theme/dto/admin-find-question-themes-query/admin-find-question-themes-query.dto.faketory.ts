import { faker } from "@faker-js/faker";

import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS, QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { QUESTION_THEME_STATUS_QUERY_KEY } from "@question-theme/application/dto/constants/question-theme-filter-query.dto.constants";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

import type { AdminFindQuestionThemesQueryDto } from "@question-theme/application/dto/admin-find-question-themes-query/admin-find-question-themes-query.dto.shape";

function createFakeAdminFindQuestionThemesQueryDto(overrides: Partial<AdminFindQuestionThemesQueryDto> = {}): AdminFindQuestionThemesQueryDto {
  return {
    [SORT_BY_QUERY_KEY]: faker.helpers.arrayElement(ADMIN_QUESTION_THEME_SORTABLE_FIELDS),
    [SORT_ORDER_QUERY_KEY]: faker.helpers.arrayElement(SORT_ORDERS),
    [QUESTION_THEME_STATUS_QUERY_KEY]: faker.helpers.maybe(() => faker.helpers.arrayElement(QUESTION_THEME_STATUSES)),
    ...overrides,
  };
}

export { createFakeAdminFindQuestionThemesQueryDto };