export class QuestionThemeAssignmentCreationError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme with id ${questionThemeId} could not be assigned in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentCreationError";
  }
}