import { Test } from "@nestjs/testing";

import { ModifyQuestionUseCase } from "@question/application/use-cases/modify-question/modify-question.use-case";
import { QuestionNotFoundError } from "@question/domain/errors/question.errors";
import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import { createMockedQuestionRepository } from "@mocks/contexts/question/infrastructure/persistence/mongoose/question.mongoose.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionModificationContract } from "@faketories/contexts/question/contracts/question-modification/question-modification.contracts.faketory";
import { createFakeQuestionModificationCommand } from "@faketories/contexts/question/commands/question-modification.commands.faketory";

describe("Modify Question Use Case", () => {
  let modifyQuestionUseCase: ModifyQuestionUseCase;
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
    const testingModule = await Test.createTestingModule({
      providers: [
        ModifyQuestionUseCase,
        {
          provide: QUESTION_REPOSITORY_TOKEN,
          useValue: mocks.repositories.question,
        },
      ],
    }).compile();

    modifyQuestionUseCase = testingModule.get<ModifyQuestionUseCase>(ModifyQuestionUseCase);
  });

  describe(ModifyQuestionUseCase.prototype.modify, () => {
    it("should call question repository modify with correct arguments when called.", async() => {
      const questionId = "question-id-1";
      const payload = createFakeQuestionModificationContract();
      const command = createFakeQuestionModificationCommand({ questionId, payload });
      await modifyQuestionUseCase.modify(command);

      expect(mocks.repositories.question.modify).toHaveBeenCalledExactlyOnceWith(questionId, payload);
    });

    it("should throw QuestionNotFoundError when question repository returns undefined.", async() => {
      const questionId = "question-id-1";
      const payload = createFakeQuestionModificationContract();
      mocks.repositories.question.modify.mockResolvedValueOnce(undefined);
      const command = createFakeQuestionModificationCommand({ questionId, payload });
      const expectedError = new QuestionNotFoundError(questionId);

      await expect(modifyQuestionUseCase.modify(command)).rejects.toThrow(expectedError);
    });

    it("should return the modified question when question repository returns a question.", async() => {
      const questionId = "question-id-1";
      const payload = createFakeQuestionModificationContract();
      const expectedQuestion = createFakeQuestion();
      mocks.repositories.question.modify.mockResolvedValueOnce(expectedQuestion);
      const command = createFakeQuestionModificationCommand({ questionId, payload });
      const result = await modifyQuestionUseCase.modify(command);

      expect(result).toStrictEqual(expectedQuestion);
    });
  });
});