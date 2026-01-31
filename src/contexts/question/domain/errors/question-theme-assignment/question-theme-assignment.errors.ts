class QuestionThemeAssignmentAlreadyExistsError extends Error {
  public constructor(questionThemeAssignmentId: string, questionId: string) {
    super(`Question theme assignment with id ${questionThemeAssignmentId} already exists in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentAlreadyExistsError";
  }
}

class QuestionThemeAssignmentCreationError extends Error {
  public constructor(questionThemeAssignmentId: string, questionId: string) {
    super(`Question theme assignment with id ${questionThemeAssignmentId} could not be created in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentCreationError";
  }
}

export {
  QuestionThemeAssignmentAlreadyExistsError,
  QuestionThemeAssignmentCreationError,
};