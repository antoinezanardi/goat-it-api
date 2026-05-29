import type { QuestionThemeAssignmentCreationCommand } from "@question/domain/types/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

type AssignThemeToQuestionStub = {
  assign: (command: QuestionThemeAssignmentCreationCommand) => Promise<Question>;
};

type MockedAssignThemeToQuestionUseCase = { [K in keyof AssignThemeToQuestionStub]: Mock<AssignThemeToQuestionStub[K]> };

function createMockedAssignThemeToQuestionUseCase(overrides: Partial<MockedAssignThemeToQuestionUseCase> = {}): MockedAssignThemeToQuestionUseCase {
  return {
    assign: vi.fn<AssignThemeToQuestionStub["assign"]>().mockResolvedValue(createFakeQuestion()),
    ...overrides,
  };
}

export { createMockedAssignThemeToQuestionUseCase };