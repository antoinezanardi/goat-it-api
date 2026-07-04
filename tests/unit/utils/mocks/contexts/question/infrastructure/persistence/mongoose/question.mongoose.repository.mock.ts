import type { QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract, QuestionCreationContract } from "@question/domain/types/question.contracts";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { FindRandomOptions } from "@question/domain/types/question.types";

type QuestionRepositoryStub = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
  archive: (id: string) => Promise<Question | undefined>;
  assignTheme: (questionId: string, questionThemeAssignmentCreationContract: QuestionThemeAssignmentCreationContract) => Promise<Question | undefined>;
  removeTheme: (questionId: string, themeId: string) => Promise<Question | undefined>;
  modify: (id: string, contract: QuestionModificationContract) => Promise<Question | undefined>;
  modifyThemeAssignment: (questionId: string, themeId: string, contract: QuestionThemeAssignmentModificationContract) => Promise<Question | undefined>;
  countLiveByThemeId: (themeId: string) => Promise<number>;
  findRandom: (options: FindRandomOptions) => Promise<Question[]>;
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
    modify: vi.fn<QuestionRepositoryStub["modify"]>().mockResolvedValue(createFakeQuestion()),
    modifyThemeAssignment: vi.fn<QuestionRepositoryStub["modifyThemeAssignment"]>().mockResolvedValue(createFakeQuestion()),
    countLiveByThemeId: vi.fn<QuestionRepositoryStub["countLiveByThemeId"]>().mockResolvedValue(0),
    findRandom: vi.fn<QuestionRepositoryStub["findRandom"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
    ...overrides,
  };
}

export { createMockedQuestionRepository };