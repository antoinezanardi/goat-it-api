import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type FindQuestionByIdStub = {
  getById: (id: string) => Promise<Question>;
};

type MockedFindQuestionByIdUseCase = { [K in keyof FindQuestionByIdStub]: Mock<FindQuestionByIdStub[K]> };

function createMockedFindQuestionByIdUseCase(): MockedFindQuestionByIdUseCase {
  return {
    getById: vi.fn<FindQuestionByIdStub["getById"]>().mockResolvedValue(createFakeQuestion()),
  };
}

export { createMockedFindQuestionByIdUseCase };