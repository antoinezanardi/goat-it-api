import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeCreationCommand } from "@question-theme/domain/types/question-theme.commands";
import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question-theme/domain/repositories/question-theme.repository.constants";
import { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class CreateQuestionThemeUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async create(questionThemeCreationCommand: QuestionThemeCreationCommand): Promise<QuestionTheme> {
    const { payload } = questionThemeCreationCommand;
    await this.throwIfQuestionThemeNotCreatable(questionThemeCreationCommand);

    return this.questionThemeRepository.create(payload);
  }

  private async throwIfQuestionThemeNotCreatable(questionThemeCreationCommand: QuestionThemeCreationCommand): Promise<void> {
    const { payload } = questionThemeCreationCommand;
    const questionTheme = await this.questionThemeRepository.findBySlug(payload.slug);
    if (questionTheme) {
      throw new QuestionThemeSlugAlreadyExistsError(payload.slug);
    }
  }
}