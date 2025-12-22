import { Test } from "@nestjs/testing";

import { UpdateQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/update-question-theme/update-question-theme.use-case";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";
import { createFakeQuestionThemeUpdateContract } from "@faketories/contexts/question/question-theme/contracts/question-theme.contracts.faketory";
import { createFakeQuestionThemeUpdateCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Update Question Theme Use Case", () => {
  let updateQuestionThemeUseCase: UpdateQuestionThemeUseCase;
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
        UpdateQuestionThemeUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    updateQuestionThemeUseCase = testingModule.get<UpdateQuestionThemeUseCase>(UpdateQuestionThemeUseCase);
  });

  describe(UpdateQuestionThemeUseCase.prototype.update, () => {
    it("should update a question theme from repository when called.", async() => {
      const id = "question-theme-id-1";
      const payload = createFakeQuestionThemeUpdateContract();
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });
      await updateQuestionThemeUseCase.update(updateQuestionThemeCommand);

      expect(mocks.repositories.questionTheme.update).toHaveBeenCalledExactlyOnceWith(id, payload);
    });

    it("should return the updated question theme from repository when called.", async() => {
      const id = "question-theme-id-1";
      const payload = createFakeQuestionThemeUpdateContract();
      const expectedUpdatedQuestionTheme = createFakeQuestionTheme();
      mocks.repositories.questionTheme.update.mockResolvedValueOnce(expectedUpdatedQuestionTheme);
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });
      const result = await updateQuestionThemeUseCase.update(updateQuestionThemeCommand);

      expect(result).toStrictEqual<QuestionTheme>(expectedUpdatedQuestionTheme);
    });
  });
});