import type { QuestionThemeAssignmentRemovalCommand } from "@question/domain/commands/question-theme-assignment/question-theme-assignment.commands";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type RemoveThemeFromQuestionStub = {
  remove: (command: QuestionThemeAssignmentRemovalCommand) => Promise<Question>;
};

type MockedRemoveThemeFromQuestionUseCase = { [K in keyof RemoveThemeFromQuestionStub]: Mock<RemoveThemeFromQuestionStub[K]> };

function createMockedRemoveThemeFromQuestionUseCase(overrides: Partial<MockedRemoveThemeFromQuestionUseCase> = {}): MockedRemoveThemeFromQuestionUseCase {
  return {
    remove: vi.fn<RemoveThemeFromQuestionStub["remove"]>().mockResolvedValue(createFakeQuestion()),
    ...overrides,
  };
}

export { createMockedRemoveThemeFromQuestionUseCase };