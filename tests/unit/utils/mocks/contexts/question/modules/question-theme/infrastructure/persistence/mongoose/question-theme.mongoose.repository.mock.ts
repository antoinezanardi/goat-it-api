import type { QuestionThemeModificationContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepositoryStub = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (data: QuestionThemeDraft) => Promise<QuestionTheme>;
  modify: (id: string, questionTheme: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
};

type MockedQuestionThemeRepository = { [K in keyof QuestionThemeRepositoryStub]: Mock<QuestionThemeRepositoryStub[K]> };

function createMockedQuestionThemeRepository(): MockedQuestionThemeRepository {
  return {
    findAll: vi.fn<QuestionThemeRepositoryStub["findAll"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
    findById: vi.fn<QuestionThemeRepositoryStub["findById"]>().mockResolvedValue(createFakeQuestionTheme()),
    findBySlug: vi.fn<QuestionThemeRepositoryStub["findBySlug"]>().mockResolvedValue(createFakeQuestionTheme()),
    create: vi.fn<QuestionThemeRepositoryStub["create"]>().mockResolvedValue(createFakeQuestionTheme()),
    modify: vi.fn<QuestionThemeRepositoryStub["modify"]>().mockResolvedValue(createFakeQuestionTheme()),
    archive: vi.fn<QuestionThemeRepositoryStub["archive"]>().mockResolvedValue(createFakeQuestionTheme()),
  };
}

export { createMockedQuestionThemeRepository };