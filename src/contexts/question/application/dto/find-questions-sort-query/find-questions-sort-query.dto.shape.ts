import { z } from "zod";

import { SORT_BY_QUERY_KEY, SORT_ORDER_QUERY_KEY } from "@shared/application/dto/constants/sort-query.dto.constants";
import { zSortOrder } from "@shared/infrastructure/http/zod/validators/sort/sort.zod.validators";

import { QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/zod/validators/constants/question-sort.dto.zod.validators.constants";

const FIND_QUESTIONS_SORT_QUERY_DTO = z.object({
  [SORT_BY_QUERY_KEY]: z.enum(QUESTION_SORTABLE_FIELDS)
    .default(QUESTION_SORT_BY_DEFAULT)
    .describe(QUESTION_SORT_BY_DESCRIPTION)
    .meta({ example: QUESTION_SORT_BY_DEFAULT }),
  [SORT_ORDER_QUERY_KEY]: zSortOrder(),
});

type FindQuestionsSortQueryDto = z.infer<typeof FIND_QUESTIONS_SORT_QUERY_DTO>;

export type { FindQuestionsSortQueryDto };

export { FIND_QUESTIONS_SORT_QUERY_DTO };