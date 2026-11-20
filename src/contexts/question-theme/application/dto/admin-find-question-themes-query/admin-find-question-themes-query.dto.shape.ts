import { z } from "zod";

import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";
import { zQuestionThemeStatus } from "@question-theme/contracts/dto/zod/validators/question-theme/question-theme.dto.zod.validators";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION, QUESTION_THEME_SORT_ORDER_DEFAULT, QUESTION_THEME_SORT_ORDER_DESCRIPTION } from "@question-theme/application/dto/shared/constants/question-theme-sort.dto.constants";

import { FULLY_TRANSLATED_QUERY_KEY } from "@shared/application/dto/constants/translation-completeness-query.dto.constants";
import { SORT_ORDERS } from "@shared/domain/constants/sort/sort.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import { zIsFullyTranslated } from "@shared/application/dto/zod/validators/translation-completeness/translation-completeness.zod.validators";
import { zLimit } from "@shared/application/dto/zod/validators/limit/limit.zod.validators";

/**
 * Validates an admin theme-list query: sorting, limiting and the status and translation-completeness filters, with the sort-field, sort-order and limit defaults applied.
 */
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
  [LIMIT_QUERY_KEY]: zLimit(),
  status: zQuestionThemeStatus().optional(),
  [FULLY_TRANSLATED_QUERY_KEY]: zIsFullyTranslated(),
});

/**
 * The parsed admin theme-list query consumers receive, with the sort defaults resolved and omitted filters absent.
 */
type AdminFindQuestionThemesQueryDto = z.infer<typeof ADMIN_FIND_QUESTION_THEMES_QUERY_DTO>;

export type { AdminFindQuestionThemesQueryDto };

export { ADMIN_FIND_QUESTION_THEMES_QUERY_DTO };