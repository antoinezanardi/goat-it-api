import {
  zQuestionThemeAssignmentIsPrimary,
  zQuestionThemeAssignmentIsHint,
} from "@question/application/dto/shared/zod/validators/question-theme-assignment/question-theme-assignment.dto.zod.validators";

describe("Question Theme Assignment DTO Zod Validators", () => {
  describe(zQuestionThemeAssignmentIsPrimary, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when a boolean true is provided",
        value: true,
        expected: true,
      },
      {
        test: "should return true when a boolean false is provided",
        value: false,
        expected: true,
      },
      {
        test: "should return false when a string is provided",
        value: "true",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeAssignmentIsPrimary().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeAssignmentIsPrimary();

      expect(schema.description).toBe("Indicates if the assigned theme is the primary theme for the question");
    });
  });

  describe(zQuestionThemeAssignmentIsHint, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when a boolean true is provided",
        value: true,
        expected: true,
      },
      {
        test: "should return true when a boolean false is provided",
        value: false,
        expected: true,
      },
      {
        test: "should return false when a string is provided",
        value: "true",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeAssignmentIsHint().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeAssignmentIsHint();

      expect(schema.description).toBe("Indicates if the assigned theme is a hint for the question's answer");
    });
  });
});