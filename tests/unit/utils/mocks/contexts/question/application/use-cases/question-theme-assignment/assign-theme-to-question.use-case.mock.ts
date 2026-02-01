import type { QuestionThemeAssignmentCreationCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

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