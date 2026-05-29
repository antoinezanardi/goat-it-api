import { QuestionThemeReferencedByLiveQuestionsError } from "./question-theme-referenced-by-live-questions.error";

describe(QuestionThemeReferencedByLiveQuestionsError, () => {
  it("should have name QuestionThemeReferencedByLiveQuestionsError when created.", () => {
    const error = new QuestionThemeReferencedByLiveQuestionsError("themeId", 3);

    expect(error.name).toBe("QuestionThemeReferencedByLiveQuestionsError");
  });

  it("should have message with theme id and live question count when created.", () => {
    const error = new QuestionThemeReferencedByLiveQuestionsError("themeId", 3);

    expect(error.message).toBe("Question theme with id themeId is referenced by 3 live question(s) and cannot be archived");
  });
});