import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question-theme/domain/repositories/question-theme.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

describe(FindQuestionThemeByIdUseCase, () => {
  let findQuestionThemeByIdUseCase: FindQuestionThemeByIdUseCase;
  let mocks: {
    repositories: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeRepository>;
    };
  };

  beforeEach(() => {
    mocks = {
      repositories: {
        questionTheme: createMockedQuestionThemeRepository(),
      },
    };

    findQuestionThemeByIdUseCase = new FindQuestionThemeByIdUseCase(mocks.repositories.questionTheme);
  });

  describe(FindQuestionThemeByIdUseCase.prototype.getById, () => {
    it("should get question theme by id from repository when called.", async() => {
      await findQuestionThemeByIdUseCase.getById("123");

      expect(mocks.repositories.questionTheme.findById).toHaveBeenCalledExactlyOnceWith("123");
    });

    it("should throw an error when question theme is not found.", async() => {
      mocks.repositories.questionTheme.findById.mockResolvedValue(undefined);
      const expectedError = new QuestionThemeNotFoundError("123");

      await expect(async() => findQuestionThemeByIdUseCase.getById("123")).rejects.toThrow(expectedError);
    });

    it("should return the question theme when found.", async() => {
      const questionThemeDocument = createFakeQuestionTheme();
      mocks.repositories.questionTheme.findById.mockResolvedValue(questionThemeDocument);
      const actualQuestionTheme = await findQuestionThemeByIdUseCase.getById("123");

      expect(actualQuestionTheme).toStrictEqual(questionThemeDocument);
    });
  });
});