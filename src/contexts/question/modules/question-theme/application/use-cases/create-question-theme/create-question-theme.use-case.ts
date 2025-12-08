import { Inject, Injectable } from "@nestjs/common";

import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class CreateQuestionThemeUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async create(questionThemeDraft: QuestionThemeDraft): Promise<QuestionTheme> {
    return this.questionThemeRepository.create(questionThemeDraft);
  }
}