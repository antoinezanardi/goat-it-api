import { ModifyQuestionUseCase } from "@question/application/use-cases/modify-question/modify-question.use-case";
import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";

import { createMockedQuestionRepository } from "@mocks/contexts/question/domain/repositories/question.repository.mock";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionModificationContract } from "@faketories/contexts/question/contracts/question-modification/question-modification.contracts.faketory";
import { createFakeQuestionModificationCommand } from "@faketories/contexts/question/commands/question-modification.commands.faketory";

describe(ModifyQuestionUseCase, () => {
  let modifyQuestionUseCase: ModifyQuestionUseCase;
  let mocks: {
    repositories: {
      question: ReturnType<typeof createMockedQuestionRepository>;
    };
  };

  beforeEach(() => {
    mocks = {
      repositories: {
        question: createMockedQuestionRepository(),
      },
    };

    modifyQuestionUseCase = new ModifyQuestionUseCase(mocks.repositories.question);
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