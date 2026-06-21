import { QuestionThemeAssignmentAbsentError } from "./question-theme-assignment-absent.error";

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