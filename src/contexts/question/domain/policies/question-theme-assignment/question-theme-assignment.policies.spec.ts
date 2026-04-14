import { QuestionPrimaryThemeAssignmentNotRemovableError, QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment/question-theme-assignment.errors";
import { ensureQuestionThemeAssignmentIsRemovable, ensureQuestionThemeAssignmentIsModifiable } from "@question/domain/policies/question-theme-assignment/question-theme-assignment.policies";

import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question/question-theme/entity/question-theme.entity.faketory";

describe("Question Theme Assignment Policies", () => {
  describe(ensureQuestionThemeAssignmentIsRemovable, () => {
    it("should not throw when the theme assignment is not primary.", () => {
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }), isPrimary: false }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }), isPrimary: true }),
        ],
      });

      expect(() => ensureQuestionThemeAssignmentIsRemovable(question, "theme-1")).not.toThrow();
    });

    it("should throw QuestionThemeAssignmentAbsentError when the theme is not assigned to the question.", () => {
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }), isPrimary: false })],
      });

      expect(() => ensureQuestionThemeAssignmentIsRemovable(question, "missing-theme")).toThrow(QuestionThemeAssignmentAbsentError);
    });

    it("should throw QuestionPrimaryThemeAssignmentNotRemovableError when the theme assignment is primary.", () => {
      const question = createFakeQuestion({
        themes: [
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }), isPrimary: true }),
          createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-2" }), isPrimary: false }),
        ],
      });

      expect(() => ensureQuestionThemeAssignmentIsRemovable(question, "theme-1")).toThrow(QuestionPrimaryThemeAssignmentNotRemovableError);
    });
  });

  describe(ensureQuestionThemeAssignmentIsModifiable, () => {
    it("should not throw when the theme is assigned to the question.", () => {
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })],
      });

      expect(() => ensureQuestionThemeAssignmentIsModifiable(question, "theme-1")).not.toThrow();
    });

    it("should throw QuestionThemeAssignmentAbsentError when the theme is not assigned to the question.", () => {
      const question = createFakeQuestion({
        themes: [createFakeQuestionThemeAssignment({ theme: createFakeQuestionTheme({ id: "theme-1" }) })],
      });

      expect(() => ensureQuestionThemeAssignmentIsModifiable(question, "missing-theme")).toThrow(QuestionThemeAssignmentAbsentError);
    });
  });
});