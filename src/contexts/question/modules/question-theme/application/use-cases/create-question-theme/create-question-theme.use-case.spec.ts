import { Test } from "@nestjs/testing";

import { CreateQuestionThemeUseCase } from "@question/modules/question-theme/application/use-cases/create-question-theme/create-question-theme.use-case";
import { QuestionThemeSlugAlreadyExistsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { createMockedQuestionThemeRepository } from "@mocks/contexts/question/modules/question-theme/infrastructure/persistence/mongoose/question-theme.mongoose.repository.mock";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";
import { createFakeQuestionThemeCreationCommand } from "@faketories/contexts/question/question-theme/commands/question-theme.commands.faketory";

import type { Mock } from "vitest";

describe("Create Question Theme Use Case", () => {
  let createQuestionThemeUseCase: CreateQuestionThemeUseCase;
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
        CreateQuestionThemeUseCase,
        {
          provide: QUESTION_THEME_REPOSITORY_TOKEN,
          useValue: mocks.repositories.questionTheme,
        },
      ],
    }).compile();

    createQuestionThemeUseCase = testingModule.get<CreateQuestionThemeUseCase>(CreateQuestionThemeUseCase);
  });

  describe(CreateQuestionThemeUseCase.prototype.create, () => {
    let localMocks: {
      throwIfQuestionThemeSlugAlreadyExists: Mock;
    };

    beforeEach(() => {
      const createQuestionThemeUseCaseStub = createQuestionThemeUseCase as unknown as { throwIfQuestionThemeSlugAlreadyExists: () => void };
      localMocks = {
        throwIfQuestionThemeSlugAlreadyExists: vi.spyOn(createQuestionThemeUseCaseStub, "throwIfQuestionThemeSlugAlreadyExists").mockResolvedValue(),
      };
    });

    it("should check if question theme slug already exists when called.", async() => {
      const questionThemeCreationCommand = createFakeQuestionThemeCreationCommand();
      await createQuestionThemeUseCase.create(questionThemeCreationCommand);

      expect(localMocks.throwIfQuestionThemeSlugAlreadyExists).toHaveBeenCalledExactlyOnceWith(questionThemeCreationCommand);
    });

    it("should create a question theme from repository when called.", async() => {
      const questionThemeCreationCommand = createFakeQuestionThemeCreationCommand();
      await createQuestionThemeUseCase.create(questionThemeCreationCommand);

      expect(mocks.repositories.questionTheme.create).toHaveBeenCalledExactlyOnceWith(questionThemeCreationCommand.payload);
    });
  });

  describe("throwIfQuestionThemeSlugAlreadyExists", () => {
    it("should throw an error when question theme slug already exists.", async() => {
      const questionThemeCreationCommand = createFakeQuestionThemeCreationCommand();
      mocks.repositories.questionTheme.findBySlug.mockResolvedValueOnce(createFakeQuestionTheme());
      const expectedError = new QuestionThemeSlugAlreadyExistsError(questionThemeCreationCommand.payload.slug);

      await expect(createQuestionThemeUseCase["throwIfQuestionThemeSlugAlreadyExists"](questionThemeCreationCommand)).rejects.toThrowError(expectedError);
    });

    it("should not throw an error when question theme slug does not exist.", async() => {
      const questionThemeCreationCommand = createFakeQuestionThemeCreationCommand();
      mocks.repositories.questionTheme.findBySlug.mockResolvedValueOnce(undefined);

      await expect(createQuestionThemeUseCase["throwIfQuestionThemeSlugAlreadyExists"](questionThemeCreationCommand)).resolves.not.toThrowError();
    });
  });
});