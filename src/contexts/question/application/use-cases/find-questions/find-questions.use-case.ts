import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_REPOSITORY_TOKEN } from "@question/domain/repositories/question.repository.constants";
import type { Question } from "@question/domain/types/question.entities";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import type { QuestionFilterOptions, QuestionSortableField } from "@question/domain/types/question.types";

@Injectable()
export class FindQuestionsUseCase {
  public constructor(@Inject(QUESTION_REPOSITORY_TOKEN)
  private readonly questionRepository: QuestionRepository) {}

  public async list(options: FindAllOptions<QuestionSortableField, QuestionFilterOptions>): Promise<Question[]> {
    return this.questionRepository.findAll(options);
  }
}