import { Test } from "@nestjs/testing";

import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { GetQuestionThemesByIdsOrThrowUseCase } from "@question/modules/question-theme/application/use-cases/get-question-themes-by-ids-or-throw/get-question-themes-by-ids-or-throw.use-case";
import { QuestionCreationError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import { ReferencedQuestionThemeArchivedError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import { createMockedGetQuestionThemesByIdsOrThrowUseCase } from "@mocks/contexts/question/modules/question-theme/application/use-cases/get-question-themes-by-ids-or-throw.use-case.mock";
import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionCreationCommand } from "@faketories/contexts/question/commands/question.commands.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { TestingModule } from "@nestjs/testing";

import type { Question } from "@question/domain/entities/question.types";

describe("Create Question Use Case", () => {
  let createQuestionUseCase: CreateQuestionUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
    useCases: {
      getQuestionThemesByIdsOrThrow: ReturnType<typeof createMockedGetQuestionThemesByIdsOrThrowUseCase>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
      useCases: {
        getQuestionThemesByIdsOrThrow: createMockedGetQuestionThemesByIdsOrThrowUseCase(),
      },
    };
    mocks.useCases.getQuestionThemesByIdsOrThrow.getByIdsOrThrow.mockResolvedValue([
      createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS }),
      createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS }),
    ]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQuestionUseCase,
        {
          provide: GetQuestionThemesByIdsOrThrowUseCase,
          useValue: mocks.useCases.getQuestionThemesByIdsOrThrow,
        },
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    createQuestionUseCase = module.get<CreateQuestionUseCase>(CreateQuestionUseCase);
  });

  describe(CreateQuestionUseCase.prototype.create, () => {
    it("should call repository.create with payload when called.", async() => {
      const command = createFakeQuestionCreationCommand();

      await createQuestionUseCase.create(command);

      expect(mocks.repositories.question.create).toHaveBeenCalledExactlyOnceWith(command.payload);
    });

    it("should throw QuestionCreationError when repository returns undefined.", async() => {
      const command = createFakeQuestionCreationCommand();
      mocks.repositories.question.create.mockResolvedValueOnce(undefined);
      const expectedError = new QuestionCreationError();

      await expect(createQuestionUseCase.create(command)).rejects.toThrowError(expectedError);
    });

    it("should return created question when repository returns one.", async() => {
      const command = createFakeQuestionCreationCommand();
      const expected = createFakeQuestion();
      mocks.repositories.question.create.mockResolvedValueOnce(expected);

      const actual = await createQuestionUseCase.create(command);

      expect(actual).toStrictEqual<Question>(expected);
    });

    it("should call checkQuestionIsCreatable with command when called.", async() => {
      const command = createFakeQuestionCreationCommand();
      const checkQuestionIsCreatableSpy = vi.spyOn(createQuestionUseCase as unknown as { checkQuestionIsCreatable: () => Promise<void> }, "checkQuestionIsCreatable");
      await createQuestionUseCase.create(command);

      expect(checkQuestionIsCreatableSpy).toHaveBeenCalledExactlyOnceWith(command);
    });
  });

  describe("checkQuestionIsCreatable", () => {
    it("should call getQuestionThemesByIdsOrThrow.getByIdsOrThrow with theme ids when called.", async() => {
      const command = createFakeQuestionCreationCommand();
      const expectedThemeIds = new Set(command.payload.themes.map(themeAssignment => themeAssignment.themeId));

      await createQuestionUseCase["checkQuestionIsCreatable"](command);

      expect(mocks.useCases.getQuestionThemesByIdsOrThrow.getByIdsOrThrow).toHaveBeenCalledExactlyOnceWith(expectedThemeIds);
    });

    it("should not throw when all referenced themes exist and are not archived.", async() => {
      const command = createFakeQuestionCreationCommand();

      await expect(createQuestionUseCase["checkQuestionIsCreatable"](command)).resolves.not.toThrowError();
    });

    it("should throw ReferencedQuestionThemeArchivedError when some referenced theme is archived.", async() => {
      const command = createFakeQuestionCreationCommand();
      const archivedThemeId = command.payload.themes[0].themeId;
      mocks.useCases.getQuestionThemesByIdsOrThrow.getByIdsOrThrow.mockResolvedValueOnce([
        createFakeQuestionTheme({
          id:
          archivedThemeId,
          status: QUESTION_THEME_STATUS_ARCHIVED,
        }),
      ]);
      const expectedError = new ReferencedQuestionThemeArchivedError(archivedThemeId);

      await expect(createQuestionUseCase["checkQuestionIsCreatable"](command)).rejects.toThrowError(expectedError);
    });
  });
});