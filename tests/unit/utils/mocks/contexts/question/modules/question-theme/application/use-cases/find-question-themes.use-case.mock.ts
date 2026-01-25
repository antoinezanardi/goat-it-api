import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type FindQuestionThemesUseCaseStub = {
  list: () => Promise<QuestionTheme[]>;
};

type MockedFindQuestionThemesUseCase = { [K in keyof FindQuestionThemesUseCaseStub]: Mock<FindQuestionThemesUseCaseStub[K]> };

function createMockedFindQuestionThemesUseCase(): MockedFindQuestionThemesUseCase {
  return {
    list: vi.fn<FindQuestionThemesUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
  };
}

export { createMockedFindQuestionThemesUseCase };