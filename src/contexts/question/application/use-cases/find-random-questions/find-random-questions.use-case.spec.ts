import { Test } from "@nestjs/testing";

import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { FindRandomOptions } from "@question/domain/types/question.types";

describe("Find Random Questions Use Case", () => {
  let findRandomQuestionsUseCase: FindRandomQuestionsUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };
  let findRandomOptions: FindRandomOptions;

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        FindRandomQuestionsUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    findRandomQuestionsUseCase = testingModule.get<FindRandomQuestionsUseCase>(FindRandomQuestionsUseCase);
    findRandomOptions = { limit: 5 };
  });

  describe(FindRandomQuestionsUseCase.prototype.list, () => {
    it("should find random questions from repository when called.", async() => {
      await findRandomQuestionsUseCase.list(findRandomOptions);

      expect(mocks.repositories.question.findRandom).toHaveBeenCalledExactlyOnceWith(findRandomOptions);
    });

    it("should return questions from repository when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.repositories.question.findRandom.mockResolvedValueOnce(expectedQuestions);

      const actualQuestions = await findRandomQuestionsUseCase.list(findRandomOptions);

      expect(actualQuestions).toStrictEqual(expectedQuestions);
    });
  });
});