import { QuestionThemeAssignmentRemovalError } from "@question/domain/errors/question-theme-assignment-removal/question-theme-assignment-removal.error";

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