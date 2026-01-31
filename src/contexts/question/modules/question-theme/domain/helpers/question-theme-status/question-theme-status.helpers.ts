import { QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

function findArchivedQuestionTheme(themes: QuestionTheme[]): QuestionTheme | undefined {
  return themes.find(theme => theme.status === QUESTION_THEME_STATUS_ARCHIVED);
}

export {
  findArchivedQuestionTheme,
};