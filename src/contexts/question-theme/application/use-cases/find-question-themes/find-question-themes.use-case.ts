import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { SortOptions } from "@shared/domain/types/sort/sort.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class FindQuestionThemesUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async list(sortOptions: SortOptions<QuestionThemeSortableField>): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.findAll(sortOptions);
  }
}