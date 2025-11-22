class QuestionThemeNotFoundError extends Error {
  public constructor(questionThemeId: string) {
    super(`Question theme with id ${questionThemeId} not found`);
    this.name = "QuestionThemeNotFoundError";
  }
}

class QuestionThemeAlreadyArchivedError extends Error {
  public constructor(questionThemeId: string) {
    super(`Question theme with id ${questionThemeId} already has status 'archived'`);
    this.name = "QuestionThemeAlreadyArchivedError";
  }
}

export {
  QuestionThemeNotFoundError,
  QuestionThemeAlreadyArchivedError,
};