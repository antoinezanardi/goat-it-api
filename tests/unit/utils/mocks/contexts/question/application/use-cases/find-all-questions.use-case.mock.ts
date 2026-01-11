import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type FindAllQuestionsUseCaseStub = {
  list: () => Promise<Question[]>;
};

type MockedFindAllQuestionsUseCase = { [K in keyof FindAllQuestionsUseCaseStub]: Mock<FindAllQuestionsUseCaseStub[K]> };

function createMockedFindAllQuestionsUseCase(): MockedFindAllQuestionsUseCase {
  return {
    list: vi.fn<FindAllQuestionsUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
  };
}

export { createMockedFindAllQuestionsUseCase };