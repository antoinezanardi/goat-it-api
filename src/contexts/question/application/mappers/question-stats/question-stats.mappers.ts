import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import type { QuestionStats } from "@question/domain/types/question.types";

function buildZeroRecord<T extends string>(keys: readonly T[]): Record<T, number> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries(keys.map(key => [key, 0])) as Record<T, number>;
}

function createQuestionStatsDtoFromStats(stats: QuestionStats): QuestionStatsDto {
  return {
    total: stats.total,
    byStatus: { ...buildZeroRecord(QUESTION_STATUSES), ...stats.byStatus },
    byCategory: { ...buildZeroRecord(QUESTION_CATEGORIES), ...stats.byCategory },
    byCognitiveDifficulty: { ...buildZeroRecord(QUESTION_COGNITIVE_DIFFICULTIES), ...stats.byCognitiveDifficulty },
    byAuthorRole: { ...buildZeroRecord(QUESTION_AUTHOR_ROLES), ...stats.byAuthorRole },
    byRejectionType: { ...buildZeroRecord(QUESTION_REJECTION_TYPES), ...stats.byRejectionType },
  };
}

export { createQuestionStatsDtoFromStats };