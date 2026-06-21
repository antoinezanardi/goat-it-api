import { QuestionThemeAssignmentCreationError } from "./question-theme-assignment-creation.error";

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