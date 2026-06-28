import { z } from "zod";

import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { zSortOrder } from "@shared/infrastructure/http/zod/validators/sort/sort.zod.validators";

import { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_STATUS_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/zod/validators/constants/question-sort.dto.zod.validators.constants";
import { zQuestionAuthorRole, zQuestionCategory, zQuestionCognitiveDifficulty, zQuestionStatus, zQuestionThemeIdsFilter } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";

const ADMIN_FIND_QUESTIONS_QUERY_DTO = z.object({
  [SORT_BY_QUERY_KEY]: z.enum(ADMIN_QUESTION_SORTABLE_FIELDS)
    .optional()
    .default(QUESTION_SORT_BY_DEFAULT)
    .describe(QUESTION_SORT_BY_DESCRIPTION)
    .meta({ example: QUESTION_SORT_BY_DEFAULT }),
  [SORT_ORDER_QUERY_KEY]: zSortOrder(),
  [QUESTION_STATUS_QUERY_KEY]: zQuestionStatus().optional(),
  [QUESTION_CATEGORY_QUERY_KEY]: zQuestionCategory().optional(),
  [QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY]: zQuestionCognitiveDifficulty().optional(),
  [QUESTION_AUTHOR_ROLE_QUERY_KEY]: zQuestionAuthorRole().optional(),
  [QUESTION_THEME_IDS_QUERY_KEY]: zQuestionThemeIdsFilter(),
});

type AdminFindQuestionsQueryDto = z.infer<typeof ADMIN_FIND_QUESTIONS_QUERY_DTO>;

export type { AdminFindQuestionsQueryDto };

export { ADMIN_FIND_QUESTIONS_QUERY_DTO };