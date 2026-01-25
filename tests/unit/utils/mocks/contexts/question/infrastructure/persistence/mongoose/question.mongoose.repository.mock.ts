import { vi } from "vitest";

import type { QuestionCreationContract } from "@question/domain/contracts/question.contracts";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Mock } from "vitest";

import type { Question } from "@question/domain/entities/question.types";

type QuestionRepositoryStub = {
  findAll: () => Promise<Question[]>;
  findById: (id: string) => Promise<Question | undefined>;
  create: (questionCreationContract: QuestionCreationContract) => Promise<Question | undefined>;
};

type MockedQuestionRepository = { [K in keyof QuestionRepositoryStub]: Mock<QuestionRepositoryStub[K]> };

function createMockedQuestionRepository(): MockedQuestionRepository {
  return {
    findAll: vi.fn<QuestionRepositoryStub["findAll"]>().mockResolvedValue([
      createFakeQuestion(),
      createFakeQuestion(),
      createFakeQuestion(),
    ]),
    findById: vi.fn<QuestionRepositoryStub["findById"]>().mockResolvedValue(createFakeQuestion()),
    create: vi.fn<QuestionRepositoryStub["create"]>().mockResolvedValue(createFakeQuestion()),
  };
}

export { createMockedQuestionRepository };