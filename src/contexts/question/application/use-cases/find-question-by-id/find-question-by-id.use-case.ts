import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Reads a single question and turns a missing question into a domain error.
 */
export class FindQuestionByIdUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  /**
   * Returns the question matching the id.
   *
   * @throws `QuestionNotFoundError` when no question matches the id.
   */
  public async getById(id: string): Promise<Question> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundError(id);
    }
    return question;
  }
}