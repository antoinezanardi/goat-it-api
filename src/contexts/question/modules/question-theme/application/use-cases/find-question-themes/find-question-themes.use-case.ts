import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import type { SortOptions } from "@shared/domain/types/sort/sort.types";
import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import type { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";
import type { QuestionThemeSortableField } from "@question/modules/question-theme/domain/types/question-theme-sortable-fields.types";

@Injectable()
export class FindQuestionThemesUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async list(sortOptions: SortOptions<QuestionThemeSortableField>): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.findAll(sortOptions);
  }
}