import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";

import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_STATUS_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import type { AdminFindQuestionsQueryDto } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";
import type { FindQuestionsQueryDto } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";

import type { PublicQuestionFilterOptions, QuestionFilterOptions } from "@question/domain/types/question.types";

function createQuestionFilterOptionsFromQueryDto(dto: AdminFindQuestionsQueryDto): Partial<QuestionFilterOptions> | undefined {
  return pickDefinedValues({
    status: dto[QUESTION_STATUS_QUERY_KEY],
    category: dto[QUESTION_CATEGORY_QUERY_KEY],
    cognitiveDifficulty: dto[QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY],
    authorRole: dto[QUESTION_AUTHOR_ROLE_QUERY_KEY],
    themeIds: dto[QUESTION_THEME_IDS_QUERY_KEY],
  });
}

function createPublicQuestionFilterOptionsFromQueryDto(dto: FindQuestionsQueryDto): Partial<PublicQuestionFilterOptions> | undefined {
  return pickDefinedValues({
    category: dto[QUESTION_CATEGORY_QUERY_KEY],
    cognitiveDifficulty: dto[QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY],
    authorRole: dto[QUESTION_AUTHOR_ROLE_QUERY_KEY],
    themeIds: dto[QUESTION_THEME_IDS_QUERY_KEY],
  });
}

export { createQuestionFilterOptionsFromQueryDto, createPublicQuestionFilterOptionsFromQueryDto };