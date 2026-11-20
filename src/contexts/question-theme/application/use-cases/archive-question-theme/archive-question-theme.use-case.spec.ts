import { ArchiveQuestionThemeUseCase } from "@question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { QuestionThemeAlreadyArchivedError } from "@question-theme/domain/errors/question-theme-already-archived/question-theme-already-archived.error";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";

import { CountLiveQuestionsByThemeIdUseCase } from "@question/application/use-cases/count-live-questions-by-theme-id/count-live-questions-by-theme-id.use-case";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question-theme/domain/repositories/question-theme.repository.mock";
import { createMockedCountLiveQuestionsByThemeIdUseCase } from "@mocks/contexts/question/application/use-cases/count-live-questions-by-theme-id.use-case.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

describe(ArchiveQuestionThemeUseCase, () => {
  let archiveQuestionThemeUseCase: ArchiveQuestionThemeUseCase;
  let mocks: {
    repositories: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeRepository>;
    };
    useCases: {
      countLiveQuestionsByThemeId: ReturnType<typeof createMockedCountLiveQuestionsByThemeIdUseCase>;
    };
  };

  beforeEach(() => {
    mocks = {
      repositories: {
        questionTheme: createMockedQuestionThemeRepository(),
      },
      useCases: {
        countLiveQuestionsByThemeId: createMockedCountLiveQuestionsByThemeIdUseCase(),
      },
    };

    archiveQuestionThemeUseCase = new ArchiveQuestionThemeUseCase(
      mocks.repositories.questionTheme,
      mocks.useCases.countLiveQuestionsByThemeId as unknown as CountLiveQuestionsByThemeIdUseCase,
    );
  });

  describe(ArchiveQuestionThemeUseCase.prototype.archive, () => {
    beforeEach(() => {
      mocks.repositories.questionTheme.findById.mockResolvedValue(createFakeQuestionTheme({
        status: "active",
      }));
      mocks.useCases.countLiveQuestionsByThemeId.execute.mockResolvedValue(0);
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

      await expect(archiveQuestionThemeUseCase.archive(questionThemeId)).rejects.toThrow(expectedError);
    });

    it("should return the archived question theme when called.", async() => {
      const questionThemeId = "question-theme-id-1";
      const archivedQuestionTheme = createFakeQuestionTheme({
        id: questionThemeId,
        status: "archived",
      });
      mocks.repositories.questionTheme.archive.mockResolvedValueOnce(archivedQuestionTheme);
      const result = await archiveQuestionThemeUseCase.archive(questionThemeId);

      expect(result).toStrictEqual(archivedQuestionTheme);
    });
  });

  describe("throwIfQuestionThemeNotArchivable", () => {
    it("should throw an error when question theme to archive is not found.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.repositories.questionTheme.findById.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeNotFoundError(questionThemeId);

      await expect(archiveQuestionThemeUseCase["throwIfQuestionThemeNotArchivable"](questionThemeId)).rejects.toThrow(expectedError);
    });

    it("should throw an error when question theme to archive is already archived.", async() => {
      const questionThemeId = "question-theme-id-1";
      const foundQuestionTheme = createFakeQuestionTheme({
        id: questionThemeId,
        status: "archived",
      });
      mocks.repositories.questionTheme.findById.mockResolvedValueOnce(foundQuestionTheme);
      const expectedError = new QuestionThemeAlreadyArchivedError(questionThemeId);

      await expect(archiveQuestionThemeUseCase["throwIfQuestionThemeNotArchivable"](questionThemeId)).rejects.toThrow(expectedError);
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

  describe("throwIfLiveQuestionsReferenceTheme", () => {
    it("should call countLiveQuestionsByThemeId.execute with the theme id when called.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.useCases.countLiveQuestionsByThemeId.execute.mockResolvedValueOnce(0);

      await archiveQuestionThemeUseCase["throwIfLiveQuestionsReferenceTheme"](questionThemeId);

      expect(mocks.useCases.countLiveQuestionsByThemeId.execute).toHaveBeenCalledExactlyOnceWith(questionThemeId);
    });

    it("should not throw when theme has no live questions referencing it.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.useCases.countLiveQuestionsByThemeId.execute.mockResolvedValueOnce(0);

      await expect(archiveQuestionThemeUseCase["throwIfLiveQuestionsReferenceTheme"](questionThemeId)).resolves.toBeUndefined();
    });

    it("should throw QuestionThemeReferencedByLiveQuestionsError when live questions reference the theme.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.useCases.countLiveQuestionsByThemeId.execute.mockResolvedValueOnce(3);
      const expectedError = new QuestionThemeReferencedByLiveQuestionsError(questionThemeId, 3);

      await expect(archiveQuestionThemeUseCase["throwIfLiveQuestionsReferenceTheme"](questionThemeId)).rejects.toThrow(expectedError);
    });
  });
});