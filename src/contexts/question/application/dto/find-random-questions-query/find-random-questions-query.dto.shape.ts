import { z } from "zod";

import { LIMIT_QUERY_KEY } from "@shared/application/dto/constants/limit-query.dto.constants";

import { RANDOM_QUESTIONS_LIMIT_DEFAULT, RANDOM_QUESTIONS_LIMIT_DESCRIPTION, RANDOM_QUESTIONS_LIMIT_MAXIMUM, RANDOM_QUESTIONS_LIMIT_MINIMUM } from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";

const FIND_RANDOM_QUESTIONS_QUERY_DTO = z.object({
  [LIMIT_QUERY_KEY]: z.coerce.number()
    .int()
    .min(RANDOM_QUESTIONS_LIMIT_MINIMUM)
    .max(RANDOM_QUESTIONS_LIMIT_MAXIMUM)
    .optional()
    .default(RANDOM_QUESTIONS_LIMIT_DEFAULT)
    .describe(RANDOM_QUESTIONS_LIMIT_DESCRIPTION)
    .meta({ example: RANDOM_QUESTIONS_LIMIT_DEFAULT }),
});

type FindRandomQuestionsQueryDto = z.infer<typeof FIND_RANDOM_QUESTIONS_QUERY_DTO>;

export type { FindRandomQuestionsQueryDto };

export { FIND_RANDOM_QUESTIONS_QUERY_DTO };