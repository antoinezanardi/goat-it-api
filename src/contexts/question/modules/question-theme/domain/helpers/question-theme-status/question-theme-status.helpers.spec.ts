import { findArchivedQuestionTheme } from "@question/modules/question-theme/domain/helpers/question-theme-status/question-theme-status.helpers";
import {
  DEFAULT_QUESTION_THEME_STATUS,
  QUESTION_THEME_STATUS_ARCHIVED,
} from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";

import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question/modules/question-theme/domain/entities/question-theme.types";

describe("QuestionThemeStatus Predicates", () => {
  describe(findArchivedQuestionTheme, () => {
    it("should return the archived theme when at least one theme is archived.", () => {
      const themes: QuestionTheme[] = [
        createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS }),
        createFakeQuestionTheme({ status: QUESTION_THEME_STATUS_ARCHIVED }),
      ];

      const result = findArchivedQuestionTheme(themes);

      expect(result).toStrictEqual<QuestionTheme>(themes[1]);
    });

    it("should return undefined when none of the themes are archived.", () => {
      const themes: QuestionTheme[] = [
        createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS }),
        createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS }),
      ];

      const result = findArchivedQuestionTheme(themes);

      expect(result).toBeUndefined();
    });

    it("should return undefined when given an empty array.", () => {
      const themes: QuestionTheme[] = [];

      const result = findArchivedQuestionTheme(themes);

      expect(result).toBeUndefined();
    });
  });
});