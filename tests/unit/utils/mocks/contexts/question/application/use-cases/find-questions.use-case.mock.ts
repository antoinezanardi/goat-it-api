import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type FindQuestionsUseCaseStub = {
  list: () => Promise<Question[]>;
};

type MockedFindQuestionsUseCase = { [K in keyof FindQuestionsUseCaseStub]: Mock<FindQuestionsUseCaseStub[K]> };

function createMockedFindQuestionsUseCase(overrides: Partial<MockedFindQuestionsUseCase> = {}): MockedFindQuestionsUseCase {
  return {
    list: vi.fn<FindQuestionsUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
    ...overrides,
  };
}

export { createMockedFindQuestionsUseCase };