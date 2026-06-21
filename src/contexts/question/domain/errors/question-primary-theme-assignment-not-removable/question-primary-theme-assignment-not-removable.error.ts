export class QuestionPrimaryThemeAssignmentNotRemovableError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Primary question theme with id ${questionThemeId} cannot be removed from question with id ${questionId}. Switch primary to another theme first`);
    this.name = "QuestionPrimaryThemeAssignmentNotRemovableError";
  }
}