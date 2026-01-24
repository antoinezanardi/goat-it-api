import { Test } from "@nestjs/testing";

import { CheckQuestionThemesExistenceUseCase } from "@question/modules/question-theme/application/use-cases/check-question-themes-existence/check-question-themes-existence.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";
import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

describe("Check Question Themes Existence Use Case", () => {
  let checkQuestionThemesExistenceUseCase: CheckQuestionThemesExistenceUseCase;
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
        CheckQuestionThemesExistenceUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    checkQuestionThemesExistenceUseCase = testingModule.get<CheckQuestionThemesExistenceUseCase>(CheckQuestionThemesExistenceUseCase);
  });

  describe(CheckQuestionThemesExistenceUseCase.prototype.checkExistenceByIds, () => {
    it("should call repository.findByIds when all ids exist.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      await checkQuestionThemesExistenceUseCase.checkExistenceByIds(ids);

      expect(mocks.repositories.questionTheme.findByIds).toHaveBeenCalledExactlyOnceWith(ids);
    });

    it("should throw QuestionThemeNotFoundError when some ids are missing.", async() => {
      const missingId = "missing-id";
      const ids = new Set([missingId]);
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce([]);
      const expectedError = new QuestionThemeNotFoundError(missingId);

      await expect(checkQuestionThemesExistenceUseCase.checkExistenceByIds(ids)).rejects.toThrowError(expectedError);
    });
  });
});