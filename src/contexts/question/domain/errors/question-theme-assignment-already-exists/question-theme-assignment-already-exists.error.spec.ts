import { QuestionThemeAssignmentAlreadyExistsError } from "@question/domain/errors/question-theme-assignment-already-exists/question-theme-assignment-already-exists.error";

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