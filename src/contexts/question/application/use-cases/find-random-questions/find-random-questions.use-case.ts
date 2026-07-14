import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import type { Question } from "@question/domain/types/question.entities";

import type { FindRandomQuestionsOptions } from "@question/domain/types/question.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class FindRandomQuestionsUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN) private readonly questionRepository: QuestionRepository) {}

  public async list(options: FindRandomQuestionsOptions): Promise<Question[]> {
    return this.questionRepository.findRandom(options);
  }
}