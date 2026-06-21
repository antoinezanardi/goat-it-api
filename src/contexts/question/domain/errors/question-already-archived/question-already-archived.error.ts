import { QUESTION_STATUS_ARCHIVED } from "@question/domain/constants/question.constants";

export class QuestionAlreadyArchivedError extends Error {
  public constructor(questionId: string) {
    super(`Question with id ${questionId} already has status '${QUESTION_STATUS_ARCHIVED}'`);
    this.name = "QuestionAlreadyArchivedError";
  }
}