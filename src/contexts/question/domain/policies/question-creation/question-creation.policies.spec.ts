import { computeQuestionStatusFromAuthorRole } from "@question/domain/policies/question-creation/question-creation.policies";

import type { QuestionCreationAuthorRole } from "@question/domain/value-objects/question-author/question-author.types";
import type { QuestionCreationStatus } from "@question/domain/value-objects/question-status/question-status.types";

describe("Question Creation Policies", () => {
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
});