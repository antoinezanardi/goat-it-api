import { QuestionThemeReferencedByLiveQuestionsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

function ensureNoLiveQuestionsReferenceTheme(liveQuestionCount: number, questionThemeId: string): void {
  if (liveQuestionCount > 0) {
    throw new QuestionThemeReferencedByLiveQuestionsError(questionThemeId, liveQuestionCount);
  }
}

export {
  ensureNoLiveQuestionsReferenceTheme,
};