import { createFakeQuestionThemeStats } from "@faketories/contexts/question-theme/domain/question-theme-stats/question-theme-stats.faketory";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

function createFakeQuestionThemeStatsDto(overrides: Partial<QuestionThemeStatsDto> = {}): QuestionThemeStatsDto {
  return {
    ...createFakeQuestionThemeStats(),
    ...overrides,
  };
}

export { createFakeQuestionThemeStatsDto };