import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type FindQuestionThemeByIdStub = {
  getById: (id: string) => Promise<QuestionTheme>;
};

type MockedFindQuestionThemeByIdUseCase = { [K in keyof FindQuestionThemeByIdStub]: Mock<FindQuestionThemeByIdStub[K]> };

function createMockedFindQuestionThemeByIdUseCase(overrides: Partial<MockedFindQuestionThemeByIdUseCase> = {}): MockedFindQuestionThemeByIdUseCase {
  return {
    getById: vi.fn<FindQuestionThemeByIdStub["getById"]>().mockResolvedValue(createFakeQuestionTheme()),
    ...overrides,
  };
}

export { createMockedFindQuestionThemeByIdUseCase };