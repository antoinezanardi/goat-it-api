import { Test } from "@nestjs/testing";

import { ArchiveQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/question-theme.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Archive Question Theme Use Case", () => {
  let archiveQuestionThemeUseCase: ArchiveQuestionThemeUseCase;
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
        ArchiveQuestionThemeUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    archiveQuestionThemeUseCase = testingModule.get<ArchiveQuestionThemeUseCase>(ArchiveQuestionThemeUseCase);
  });

  describe(ArchiveQuestionThemeUseCase.prototype.archive, () => {
    beforeEach(() => {
      mocks.repositories.questionTheme.findById.mockResolvedValue(createFakeQuestionTheme({
        status: "active",
      }));
    });

    it("should archive a question theme from repository when called.", async() => {
      const questionThemeId = "question-theme-id-1";
      await archiveQuestionThemeUseCase.archive(questionThemeId);

      expect(mocks.repositories.questionTheme.archive).toHaveBeenCalledExactlyOnceWith(questionThemeId);
    });

    it("should throw an error when question theme to archive is not found after archived.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.repositories.questionTheme.archive.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeNotFoundError(questionThemeId);

      await expect(archiveQuestionThemeUseCase.archive(questionThemeId)).rejects.toThrowError(expectedError);
    });

    it("should return the archived question theme when called.", async() => {
      const questionThemeId = "question-theme-id-1";
      const archivedQuestionTheme = createFakeQuestionTheme({
        id: questionThemeId,
        status: "archived",
      });
      mocks.repositories.questionTheme.archive.mockResolvedValueOnce(archivedQuestionTheme);
      const result = await archiveQuestionThemeUseCase.archive(questionThemeId);

      expect(result).toStrictEqual<QuestionTheme>(archivedQuestionTheme);
    });
  });

  describe("throwIfQuestionThemeNotArchivable", () => {
    it("should throw an error when question theme to archive is not found.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.repositories.questionTheme.findById.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeNotFoundError(questionThemeId);

      await expect(archiveQuestionThemeUseCase["throwIfQuestionThemeNotArchivable"](questionThemeId)).rejects.toThrowError(expectedError);
    });

    it("should throw an error when question theme to archive is already archived.", async() => {
      const questionThemeId = "question-theme-id-1";
      const foundQuestionTheme = createFakeQuestionTheme({
        id: questionThemeId,
        status: "archived",
      });
      mocks.repositories.questionTheme.findById.mockResolvedValueOnce(foundQuestionTheme);
      const expectedError = new QuestionThemeAlreadyArchivedError(questionThemeId);

      await expect(archiveQuestionThemeUseCase["throwIfQuestionThemeNotArchivable"](questionThemeId)).rejects.toThrowError(expectedError);
    });

    it("should not throw any error when question theme to archive is found and active.", async() => {
      const questionThemeId = "question-theme-id-1";
      const foundQuestionTheme = createFakeQuestionTheme({
        id: questionThemeId,
        status: "active",
      });
      mocks.repositories.questionTheme.findById.mockResolvedValueOnce(foundQuestionTheme);

      await expect(archiveQuestionThemeUseCase["throwIfQuestionThemeNotArchivable"](questionThemeId)).resolves.toBeUndefined();
    });
  });
});