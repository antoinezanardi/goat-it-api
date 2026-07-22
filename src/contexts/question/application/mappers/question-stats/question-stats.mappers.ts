import { createZeroFilledRecord } from "@shared/application/mappers/stats/stats.helpers";

import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import type { QuestionStats } from "@question/domain/types/question.types";

function createQuestionStatsDtoFromStats(stats: QuestionStats): QuestionStatsDto {
  return {
    total: stats.total,
    byStatus: { ...createZeroFilledRecord(QUESTION_STATUSES), ...stats.byStatus },
    byCategory: { ...createZeroFilledRecord(QUESTION_CATEGORIES), ...stats.byCategory },
    byCognitiveDifficulty: { ...createZeroFilledRecord(QUESTION_COGNITIVE_DIFFICULTIES), ...stats.byCognitiveDifficulty },
    byAuthorRole: { ...createZeroFilledRecord(QUESTION_AUTHOR_ROLES), ...stats.byAuthorRole },
    byRejectionType: { ...createZeroFilledRecord(QUESTION_REJECTION_TYPES), ...stats.byRejectionType },
  };
}

export { createQuestionStatsDtoFromStats };