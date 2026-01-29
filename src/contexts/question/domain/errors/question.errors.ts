import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";

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

class QuestionAlreadyArchivedError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} already has status '${QUESTION_STATUS_ARCHIVED}'`);
    this.name = "QuestionAlreadyArchivedError";
  }
}

export {
  QuestionNotFoundError,
  QuestionCreationError,
  QuestionAlreadyArchivedError,
};