import { z } from "zod";

import { zSortOrder } from "@shared/infrastructure/http/zod/validators/sort/sort.zod.validators";

import { QUESTION_SORTABLE_FIELDS } from "@question/domain/constants/question-sortable-fields.constants";
import { QUESTION_SORT_BY_DEFAULT, QUESTION_SORT_BY_DESCRIPTION } from "@question/application/dto/shared/zod/validators/constants/question-sort.dto.zod.validators.constants";

const FIND_QUESTIONS_SORT_QUERY_DTO = z.object({
  "sort-by": z.enum(QUESTION_SORTABLE_FIELDS)
    .default(QUESTION_SORT_BY_DEFAULT)
    .describe(QUESTION_SORT_BY_DESCRIPTION),
  "sort-order": zSortOrder(),
});

type FindQuestionsSortQueryDto = z.infer<typeof FIND_QUESTIONS_SORT_QUERY_DTO>;

export type { FindQuestionsSortQueryDto };

export { FIND_QUESTIONS_SORT_QUERY_DTO };