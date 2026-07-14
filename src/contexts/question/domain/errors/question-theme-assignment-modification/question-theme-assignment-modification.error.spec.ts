import { QuestionThemeAssignmentModificationError } from "@question/domain/errors/question-theme-assignment-modification/question-theme-assignment-modification.error";

describe(QuestionThemeAssignmentModificationError, () => {
  it("should set message when constructed.", () => {
    const themeId = "t1";
    const questionId = "q1";
    const error = new QuestionThemeAssignmentModificationError(themeId, questionId);

    expect(error.message).toBe(`Question theme assignment with id ${themeId} could not be modified in question with id ${questionId}`);
  });

  it("should have correct name when constructed.", () => {
    const error = new QuestionThemeAssignmentModificationError("t", "q");

    expect(error.name).toBe("QuestionThemeAssignmentModificationError");
  });
});