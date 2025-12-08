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

class QuestionThemeSlugAlreadyExistsError extends Error {
  public constructor(slug: string) {
    super(`Question theme with slug ${slug} already exists`);
    this.name = "QuestionThemeSlugAlreadyExistsError";
  }
}

export {
  QuestionThemeNotFoundError,
  QuestionThemeAlreadyArchivedError,
  QuestionThemeSlugAlreadyExistsError,
};