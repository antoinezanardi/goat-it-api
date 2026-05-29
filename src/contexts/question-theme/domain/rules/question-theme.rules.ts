import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

function isQuestionThemeArchived(questionTheme: QuestionTheme): questionTheme is QuestionTheme & { status: typeof QUESTION_THEME_STATUS_ARCHIVED } {
  return questionTheme.status === QUESTION_THEME_STATUS_ARCHIVED;
}

function ensureNoLiveQuestionsReferenceTheme(liveQuestionCount: number, questionThemeId: string): void {
  if (liveQuestionCount > 0) {
    throw new QuestionThemeReferencedByLiveQuestionsError(questionThemeId, liveQuestionCount);
  }
}

function findArchivedQuestionTheme(themes: QuestionTheme[]): QuestionTheme | undefined {
  return themes.find(isQuestionThemeArchived);
}

export {
  ensureNoLiveQuestionsReferenceTheme,
  findArchivedQuestionTheme,
  isQuestionThemeArchived,
};