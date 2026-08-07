import { z } from "zod";

import {
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_DESCRIPTION,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM,
  FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM,
} from "@question/application/dto/find-random-questions-body/constants/find-random-questions-body.dto.constants";
import {
  zQuestionCategoriesFilter,
  zQuestionCognitiveDifficultiesFilter,
  zQuestionExcludedIdsFilter,
  zQuestionThemeIdsFilter,
} from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";

const FIND_RANDOM_QUESTIONS_BODY_DTO = z.object({
  limit: z.number()
    .int()
    .min(FIND_RANDOM_QUESTIONS_BODY_LIMIT_MINIMUM)
    .max(FIND_RANDOM_QUESTIONS_BODY_LIMIT_MAXIMUM)
    .optional()
    .default(FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT)
    .describe(FIND_RANDOM_QUESTIONS_BODY_LIMIT_DESCRIPTION)
    .meta({ example: FIND_RANDOM_QUESTIONS_BODY_LIMIT_DEFAULT }),
  excludedIds: zQuestionExcludedIdsFilter(),
  categories: zQuestionCategoriesFilter(),
  cognitiveDifficulties: zQuestionCognitiveDifficultiesFilter(),
  themeIds: zQuestionThemeIdsFilter(),
});

type FindRandomQuestionsBodyDto = z.infer<typeof FIND_RANDOM_QUESTIONS_BODY_DTO>;

export type { FindRandomQuestionsBodyDto };

export { FIND_RANDOM_QUESTIONS_BODY_DTO };