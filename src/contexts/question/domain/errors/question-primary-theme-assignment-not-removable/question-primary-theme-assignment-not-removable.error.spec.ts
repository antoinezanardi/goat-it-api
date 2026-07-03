import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";

describe(QuestionPrimaryThemeAssignmentNotRemovableError, () => {
  it("should set message when constructed.", () => {
    const themeId = "t4";
    const questionId = "q5";
    const error = new QuestionPrimaryThemeAssignmentNotRemovableError(themeId, questionId);

    expect(error.message).toBe(`Primary question theme with id ${themeId} cannot be removed from question with id ${questionId}. Switch primary to another theme first`);
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionPrimaryThemeAssignmentNotRemovableError("t", "q");

    expect(error.name).toBe("QuestionPrimaryThemeAssignmentNotRemovableError");
  });
});