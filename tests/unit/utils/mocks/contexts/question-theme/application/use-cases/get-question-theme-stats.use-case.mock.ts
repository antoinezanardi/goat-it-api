import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";
import type { Mock } from "vitest";

type GetQuestionThemeStatsStub = {
  getStats: () => Promise<QuestionThemeStatsDto>;
};

type MockedGetQuestionThemeStatsUseCase = { [K in keyof GetQuestionThemeStatsStub]: Mock<GetQuestionThemeStatsStub[K]> };

function createMockedGetQuestionThemeStatsUseCase(overrides: Partial<MockedGetQuestionThemeStatsUseCase> = {}): MockedGetQuestionThemeStatsUseCase {
  return {
    getStats: vi.fn<GetQuestionThemeStatsStub["getStats"]>().mockResolvedValue({
      total: 0,
      byStatus: { active: 0, archived: 0 },
      byQuestionCount: [],
    }),
    ...overrides,
  };
}

export { createMockedGetQuestionThemeStatsUseCase };