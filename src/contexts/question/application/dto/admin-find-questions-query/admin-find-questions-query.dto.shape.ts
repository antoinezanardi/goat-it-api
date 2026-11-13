import { z } from "zod";

import { FULLY_TRANSLATED_QUERY_KEY } from "@shared/application/dto/constants/translation-completeness-query.dto.constants";
import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { zIsFullyTranslated } from "@shared/application/dto/zod/validators/translation-completeness/translation-completeness.zod.validators";
import { zLimit } from "@shared/application/dto/zod/validators/limit/limit.zod.validators";
import { zSortOrder } from "@shared/application/dto/zod/validators/sort/sort.zod.validators";

import { ADMIN_QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_IDS_QUERY_KEY, QUESTION_IS_ADULT_CONTENT_QUERY_KEY, QUESTION_STATUS_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/constants/question-sort.dto.constants";
import { zQuestionAuthorRole, zQuestionCategory, zQuestionCognitiveDifficulty, zQuestionIdsFilter, zQuestionIsAdultContentFilter, zQuestionStatus, zQuestionThemeIdsFilter } from "@question/application/dto/zod/validators/question.dto.zod.validators";

/**
 * Validates an admin question-list query: sorting, limiting and every supported filter, with the sort-field, sort-order and limit defaults applied.
 */
const ADMIN_FIND_QUESTIONS_QUERY_DTO = z.object({
  [SORT_BY_QUERY_KEY]: z.enum(ADMIN_QUESTION_SORTABLE_FIELDS)
    .optional()
    .default(QUESTION_SORT_BY_DEFAULT)
    .describe(QUESTION_SORT_BY_DESCRIPTION)
    .meta({ example: QUESTION_SORT_BY_DEFAULT }),
  [SORT_ORDER_QUERY_KEY]: zSortOrder(),
  [LIMIT_QUERY_KEY]: zLimit(),
  [QUESTION_STATUS_QUERY_KEY]: zQuestionStatus().optional(),
  [QUESTION_CATEGORY_QUERY_KEY]: zQuestionCategory().optional(),
  [QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY]: zQuestionCognitiveDifficulty().optional(),
  [QUESTION_AUTHOR_ROLE_QUERY_KEY]: zQuestionAuthorRole().optional(),
  [QUESTION_THEME_IDS_QUERY_KEY]: zQuestionThemeIdsFilter(),
  [QUESTION_IDS_QUERY_KEY]: zQuestionIdsFilter(),
  [QUESTION_IS_ADULT_CONTENT_QUERY_KEY]: zQuestionIsAdultContentFilter(),
  [FULLY_TRANSLATED_QUERY_KEY]: zIsFullyTranslated(),
});

/**
 * The parsed admin question-list query consumers receive, with the sort defaults resolved and omitted filters absent.
 */
type AdminFindQuestionsQueryDto = z.infer<typeof ADMIN_FIND_QUESTIONS_QUERY_DTO>;

export type { AdminFindQuestionsQueryDto };

export { ADMIN_FIND_QUESTIONS_QUERY_DTO };