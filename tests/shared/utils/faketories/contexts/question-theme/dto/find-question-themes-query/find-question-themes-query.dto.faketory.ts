import { faker } from "@faker-js/faker";

import { QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";

import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { LIMIT_DEFAULT, LIMIT_MINIMUM } from "@shared/infrastructure/http/zod/validators/limit/constants/limit.zod.validators.constants";

import type { FindQuestionThemesQueryDto } from "@question-theme/application/dto/find-question-themes-query/find-question-themes-query.dto.shape";

function createFakeFindQuestionThemesQueryDto(overrides: Partial<FindQuestionThemesQueryDto> = {}): FindQuestionThemesQueryDto {
  return {
    [SORT_BY_QUERY_KEY]: faker.helpers.arrayElement(QUESTION_THEME_SORTABLE_FIELDS),
    [SORT_ORDER_QUERY_KEY]: faker.helpers.arrayElement(SORT_ORDERS),
    [LIMIT_QUERY_KEY]: faker.helpers.maybe(() => faker.number.int({ min: LIMIT_MINIMUM })) ?? LIMIT_DEFAULT,
    ...overrides,
  };
}

export { createFakeFindQuestionThemesQueryDto };