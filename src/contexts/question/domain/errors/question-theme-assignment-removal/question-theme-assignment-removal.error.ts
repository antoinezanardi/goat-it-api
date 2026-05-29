export class QuestionThemeAssignmentRemovalError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme with id ${questionThemeId} could not be removed from question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentRemovalError";
  }
}