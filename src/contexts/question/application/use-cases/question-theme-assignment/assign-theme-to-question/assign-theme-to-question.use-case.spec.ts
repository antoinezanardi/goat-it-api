import { Test } from "@nestjs/testing";

import { AssignThemeToQuestionUseCase } from "@question/application/use-cases/question-theme-assignment/assign-theme-to-question/assign-theme-to-question.use-case";
import { QuestionThemeAssignmentAlreadyExistsError, QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { FindQuestionThemeByIdUseCase } from "@question/modules/question-theme/application/use-cases/find-question-theme-by-id/find-question-theme-by-id.use-case";
import { FindQuestionByIdUseCase } from "@question/application/use-cases/find-question-by-id/find-question-by-id.use-case";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { ReferencedQuestionThemeArchivedError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import { createMockedFindQuestionThemeByIdUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/find-question-theme-by-id.use-case.mock";
import { createMockedFindQuestionByIdUseCase } from "@mocks/contexts/question/application/use-cases/find-question-by-id.use-case.mock";
import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestionThemeAssignmentCreationContract } from "@faketories/contexts/question/contracts/question-theme-assignment/question-theme-assignment.contracts.faketory";
import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeAssignmentCreationCommand } from "@faketories/contexts/question/commands/question-theme-assignment/commands/question-theme-assignment.commands.faketory";

import type { TestingModule } from "@nestjs/testing";

import type { Question } from "@question/domain/entities/question.types";

describe("Assign Theme To Question Use Case", () => {
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

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
      useCases: {
        findQuestionThemeById: createMockedFindQuestionThemeByIdUseCase(),
        findQuestionById: createMockedFindQuestionByIdUseCase(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignThemeToQuestionUseCase,
        {
          provide: FindQuestionThemeByIdUseCase,
          useValue: mocks.useCases.findQuestionThemeById,
        },
        {
          provide: FindQuestionByIdUseCase,
          useValue: mocks.useCases.findQuestionById,
        },
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    assignThemeToQuestionUseCase = module.get<AssignThemeToQuestionUseCase>(AssignThemeToQuestionUseCase);
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
      });
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({
        status: DEFAULT_QUESTION_THEME_STATUS,
      }));
      mocks.useCases.findQuestionById.getById.mockResolvedValue(createFakeQuestion());
      mocks.repositories.question.assignTheme.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionThemeAssignmentCreationError(command.payload.themeId, command.questionId);

      await expect(async() => assignThemeToQuestionUseCase.assign(command)).rejects.toThrowError(expectedError);
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

      expect(result).toStrictEqual<Question>(updatedQuestion);
    });
  });

  describe("checkThemeIsAssignableToQuestion", () => {
    it("should throw QuestionThemeAssignmentAlreadyExistsError when theme already assigned.", async() => {
      const command = createFakeQuestionThemeAssignmentCreationCommand({
        questionId: "q-1",
        payload: createFakeQuestionThemeAssignmentCreationContract({ themeId: "theme-1" }),
      });
      const themes = [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })];
      const existingQuestion = createFakeQuestion({ themes });
      mocks.useCases.findQuestionById.getById.mockResolvedValue(existingQuestion);
      mocks.useCases.findQuestionThemeById.getById.mockResolvedValue(createFakeQuestionTheme({ id: command.payload.themeId }));
      const expectedError = new QuestionThemeAssignmentAlreadyExistsError("q-1", command.payload.themeId);

      await expect(async() => assignThemeToQuestionUseCase["checkThemeIsAssignableToQuestion"](command.payload, "q-1")).rejects.toThrowError(expectedError);
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

      await expect(async() => assignThemeToQuestionUseCase["checkThemeIsAssignableToQuestion"](command.payload, command.questionId)).rejects.toThrowError(expectedError);
    });
  });
});