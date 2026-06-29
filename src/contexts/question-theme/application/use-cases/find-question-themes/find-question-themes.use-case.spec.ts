import { Test } from "@nestjs/testing";

import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeFindAllOptions } from "@faketories/shared/domain/find-all-options.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";

describe("Find Question Themes Use Case", () => {
  let findQuestionThemesUseCase: FindQuestionThemesUseCase;
  let mocks: {
    repositories: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeRepository>;
    };
  };
  let findAllOptions: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>;

  beforeEach(async() => {
    mocks = {
      repositories: {
        questionTheme: createMockedQuestionThemeRepository(),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        FindQuestionThemesUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    findQuestionThemesUseCase = testingModule.get<FindQuestionThemesUseCase>(FindQuestionThemesUseCase);
    findAllOptions = createFakeFindAllOptions(ADMIN_QUESTION_THEME_SORTABLE_FIELDS);
  });

  describe(FindQuestionThemesUseCase.prototype.list, () => {
    it("should return all question themes when limit is not set.", async() => {
      const expectedQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.repositories.questionTheme.findAll.mockResolvedValueOnce(expectedQuestionThemes);
      const optionsWithoutLimit = { sort: findAllOptions.sort };

      const actualQuestionThemes = await findQuestionThemesUseCase.list(optionsWithoutLimit);

      expect(actualQuestionThemes).toStrictEqual(expectedQuestionThemes);
    });

    it("should call repository with full options when called.", async() => {
      await findQuestionThemesUseCase.list(findAllOptions);

      expect(mocks.repositories.questionTheme.findAll).toHaveBeenCalledExactlyOnceWith(findAllOptions);
    });

    it("should return only the first N question themes when limit is set.", async() => {
      const expectedQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.repositories.questionTheme.findAll.mockResolvedValueOnce(expectedQuestionThemes);
      const optionsWithLimit = { ...findAllOptions, limit: 2 };

      const actualQuestionThemes = await findQuestionThemesUseCase.list(optionsWithLimit);

      expect(actualQuestionThemes).toStrictEqual(expectedQuestionThemes.slice(0, 2));
    });

    it("should return all question themes when limit exceeds total count.", async() => {
      const expectedQuestionThemes = [
        createFakeQuestionTheme(),
        createFakeQuestionTheme(),
      ];
      mocks.repositories.questionTheme.findAll.mockResolvedValueOnce(expectedQuestionThemes);
      const optionsWithLimit = { ...findAllOptions, limit: 5 };

      const actualQuestionThemes = await findQuestionThemesUseCase.list(optionsWithLimit);

      expect(actualQuestionThemes).toStrictEqual(expectedQuestionThemes);
    });

    it("should call repository with full options when limit is set.", async() => {
      const optionsWithLimit = { ...findAllOptions, limit: 2 };

      await findQuestionThemesUseCase.list(optionsWithLimit);

      expect(mocks.repositories.questionTheme.findAll).toHaveBeenCalledExactlyOnceWith(optionsWithLimit);
    });
  });
});