import { Test } from "@nestjs/testing";

import { FindAllQuestionThemesUseCase } from "@question/modules/question-theme/application/use-cases/find-all-question-themes/find-all-question-themes.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import type { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

describe("Find All Question Themes Use Case", () => {
  let findAllQuestionThemesUseCase: FindAllQuestionThemesUseCase;
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
        FindAllQuestionThemesUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    findAllQuestionThemesUseCase = testingModule.get<FindAllQuestionThemesUseCase>(FindAllQuestionThemesUseCase);
  });

  describe(FindAllQuestionThemesUseCase.prototype.list, () => {
    it("should list all question themes from repository when called.", async() => {
      await findAllQuestionThemesUseCase.list();

      expect(mocks.repositories.questionTheme.findAll).toHaveBeenCalledExactlyOnceWith();
    });
  });
});