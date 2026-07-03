import { QuestionThemeNotFoundError } from "@question-theme/domain/errors/question-theme-not-found/question-theme-not-found.error";

describe(QuestionThemeNotFoundError, () => {
  it("should have name QuestionThemeNotFoundError when created.", () => {
    const error = new QuestionThemeNotFoundError("themeId");

    expect(error.name).toBe("QuestionThemeNotFoundError");
  });

  it("should have message with theme id when created.", () => {
    const error = new QuestionThemeNotFoundError("themeId");

    expect(error.message).toBe("Question theme with id themeId not found");
  });
});