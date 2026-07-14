import {
  RANDOM_QUESTIONS_CATEGORIES_QUERY_KEY,
  RANDOM_QUESTIONS_COGNITIVE_DIFFICULTIES_QUERY_KEY,
  RANDOM_QUESTIONS_EXCLUDED_IDS_QUERY_KEY,
} from "@question/application/dto/find-random-questions-query/constants/find-random-questions-query.dto.constants";
import type { FindRandomQuestionsQueryDto } from "@question/application/dto/find-random-questions-query/find-random-questions-query.dto.shape";
import { QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";

function createFindRandomQuestionsOptionsFromQueryDto(queryDto: FindRandomQuestionsQueryDto): FindRandomQuestionsOptions {
  return {
    limit: queryDto.limit,
    excludedIds: queryDto[RANDOM_QUESTIONS_EXCLUDED_IDS_QUERY_KEY],
    categories: queryDto[RANDOM_QUESTIONS_CATEGORIES_QUERY_KEY],
    cognitiveDifficulties: queryDto[RANDOM_QUESTIONS_COGNITIVE_DIFFICULTIES_QUERY_KEY],
    themeIds: queryDto[QUESTION_THEME_IDS_QUERY_KEY],
  };
}

export { createFindRandomQuestionsOptionsFromQueryDto };