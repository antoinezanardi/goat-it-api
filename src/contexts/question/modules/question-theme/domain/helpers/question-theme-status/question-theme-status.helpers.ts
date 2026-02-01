import { isQuestionThemeArchived } from "@question/modules/question-theme/domain/predicates/question-theme-status/question-theme-status.predicates";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

function findArchivedQuestionTheme(themes: QuestionTheme[]): QuestionTheme | undefined {
  return themes.find(isQuestionThemeArchived);
}

export {
  findArchivedQuestionTheme,
};