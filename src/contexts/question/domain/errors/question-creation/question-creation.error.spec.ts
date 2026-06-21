import { QuestionCreationError } from "./question-creation.error";

describe(QuestionCreationError, () => {
  it("should set message when constructed.", () => {
    const error = new QuestionCreationError();

    expect(error.message).toBe("Failed to create question");
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionCreationError();

    expect(error.name).toBe("QuestionCreationError");
  });
});