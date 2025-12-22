import type { QuestionThemeUpdateCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type UpdateQuestionThemeUseCaseStub = {
  update: (questionThemeDraft: QuestionThemeUpdateCommand) => Promise<QuestionTheme>;
};

type MockedCreateQuestionThemeUseCase = { [K in keyof UpdateQuestionThemeUseCaseStub]: Mock<UpdateQuestionThemeUseCaseStub[K]> };

function createMockedUpdateQuestionThemeUseCase(): MockedCreateQuestionThemeUseCase {
  return {
    update: vi.fn<UpdateQuestionThemeUseCaseStub["update"]>().mockResolvedValue(createFakeQuestionTheme()),
  };
}

export { createMockedUpdateQuestionThemeUseCase };