import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { FindQuestionThemeByIdUseCase } from "@question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";

import { AssignThemeToQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/assign-theme-to-question/assign-theme-to-question.use-case";
import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";
import { QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment-creation/question-theme-assignment-creation.error";
import { QuestionMaximumThemesError } from "@question/domain/errors/question-maximum-themes/question-maximum-themes.error";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { ReferencedQuestionThemeArchivedError } from "@question/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";

import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question-theme/application/use-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";
import { createMockedQuestionRepository } from "@mocks/contexts/question/domain/repositories/question.repository.mock";

import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/repository-contracts/question-theme-assignment/question-theme-assignment.repository-contracts.faketory";
import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignmentCreationCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment.commands.faketory";

describe(AssignThemeToQuestionUseCase, () => {
  let assignThemeToQuestionUseCase: AssignThemeToQuestionUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
    useCases: {
      findQuestionThemeById: ReturnType<typeof createMockedFindQuestionThemeByIdUseCase>;
      findQuestionById: ReturnType<typeof createMockedFindQuestionByIdUseCase>;
    };
  };

  beforeEach(() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
      useCases: {
        findQuestionThemeById: createMockedFindQuestionThemeByIdUseCase(),
        findQuestionById: createMockedFindQuestionByIdUseCase(),
      },
    };

    assignThemeToQuestionUseCase = new AssignThemeToQuestionUseCase(
      mocks.repositories.question,
      mocks.useCases.findQuestionThemeById as unknown as FindQuestionThemeByIdUseCase,
      mocks.useCases.findQuestionById as unknown as FindQuestionByIdUseCase,
    );
  });

  describe(AssignThemeToQuestionUseCase.prototype.assign, () => {
    it("should call repository.assignTheme with payload when called.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
      });
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({
        status: DEFAULT_QUESTION_THEME_STATUS,
      }));
      mocks.useCases.findQuestionById.getById.mockResolvedValue(createFakeQuestion({
        themes: [],
      }));

      await assignThemeToQuestionUseCase.assign(command);

      expect(mocks.repositories.question.assignTheme).toHaveBeenCalledExactlyOnceWith(command.questionId, command.payload);
    });

    it("should throw when repository.assignTheme returns undefined.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-new" }),
      });
      const question = createFakeQuestion({
        id: "q-1",
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "existing-theme" }) })],
      });
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({
        id: "theme-new",
        status: DEFAULT_QUESTION_THEME_STATUS,
      }));
      mocks.useCases.findQuestionById.getById.mockResolvedValue(question);
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeAssignmentCreationError(command.payload.themeId, command.questionId);

      await expect(async() => assignThemeToQuestionUseCase.assign(command)).rejects.toThrow(expectedError);
    });

    it("should throw QuestionMaximumThemesError when the conditional write matches no document and the question reached the maximum.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-max",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-new" }),
      });
      const questionBefore = createFakeQuestion({
        id: "q-max",
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) }),
        ],
      });
      const questionAfter = createFakeQuestion({
        id: "q-max",
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-3" }) }),
        ],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(questionBefore).mockResolvedValueOnce(questionAfter);
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({ id: "theme-new", status: DEFAULT_QUESTION_THEME_STATUS }));
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionMaximumThemesError(command.questionId);

      await expect(assignThemeToQuestionUseCase.assign(command)).rejects.toThrow(expectedError);
    });

    it("should throw QuestionThemeAssignmentAlreadyExistsError when the conditional write matches no document and the theme is now assigned.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-duplicate",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-1" }),
      });
      const questionBefore = createFakeQuestion({
        id: "q-duplicate",
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) })],
      });
      const questionAfter = createFakeQuestion({
        id: "q-duplicate",
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) }),
        ],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(questionBefore).mockResolvedValueOnce(questionAfter);
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({ id: "theme-1", status: DEFAULT_QUESTION_THEME_STATUS }));
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeAssignmentAlreadyExistsError(command.payload.themeId, command.questionId);

      await expect(assignThemeToQuestionUseCase.assign(command)).rejects.toThrow(expectedError);
    });

    it("should throw ReferencedQuestionThemeArchivedError when the conditional write matches no document and the theme became archived.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-archived-theme",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-1" }),
      });
      const question = createFakeQuestion({ id: "q-archived-theme", themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) })] });
      mocks.useCases.findQuestionById.getById.mockResolvedValueOnce(question).mockResolvedValueOnce(question);
      mocks.useCases.findQuestionThemeById.getById
        .mockResolvedValueOnce(createFakeQuestionTheme({ id: "theme-1", status: DEFAULT_QUESTION_THEME_STATUS }))
        .mockResolvedValueOnce(createFakeQuestionTheme({ id: "theme-1", status: QUESTION_THEME_STATUS_ARCHIVED }));
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(undefined);
      const expectedError = new ReferencedQuestionThemeArchivedError(command.payload.themeId);

      await expect(assignThemeToQuestionUseCase.assign(command)).rejects.toThrow(expectedError);
    });

    it("should map a concurrent assignment that lost the maximum-theme race to QuestionMaximumThemesError when the conditional write matches no document.", async() => {
      const firstCommand = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-race",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-a", isPrimary: false }),
      });
      const secondCommand = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-race",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-b", isPrimary: false }),
      });
      const twoThemesQuestion = createFakeQuestion({
        id: "q-race",
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) }),
        ],
      });
      const threeThemesQuestion = createFakeQuestion({
        id: "q-race",
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-a" }) }),
        ],
      });
      const firstWrite = Promise.withResolvers<ReturnType<typeof createFakeQuestion> | undefined>();
      const secondWrite = Promise.withResolvers<ReturnType<typeof createFakeQuestion> | undefined>();
      const themeA = createFakeQuestionTheme({ id: "theme-a", status: DEFAULT_QUESTION_THEME_STATUS });
      const themeB = createFakeQuestionTheme({ id: "theme-b", status: DEFAULT_QUESTION_THEME_STATUS });
      mocks.useCases.findQuestionById.getById
        .mockResolvedValueOnce(twoThemesQuestion)
        .mockResolvedValueOnce(twoThemesQuestion)
        .mockResolvedValueOnce(threeThemesQuestion);
      mocks.useCases.findQuestionThemeById.getById
        .mockResolvedValueOnce(themeA)
        .mockResolvedValueOnce(themeB)
        .mockResolvedValueOnce(themeB);
      mocks.repositories.question.assignTheme.mockReturnValueOnce(firstWrite.promise).mockReturnValueOnce(secondWrite.promise);
      const firstAssignment = assignThemeToQuestionUseCase.assign(firstCommand);
      const secondAssignment = assignThemeToQuestionUseCase.assign(secondCommand);
      await vi.waitUntil(() => mocks.repositories.question.assignTheme.mock.calls.length === 2);
      firstWrite.resolve(threeThemesQuestion);
      secondWrite.resolve(undefined);
      const expectedError = new QuestionMaximumThemesError(firstCommand.questionId);

      await expect(secondAssignment).rejects.toThrow(expectedError);

      await firstAssignment;
    });

    it("should assign a theme to an archived question when called.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-archived",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-1" }),
      });
      const archivedQuestion = createFakeQuestion({
        id: "q-archived",
        status: "archived",
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) })],
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(archivedQuestion);
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({ id: "theme-1", status: DEFAULT_QUESTION_THEME_STATUS }));
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(archivedQuestion);

      await assignThemeToQuestionUseCase.assign(command);

      expect(mocks.repositories.question.assignTheme).toHaveBeenCalledExactlyOnceWith(command.questionId, command.payload);
    });

    it("should return updated question when repository.assignTheme returns it.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
      });
      const updatedQuestion = createFakeQuestion();
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({
        status: DEFAULT_QUESTION_THEME_STATUS,
      }));
      mocks.useCases.findQuestionById.getById.mockResolvedValue(createFakeQuestion());
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(updatedQuestion);

      const result = await assignThemeToQuestionUseCase.assign(command);

      expect(result).toStrictEqual(updatedQuestion);
    });
  });

  describe("throwIfThemeNotAssignableToQuestion", () => {
    it("should throw QuestionThemeAssignmentAlreadyExistsError when theme already assigned.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-1" }),
      });
      const themes = [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })];
      const existingQuestion = createFakeQuestion({ themes });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(existingQuestion);
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({ id: command.payload.themeId }));
      const expectedError = new QuestionThemeAssignmentAlreadyExistsError(command.payload.themeId, command.questionId);

      await expect(async() => assignThemeToQuestionUseCase["throwIfThemeNotAssignableToQuestion"](command.payload, command.questionId)).rejects.toThrow(expectedError);
    });

    it("should throw ReferencedQuestionThemeArchivedError when theme is archived.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
      });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(createFakeQuestion({ themes: [] }));
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({
        id: command.payload.themeId,
        status: QUESTION_THEME_STATUS_ARCHIVED,
      }));
      const expectedError = new ReferencedQuestionThemeArchivedError(command.payload.themeId);

      await expect(async() => assignThemeToQuestionUseCase["throwIfThemeNotAssignableToQuestion"](command.payload, command.questionId)).rejects.toThrow(expectedError);
    });

    it("should throw QuestionMaximumThemesError when the question already has the maximum number of themes.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-new" }),
      });
      const themes = [
        createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) }),
        createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }) }),
        createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-3" }) }),
      ];
      mocks.useCases.findQuestionById.getById.mockResolvedValue(createFakeQuestion({ id: "q-1", themes }));
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({ id: command.payload.themeId }));
      const expectedError = new QuestionMaximumThemesError(command.questionId);

      await expect(async() => assignThemeToQuestionUseCase["throwIfThemeNotAssignableToQuestion"](command.payload, command.questionId)).rejects.toThrow(expectedError);
    });
  });
});