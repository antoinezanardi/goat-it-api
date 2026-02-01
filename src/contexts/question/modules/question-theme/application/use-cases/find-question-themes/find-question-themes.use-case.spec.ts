import { Test } from "@nestjs/testing";

import { FindQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-question-themes/find-question-themes.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import type { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

describe("Find Question Themes Use Case", () => {
  let findQuestionThemesUseCase: FindQuestionThemesUseCase;
  let mocks: {
    repositories: {
      questionTheme: QuestionThemeRepository;
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
        FindQuestionThemesUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    findQuestionThemesUseCase = testingModule.get<FindQuestionThemesUseCase>(FindQuestionThemesUseCase);
  });

  describe(FindQuestionThemesUseCase.prototype.list, () => {
    it("should list all question themes from repository when called.", async() => {
      await findQuestionThemesUseCase.list();

      expect(mocks.repositories.questionTheme.findAll).toHaveBeenCalledExactlyOnceWith();
    });
  });
});