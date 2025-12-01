import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type FindAllQuestionThemesUseCaseStub = {
  getById: (id: string) => Promise<QuestionTheme>;
};

type MockedFindAllQuestionThemesUseCase = { [K in keyof FindAllQuestionThemesUseCaseStub]: Mock<FindAllQuestionThemesUseCaseStub[K]> };

function createMockedFindQuestionThemeByIdUseCase(): MockedFindAllQuestionThemesUseCase {
  return {
    getById: vi.fn<FindAllQuestionThemesUseCaseStub["getById"]>().mockResolvedValue(createFakeQuestionTheme()),
  };
}

export { createMockedFindQuestionThemeByIdUseCase };