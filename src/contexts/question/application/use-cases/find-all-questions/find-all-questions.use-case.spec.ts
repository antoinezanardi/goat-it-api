import { Test } from "@nestjs/testing";

import { FindAllQuestionsUseCase } from "@question/application/use-cases/find-all-questions/find-all-questions.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

describe("Find All Questions Use Case", () => {
  let findAllQuestionsUseCase: FindAllQuestionsUseCase;
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
        FindAllQuestionsUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    findAllQuestionsUseCase = testingModule.get<FindAllQuestionsUseCase>(FindAllQuestionsUseCase);
  });

  describe(FindAllQuestionsUseCase.prototype.list, () => {
    it("should list all questions from repository when called.", async() => {
      await findAllQuestionsUseCase.list();

      expect(mocks.repositories.question.findAll).toHaveBeenCalledExactlyOnceWith();
    });

    it("should return questions from repository when called.", async() => {
      const expectedQuestions = [
        createFakeQuestion(),
        createFakeQuestion(),
        createFakeQuestion(),
      ];
      mocks.repositories.question.findAll.mockResolvedValueOnce(expectedQuestions);

      const actualQuestions = await findAllQuestionsUseCase.list();

      expect(actualQuestions).toStrictEqual(expectedQuestions);
    });
  });
});