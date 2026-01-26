import type { QuestionThemeModificationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type ModifyQuestionThemeUseCaseStub = {
  modify: (questionThemeModificationCommand: QuestionThemeModificationCommand) => Promise<QuestionTheme>;
};

type MockedModifyQuestionThemeUseCase = { [K in keyof ModifyQuestionThemeUseCaseStub]: Mock<ModifyQuestionThemeUseCaseStub[K]> };

function createMockedModifyQuestionThemeUseCase(overrides: Partial<MockedModifyQuestionThemeUseCase> = {}): MockedModifyQuestionThemeUseCase {
  return {
    modify: vi.fn<ModifyQuestionThemeUseCaseStub["modify"]>().mockResolvedValue(createFakeQuestionTheme()),
    ...overrides,
  };
}

export { createMockedModifyQuestionThemeUseCase };