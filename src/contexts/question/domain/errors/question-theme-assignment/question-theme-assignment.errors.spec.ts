import {
  QuestionThemeAssignmentAlreadyExistsError,
  QuestionThemeAssignmentAbsentError,
  QuestionThemeAssignmentCreationError,
  QuestionThemeAssignmentRemovalError,
} from "./question-theme-assignment.errors";

describe("Question Theme Assignment Domain Errors", () => {
  describe(QuestionThemeAssignmentAlreadyExistsError, () => {
    it("should set message when constructed.", () => {
      const assignmentId = "a1";
      const questionId = "q1";
      const error = new QuestionThemeAssignmentAlreadyExistsError(assignmentId, questionId);

      expect(error.message).toBe(`Question theme assignment with id ${assignmentId} already exists in question with id ${questionId}`);
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionThemeAssignmentAlreadyExistsError("a", "q");

      expect(error.name).toBe("QuestionThemeAssignmentAlreadyExistsError");
    });
  });

  describe(QuestionThemeAssignmentAbsentError, () => {
    it("should set message when constructed.", () => {
      const themeId = "t1";
      const questionId = "q2";
      const error = new QuestionThemeAssignmentAbsentError(themeId, questionId);

      expect(error.message).toBe(`Question theme with id ${themeId} is not assigned to question with id ${questionId}`);
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionThemeAssignmentAbsentError("t", "q");

      expect(error.name).toBe("QuestionThemeAssignmentAbsentError");
    });
  });

  describe(QuestionThemeAssignmentCreationError, () => {
    it("should set message when constructed.", () => {
      const themeId = "t2";
      const questionId = "q3";
      const error = new QuestionThemeAssignmentCreationError(themeId, questionId);

      expect(error.message).toBe(`Question theme with id ${themeId} could not be assigned in question with id ${questionId}`);
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionThemeAssignmentCreationError("t", "q");

      expect(error.name).toBe("QuestionThemeAssignmentCreationError");
    });
  });

  describe(QuestionThemeAssignmentRemovalError, () => {
    it("should set message when constructed.", () => {
      const themeId = "t3";
      const questionId = "q4";
      const error = new QuestionThemeAssignmentRemovalError(themeId, questionId);

      expect(error.message).toBe(`Question theme with id ${themeId} could not be removed from question with id ${questionId}`);
    });

    it("should have correct name when constructed.", () => {
      const error = new QuestionThemeAssignmentRemovalError("t", "q");

      expect(error.name).toBe("QuestionThemeAssignmentRemovalError");
    });
  });
});