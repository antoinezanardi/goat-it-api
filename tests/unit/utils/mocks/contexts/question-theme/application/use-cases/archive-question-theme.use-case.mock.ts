import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

type ArchiveQuestionThemeUseCaseStub = {
  archive: (id: string) => Promise<QuestionTheme>;
};

type MockedArchiveQuestionThemeUseCase = { [K in keyof ArchiveQuestionThemeUseCaseStub]: Mock<ArchiveQuestionThemeUseCaseStub[K]> };

function createMockedArchiveQuestionThemeUseCase(overrides: Partial<MockedArchiveQuestionThemeUseCase> = {}): MockedArchiveQuestionThemeUseCase {
  return {
    archive: vi.fn<ArchiveQuestionThemeUseCaseStub["archive"]>().mockResolvedValue(createFakeQuestionTheme({ status: "archived" })),
    ...overrides,
  };
}

export { createMockedArchiveQuestionThemeUseCase };