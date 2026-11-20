import type { Question } from "@question/domain/types/question.entities";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

/**
 * Draws a random sample of active questions for a game round, honouring the exclusion and filter options.
 */
export class FindRandomQuestionsUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async list(options: FindRandomQuestionsOptions): Promise<Question[]> {
    return this.questionRepository.findRandom(options);
  }
}