import type { QuestionCreationCommand } from "@question/domain/types/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

type CreateQuestionStub = {
  create: (command: QuestionCreationCommand) => Promise<Question>;
};

type MockedCreateQuestionUseCase = { [K in keyof CreateQuestionStub]: Mock<CreateQuestionStub[K]> };

function createMockedCreateQuestionUseCase(overrides: Partial<MockedCreateQuestionUseCase> = {}): MockedCreateQuestionUseCase {
  return {
    create: vi.fn<CreateQuestionStub["create"]>().mockResolvedValue(createFakeQuestion()),
    ...overrides,
  };
}

export { createMockedCreateQuestionUseCase };