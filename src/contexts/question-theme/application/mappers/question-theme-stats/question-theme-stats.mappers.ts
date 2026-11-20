import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";

import { createStatsZeroFilledRecord } from "@shared/application/helpers/stats/stats.helpers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import type { QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";

/**
 * Maps domain theme stats to the HTTP stats DTO, zero-filling every status so a status without matches still appears in the response.
 */
function createQuestionThemeStatsDtoFromStats(stats: QuestionThemeStats): QuestionThemeStatsDto {
  return {
    total: stats.total,
    byStatus: createStatsZeroFilledRecord(QUESTION_THEME_STATUSES, stats.byStatus),
    byQuestionCount: stats.byQuestionCount,
    byTranslationCompleteness: stats.byTranslationCompleteness,
  };
}

export { createQuestionThemeStatsDtoFromStats };