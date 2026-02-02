import { Test } from "@nestjs/testing";

import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QuestionThemeAssignmentAbsentError, QuestionThemeAssignmentRemovalError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { QuestionMinimumThemesError } from "@question/domain/errors/question.errors";

import { RemoveThemeFromQuestionUseCase } from "./remove-theme-from-question.use-case";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";
import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";

import { createFakeQuestionThemeAssignmentRemovalCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment.commands.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { Question } from "@question/domain/entities/question.types";

describe(RemoveThemeFromQuestionUseCase, () => {
  let useCase: RemoveThemeFromQuestionUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
    useCases: {
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
      useCases: {
        findQuestionById: createMockedFindQuestionByIdUseCase(),
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        RemoveThemeFromQuestionUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
        {
          provide: FindQuestionByIdUseCase,
          useValue: mocks.useCases.findQuestionById,
        },
      ],
    }).compile();

    useCase = module.get(RemoveThemeFromQuestionUseCase);
  });

  describe(RemoveThemeFromQuestionUseCase.prototype.remove, () => {
    it("should throw QuestionThemeAssignmentRemovalError when repository returns undefined.", async() => {
      const command = createFakeQuestionThemeAssignmentRemovalCommand({
        questionId: "q3",
        themeId: "theme-1",
      });
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "theme-1" }),
          }),
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "theme-2" }),
          }),
        ],
      });
      vi.mocked(mocks.useCases.findQuestionById.getById).mockResolvedValueOnce(question);
      vi.mocked(mocks.repositories.question.removeTheme).mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeAssignmentRemovalError(command.themeId, command.questionId);

      await expect(useCase.remove(command)).rejects.toThrowError(expectedError);
    });

    it("should call repository remove method when called.", async() => {
      const command = createFakeQuestionThemeAssignmentRemovalCommand({
        questionId: "q3",
        themeId: "theme-1",
      });
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "theme-1" }),
          }),
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "theme-2" }),
          }),
        ],
      });
      vi.mocked(mocks.useCases.findQuestionById.getById).mockResolvedValueOnce(question);
      const updated = createFakeQuestion();
      vi.mocked(mocks.repositories.question.removeTheme).mockResolvedValueOnce(updated);

      await useCase.remove(command);

      expect(mocks.repositories.question.removeTheme).toHaveBeenCalledExactlyOnceWith(command.questionId, command.themeId);
    });

    it("should return updated question when repository succeeds.", async() => {
      const command = createFakeQuestionThemeAssignmentRemovalCommand({
        questionId: "q3",
        themeId: "theme-1",
      });
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "theme-1" }),
          }),
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "theme-2" }),
          }),
        ],
      });
      vi.mocked(mocks.useCases.findQuestionById.getById).mockResolvedValueOnce(question);
      const updated = createFakeQuestion();
      vi.mocked(mocks.repositories.question.removeTheme).mockResolvedValueOnce(updated);

      const result = await useCase.remove(command);

      expect(result).toStrictEqual<Question>(updated);
    });
  });

  describe("checkThemeIsRemovableFromQuestion", () => {
    it("should throw QuestionMinimumThemesError when question has minimum themes.", async() => {
      const command = createFakeQuestionThemeAssignmentRemovalCommand({
        questionId: "q1",
        themeId: "existing-theme",
      });
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "existing-theme" }),
          }),
        ],
      });
      vi.mocked(mocks.useCases.findQuestionById.getById).mockResolvedValueOnce(question);
      const expectedError = new QuestionMinimumThemesError(command.questionId);

      await expect(useCase["checkThemeIsRemovableFromQuestion"](command.questionId, command.themeId)).rejects.toThrowError(expectedError);
    });

    it("should throw QuestionThemeAssignmentAbsentError when question has no themes.", async() => {
      const command = createFakeQuestionThemeAssignmentRemovalCommand({
        questionId: "q0",
        themeId: "missing-theme",
      });
      const question = createFakeQuestion({
        themes: [],
      });
      vi.mocked(mocks.useCases.findQuestionById.getById).mockResolvedValueOnce(question);
      const expectedError = new QuestionThemeAssignmentAbsentError(command.themeId, command.questionId);

      await expect(useCase["checkThemeIsRemovableFromQuestion"](command.questionId, command.themeId)).rejects.toThrowError(expectedError);
    });

    it("should throw QuestionThemeAssignmentAbsentError when theme not assigned.", async() => {
      const command = createFakeQuestionThemeAssignmentRemovalCommand({
        questionId: "q2",
        themeId: "missing-theme",
      });
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "existing-theme" }),
          }),
          createFakeQuestionThemeAssignment({
            theme: createFakeQuestionTheme({ id: "existing-theme-2" }),
          }),
        ],
      });
      vi.mocked(mocks.useCases.findQuestionById.getById).mockResolvedValueOnce(question);
      const expectedError = new QuestionThemeAssignmentAbsentError(command.themeId, command.questionId);

      await expect(useCase["checkThemeIsRemovableFromQuestion"](command.questionId, command.themeId)).rejects.toThrowError(expectedError);
    });
  });
});