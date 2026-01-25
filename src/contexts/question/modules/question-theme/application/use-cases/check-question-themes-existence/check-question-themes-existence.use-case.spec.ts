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
    it("should call questionTheme.findByIds with the provided ids when called.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      await checkQuestionThemesExistenceUseCase.checkExistenceByIds(ids);

      expect(mocks.repositories.questionTheme.findByIds).toHaveBeenCalledExactlyOnceWith(ids);
    });

    it("should call throwErrorForMissingQuestionThemeIds when some ids are missing.", async() => {
      const themes = [createFakeQuestionTheme({ id: "theme-1" })];
      const ids = new Set([...themes.map(theme => theme.id), "missing-theme-id"]);
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const throwErrorForMissingQuestionThemeIdsStub = CheckQuestionThemesExistenceUseCase as unknown as { throwErrorForMissingQuestionThemeIds: () => void };
      const throwErrorForMissingQuestionThemeIdsMock = vi.spyOn(throwErrorForMissingQuestionThemeIdsStub, "throwErrorForMissingQuestionThemeIds").mockImplementation(vi.fn);

      await checkQuestionThemesExistenceUseCase.checkExistenceByIds(ids);

      expect(throwErrorForMissingQuestionThemeIdsMock).toHaveBeenCalledExactlyOnceWith(ids, new Set(themes.map(theme => theme.id)));
    });

    it("should not call throwErrorForMissingQuestionThemeIds when all ids are found.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const throwErrorForMissingQuestionThemeIdsStub = CheckQuestionThemesExistenceUseCase as unknown as { throwErrorForMissingQuestionThemeIds: () => void };
      const throwErrorForMissingQuestionThemeIdsMock = vi.spyOn(throwErrorForMissingQuestionThemeIdsStub, "throwErrorForMissingQuestionThemeIds").mockImplementation(vi.fn);
      await checkQuestionThemesExistenceUseCase.checkExistenceByIds(ids);

      expect(throwErrorForMissingQuestionThemeIdsMock).not.toHaveBeenCalled();
    });
  });

  describe("throwErrorForMissingQuestionThemeIds", () => {
    it("should throw QuestionThemeNotFoundError for first missing id when called.", () => {
      const requestedIds = new Set(["id-1", "id-2", "id-3"]);
      const foundIds = new Set(["id-1", "id-3"]);
      const expectedError = new QuestionThemeNotFoundError("id-2");

      expect(() => {
        CheckQuestionThemesExistenceUseCase["throwErrorForMissingQuestionThemeIds"](requestedIds, foundIds);
      }).toThrowError(expectedError);
    });

    it("should not throw any error when all ids are found.", () => {
      const requestedIds = new Set(["id-1", "id-2"]);
      const foundIds = new Set(["id-1", "id-2"]);

      expect(() => {
        CheckQuestionThemesExistenceUseCase["throwErrorForMissingQuestionThemeIds"](requestedIds, foundIds);
      }).not.toThrowError();
    });
  });
});