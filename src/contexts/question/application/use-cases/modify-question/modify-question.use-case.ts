import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import type { QuestionModificationCommand } from "@question/application/commands/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

export class ModifyQuestionUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async modify(questionModificationCommand: QuestionModificationCommand): Promise<Question> {
    const { questionId, payload } = questionModificationCommand;
    const modifiedQuestion = await this.questionRepository.modify(questionId, payload);
    if (!modifiedQuestion) {
      throw new QuestionNotFoundError(questionId);
    }
    return modifiedQuestion;
  }
}