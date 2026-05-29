import { QuestionThemeSlugAlreadyExistsError } from "./question-theme-slug-already-exists.error";

describe(QuestionThemeSlugAlreadyExistsError, () => {
  it("should have name QuestionThemeSlugAlreadyExistsError when created.", () => {
    const error = new QuestionThemeSlugAlreadyExistsError("themeSlug");

    expect(error.name).toBe("QuestionThemeSlugAlreadyExistsError");
  });

  it("should have message with theme slug when created.", () => {
    const error = new QuestionThemeSlugAlreadyExistsError("themeSlug");

    expect(error.message).toBe("Question theme with slug themeSlug already exists");
  });
});