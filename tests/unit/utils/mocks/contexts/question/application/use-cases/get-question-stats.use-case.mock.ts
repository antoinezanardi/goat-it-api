import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import type { Mock } from "vitest";

type GetQuestionStatsStub = {
  getStats: () => Promise<QuestionStatsDto>;
};

type MockedGetQuestionStatsUseCase = { [K in keyof GetQuestionStatsStub]: Mock<GetQuestionStatsStub[K]> };

function createMockedGetQuestionStatsUseCase(overrides: Partial<MockedGetQuestionStatsUseCase> = {}): MockedGetQuestionStatsUseCase {
  return {
    getStats: vi.fn<GetQuestionStatsStub["getStats"]>().mockResolvedValue({
      total: 0,
      byStatus: { active: 0, archived: 0, pending: 0, rejected: 0 },
      byCategory: { explanation: 0, lexicon: 0, riddle: 0, trivia: 0 },
      byCognitiveDifficulty: { easy: 0, hard: 0, medium: 0 },
      byAuthorRole: { admin: 0, ai: 0, game: 0 },
      byRejectionType: { "duplicate-question": 0, "inappropriate-content": 0, "incorrect-information": 0, "other": 0, "poor-quality": 0 },
    }),
    ...overrides,
  };
}

export { createMockedGetQuestionStatsUseCase };