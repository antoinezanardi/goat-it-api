import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import type { SortOptions } from "@shared/domain/types/sort.types";
import type { Question } from "@question/domain/entities/question.types";
import type { QuestionRepository, QuestionSortableField } from "@question/domain/repositories/question.repository.types";

@Injectable()
export class FindQuestionsUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async list(sortOptions: SortOptions<QuestionSortableField>): Promise<Question[]> {
    return this.questionRepository.findAll(sortOptions);
  }
}