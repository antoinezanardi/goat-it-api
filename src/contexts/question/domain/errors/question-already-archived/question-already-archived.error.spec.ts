import { QUESTION_STATUS_ARCHIVED } from "@question/domain/constants/question.constants";
import { QuestionAlreadyArchivedError } from "@question/domain/errors/question-already-archived/question-already-archived.error";

describe(QuestionAlreadyArchivedError, () => {
  it("should set message including status when constructed.", () => {
    const id = "zzz";
    const error = new QuestionAlreadyArchivedError(id);

    expect(error.message).toBe(`Question with id ${id} already has status '${QUESTION_STATUS_ARCHIVED}'`);
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionAlreadyArchivedError("id");

    expect(error.name).toBe("QuestionAlreadyArchivedError");
  });
});