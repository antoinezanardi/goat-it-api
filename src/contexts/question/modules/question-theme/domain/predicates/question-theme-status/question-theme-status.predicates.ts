import { QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

function isQuestionThemeArchived(questionTheme: QuestionTheme): questionTheme is QuestionTheme & { status: typeof QUESTION_THEME_STATUS_ARCHIVED } {
  return questionTheme.status === QUESTION_THEME_STATUS_ARCHIVED;
}

export {
  isQuestionThemeArchived,
};