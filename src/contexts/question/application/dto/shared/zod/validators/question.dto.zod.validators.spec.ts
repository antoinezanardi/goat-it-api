import { zQuestionCognitiveDifficulty, zQuestionStatus, zQuestionSourceUrls } from "./question.dto.zod.validators";

describe("Question DTO Zod Validators", () => {
  describe(zQuestionCognitiveDifficulty, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when cognitive difficulty is 'easy'",
        value: "easy",
        expected: true,
      },
      {
        test: "should return true when cognitive difficulty is 'medium'",
        value: "medium",
        expected: true,
      },
      {
        test: "should return true when cognitive difficulty is 'hard'",
        value: "hard",
        expected: true,
      },
      {
        test: "should return false when cognitive difficulty is 'extreme'",
        value: "extreme",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionCognitiveDifficulty().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionCognitiveDifficulty();

      expect(schema.description).toBe("Question's cognitive difficulty level");
    });
  });

  describe(zQuestionStatus, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when status is 'pending'",
        value: "pending",
        expected: true,
      },
      {
        test: "should return true when status is 'active'",
        value: "active",
        expected: true,
      },
      {
        test: "should return true when status is 'rejected'",
        value: "rejected",
        expected: true,
      },
      {
        test: "should return true when status is 'archived'",
        value: "archived",
        expected: true,
      },
      {
        test: "should return false when status is 'deleted'",
        value: "deleted",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionStatus().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionStatus();

      expect(schema.description).toBe("Question's status");
    });
  });

  describe(zQuestionSourceUrls, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when array of valid URLs is provided",
        value: new Set(["https://example.com/source1", "https://example.com/source2"]),
        expected: true,
      },
      {
        test: "should return false when array is empty",
        value: [],
        expected: false,
      },
      {
        test: "should return false when array contains an invalid URL",
        value: ["https://example.com/source1", "invalid-url"],
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionSourceUrls().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct metadata when accessed.", () => {
      const schema = zQuestionSourceUrls();
      const expectedMeta = {
        description: "List of unique source URLs for the question",
        example: ["https://example.com/source1", "https://example.com/source2"],
      };

      expect(schema.meta()).toStrictEqual(expectedMeta);
    });
  });
});