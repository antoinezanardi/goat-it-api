import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

import type { QuestionThemeRepository } from "@question-theme/domain/repositories/question-theme.repository.types";

/**
 * Resolves a set of theme ids for the `question` context and fails when any requested theme is missing.
 */
export class GetQuestionThemesByIdsOrThrowUseCase {
  public constructor(private readonly questionThemeRepository: QuestionThemeRepository) {}

  private static throwErrorForMissingQuestionThemeIds(requestedIds: Set<string>, foundIds: Set<string>): void {
    for (const id of requestedIds) {
      if (!foundIds.has(id)) {
        throw new QuestionThemeNotFoundError(id);
      }
    }
  }

  /**
   * Returns the found themes in no guaranteed order.
   *
   * @throws `QuestionThemeNotFoundError` for the first requested id that matches no theme.
   */
  public async getByIdsOrThrow(ids: Set<string>): Promise<QuestionTheme[]> {
    const foundQuestionThemes = await this.questionThemeRepository.findByIds(ids);
    const foundQuestionThemeIds = new Set(foundQuestionThemes.map(theme => theme.id));
    if (foundQuestionThemeIds.size !== ids.size) {
      GetQuestionThemesByIdsOrThrowUseCase.throwErrorForMissingQuestionThemeIds(ids, foundQuestionThemeIds);
    }
    return foundQuestionThemes;
  }
}