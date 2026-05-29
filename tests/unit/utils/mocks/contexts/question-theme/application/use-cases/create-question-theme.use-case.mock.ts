import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionThemeCreationCommand } from "@question-theme/domain/types/question-theme.commands";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

type CreateQuestionThemeUseCaseStub = {
  create: (questionThemeCreationCommand: QuestionThemeCreationCommand) => Promise<QuestionTheme>;
};

type MockedCreateQuestionThemeUseCase = { [K in keyof CreateQuestionThemeUseCaseStub]: Mock<CreateQuestionThemeUseCaseStub[K]> };

function createMockedCreateQuestionThemeUseCase(overrides: Partial<MockedCreateQuestionThemeUseCase> = {}): MockedCreateQuestionThemeUseCase {
  return {
    create: vi.fn<CreateQuestionThemeUseCaseStub["create"]>().mockResolvedValue(createFakeQuestionTheme({ status: "active" })),
    ...overrides,
  };
}

export { createMockedCreateQuestionThemeUseCase };