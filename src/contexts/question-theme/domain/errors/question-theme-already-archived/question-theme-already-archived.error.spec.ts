import { QuestionThemeAlreadyArchivedError } from "./question-theme-already-archived.error";

describe(QuestionThemeAlreadyArchivedError, () => {
  it("should have name QuestionThemeAlreadyArchivedError when created.", () => {
    const error = new QuestionThemeAlreadyArchivedError("themeId");

    expect(error.name).toBe("QuestionThemeAlreadyArchivedError");
  });

  it("should have message with theme id when created.", () => {
    const error = new QuestionThemeAlreadyArchivedError("themeId");

    expect(error.message).toBe("Question theme with id themeId already has status 'archived'");
  });
});