import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

type CreateQuestionThemeUseCaseStub = {
  create: (questionThemeDraft: QuestionThemeDraft) => Promise<QuestionTheme>;
};

type MockedCreateQuestionThemeUseCase = { [K in keyof CreateQuestionThemeUseCaseStub]: Mock<CreateQuestionThemeUseCaseStub[K]> };

function createMockedCreateQuestionThemeUseCase(): MockedCreateQuestionThemeUseCase {
  return {
    create: vi.fn<CreateQuestionThemeUseCaseStub["create"]>().mockResolvedValue(createFakeQuestionTheme({ status: "active" })),
  };
}

export { createMockedCreateQuestionThemeUseCase };