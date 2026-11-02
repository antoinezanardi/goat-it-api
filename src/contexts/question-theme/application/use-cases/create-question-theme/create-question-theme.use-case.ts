import { QuestionThemeSlugAlreadyExistsError } from "@question-theme/domain/errors/question-theme-slug-already-exists/question-theme-slug-already-exists.error";

import type { QuestionThemeCreationCommand } from "@question-theme/application/commands/question-theme.commands";
import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

export class CreateQuestionThemeUseCase {
  public constructor(private readonly questionThemeRepository: QuestionThemeRepository) {}

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