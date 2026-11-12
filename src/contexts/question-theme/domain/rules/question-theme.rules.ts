import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

/**
 * Narrows the theme status to archived so callers branch on the archived case without re-reading the status constant.
 */
function isQuestionThemeArchived(questionTheme: QuestionTheme): questionTheme is QuestionTheme & { status: typeof QUESTION_THEME_STATUS_ARCHIVED } {
  return questionTheme.status === QUESTION_THEME_STATUS_ARCHIVED;
}

/**
 * Protects the theme-archive invariant: a theme still referenced by at least one live question must not be archived.
 *
 * @throws `QuestionThemeReferencedByLiveQuestionsError` when `liveQuestionCount` is greater than zero.
 */
function ensureNoLiveQuestionsReferenceTheme(liveQuestionCount: number, questionThemeId: string): void {
  if (liveQuestionCount > 0) {
    throw new QuestionThemeReferencedByLiveQuestionsError(questionThemeId, liveQuestionCount);
  }
}

/**
 * Returns the first archived theme in the list, or `undefined` when no theme is archived.
 */
function findArchivedQuestionTheme(themes: QuestionTheme[]): QuestionTheme | undefined {
  return themes.find(isQuestionThemeArchived);
}

export {
  ensureNoLiveQuestionsReferenceTheme,
  findArchivedQuestionTheme,
  isQuestionThemeArchived,
};