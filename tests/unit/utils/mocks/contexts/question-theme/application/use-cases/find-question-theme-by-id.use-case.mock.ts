import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

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