import { Test } from "@nestjs/testing";

import { createSortOptionsFromSortQueryDto } from "@shared/application/mappers/sort-query-dto/sort-query-dto.mappers";

import { FindQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeAdminFindQuestionThemesSortQueryDto } from "@faketories/contexts/question/question-theme/dto/admin-find-question-themes-sort-query/admin-find-question-themes-sort-query.dto.faketory";

import type { SortOptions } from "@shared/domain/types/sort/sort.types";
import type { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";
import type { QuestionThemeSortableField } from "@question/modules/question-theme/domain/types/question-theme-sortable-fields.types";

describe("Find Question Themes Use Case", () => {
  let findQuestionThemesUseCase: FindQuestionThemesUseCase;
  let mocks: {
    repositories: {
      questionTheme: QuestionThemeRepository;
    };
  };
  let sortOptions: SortOptions<QuestionThemeSortableField>;

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
    sortOptions = createSortOptionsFromSortQueryDto(createFakeAdminFindQuestionThemesSortQueryDto());
  });

  describe(FindQuestionThemesUseCase.prototype.list, () => {
    it("should list all question themes from repository when called.", async() => {
      await findQuestionThemesUseCase.list(sortOptions);

      expect(mocks.repositories.questionTheme.findAll).toHaveBeenCalledExactlyOnceWith(sortOptions);
    });
  });
});