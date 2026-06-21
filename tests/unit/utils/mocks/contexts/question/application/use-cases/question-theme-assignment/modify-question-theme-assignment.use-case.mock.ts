import type { QuestionThemeAssignmentModificationCommand } from "@question/domain/types/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

type ModifyQuestionThemeAssignmentStub = {
  modify: (command: QuestionThemeAssignmentModificationCommand) => Promise<Question>;
};

type MockedModifyQuestionThemeAssignmentUseCase = { [K in keyof ModifyQuestionThemeAssignmentStub]: Mock<ModifyQuestionThemeAssignmentStub[K]> };

function createMockedModifyQuestionThemeAssignmentUseCase(overrides: Partial<MockedModifyQuestionThemeAssignmentUseCase> = {}): MockedModifyQuestionThemeAssignmentUseCase {
  return {
    modify: vi.fn<ModifyQuestionThemeAssignmentStub["modify"]>().mockResolvedValue(createFakeQuestion()),
    ...overrides,
  };
}

export { createMockedModifyQuestionThemeAssignmentUseCase };