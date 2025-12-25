import { Test } from "@nestjs/testing";

import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Find Question Theme By Id Use Case", () => {
  let findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase;
  let mocks: {
    repositories: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeRepository>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        questionTheme: createMockedQuestionThemeRepository(),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        FindQuestionThemeByIdUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    findQuestionThemeByIdUseCase = testingModule.get<FindQuestionThemeByIdUseCase>(FindQuestionThemeByIdUseCase);
  });

  describe(FindQuestionThemeByIdUseCase.prototype.getById, () => {
    it("should get question theme by id from repository when called.", async() => {
      await findQuestionThemeByIdUseCase.getById("123");

      expect(mocks.repositories.questionTheme.findById).toHaveBeenCalledExactlyOnceWith("123");
    });

    it("should throw an error when question theme is not found.", async() => {
      mocks.repositories.questionTheme.findById.mockResolvedValue(undefined);
      const expectedError = new QuestionThemeNotFoundError("123");

      await expect(async() => findQuestionThemeByIdUseCase.getById("123")).rejects.toThrowError(expectedError);
    });

    it("should return the question theme when found.", async() => {
      const questionThemeDocument = createFakeQuestionTheme();
      mocks.repositories.questionTheme.findById.mockResolvedValue(questionThemeDocument);
      const actualQuestionTheme = await findQuestionThemeByIdUseCase.getById("123");

      expect(actualQuestionTheme).toStrictEqual<QuestionTheme>(questionThemeDocument);
    });
  });
});