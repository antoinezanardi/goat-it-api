import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class FindQuestionThemeByIdUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async getById(id: string): Promise<QuestionTheme> {
    const questionTheme = await this.questionThemeRepository.findById(id);
    if (!questionTheme) {
      throw new QuestionThemeNotFoundError(id);
    }
    return questionTheme;
  }
}