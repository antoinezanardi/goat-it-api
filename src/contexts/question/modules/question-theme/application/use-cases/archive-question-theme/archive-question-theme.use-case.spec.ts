import { Test } from "@nestjs/testing";

import { ArchiveQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/archive-question-theme/archive-question-theme.use-case";
import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError, QuestionThemeReferencedByLiveQuestionsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";
import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("Archive Question Theme Use Case", () => {
  let archiveQuestionThemeUseCase: ArchiveQuestionThemeUseCase;
  let mocks: {
    repositories: {
      questionTheme: ReturnType<typeof createMockedQuestionThemeRepository>;
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        questionTheme: createMockedQuestionThemeRepository(),
        question: createMockedQuestionRepository(),
      },
    };
    const testingModule = await Test.createTestingModule({
      providers: [
        ArchiveQuestionThemeUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
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
      mocks.repositories.question.countLiveByThemeId.mockResolvedValue(0);
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

      expect(result).toStrictEqual<QuestionTheme>(archivedQuestionTheme);
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
    it("should not throw when theme has no live questions referencing it.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.repositories.question.countLiveByThemeId.mockResolvedValueOnce(0);

      await expect(archiveQuestionThemeUseCase["throwIfLiveQuestionsReferenceTheme"](questionThemeId)).resolves.toBeUndefined();
    });

    it("should throw QuestionThemeReferencedByLiveQuestionsError when live questions reference the theme.", async() => {
      const questionThemeId = "question-theme-id-1";
      mocks.repositories.question.countLiveByThemeId.mockResolvedValueOnce(3);
      const expectedError = new QuestionThemeReferencedByLiveQuestionsError(questionThemeId, 3);

      await expect(archiveQuestionThemeUseCase["throwIfLiveQuestionsReferenceTheme"](questionThemeId)).rejects.toThrow(expectedError);
    });
  });
});