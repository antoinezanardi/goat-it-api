export class QuestionThemeAssignmentAbsentError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme with id ${questionThemeId} is not assigned to question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentAbsentError";
  }
}