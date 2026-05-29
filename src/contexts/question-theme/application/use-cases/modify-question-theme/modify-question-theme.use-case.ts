import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeModificationCommand } from "@question-theme/domain/types/question-theme.commands";
import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";
import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class ModifyQuestionThemeUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async modify(questionThemeModificationCommand: QuestionThemeModificationCommand): Promise<QuestionTheme> {
    const { questionThemeId, payload } = questionThemeModificationCommand;
    await this.throwIfQuestionThemeNotModifiable(questionThemeModificationCommand);
    const modifiedQuestionTheme = await this.questionThemeRepository.modify(questionThemeId, payload);
    if (!modifiedQuestionTheme) {
      throw new QuestionThemeNotFoundError(questionThemeId);
    }
    return modifiedQuestionTheme;
  }

  private async throwIfQuestionThemeNotModifiable(questionThemeModificationCommand: QuestionThemeModificationCommand): Promise<void> {
    const { questionThemeId, payload } = questionThemeModificationCommand;
    if (payload.slug === undefined) {
      return;
    }
    const questionThemeWithSameSlug = await this.questionThemeRepository.findBySlug(payload.slug);
    if (questionThemeWithSameSlug && questionThemeWithSameSlug.id !== questionThemeId) {
      throw new QuestionThemeSlugAlreadyExistsError(payload.slug);
    }
  }
}