import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

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