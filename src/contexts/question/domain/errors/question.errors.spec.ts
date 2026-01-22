import { QuestionCreationError, QuestionNotFoundError } from "@question/domain/errors/question.errors";

describe("Question Errors", () => {
  describe(QuestionNotFoundError, () => {
    it("should have the correct name when created.", () => {
      const questionId = "test-question-id";
      const error = new QuestionNotFoundError(questionId);

      expect(error.name).toBe("QuestionNotFoundError");
    });

    it("should have the correct message when created.", () => {
      const questionId = "test-question-id";
      const error = new QuestionNotFoundError(questionId);

      expect(error.message).toBe(`Question with id ${questionId} not found`);
    });
  });

  describe(QuestionCreationError, () => {
    it("should have the correct name when created.", () => {
      const error = new QuestionCreationError();

      expect(error.name).toBe("QuestionCreationError");
    });

    it("should have the correct message when created.", () => {
      const error = new QuestionCreationError();

      expect(error.message).toBe(`Failed to create question`);
    });
  });
});