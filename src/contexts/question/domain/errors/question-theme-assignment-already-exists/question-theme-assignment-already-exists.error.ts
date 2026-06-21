export class QuestionThemeAssignmentAlreadyExistsError extends Error {
  public constructor(questionThemeAssignmentId: string, questionId: string) {
    super(`Question theme assignment with id ${questionThemeAssignmentId} already exists in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentAlreadyExistsError";
  }
}