import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import type { QuestionModificationCommand } from "@question/application/commands/question.commands";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Applies a partial question modification and turns a missing question into a domain error.
 */
export class ModifyQuestionUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  /**
   * Returns the question with the modification applied.
   *
   * @throws `QuestionNotFoundError` when no question matches the id.
   */
  public async modify(questionModificationCommand: QuestionModificationCommand): Promise<Question> {
    const { questionId, payload } = questionModificationCommand;
    const modifiedQuestion = await this.questionRepository.modify(questionId, payload);
    if (!modifiedQuestion) {
      throw new QuestionNotFoundError(questionId);
    }
    return modifiedQuestion;
  }
}