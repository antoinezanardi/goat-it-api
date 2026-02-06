import { Test } from "@nestjs/testing";

import { FindQuestionsUseCase } from "@question/application/use-cases/find-questions/find-questions.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Question } from "@question/domain/entities/question.types";

describe("Find Questions Use Case", () => {
  let findQuestionsUseCase: FindQuestionsUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        FindQuestionsUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    findQuestionsUseCase = testingModule.get<FindQuestionsUseCase>(FindQuestionsUseCase);
  });

  describe(FindQuestionsUseCase.prototype.list, () => {
    it("should list all questions from repository when called.", async() => {
      await findQuestionsUseCase.list();

      expect(mocks.repositories.question.findAll).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return questions from repository when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.repositories.question.findAll.mockResolvedValueOnce(expectedQuestions);

      const actualQuestions = await findQuestionsUseCase.list();

      expect(actualQuestions).toStrictEqual<Question[]>(expectedQuestions);
    });
  });
});