import type { QuestionModificationContract, QuestionThemeAssignmentCreationContract, QuestionThemeAssignmentModificationContract, QuestionCreationContract } from "@question/domain/types/question.contracts";
import type { Question } from "@question/domain/types/question.entities";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { FindRandomQuestionsOptions, QuestionStats } from "@question/domain/types/question.types";

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
  findRandom: (options: FindRandomQuestionsOptions) => Promise<Question[]>;
  getStats: () => Promise<QuestionStats>;
};

type MockedQuestionRepository = { [K in keyof QuestionRepositoryStub]: Mock<QuestionRepositoryStub[K]> };

const DEFAULT_QUESTION = createFakeQuestion();

const DEFAULT_STATS = {
  total: 0,
  byStatus: { active: 0, archived: 0, pending: 0, rejected: 0 },
  byCategory: { explanation: 0, lexicon: 0, riddle: 0, trivia: 0 },
  byCognitiveDifficulty: { easy: 0, hard: 0, medium: 0 },
  byAuthorRole: { admin: 0, ai: 0, game: 0 },
  byRejectionType: { "duplicate-question": 0, "inappropriate-content": 0, "incorrect-information": 0, "other": 0, "poor-quality": 0 },
} as const;

function createMockedQuestionRepository(overrides: Partial<MockedQuestionRepository> = {}): MockedQuestionRepository {
  return {
    findAll: vi.fn<QuestionRepositoryStub["findAll"]>().mockResolvedValue([DEFAULT_QUESTION, createFakeQuestion(), createFakeQuestion()]),
    findById: vi.fn<QuestionRepositoryStub["findById"]>().mockResolvedValue(DEFAULT_QUESTION),
    create: vi.fn<QuestionRepositoryStub["create"]>().mockResolvedValue(DEFAULT_QUESTION),
    archive: vi.fn<QuestionRepositoryStub["archive"]>().mockResolvedValue(DEFAULT_QUESTION),
    assignTheme: vi.fn<QuestionRepositoryStub["assignTheme"]>().mockResolvedValue(DEFAULT_QUESTION),
    removeTheme: vi.fn<QuestionRepositoryStub["removeTheme"]>().mockResolvedValue(DEFAULT_QUESTION),
    modify: vi.fn<QuestionRepositoryStub["modify"]>().mockResolvedValue(DEFAULT_QUESTION),
    modifyThemeAssignment: vi.fn<QuestionRepositoryStub["modifyThemeAssignment"]>().mockResolvedValue(DEFAULT_QUESTION),
    countLiveByThemeId: vi.fn<QuestionRepositoryStub["countLiveByThemeId"]>().mockResolvedValue(0),
    findRandom: vi.fn<QuestionRepositoryStub["findRandom"]>().mockResolvedValue([DEFAULT_QUESTION, createFakeQuestion(), createFakeQuestion()]),
    getStats: vi.fn<QuestionRepositoryStub["getStats"]>().mockResolvedValue({ ...DEFAULT_STATS }),
    ...overrides,
  };
}

export { createMockedQuestionRepository };