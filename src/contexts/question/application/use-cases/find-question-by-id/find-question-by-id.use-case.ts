import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";
import type { Question } from "@question/domain/types/question.entities";

import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

export class FindQuestionByIdUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async getById(id: string): Promise<Question> {
    const question = await this.questionRepository.findById(id);
    if (!question) {
      throw new QuestionNotFoundError(id);
    }
    return question;
  }
}