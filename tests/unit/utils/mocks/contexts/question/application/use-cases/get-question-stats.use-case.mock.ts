import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import { createFakeQuestionStatsDto } from "@faketories/contexts/question/dto/question-stats/question-stats.dto.faketory";

import type { Mock } from "vitest";

type GetQuestionStatsStub = {
  getStats: () => Promise<QuestionStatsDto>;
};

type MockedGetQuestionStatsUseCase = { [K in keyof GetQuestionStatsStub]: Mock<GetQuestionStatsStub[K]> };

function createMockedGetQuestionStatsUseCase(overrides: Partial<MockedGetQuestionStatsUseCase> = {}): MockedGetQuestionStatsUseCase {
  return {
    getStats: vi.fn<GetQuestionStatsStub["getStats"]>().mockResolvedValue(createFakeQuestionStatsDto()),
    ...overrides,
  };
}

export { createMockedGetQuestionStatsUseCase };