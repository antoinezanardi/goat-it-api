import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeSlugAlreadyExistsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionTheme, QuestionThemeDraft } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class CreateQuestionThemeUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async create(questionThemeDraft: QuestionThemeDraft): Promise<QuestionTheme> {
    await this.throwIfQuestionThemeSlugAlreadyExists(questionThemeDraft);

    return this.questionThemeRepository.create(questionThemeDraft);
  }

  private async throwIfQuestionThemeSlugAlreadyExists(questionThemeDraft: QuestionThemeDraft): Promise<void> {
    const questionTheme = await this.questionThemeRepository.findBySlug(questionThemeDraft.slug);
    if (questionTheme) {
      throw new QuestionThemeSlugAlreadyExistsError(questionThemeDraft.slug);
    }
  }
}