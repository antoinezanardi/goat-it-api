import type { Question } from "@question/domain/types/question.entities";

import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionRepository } from "@question/domain/repositories/question.repository.types";
import type { QuestionFilterOptions, QuestionSortableField } from "@question/domain/types/question.types";

/**
 * Lists questions for the admin and public routes using the given filter, sort and limit options.
 */
export class FindQuestionsUseCase {
  public constructor(private readonly questionRepository: QuestionRepository) {}

  public async list(options: FindAllOptions<QuestionSortableField, QuestionFilterOptions>): Promise<Question[]> {
    return this.questionRepository.findAll(options);
  }
}