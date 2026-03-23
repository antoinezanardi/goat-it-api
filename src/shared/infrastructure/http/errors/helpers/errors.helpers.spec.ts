import { getDerivedErrorCodeFromClassName } from "./errors.helpers";

describe("Error Helpers", () => {
  describe(getDerivedErrorCodeFromClassName, () => {
    it.each<{
      test: string;
      input: string;
      expected: string;
    }>([
      {
        test: "should convert class name to kebab-case and remove Error suffix",
        input: "QuestionNotFoundError",
        expected: "question-not-found",
      },
      {
        test: "should handle single word error class name",
        input: "ValidationError",
        expected: "validation",
      },
      {
        test: "should handle error class name with multiple words",
        input: "InvalidQuestionThemeError",
        expected: "invalid-question-theme",
      },
      {
        test: "should handle error class name without Error suffix",
        input: "InvalidQuestion",
        expected: "invalid-question",
      },
      {
        test: "should handle error class name with consecutive uppercase letters",
        input: "IOError",
        expected: "io",
      },
      {
        test: "should not remove Error suffix when not at the end of the class name.",
        input: "ErrorInTheMiddle",
        expected: "error-in-the-middle",
      },
      {
        test: "should handle error class name starting with uppercase",
        input: "MyCustomError",
        expected: "my-custom",
      },
      {
        test: "should handle very short error class name with Error suffix",
        input: "Error",
        expected: "",
      },
      {
        test: "should handle single character word before Error suffix",
        input: "AError",
        expected: "a",
      },
    ])("$test", ({ input, expected }) => {
      expect(getDerivedErrorCodeFromClassName(input)).toBe(expected);
    });
  });
});