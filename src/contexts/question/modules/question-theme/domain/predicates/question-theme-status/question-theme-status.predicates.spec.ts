import { isQuestionThemeArchived } from "@question/modules/question-theme/domain/predicates/question-theme-status/question-theme-status.predicates";
import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

describe("Question Theme Status Predicates", () => {
  describe(isQuestionThemeArchived, () => {
    it("should return true when question theme status is archived.", () => {
      const theme = createFakeQuestionTheme({ status: QUESTION_THEME_STATUS_ARCHIVED });

      const isArchived = isQuestionThemeArchived(theme);

      expect(isArchived).toBeTruthy();
    });

    it("should return false when question theme status is not archived.", () => {
      const theme = createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS });

      const isArchived = isQuestionThemeArchived(theme);

      expect(isArchived).toBeFalsy();
    });
  });
});