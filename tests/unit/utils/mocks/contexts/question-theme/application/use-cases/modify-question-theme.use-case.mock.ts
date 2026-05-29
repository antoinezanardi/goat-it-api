import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionThemeModificationCommand } from "@question-theme/domain/types/question-theme.commands";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

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