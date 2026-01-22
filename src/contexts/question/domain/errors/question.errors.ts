class QuestionNotFoundError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} not found`);
    this.name = "QuestionNotFoundError";
  }
}

class QuestionCreationError extends Error {
  public constructor() {
    super(`Failed to create question`);
    this.name = "QuestionCreationError";
  }
}

export {
  QuestionNotFoundError,
  QuestionCreationError,
};