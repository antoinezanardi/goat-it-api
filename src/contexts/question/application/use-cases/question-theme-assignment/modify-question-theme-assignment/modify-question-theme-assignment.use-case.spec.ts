import { ModifyQuestionThemeAssignmentUseCase } from "@question/application/use-cases/question-theme-assignment/modify-question-theme-assignment/modify-question-theme-assignment.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { QuestionThemeAssignmentModificationError } from "@question/domain/errors/question-theme-assignment-modification/question-theme-assignment-modification.error";

import { createMockedQuestionRepository } from "@mocks/contexts/question/domain/repositories/question.repository.mock";
import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";

import { createFakeQuestionThemeAssignmentModificationCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment-modification.commands.faketory";
import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

describe(ModifyQuestionThemeAssignmentUseCase, () => {
  let useCase: ModifyQuestionThemeAssignmentUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
    useCases: {
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
    };
  };

  beforeEach(() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
      useCases: {
        findQuestionById: createMockedFindQuestionByIdUseCase(),
      },
    };

    useCase = new ModifyQuestionThemeAssignmentUseCase(
      mocks.repositories.question,
      mocks.useCases.findQuestionById as unknown as FindQuestionByIdUseCase,
    );
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

    it("should throw QuestionThemeAssignmentModificationError when repository returns undefined and the re-check still allows the modification.", async() => {
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

    it("should throw QuestionThemeAssignmentAbsentError when the conditional write matches no document and the assignment is gone.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-2",
        themeId: "theme-2",
        payload: { isHint: false },
      });
      const questionBefore = createFakeQuestion({
        id: command.questionId,
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) })],
      });
      const questionAfter = createFakeQuestion({
        id: command.questionId,
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(questionBefore).mockResolvedValueOnce(questionAfter);
      mocks.repositories.question.modifyThemeAssignment.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeAssignmentAbsentError(command.themeId, command.questionId);

      await expect(useCase.modify(command)).rejects.toThrow(expectedError);
    });

    it("should let two concurrent promotions reach the repository when both pass the read check.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-5",
        themeId: "theme-5",
        payload: { isPrimary: true },
      });
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-5" }) })],
      });
      const firstWrite = Promise.withResolvers<ReturnType<typeof createFakeQuestion> | undefined>();
      const secondWrite = Promise.withResolvers<ReturnType<typeof createFakeQuestion> | undefined>();
      mocks.useCases.findQuestionById.getById.mockResolvedValue(question);
      mocks.repositories.question.modifyThemeAssignment.mockReturnValueOnce(firstWrite.promise).mockReturnValueOnce(secondWrite.promise);
      const firstModification = useCase.modify(command);
      const secondModification = useCase.modify(command);
      await vi.waitUntil(() => mocks.repositories.question.modifyThemeAssignment.mock.calls.length === 2);
      firstWrite.resolve(question);
      secondWrite.resolve(question);

      await expect(Promise.all([firstModification, secondModification])).resolves.toHaveLength(2);
    });

    it("should modify a theme assignment on an archived question when called.", async() => {
      const command = createFakeQuestionThemeAssignmentModificationCommand({
        questionId: "q-archived",
        themeId: "theme-1",
        payload: { isHint: true },
      });
      const archivedQuestion = createFakeQuestion({
        id: "q-archived",
        status: "archived",
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(archivedQuestion);
      mocks.repositories.question.modifyThemeAssignment.mockResolvedValueOnce(archivedQuestion);

      await useCase.modify(command);

      expect(mocks.repositories.question.modifyThemeAssignment).toHaveBeenCalledExactlyOnceWith(command.questionId, command.themeId, command.payload);
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