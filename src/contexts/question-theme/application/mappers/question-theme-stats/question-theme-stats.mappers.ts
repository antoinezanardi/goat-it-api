import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";

import { createStatsZeroFilledRecord } from "@shared/application/mappers/stats/stats.helpers";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import type { QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";

function createQuestionThemeStatsDtoFromStats(stats: QuestionThemeStats): QuestionThemeStatsDto {
  return {
    total: stats.total,
    byStatus: createStatsZeroFilledRecord(QUESTION_THEME_STATUSES, stats.byStatus),
    byQuestionCount: stats.byQuestionCount,
  };
}

export { createQuestionThemeStatsDtoFromStats };