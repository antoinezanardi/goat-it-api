import { Test } from "@nestjs/testing";

import { FindQuestionThemesUseCase } from "@question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { ADMIN_QUESTION_THEME_SORTABLE_FIELDS } from "@question-theme/domain/constants/question-theme.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeFindAllOptions } from "@faketories/shared/domain/find-all-options.faketory";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

describe("Find Question Themes Use Case", () => {
  let findQuestionThemesUseCase: FindQuestionThemesUseCase;
  let mocks: {
    repositories: {
      questionTheme: QuestionThemeRepository;
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
    it("should list all question themes from repository when called.", async() => {
      await findQuestionThemesUseCase.list(findAllOptions);

      expect(mocks.repositories.questionTheme.findAll).toHaveBeenCalledExactlyOnceWith(findAllOptions);
    });
  });
});