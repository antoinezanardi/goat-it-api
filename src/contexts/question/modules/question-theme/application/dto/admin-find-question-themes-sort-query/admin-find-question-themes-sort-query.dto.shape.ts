import { z } from "zod";

import { zSortOrder } from "@shared/infrastructure/http/zod/validators/sort/sort.zod.validators";

import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question/modules/question-theme/domain/constants/question-theme-sortable-fields.constants";
import { QUESTION_THEME_SORT_BY_DEFAULT, QUESTION_THEME_SORT_BY_DESCRIPTION } from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme-sort.dto.zod.validators.constants";

const ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO = z.object({
  "sort-by": z.enum(ADMIN_QUESTION_THEME_SORTABLE_FIELDS)
    .default(QUESTION_THEME_SORT_BY_DEFAULT)
    .describe(QUESTION_THEME_SORT_BY_DESCRIPTION),
  "sort-order": zSortOrder(),
});

type AdminFindQuestionThemesSortQueryDto = z.infer<typeof ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO>;

export type { AdminFindQuestionThemesSortQueryDto };

export { ADMIN_FIND_QUESTION_THEMES_SORT_QUERY_DTO };