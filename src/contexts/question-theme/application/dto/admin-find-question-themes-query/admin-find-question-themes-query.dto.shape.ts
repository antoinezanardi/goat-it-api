import { z } from "zod";

import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";
import { zQuestionThemeStatus } from "@question-theme/application/dto/zod/validators/question-theme.dto.zod.validators";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_ORDER_DEFAULT, QUESTION_THEME_SORT_ORDER_DESCRIPTION } from "@question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";

import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";

const ADMIN_FIND_QUESTION_THEMES_QUERY_DTO = z.object({
  [SORT_BY_QUERY_KEY]: z.enum(ADMIN_QUESTION_THEME_SORTABLE_FIELDS)
    .optional()
    .default(QUESTION_THEME_SORT_BY_DEFAULT)
    .describe(QUESTION_THEME_SORT_BY_DESCRIPTION)
    .meta({ example: QUESTION_THEME_SORT_BY_DEFAULT }),
  [SORT_ORDER_QUERY_KEY]: z.enum(SORT_ORDERS)
    .optional()
    .default(QUESTION_THEME_SORT_ORDER_DEFAULT)
    .describe(QUESTION_THEME_SORT_ORDER_DESCRIPTION)
    .meta({ example: QUESTION_THEME_SORT_ORDER_DEFAULT }),
  status: zQuestionThemeStatus().optional(),
});

type AdminFindQuestionThemesQueryDto = z.infer<typeof ADMIN_FIND_QUESTION_THEMES_QUERY_DTO>;

export type { AdminFindQuestionThemesQueryDto };

export { ADMIN_FIND_QUESTION_THEMES_QUERY_DTO };