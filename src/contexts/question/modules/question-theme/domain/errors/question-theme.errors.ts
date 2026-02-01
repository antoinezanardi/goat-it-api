import { QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

class QuestionThemeNotFoundError extends Error {
  public constructor(questionThemeId: string) {
    super(`Question theme with id ${questionThemeId} not found`);
    this.name = "QuestionThemeNotFoundError";
  }
}

class QuestionThemeAlreadyArchivedError extends Error {
  public constructor(questionThemeId: string) {
    super(`Question theme with id ${questionThemeId} already has status '${QUESTION_THEME_STATUS_ARCHIVED}'`);
    this.name = "QuestionThemeAlreadyArchivedError";
  }
}

class QuestionThemeSlugAlreadyExistsError extends Error {
  public constructor(slug: string) {
    super(`Question theme with slug ${slug} already exists`);
    this.name = "QuestionThemeSlugAlreadyExistsError";
  }
}

class ReferencedQuestionThemeArchivedError extends Error {
  public constructor(questionThemeId: string) {
    super(`Referenced question theme with id ${questionThemeId} is archived`);
    this.name = "ReferencedQuestionThemeArchivedError";
  }
}

export {
  QuestionThemeNotFoundError,
  QuestionThemeAlreadyArchivedError,
  QuestionThemeSlugAlreadyExistsError,
  ReferencedQuestionThemeArchivedError,
};