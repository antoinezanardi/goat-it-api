import { Test } from "@nestjs/testing";

import { ModifyQuestionThemeAssignmentUseCase } from "@question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/modify-question-theme-assignment.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { QuestionThemeAssignmentModificationError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment-modification.errors";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";
import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";

import { createFakeQuestionThemeAssignmentModificationCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment-modification.commands.faketory";
import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { TestingModule } from "@nestjs/testing";

describe("Modify Question Theme Assignment Use Case", () => {
  let useCase: ModifyQuestionThemeAssignmentUseCase;
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModifyQuestionThemeAssignmentUseCase,
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

    useCase = module.get(ModifyQuestionThemeAssignmentUseCase);
  });

  describe(ModifyQuestionThemeAssignmentUseCase.prototype.modify, () => {
    it("should call repository.modifyThemeAssignment with command when called.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-1",
        themeId: "theme-1",
        payload: { isHint: true },
      });
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(question);

      await useCase.modify(command);

      expect(mocks.repositories.question.modifyThemeAssignment).toHaveBeenCalledExactlyOnceWith(command.questionId, command.themeId, command.payload);
    });

    it("should throw QuestionThemeAssignmentModificationError when repository returns undefined.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-2",
        themeId: "theme-2",
        payload: { isHint: false },
      });
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(question);
      mocks.repositories.question.modifyThemeAssignment.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeAssignmentModificationError(command.themeId, command.questionId);

      await expect(useCase.modify(command)).rejects.toThrow(expectedError);
    });

    it("should return updated question when repository succeeds.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-3",
        themeId: "theme-3",
        payload: { isPrimary: true },
      });
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-3" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(question);
      const updatedQuestion = createFakeQuestion();
      mocks.repositories.question.modifyThemeAssignment.mockResolvedValueOnce(updatedQuestion);

      const result = await useCase.modify(command);

      expect(result).toStrictEqual(updatedQuestion);
    });
  });

  describe("throwIfThemeAssignmentNotModifiable", () => {
    it("should throw QuestionThemeAssignmentAbsentError when theme is not assigned to question.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-4",
        themeId: "missing-theme",
      });
      const question = createFakeQuestion({
        id: command.questionId,
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(question);
      const expectedError = new QuestionThemeAssignmentAbsentError(command.themeId, command.questionId);

      await expect(useCase["throwIfThemeAssignmentNotModifiable"](command.questionId, command.themeId)).rejects.toThrow(expectedError);
    });
  });
});