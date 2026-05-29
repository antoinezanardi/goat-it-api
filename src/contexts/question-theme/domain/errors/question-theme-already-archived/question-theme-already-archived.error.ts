import { QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";

export class QuestionThemeAlreadyArchivedError extends Error {
  public constructor(questionThemeId: string) {
    super(`Question theme with id ${questionThemeId} already has status '${QUESTION_THEME_STATUS_ARCHIVED}'`);
    this.name = "QuestionThemeAlreadyArchivedError";
  }
}