import { Test } from "@nestjs/testing";

import { UpdateQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/update-question-theme/update-question-theme.use-case";
import { QuestionThemeNotFoundError, QuestionThemeSlugAlreadyExistsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
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
    beforeEach(() => {
      mocks.repositories.questionTheme.findBySlug.mockResolvedValue(undefined);
    });

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

    it("should throw an error when question theme to update is not found.", async() => {
      const id = "question-theme-id-1";
      const payload = createFakeQuestionThemeUpdateContract();
      mocks.repositories.questionTheme.update.mockResolvedValueOnce(undefined);
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });
      const expectedError = new QuestionThemeNotFoundError(id);

      await expect(updateQuestionThemeUseCase.update(updateQuestionThemeCommand)).rejects.toThrowError(expectedError);
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

  describe("throwIfQuestionThemeNewSlugAlreadyExists", () => {
    it("should not find a question theme with same slug when payload slug is undefined.", async() => {
      const id = "question-theme-id-1";
      const payload = createFakeQuestionThemeUpdateContract({ slug: undefined });
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });
      await updateQuestionThemeUseCase["throwIfQuestionThemeNewSlugAlreadyExists"](updateQuestionThemeCommand);

      expect(mocks.repositories.questionTheme.findBySlug).not.toHaveBeenCalled();
    });

    it("should find a question theme with same slug when payload slug is defined.", async() => {
      const id = "question-theme-id-1";
      const payload = createFakeQuestionThemeUpdateContract({ slug: "new-slug" });
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });
      mocks.repositories.questionTheme.findBySlug.mockResolvedValueOnce(undefined);
      await updateQuestionThemeUseCase["throwIfQuestionThemeNewSlugAlreadyExists"](updateQuestionThemeCommand);

      expect(mocks.repositories.questionTheme.findBySlug).toHaveBeenCalledExactlyOnceWith("new-slug");
    });

    it("should throw an error when another question theme with same slug already exists.", async() => {
      const id = "question-theme-id-1";
      const existingSlug = "existing-slug";
      const payload = createFakeQuestionThemeUpdateContract({ slug: existingSlug });
      const existingQuestionTheme = createFakeQuestionTheme({ id: "question-theme-id-2", slug: existingSlug });
      mocks.repositories.questionTheme.findBySlug.mockResolvedValueOnce(existingQuestionTheme);
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });
      const expectedError = new QuestionThemeSlugAlreadyExistsError(existingSlug);

      await expect(updateQuestionThemeUseCase["throwIfQuestionThemeNewSlugAlreadyExists"](updateQuestionThemeCommand)).rejects.toThrowError(expectedError);
    });

    it("should not throw an error when no other question theme with same slug exists.", async() => {
      const id = "question-theme-id-1";
      const updatedSlug = "new-slug";
      const payload = createFakeQuestionThemeUpdateContract({ slug: updatedSlug });
      mocks.repositories.questionTheme.findBySlug.mockResolvedValueOnce(undefined);
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });

      await expect(updateQuestionThemeUseCase["throwIfQuestionThemeNewSlugAlreadyExists"](updateQuestionThemeCommand)).resolves.not.toThrowError();
    });

    it("should not throw an error when the question theme with same slug is the one being updated.", async() => {
      const id = "question-theme-id-1";
      const updatedSlug = "existing-slug";
      const payload = createFakeQuestionThemeUpdateContract({ slug: updatedSlug });
      const existingQuestionTheme = createFakeQuestionTheme({ id, slug: updatedSlug });
      mocks.repositories.questionTheme.findBySlug.mockResolvedValueOnce(existingQuestionTheme);
      const updateQuestionThemeCommand = createFakeQuestionThemeUpdateCommand({
        questionThemeId: id,
        payload,
      });

      await expect(updateQuestionThemeUseCase["throwIfQuestionThemeNewSlugAlreadyExists"](updateQuestionThemeCommand)).resolves.not.toThrowError();
    });
  });
});