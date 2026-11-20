import { FindRandomQuestionsUseCase } from "@question/application/use-cases/find-random-questions/find-random-questions.use-case";

import { createMockedQuestionRepository } from "@mocks/contexts/question/domain/repositories/question.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";

describe(FindRandomQuestionsUseCase, () => {
  let findRandomQuestionsUseCase: FindRandomQuestionsUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };
  let findRandomOptions: FindRandomQuestionsOptions;

  beforeEach(() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
    };

    findRandomQuestionsUseCase = new FindRandomQuestionsUseCase(mocks.repositories.question);
    findRandomOptions = { limit: 5, locale: "en" };
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