import { Test } from "@nestjs/testing";

import { GetQuestionThemesByIdsOrThrowUseCase } from "@question/modules/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";
import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Get Question Themes By Ids Or Throw Use Case", () => {
  let getQuestionThemesByIdsOrThrowUseCase: GetQuestionThemesByIdsOrThrowUseCase;
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
        GetQuestionThemesByIdsOrThrowUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    getQuestionThemesByIdsOrThrowUseCase = testingModule.get<GetQuestionThemesByIdsOrThrowUseCase>(GetQuestionThemesByIdsOrThrowUseCase);
  });

  describe(GetQuestionThemesByIdsOrThrowUseCase.prototype.getByIdsOrThrow, () => {
    it("should call questionTheme.findByIds with the provided ids when called.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(mocks.repositories.questionTheme.findByIds).toHaveBeenCalledExactlyOnceWith(ids);
    });

    it("should call throwErrorForMissingQuestionThemeIds when some ids are missing.", async() => {
      const themes = [createFakeQuestionTheme({ id: "theme-1" })];
      const ids = new Set([...themes.map(theme => theme.id), "missing-theme-id"]);
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const throwErrorForMissingQuestionThemeIdsStub = GetQuestionThemesByIdsOrThrowUseCase as unknown as { throwErrorForMissingQuestionThemeIds: () => void };
      const throwErrorForMissingQuestionThemeIdsMock = vi.spyOn(throwErrorForMissingQuestionThemeIdsStub, "throwErrorForMissingQuestionThemeIds").mockImplementation(vi.fn);

      await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(throwErrorForMissingQuestionThemeIdsMock).toHaveBeenCalledExactlyOnceWith(ids, new Set(themes.map(theme => theme.id)));
    });

    it("should not call throwErrorForMissingQuestionThemeIds when all ids are found.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const throwErrorForMissingQuestionThemeIdsStub = GetQuestionThemesByIdsOrThrowUseCase as unknown as { throwErrorForMissingQuestionThemeIds: () => void };
      const throwErrorForMissingQuestionThemeIdsMock = vi.spyOn(throwErrorForMissingQuestionThemeIdsStub, "throwErrorForMissingQuestionThemeIds").mockImplementation(vi.fn);
      await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(throwErrorForMissingQuestionThemeIdsMock).not.toHaveBeenCalled();
    });

    it("should return found question themes when all ids are found.", async() => {
      const themes = [
        createFakeQuestionTheme({ id: "theme-1" }),
        createFakeQuestionTheme({ id: "theme-2" }),
      ];
      const ids = new Set(themes.map(theme => theme.id));
      vi.mocked(mocks.repositories.questionTheme.findByIds).mockResolvedValueOnce(themes);
      const foundThemes = await getQuestionThemesByIdsOrThrowUseCase.getByIdsOrThrow(ids);

      expect(foundThemes).toStrictEqual<QuestionTheme[]>(themes);
    });
  });

  describe("throwErrorForMissingQuestionThemeIds", () => {
    it("should throw QuestionThemeNotFoundError for first missing id when called.", () => {
      const requestedIds = new Set(["id-1", "id-2", "id-3"]);
      const foundIds = new Set(["id-1", "id-3"]);
      const expectedError = new QuestionThemeNotFoundError("id-2");

      expect(() => {
        GetQuestionThemesByIdsOrThrowUseCase["throwErrorForMissingQuestionThemeIds"](requestedIds, foundIds);
      }).toThrowError(expectedError);
    });

    it("should not throw any error when all ids are found.", () => {
      const requestedIds = new Set(["id-1", "id-2"]);
      const foundIds = new Set(["id-1", "id-2"]);

      expect(() => {
        GetQuestionThemesByIdsOrThrowUseCase["throwErrorForMissingQuestionThemeIds"](requestedIds, foundIds);
      }).not.toThrowError();
    });
  });
});