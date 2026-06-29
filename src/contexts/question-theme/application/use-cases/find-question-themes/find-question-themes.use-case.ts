import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { AdminQuestionThemeFilterOptions, QuestionThemeSortableField } from "@question-theme/domain/types/question-theme.types";
import type { FindAllOptions } from "@shared/domain/types/find/find.types";
import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class FindQuestionThemesUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async list(options: FindAllOptions<QuestionThemeSortableField, AdminQuestionThemeFilterOptions>): Promise<QuestionTheme[]> {
    const questionThemes = await this.questionThemeRepository.findAll(options);

    return questionThemes.slice(0, options.limit);
  }
}