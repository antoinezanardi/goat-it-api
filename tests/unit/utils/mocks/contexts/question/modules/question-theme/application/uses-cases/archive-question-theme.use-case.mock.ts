import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

type ArchiveQuestionThemeUseCaseStub = {
  archive: (id: string) => Promise<QuestionTheme>;
};

type MockedArchiveQuestionThemeUseCase = { [K in keyof ArchiveQuestionThemeUseCaseStub]: Mock<ArchiveQuestionThemeUseCaseStub[K]> };

function createMockedArchiveQuestionThemeUseCase(): MockedArchiveQuestionThemeUseCase {
  return {
    archive: vi.fn<ArchiveQuestionThemeUseCaseStub["archive"]>().mockResolvedValue(createFakeQuestionTheme({ status: "archived" })),
  };
}

export { createMockedArchiveQuestionThemeUseCase };