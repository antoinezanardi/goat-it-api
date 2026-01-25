import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type FindQuestionsUseCaseStub = {
  list: () => Promise<Question[]>;
};

type MockedFindQuestionsUseCase = { [K in keyof FindQuestionsUseCaseStub]: Mock<FindQuestionsUseCaseStub[K]> };

function createMockedFindQuestionsUseCase(): MockedFindQuestionsUseCase {
  return {
    list: vi.fn<FindQuestionsUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
  };
}

export { createMockedFindQuestionsUseCase };