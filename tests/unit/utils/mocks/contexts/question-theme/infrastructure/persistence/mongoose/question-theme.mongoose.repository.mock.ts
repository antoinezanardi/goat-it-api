import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeStats } from "@faketories/contexts/question-theme/domain/question-theme-stats/question-theme-stats.faketory";

import type { QuestionThemeCreationContract, QuestionThemeModificationContract } from "@question-theme/domain/types/question-theme.contracts";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";
import type { Mock } from "vitest";

import type { QuestionThemeStats } from "@question-theme/domain/types/question-theme.types";

type QuestionThemeRepositoryStub = {
  findAll: () => Promise<QuestionTheme[]>;
  findByIds: (ids: Set<string>) => Promise<QuestionTheme[]>;
  findById: (id: string) => Promise<QuestionTheme | undefined>;
  findBySlug: (slug: string) => Promise<QuestionTheme | undefined>;
  create: (questionThemeCreationContract: QuestionThemeCreationContract) => Promise<QuestionTheme>;
  modify: (id: string, questionThemeModificationContract: QuestionThemeModificationContract) => Promise<QuestionTheme | undefined>;
  archive: (id: string) => Promise<QuestionTheme | undefined>;
  getStats: () => Promise<QuestionThemeStats>;
};

type MockedQuestionThemeRepository = { [K in keyof QuestionThemeRepositoryStub]: Mock<QuestionThemeRepositoryStub[K]> };

function createMockedQuestionThemeRepository(overrides: Partial<MockedQuestionThemeRepository> = {}): MockedQuestionThemeRepository {
  return {
    findAll: vi.fn<QuestionThemeRepositoryStub["findAll"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
    findByIds: vi.fn<QuestionThemeRepositoryStub["findByIds"]>().mockResolvedValue([
      createFakeQuestionTheme(),
      createFakeQuestionTheme(),
    ]),
    findById: vi.fn<QuestionThemeRepositoryStub["findById"]>().mockResolvedValue(createFakeQuestionTheme()),
    findBySlug: vi.fn<QuestionThemeRepositoryStub["findBySlug"]>().mockResolvedValue(createFakeQuestionTheme()),
    create: vi.fn<QuestionThemeRepositoryStub["create"]>().mockResolvedValue(createFakeQuestionTheme()),
    modify: vi.fn<QuestionThemeRepositoryStub["modify"]>().mockResolvedValue(createFakeQuestionTheme()),
    archive: vi.fn<QuestionThemeRepositoryStub["archive"]>().mockResolvedValue(createFakeQuestionTheme()),
    getStats: vi.fn<QuestionThemeRepositoryStub["getStats"]>().mockResolvedValue(createFakeQuestionThemeStats()),
    ...overrides,
  };
}

export { createMockedQuestionThemeRepository };