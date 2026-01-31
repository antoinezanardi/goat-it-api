import { findQuestionThemeAssignmentInQuestionById } from "@question/domain/helpers/question-theme-assignment/question-theme-assignment.helpers";

import { createFakeQuestion } from "@faketories/contexts/question/entity/question.entity.faketory";

import type { QuestionThemeAssignment } from "@question/domain/value-objects/question-theme-assignment/question-theme-assignment.types";

describe("Question Theme Assignments Helpers", () => {
  describe(findQuestionThemeAssignmentInQuestionById, () => {
    it("should return the question theme assignment when it exists in the question.", () => {
      const question = createFakeQuestion();
      const expected = question.themes[0];

      const actual = findQuestionThemeAssignmentInQuestionById(question, expected.theme.id);

      expect(actual).toStrictEqual<QuestionThemeAssignment>(expected);
    });

    it("should return undefined when the question theme assignment does not exist.", () => {
      const question = createFakeQuestion();

      const actual = findQuestionThemeAssignmentInQuestionById(question, "non-existent-id");

      expect(actual).toBeUndefined();
    });
  });
});