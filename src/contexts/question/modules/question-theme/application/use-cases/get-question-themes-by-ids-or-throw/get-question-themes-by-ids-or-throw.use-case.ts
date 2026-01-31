import { Inject, Injectable } from "@nestjs/common";

import { QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { QUESTION_THEME_REPOSITORY_TOKEN } from "@question/modules/question-theme/domain/repositories/question-theme.repository.constants";

import type { QuestionThemeRepository } from "@question/modules/question-theme/domain/repositories/question-theme.repository.types";
import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

@Injectable()
export class GetQuestionThemesByIdsOrThrowUseCase {
  public constructor(@Inject(QUESTION_THEME_REPOSITORY_TOKEN)
  private readonly questionThemeRepository: QuestionThemeRepository) {}

  private static throwErrorForMissingQuestionThemeIds(requestedIds: Set<string>, foundIds: Set<string>): void {
    for (const id of requestedIds) {
      if (!foundIds.has(id)) {
        throw new QuestionThemeNotFoundError(id);
      }
    }
  }

  public async getByIdsOrThrow(ids: Set<string>): Promise<QuestionTheme[]> {
    const foundQuestionThemes = await this.questionThemeRepository.findByIds(ids);
    const foundQuestionThemeIds = new Set(foundQuestionThemes.map(theme => theme.id));
    if (foundQuestionThemeIds.size !== ids.size) {
      GetQuestionThemesByIdsOrThrowUseCase.throwErrorForMissingQuestionThemeIds(ids, foundQuestionThemeIds);
    }
    return foundQuestionThemes;
  }
}