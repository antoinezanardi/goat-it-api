import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeCreationCommand } from "@question/modules/question-theme/domain/commands/question-theme.commands";
import { QuestionThemeSlugAlreadyExistsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class CreateQuestionThemeUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async create(questionThemeCreationCommand: QuestionThemeCreationCommand): Promise<QuestionTheme> {
    const { payload } = questionThemeCreationCommand;
    await this.throwIfQuestionThemeSlugAlreadyExists(questionThemeCreationCommand);

    return this.questionThemeRepository.create(payload);
  }

  private async throwIfQuestionThemeSlugAlreadyExists(questionThemeCreationCommand: QuestionThemeCreationCommand): Promise<void> {
    const { payload } = questionThemeCreationCommand;
    const questionTheme = await this.questionThemeRepository.findBySlug(payload.slug);
    if (questionTheme) {
      throw new QuestionThemeSlugAlreadyExistsError(payload.slug);
    }
  }
}