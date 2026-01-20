import { QuestionPersistenceMappingError } from "@question/infrastructure/persistence/mongoose/errors/question.mongoose.errors";

describe("Question Mongoose Errors", () => {
  describe(QuestionPersistenceMappingError, () => {
    it("should have the correct name when created.", () => {
      const error = new QuestionPersistenceMappingError("question-id-123");

      expect(error.name).toBe("QuestionPersistenceMappingError");
    });

    it("should include details in the message when provided.", () => {
      const error = new QuestionPersistenceMappingError("question-id-123", "Missing gameId for question author with role 'game'");

      expect(error.message).toBe("Failed to map Question with ID 'question-id-123' from persistence layer. Cause: Missing gameId for question author with role 'game'");
    });

    it("should not include details in the message when not provided.", () => {
      const error = new QuestionPersistenceMappingError("question-id-123");

      expect(error.message).toBe("Failed to map Question with ID 'question-id-123' from persistence layer.");
    });
  });
});