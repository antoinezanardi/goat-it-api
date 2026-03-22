import { QuestionThemeReferencedByLiveQuestionsError } from "@question/modules/question-theme/domain/errors/question-theme.errors";
import { ensureNoLiveQuestionsReferenceTheme } from "@question/modules/question-theme/domain/policies/question-theme-archive/question-theme-archive.policies";

describe("Question Theme Archive Policies", () => {
  describe(ensureNoLiveQuestionsReferenceTheme, () => {
    it("should not throw when no live questions reference the theme.", () => {
      expect(() => {
        ensureNoLiveQuestionsReferenceTheme(0, "themeId");
      }).not.toThrow();
    });

    it("should throw QuestionThemeReferencedByLiveQuestionsError when live question count > 0.", () => {
      expect(() => {
        ensureNoLiveQuestionsReferenceTheme(5, "themeId");
      }).toThrow(QuestionThemeReferencedByLiveQuestionsError);
    });
  });
});