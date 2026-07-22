import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import type { QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";

function buildZeroRecord<T extends string>(keys: readonly T[]): Record<T, number> {
  // Acceptable as builder pattern for typed records from const tuple arrays
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  return Object.fromEntries(keys.map(key => [key, 0])) as Record<T, number>;
}

function createQuestionThemeStatsDtoFromStats(stats: QuestionThemeStats): QuestionThemeStatsDto {
  return {
    total: stats.total,
    byStatus: { ...buildZeroRecord(QUESTION_THEME_STATUSES), ...stats.byStatus },
    byQuestionCount: stats.byQuestionCount,
  };
}

export { createQuestionThemeStatsDtoFromStats };