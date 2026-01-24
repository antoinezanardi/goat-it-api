import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";
import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class FindAllQuestionThemesUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  public async list(): Promise<QuestionTheme[]> {
    return this.questionThemeRepository.findAll();
  }

  public async checkExistenceByIds(ids: Set<string>): Promise<void> {
    const foundQuestionThemes = await this.questionThemeRepository.findByIds(ids);
    const foundQuestionThemeIds = new Set(foundQuestionThemes.map(theme => theme.id));

    for (const id of ids) {
      if (!foundQuestionThemeIds.has(id)) {
        throw new QuestionThemeNotFoundError(id);
      }
    }
  }
}