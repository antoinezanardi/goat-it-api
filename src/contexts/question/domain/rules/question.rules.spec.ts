import { QuestionPrimaryThemeAssignmentNotRemovableError } from "@question/domain/errors/question-primary-theme-assignment-not-removable/question-primary-theme-assignment-not-removable.error";
import { QuestionThemeAssignmentAbsentError } from "@question/domain/errors/question-theme-assignment-absent/question-theme-assignment-absent.error";
import { computeQuestionStatusFromAuthorRole, ensureQuestionThemeAssignmentIsModifiable, ensureQuestionThemeAssignmentIsRemovable, findQuestionThemeAssignmentInQuestionByThemeId } from "@question/domain/rules/question.rules";
import type { QuestionCreationAuthorRole, QuestionCreationStatus } from "@question/domain/types/question.value-objects";

import { createFakeQuestion, createFakeQuestionThemeAssignment } from "@faketories/contexts/question/entity/question.entity.faketory";
import { createFakeQuestionTheme } from "@faketories/contexts/question-theme/entity/question-theme.entity.faketory";

describe("Question Rules", () => {
  describe(computeQuestionStatusFromAuthorRole, () => {
    it.each<{
      test: string;
      input: QuestionCreationAuthorRole;
      expected: QuestionCreationStatus;
    }>([
      {
        test: "should return active when author role is admin",
        input: "admin",
        expected: "active",
      },
      {
        test: "should return pending when author role is ai",
        input: "ai",
        expected: "pending",
      },
    ])("$test", ({ input, expected }) => {
      const status = computeQuestionStatusFromAuthorRole(input);

      expect(status).toBe(expected);
    });
  });

  describe(findQuestionThemeAssignmentInQuestionByThemeId, () => {
    it("should return the question theme assignment when it exists in the question.", () => {
      const question = createFakeQuestion();
      const expected = question.themes[0];

      const actual = findQuestionThemeAssignmentInQuestionByThemeId(question, expected.theme.id);

      expect(actual).toStrictEqual(expected);
    });

    it("should return undefined when the question theme assignment does not exist.", () => {
      const question = createFakeQuestion();

      const actual = findQuestionThemeAssignmentInQuestionByThemeId(question, "non-existent-id");

      expect(actual).toBeUndefined();
    });
  });

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