import { QuestionThemeAlreadyArchivedError, QuestionThemeNotFoundError } from "@question/modules/question-theme/domain/errors/question-theme.errors";

describe("Question Theme Errors", () => {
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
});