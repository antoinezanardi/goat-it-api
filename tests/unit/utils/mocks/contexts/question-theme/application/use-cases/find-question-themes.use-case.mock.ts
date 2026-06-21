import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

type FindQuestionThemesUseCaseStub = {
  list: () => Promise<QuestionTheme[]>;
};

type MockedFindQuestionThemesUseCase = { [K in keyof FindQuestionThemesUseCaseStub]: Mock<FindQuestionThemesUseCaseStub[K]> };

function createMockedFindQuestionThemesUseCase(overrides: Partial<MockedFindQuestionThemesUseCase> = {}): MockedFindQuestionThemesUseCase {
  return {
    list: vi.fn<FindQuestionThemesUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
    ...overrides,
  };
}

export { createMockedFindQuestionThemesUseCase };