export class ReferencedQuestionThemeArchivedError extends Error {
  public constructor(questionThemeId: string) {
    super(`Referenced question theme with id ${questionThemeId} is archived`);
    this.name = "ReferencedQuestionThemeArchivedError";
  }
}