import type { QuestionCreationCommand } from "@question/domain/commands/question.commands";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type CreateQuestionStub = {
  create: (command: QuestionCreationCommand) => Promise<Question>;
};

type MockedCreateQuestionUseCase = { [K in keyof CreateQuestionStub]: Mock<CreateQuestionStub[K]> };

function createMockedCreateQuestionUseCase(): MockedCreateQuestionUseCase {
  return {
    create: vi.fn<CreateQuestionStub["create"]>().mockResolvedValue(createFakeQuestion()),
  };
}

export { createMockedCreateQuestionUseCase };