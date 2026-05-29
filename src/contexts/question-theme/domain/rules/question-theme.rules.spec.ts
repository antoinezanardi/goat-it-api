import { ensureNoLiveQuestionsReferenceTheme, findArchivedQuestionTheme, isQuestionThemeArchived } from "@question-theme/domain/rules/question-theme.rules";
import { DEFAULT_QUESTION_THEME_STATUS, QUESTION_THEME_STATUS_ARCHIVED } from "@question-theme/domain/constants/question-theme.constants";
import { QuestionThemeReferencedByLiveQuestionsError } from "@question-theme/domain/errors/question-theme-referenced-by-live-questions/question-theme-referenced-by-live-questions.error";

import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

import type { QuestionTheme } from "@question-theme/domain/types/question-theme.entities";

describe("Question Theme Rules", () => {
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

  describe("Question Theme Status Helpers", () => {
    describe(findArchivedQuestionTheme, () => {
      it("should return the archived theme when at least one theme is archived.", () => {
        const themes: QuestionTheme[] = [
          createFakeQuestionTheme({ status: DEFAULT_QUESTION_THEME_STATUS }),
          createFakeQuestionTheme({ status: QUESTION_THEME_STATUS_ARCHIVED }),
        ];

        const result = findArchivedQuestionTheme(themes);

        expect(result).toStrictEqual(themes[1]);
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
});