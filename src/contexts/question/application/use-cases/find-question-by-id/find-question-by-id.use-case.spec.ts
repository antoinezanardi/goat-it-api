import { Test } from "@nestjs/testing";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Question } from "@question/domain/entities/question.types";

describe("Find Question By Id Use Case", () => {
  let findQuestionByIdUseCase: FindQuestionByIdUseCase;
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
        FindQuestionByIdUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    findQuestionByIdUseCase = testingModule.get<FindQuestionByIdUseCase>(FindQuestionByIdUseCase);
  });

  describe(FindQuestionByIdUseCase.prototype.getById, () => {
    it("should get question by id from repository when called.", async() => {
      await findQuestionByIdUseCase.getById("123");

      expect(mocks.repositories.question.findById).toHaveBeenCalledExactlyOnceWith("123");
    });

    it("should throw an error when question is not found.", async() => {
      mocks.repositories.question.findById.mockResolvedValue(undefined);
      const expectedError = new QuestionNotFoundError("123");

      await expect(async() => findQuestionByIdUseCase.getById("123")).rejects.toThrowError(expectedError);
    });

    it("should return the question when found.", async() => {
      const questionDocument = createFakeQuestion();
      mocks.repositories.question.findById.mockResolvedValue(questionDocument);
      const actualQuestion = await findQuestionByIdUseCase.getById("123");

      expect(actualQuestion).toStrictEqual<Question>(questionDocument);
    });
  });
});