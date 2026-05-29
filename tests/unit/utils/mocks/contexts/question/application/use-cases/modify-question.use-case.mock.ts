import type { QuestionModificationCommand } from "@question/domain/types/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

type ModifyQuestionStub = {
  modify: (command: QuestionModificationCommand) => Promise<Question>;
};

type MockedModifyQuestionUseCase = { [K in keyof ModifyQuestionStub]: Mock<ModifyQuestionStub[K]> };

function createMockedModifyQuestionUseCase(overrides: Partial<MockedModifyQuestionUseCase> = {}): MockedModifyQuestionUseCase {
  return {
    modify: vi.fn<ModifyQuestionStub["modify"]>().mockResolvedValue(createFakeQuestion()),
    ...overrides,
  };
}

export { createMockedModifyQuestionUseCase };