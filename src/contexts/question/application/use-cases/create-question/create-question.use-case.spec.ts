import { Test } from "@nestjs/testing";

import { CreateQuestionUseCase } from "@question/application/use-cases/create-question/create-question.use-case";
import { QuestionCreationError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionCreationCommand } from "@faketories/contexts/question/commands/question.commands.faketory";

import type { TestingModule } from "@nestjs/testing";

import type { Question } from "@question/domain/entities/question.types";

describe("Create Question Use Case", () => {
  let createQuestionUseCase: CreateQuestionUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };

  beforeEach(async() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateQuestionUseCase,
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
  });
});