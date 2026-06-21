export class QuestionThemeNotFoundError extends Error {
  public constructor(questionThemeId: string) {
    super(`Question theme with id ${questionThemeId} not found`);
    this.name = "QuestionThemeNotFoundError";
  }
}