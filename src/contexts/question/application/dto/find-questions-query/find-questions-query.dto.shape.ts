import { z } from "zod";

import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";
import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { zLimit } from "@shared/application/dto/zod/validators/limit/limit.zod.validators";
import { zSortOrder } from "@shared/application/dto/zod/validators/sort/sort.zod.validators";

import { QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question.constants";
import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_IDS_QUERY_KEY, QUESTION_IS_ADULT_CONTENT_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/constants/question-sort.dto.constants";
import { zQuestionAuthorRole, zQuestionCategory, zQuestionCognitiveDifficulty, zQuestionIdsFilter, zQuestionIsAdultContentFilter, zQuestionThemeIdsFilter } from "@question/application/dto/zod/validators/question.dto.zod.validators";

/**
 * Validates a public question-list query: pagination, sorting and the public filters, with the sort-field, sort-order and limit defaults applied.
 */
const FIND_QUESTIONS_QUERY_DTO = z.object({
  [SORT_BY_QUERY_KEY]: z.enum(QUESTION_SORTABLE_FIELDS)
    .optional()
    .default(QUESTION_SORT_BY_DEFAULT)
    .describe(QUESTION_SORT_BY_DESCRIPTION)
    .meta({ example: QUESTION_SORT_BY_DEFAULT }),
  [SORT_ORDER_QUERY_KEY]: zSortOrder(),
  [LIMIT_QUERY_KEY]: zLimit(),
  [QUESTION_CATEGORY_QUERY_KEY]: zQuestionCategory().optional(),
  [QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY]: zQuestionCognitiveDifficulty().optional(),
  [QUESTION_AUTHOR_ROLE_QUERY_KEY]: zQuestionAuthorRole().optional(),
  [QUESTION_THEME_IDS_QUERY_KEY]: zQuestionThemeIdsFilter(),
  [QUESTION_IDS_QUERY_KEY]: zQuestionIdsFilter(),
  [QUESTION_IS_ADULT_CONTENT_QUERY_KEY]: zQuestionIsAdultContentFilter(),
});

/**
 * The parsed public question-list query consumers receive, with the sort defaults resolved and omitted filters absent.
 */
type FindQuestionsQueryDto = z.infer<typeof FIND_QUESTIONS_QUERY_DTO>;

export type { FindQuestionsQueryDto };

export { FIND_QUESTIONS_QUERY_DTO };