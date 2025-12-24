import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type FindQuestionThemeByIdStub = {
  getById: (id: string) => Promise<QuestionTheme>;
};

type MockedFindQuestionThemeByIdUseCase = { [K in keyof FindQuestionThemeByIdStub]: Mock<FindQuestionThemeByIdStub[K]> };

function createMockedFindQuestionThemeByIdUseCase(): MockedFindQuestionThemeByIdUseCase {
  return {
    getById: vi.fn<FindQuestionThemeByIdStub["getById"]>().mockResolvedValue(createFakeQuestionTheme()),
  };
}

export { createMockedFindQuestionThemeByIdUseCase };