import { getDerivedErrorCodeFromClassName } from "@shared/infrastructure/http/errors/helpers/errors.helpers";

describe("Error Helpers", () => {
  describe(getDerivedErrorCodeFromClassName, () => {
    it.each<{
      test: string;
      input: string;
      expected: string;
    }>([
      {
        test: "should return kebab-case code when class name ends with Error.",
        input: "QuestionNotFoundError",
        expected: "question-not-found",
      },
      {
        test: "should return code when class name is a single word.",
        input: "ValidationError",
        expected: "validation",
      },
      {
        test: "should return kebab-case code when class name contains multiple words.",
        input: "InvalidQuestionThemeError",
        expected: "invalid-question-theme",
      },
      {
        test: "should return kebab-case code when class name does not end with Error.",
        input: "InvalidQuestion",
        expected: "invalid-question",
      },
      {
        test: "should return correct code when class name contains consecutive uppercase letters.",
        input: "IOError",
        expected: "io",
      },
      {
        test: "should not remove 'Error' when it appears in the middle of the class name.",
        input: "ErrorInTheMiddle",
        expected: "error-in-the-middle",
      },
      {
        test: "should return kebab-case code when class name starts with uppercase.",
        input: "MyCustomError",
        expected: "my-custom",
      },
      {
        test: "should return empty code when class name is exactly 'Error'.",
        input: "Error",
        expected: "",
      },
      {
        test: "should return single-letter code when class name has a single character before 'Error'.",
        input: "AError",
        expected: "a",
      },
    ])("$test", ({ input, expected }) => {
      expect(getDerivedErrorCodeFromClassName(input)).toBe(expected);
    });
  });
});