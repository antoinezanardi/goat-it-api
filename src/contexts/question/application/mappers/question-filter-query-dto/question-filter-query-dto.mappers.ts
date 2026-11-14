import { pickDefinedValues } from "@shared/domain/rules/object/object.rules";
import { FULLY_TRANSLATED_QUERY_KEY } from "@shared/application/dto/constants/translation-completeness-query.dto.constants";

import { QUESTION_AUTHOR_ROLE_QUERY_KEY, QUESTION_CATEGORY_QUERY_KEY, QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY, QUESTION_IDS_QUERY_KEY, QUESTION_IS_ADULT_CONTENT_QUERY_KEY, QUESTION_STATUS_QUERY_KEY, QUESTION_THEME_IDS_QUERY_KEY } from "@question/application/dto/shared/constants/question-filter-query.dto.constants";
import type { AdminFindQuestionsQueryDto } from "@question/application/dto/admin-find-questions-query/admin-find-questions-query.dto.shape";
import type { FindQuestionsQueryDto } from "@question/application/dto/find-questions-query/find-questions-query.dto.shape";

import type { Locale } from "@shared/domain/value-objects/locale/locale.types";
import type { PublicQuestionFilterOptions, QuestionFilterOptions } from "@question/domain/types/question.types";

/**
 * Maps an admin question-list query DTO to the full repository filter options, dropping filters the client did not send.
 *
 * Returns `undefined` when no filter remains, which the repository reads as "match every question".
 */
function createQuestionFilterOptionsFromQueryDto(dto: AdminFindQuestionsQueryDto): Partial<QuestionFilterOptions> | undefined {
  return pickDefinedValues({
    status: dto[QUESTION_STATUS_QUERY_KEY],
    category: dto[QUESTION_CATEGORY_QUERY_KEY],
    cognitiveDifficulty: dto[QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY],
    authorRole: dto[QUESTION_AUTHOR_ROLE_QUERY_KEY],
    themeIds: dto[QUESTION_THEME_IDS_QUERY_KEY],
    ids: dto[QUESTION_IDS_QUERY_KEY],
    isAdultContent: dto[QUESTION_IS_ADULT_CONTENT_QUERY_KEY],
    isFullyTranslated: dto[FULLY_TRANSLATED_QUERY_KEY],
  });
}

/**
 * Maps a public question-list query DTO to the public filter options, adding the resolved `locale` used to keep only localized questions.
 */
function createPublicQuestionFilterOptionsFromQueryDto(dto: FindQuestionsQueryDto, locale: Locale): Partial<PublicQuestionFilterOptions> | undefined {
  return pickDefinedValues({
    category: dto[QUESTION_CATEGORY_QUERY_KEY],
    cognitiveDifficulty: dto[QUESTION_COGNITIVE_DIFFICULTY_QUERY_KEY],
    authorRole: dto[QUESTION_AUTHOR_ROLE_QUERY_KEY],
    themeIds: dto[QUESTION_THEME_IDS_QUERY_KEY],
    ids: dto[QUESTION_IDS_QUERY_KEY],
    isAdultContent: dto[QUESTION_IS_ADULT_CONTENT_QUERY_KEY],
    locale,
  });
}

export { createQuestionFilterOptionsFromQueryDto, createPublicQuestionFilterOptionsFromQueryDto };