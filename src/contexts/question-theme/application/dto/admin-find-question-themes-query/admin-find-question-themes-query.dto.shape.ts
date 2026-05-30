import { z } from "zod";

import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS, QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { QUESTION_THEME_STATUS_QUERY_KEY } from "@question-theme/application/dto/constants/question-theme-filter-query.dto.constants";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_ORDER_DEFAULT, QUESTION_THEME_SORT_ORDER_DESCRIPTION } from "@question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

const ADMIN_FIND_QUESTION_THEMES_QUERY_DTO = z.object({
  [SORT_BY_QUERY_KEY]: z.enum(ADMIN_QUESTION_THEME_SORTABLE_FIELDS)
    .default(QUESTION_THEME_SORT_BY_DEFAULT)
    .describe(QUESTION_THEME_SORT_BY_DESCRIPTION)
    .meta({ example: QUESTION_THEME_SORT_BY_DEFAULT }),
  [SORT_ORDER_QUERY_KEY]: z.enum(SORT_ORDERS)
    .default(QUESTION_THEME_SORT_ORDER_DEFAULT)
    .describe(QUESTION_THEME_SORT_ORDER_DESCRIPTION)
    .meta({ example: QUESTION_THEME_SORT_ORDER_DEFAULT }),
  [QUESTION_THEME_STATUS_QUERY_KEY]: z.enum(QUESTION_THEME_STATUSES)
    .optional()
    .describe("Question theme's status"),
});

type AdminFindQuestionThemesQueryDto = z.infer<typeof ADMIN_FIND_QUESTION_THEMES_QUERY_DTO>;

export type { AdminFindQuestionThemesQueryDto };

export { ADMIN_FIND_QUESTION_THEMES_QUERY_DTO };