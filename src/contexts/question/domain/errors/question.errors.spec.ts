import { QuestionNotFoundError } from "@question/domain/errors/question.errors";

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
});