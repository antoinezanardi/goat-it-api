import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

type GetQuestionThemesByIdsOrThrowUseCaseStub = {
  getByIdsOrThrow: (ids: Set<string>) => Promise<QuestionTheme[]>;
};

type MockedGetQuestionThemesByIdsOrThrowUseCase = { [K in keyof GetQuestionThemesByIdsOrThrowUseCaseStub]: Mock<GetQuestionThemesByIdsOrThrowUseCaseStub[K]> };

function createMockedGetQuestionThemesByIdsOrThrowUseCase(overrides: Partial<MockedGetQuestionThemesByIdsOrThrowUseCase> = {}): MockedGetQuestionThemesByIdsOrThrowUseCase {
  return {
    getByIdsOrThrow: vi.fn<GetQuestionThemesByIdsOrThrowUseCaseStub["getByIdsOrThrow"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
    ...overrides,
  };
}

export { createMockedGetQuestionThemesByIdsOrThrowUseCase };