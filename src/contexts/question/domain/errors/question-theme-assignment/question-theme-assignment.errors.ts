class QuestionThemeAssignmentAlreadyExistsError extends Error {
  public constructor(questionThemeAssignmentId: string, questionId: string) {
    super(`Question theme assignment with id ${questionThemeAssignmentId} already exists in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentAlreadyExistsError";
  }
}

class QuestionThemeAssignmentAbsentError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme with id ${questionThemeId} is not assigned to question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentAbsentError";
  }
}

class QuestionThemeAssignmentCreationError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme with id ${questionThemeId} could not be assigned in question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentCreationError";
  }
}

class QuestionThemeAssignmentRemovalError extends Error {
  public constructor(questionThemeId: string, questionId: string) {
    super(`Question theme with id ${questionThemeId} could not be removed from question with id ${questionId}`);
    this.name = "QuestionThemeAssignmentRemovalError";
  }
}

export {
  QuestionThemeAssignmentAlreadyExistsError,
  QuestionThemeAssignmentAbsentError,
  QuestionThemeAssignmentCreationError,
  QuestionThemeAssignmentRemovalError,
};