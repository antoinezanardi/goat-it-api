import { QUESTION_STATUS_ARCHIVED } from "@question/domain/value-objects/question-status/question-status.constants";
import { QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.constants";

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

class QuestionMinimumThemesError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} must have at least ${QUESTION_THEME_ASSIGNMENTS_MIN_ITEMS} theme assigned`);
    this.name = "QuestionMinimumThemesError";
  }
}

export {
  QuestionNotFoundError,
  QuestionCreationError,
  QuestionAlreadyArchivedError,
  QuestionMinimumThemesError,
};