import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

/**
 * Lists question themes for the admin and public routes using the given filter, sort and limit options.
 */
export class FindQuestionThemesUseCase {
  public constructor(private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async list(options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.findAll(options);
  }
}