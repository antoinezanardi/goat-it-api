import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type FindAllQuestionThemesUseCaseStub = {
  list: () => Promise<QuestionTheme[]>;
};

type MockedFindAllQuestionThemesUseCase = { [K in keyof FindAllQuestionThemesUseCaseStub]: Mock<FindAllQuestionThemesUseCaseStub[K]> };

function createMockedFindAllQuestionThemesUseCase(): MockedFindAllQuestionThemesUseCase {
  return {
    list: vi.fn<FindAllQuestionThemesUseCaseStub["list"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
  };
}

export { createMockedFindAllQuestionThemesUseCase };