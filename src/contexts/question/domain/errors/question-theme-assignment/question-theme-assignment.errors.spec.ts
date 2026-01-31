import { QuestionThemeAssignmentAlreadyExistsError, QuestionThemeAssignmentCreationError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";

describe("Question Theme Assignment Errors", () => {
  describe(QuestionThemeAssignmentAlreadyExistsError, () => {
    it("should set message including ids when constructed.", () => {
      const error = new QuestionThemeAssignmentAlreadyExistsError("theme-1", "question-1");

      expect(error.message).toBe("Question theme assignment with id theme-1 already exists in question with id question-1");
    });

    it("should set the error name to QuestionThemeAssignmentAlreadyExistsError when constructed.", () => {
      const error = new QuestionThemeAssignmentAlreadyExistsError("t", "q");

      expect(error.name).toBe("QuestionThemeAssignmentAlreadyExistsError");
    });
  });

  describe(QuestionThemeAssignmentCreationError, () => {
    it("should set message including ids when constructed.", () => {
      const error = new QuestionThemeAssignmentCreationError("theme-2", "question-2");

      expect(error.message).toBe("Question theme assignment with id theme-2 could not be created in question with id question-2");
    });

    it("should set the error name to QuestionThemeAssignmentCreationError when constructed.", () => {
      const error = new QuestionThemeAssignmentCreationError("t", "q");

      expect(error.name).toBe("QuestionThemeAssignmentCreationError");
    });
  });
});