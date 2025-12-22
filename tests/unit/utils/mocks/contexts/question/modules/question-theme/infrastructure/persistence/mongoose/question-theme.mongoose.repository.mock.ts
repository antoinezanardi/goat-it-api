import type { QuestionThemeUpdateContract } from "@question/modules/question-theme/domain/contracts/question-theme.contracts";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { Mock } from "vitest";

import type { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";

type QuestionThemeRepositoryStub = {
  findAll: () => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (data: QuestionThemeDraft) => Promise<QuestionTheme>;
  update: (id: string, questionTheme: QuestionThemeUpdateContract) => Promise<QuestionTheme>;
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
    update: vi.fn<QuestionThemeRepositoryStub["update"]>().mockResolvedValue(createFakeQuestionTheme()),
    archive: vi.fn<QuestionThemeRepositoryStub["archive"]>().mockResolvedValue(createFakeQuestionTheme()),
  };
}

export { createMockedQuestionThemeRepository };