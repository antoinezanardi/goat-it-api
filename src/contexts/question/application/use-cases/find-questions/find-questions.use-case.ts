import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";

import type { SortOptions } from "@shared/domain/types/sort/sort.types";
import type { Question } from "@question/domain/entities/question.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import type { QuestionSortableField } from "@question/domain/types/question-sortable-fields.types";

@Injectable()
export class FindQuestionsUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async list(sortOptions: SortOptions<QuestionSortableField>): Promise<Question[]> {
    return this.questionRepository.findAll(sortOptions);
  }
}