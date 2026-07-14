import { ReferencedQuestionThemeArchivedError } from "@question-theme/domain/errors/referenced-question-theme-archived/referenced-question-theme-archived.error";

describe(ReferencedQuestionThemeArchivedError, () => {
  it("should have name ReferencedQuestionThemeArchivedError when created.", () => {
    const error = new ReferencedQuestionThemeArchivedError("themeId");

    expect(error.name).toBe("ReferencedQuestionThemeArchivedError");
  });

  it("should have message with theme id when created.", () => {
    const error = new ReferencedQuestionThemeArchivedError("themeId");

    expect(error.message).toBe("Referenced question theme with id themeId is archived");
  });
});