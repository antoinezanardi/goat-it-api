import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import { createFakeQuestionStats } from "@faketories/contexts/question/domain/question-stats/question-stats.faketory";

function createFakeQuestionStatsDto(overrides: Partial<QuestionStatsDto> = {}): QuestionStatsDto {
  return {
    ...createFakeQuestionStats(),
    ...overrides,
  };
}

export { createFakeQuestionStatsDto };