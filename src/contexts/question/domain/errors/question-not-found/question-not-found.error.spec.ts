import { QuestionNotFoundError } from "@question/domain/errors/question-not-found/question-not-found.error";

describe(QuestionNotFoundError, () => {
  it("should set message when constructed.", () => {
    const id = "abc123";
    const error = new QuestionNotFoundError(id);

    expect(error.message).toBe(`Question with id ${id} not found`);
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionNotFoundError("x");

    expect(error.name).toBe("QuestionNotFoundError");
  });
});