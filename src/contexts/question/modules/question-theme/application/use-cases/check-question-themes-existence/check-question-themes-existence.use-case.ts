import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";

@Injectable()
export class CheckQuestionThemesExistenceUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  private static throwErrorForMissingQuestionThemeIds(requestedIds: Set<string>, foundIds: Set<string>): void {
    for (const id of requestedIds) {
      if (!foundIds.has(id)) {
        throw new QuestionThemeNotFoundError(id);
      }
    }
  }

  public async checkExistenceByIds(ids: Set<string>): Promise<void> {
    const foundQuestionThemes = await this.questionThemeRepository.findByIds(ids);
    const foundQuestionThemeIds = new Set(foundQuestionThemes.map(theme => theme.id));
    if (foundQuestionThemeIds.size === ids.size) {
      return;
    }

    CheckQuestionThemesExistenceUseCase.throwErrorForMissingQuestionThemeIds(ids, foundQuestionThemeIds);
  }
}