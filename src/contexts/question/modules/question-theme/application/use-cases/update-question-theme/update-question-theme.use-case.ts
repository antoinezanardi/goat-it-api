import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeUpdateCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";
import { QuestionThemeNotFoundError, QuestionThemeSlugAlreadyExistsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class UpdateQuestionThemeUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async update(updateQuestionThemeCommand: QuestionThemeUpdateCommand): Promise<QuestionTheme> {
    const { questionThemeId, payload } = updateQuestionThemeCommand;
    await this.throwIfQuestionThemeNewSlugAlreadyExists(updateQuestionThemeCommand);
    const updatedQuestionTheme = await this.questionThemeRepository.update(questionThemeId, payload);
    if (!updatedQuestionTheme) {
      throw new QuestionThemeNotFoundError(questionThemeId);
    }
    return updatedQuestionTheme;
  }

  private async throwIfQuestionThemeNewSlugAlreadyExists(updateQuestionThemeCommand: QuestionThemeUpdateCommand): Promise<void> {
    const { questionThemeId, payload } = updateQuestionThemeCommand;
    if (payload.slug === undefined) {
      return;
    }
    const questionThemeWithSameSlug = await this.questionThemeRepository.findBySlug(payload.slug);
    if (questionThemeWithSameSlug && questionThemeWithSameSlug.id !== questionThemeId) {
      throw new QuestionThemeSlugAlreadyExistsError(payload.slug);
    }
  }
}