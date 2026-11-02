import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

export class FindQuestionThemeByIdUseCase {
  public constructor(private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async getById(id: string): Promise<QuestionTheme> {
    const questionTheme = await this.questionThemeRepository.findById(id);
    if (!questionTheme) {
      throw new QuestionThemeNotFoundError(id);
    }
    return questionTheme;
  }
}