import type { Question } from "@question/domain/types/question.entities";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

export class FindRandomQuestionsUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async list(options: FindRandomQuestionsOptions): Promise<Question[]> {
    return this.questionRepository.findRandom(options);
  }
}