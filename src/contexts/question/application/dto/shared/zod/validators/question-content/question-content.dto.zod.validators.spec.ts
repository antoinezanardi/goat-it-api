import {
  QUESTION_ANSWER_EXAMPLE,
  QUESTION_CONTEXT_EXAMPLE,
  QUESTION_STATEMENT_EXAMPLE,
  QUESTION_TRIVIA_EXAMPLE,
} from "@question/application/dto/shared/zod/validators/question-content/constants/question-content.zod.validators.constants";
import {
  zQuestionStatement,
  zQuestionLocalizedStatement,
  zQuestionAnswer,
  zQuestionLocalizedAnswer,
  zQuestionContext,
  zQuestionLocalizedContext,
  zQuestionTrivia,
  zQuestionLocalizedTrivia,
} from "@question/application/dto/shared/zod/validators/question-content/question-content.dto.zod.validators";

describe("Question Content DTO Zod Validators", () => {
  describe(zQuestionStatement, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid string.",
        value: "any string",
        expected: true,
      },
      {
        test: "should return false when value is not a string.",
        value: 123,
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionStatement();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionStatement();

      expect(schema.description).toBe("Question's statement");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionStatement();
      const expectedMeta = {
        description: "Question's statement",
        example: QUESTION_STATEMENT_EXAMPLE,
      };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionLocalizedStatement, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized text object.",
        value: { en: "text" },
        expected: true,
      },
      {
        test: "should return false when value is an empty object.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionLocalizedStatement();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionLocalizedStatement();

      expect(schema.description).toBe("Question's statement");
    });
  });

  describe(zQuestionAnswer, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid string.",
        value: "any string",
        expected: true,
      },
      {
        test: "should return false when value is not a string.",
        value: 123,
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionAnswer();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionAnswer();

      expect(schema.description).toBe("Question's answer");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionAnswer();
      const expectedMeta = {
        description: "Question's answer",
        example: QUESTION_ANSWER_EXAMPLE,
      };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionLocalizedAnswer, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized text object.",
        value: { en: "text" },
        expected: true,
      },
      {
        test: "should return false when value is an empty object.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionLocalizedAnswer();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionLocalizedAnswer();

      expect(schema.description).toBe("Question's answer");
    });
  });

  describe(zQuestionContext, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid string.",
        value: "any string",
        expected: true,
      },
      {
        test: "should return false when value is not a string.",
        value: 123,
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionContext();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionContext();

      expect(schema.description).toBe("Additional context for the question");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionContext();
      const expectedMeta = {
        description: "Additional context for the question",
        example: QUESTION_CONTEXT_EXAMPLE,
      };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionLocalizedContext, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized text object.",
        value: { en: "text" },
        expected: true,
      },
      {
        test: "should return false when value is an empty object.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionLocalizedContext();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionLocalizedContext();

      expect(schema.description).toBe("Additional context for the question");
    });
  });

  describe(zQuestionTrivia, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid array of strings.",
        value: ["any"],
        expected: true,
      },
      {
        test: "should return false when value is not an array.",
        value: "not-an-array",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionTrivia();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionTrivia();

      expect(schema.description).toBe("Interesting trivia related to the question");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionTrivia();
      const expectedMeta = {
        description: "Interesting trivia related to the question",
        example: QUESTION_TRIVIA_EXAMPLE,
      };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionLocalizedTrivia, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized texts object.",
        value: { en: ["text"] },
        expected: true,
      },
      {
        test: "should return false when value is an empty object.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zQuestionLocalizedTrivia();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionLocalizedTrivia();

      expect(schema.description).toBe("Interesting trivia related to the question");
    });
  });
});