import type { QuestionThemeAssignmentCreationContract } from "@question/domain/contracts/question-theme-assignment/question-theme-assignment.contracts";
import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type QuestionRepositoryStub = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
  archive: (id: string) => Promise<Question | undefined>;
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;
  removeTheme: (questionId: string, themeId: string) => Promise<Question | undefined>;
};

type MockedQuestionRepository = { [K in keyof QuestionRepositoryStub]: Mock<QuestionRepositoryStub[K]> };

function createMockedQuestionRepository(overrides: Partial<MockedQuestionRepository> = {}): MockedQuestionRepository {
  return {
    findAll: vi.fn<QuestionRepositoryStub["findAll"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
    findById: vi.fn<QuestionRepositoryStub["findById"]>().mockResolvedValue(createFakeQuestion()),
    create: vi.fn<QuestionRepositoryStub["create"]>().mockResolvedValue(createFakeQuestion()),
    archive: vi.fn<QuestionRepositoryStub["archive"]>().mockResolvedValue(createFakeQuestion()),
    assignTheme: vi.fn<QuestionRepositoryStub["assignTheme"]>().mockResolvedValue(createFakeQuestion()),
    removeTheme: vi.fn<QuestionRepositoryStub["removeTheme"]>().mockResolvedValue(createFakeQuestion()),
    ...overrides,
  };
}

export { createMockedQuestionRepository };