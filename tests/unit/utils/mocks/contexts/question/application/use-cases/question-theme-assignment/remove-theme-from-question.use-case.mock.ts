import type { QuestionThemeAssignmentRemovalCommand } from "@question/domain/types/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

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