import type { QuestionThemeCreationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type CreateQuestionThemeUseCaseStub = {
  create: (questionThemeCreationCommand: QuestionThemeCreationCommand) => Promise<QuestionTheme>;
};

type MockedCreateQuestionThemeUseCase = { [K in keyof CreateQuestionThemeUseCaseStub]: Mock<CreateQuestionThemeUseCaseStub[K]> };

function createMockedCreateQuestionThemeUseCase(): MockedCreateQuestionThemeUseCase {
  return {
    create: vi.fn<CreateQuestionThemeUseCaseStub["create"]>().mockResolvedValue(createFakeQuestionTheme({ status: "active" })),
  };
}

export { createMockedCreateQuestionThemeUseCase };