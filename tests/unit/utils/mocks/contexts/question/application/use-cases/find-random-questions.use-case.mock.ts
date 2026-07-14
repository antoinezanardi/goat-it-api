import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";

type FindRandomQuestionsUseCaseStub = {
  list: (options: FindRandomQuestionsOptions) => Promise<Question[]>;
};

type MockedFindRandomQuestionsUseCase = { [K in keyof FindRandomQuestionsUseCaseStub]: Mock<FindRandomQuestionsUseCaseStub[K]> };

function createMockedFindRandomQuestionsUseCase(overrides: Partial<MockedFindRandomQuestionsUseCase> = {}): MockedFindRandomQuestionsUseCase {
  return {
    list: vi.fn<FindRandomQuestionsUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
    ...overrides,
  };
}

export { createMockedFindRandomQuestionsUseCase };