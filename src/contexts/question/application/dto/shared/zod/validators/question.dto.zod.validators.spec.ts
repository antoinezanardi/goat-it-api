import { zQuestionAuthorRole, zQuestionCognitiveDifficulty, zQuestionStatus, zQuestionCategory, zQuestionSourceUrls, zQuestionThemeIdsFilter, zQuestionId, zQuestionCreatedAt, zQuestionUpdatedAt } from "@question/application/dto/shared/zod/validators/question.dto.zod.validators";

describe("Question DTO Zod Validators", () => {
  describe(zQuestionAuthorRole, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when author role is 'admin'",
        value: "admin",
        expected: true,
      },
      {
        test: "should return true when author role is 'game'",
        value: "game",
        expected: true,
      },
      {
        test: "should return true when author role is 'ai'",
        value: "ai",
        expected: true,
      },
      {
        test: "should return false when author role is 'unknown'",
        value: "unknown",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionAuthorRole().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionAuthorRole();

      expect(schema.description).toBe("Question author's role");
    });
  });

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

  describe(zQuestionCategory, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when category is 'trivia'",
        value: "trivia",
        expected: true,
      },
      {
        test: "should return true when category is 'lexicon'",
        value: "lexicon",
        expected: true,
      },
      {
        test: "should return true when category is 'riddle'",
        value: "riddle",
        expected: true,
      },
      {
        test: "should return true when category is 'explanation'",
        value: "explanation",
        expected: true,
      },
      {
        test: "should return false when category is 'unknown'",
        value: "unknown",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionCategory().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionCategory();

      expect(schema.description).toBe("Question's category");
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
        value: ["https://example.com/source1", "https://example.com/source2"],
        expected: true,
      },
      {
        test: "should return false when array is empty",
        value: [],
        expected: false,
      },
      {
        test: "should return false when array exceeds maximum items",
        value: [
          "https://example.com/source1",
          "https://example.com/source2",
          "https://example.com/source3",
          "https://example.com/source4",
          "https://example.com/source5",
          "https://example.com/source6",
        ],
        expected: false,
      },
      {
        test: "should return false when array contains an invalid URL",
        value: ["https://example.com/source1", "invalid-url"],
        expected: false,
      },
      {
        test: "should return false when array contains duplicate URLs",
        value: ["https://example.com/source1", "https://example.com/source1"],
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

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });

    it("should have the correct refinement message for uniqueness when duplicates are present.", () => {
      const schema = zQuestionSourceUrls();
      const notUniqueTestValue = ["https://example.com/source1", "https://example.com/source1"];
      const result = schema.safeParse(notUniqueTestValue);

      expect(result.error?.issues[0].message).toBe("Source URLs must be unique");
    });
  });

  describe(zQuestionThemeIdsFilter, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when an array with a valid MongoDB ObjectId is provided",
        value: ["60af924f4f1a2563f8e8b456"],
        expected: true,
      },
      {
        test: "should return true when an array with multiple valid MongoDB ObjectIds is provided",
        value: ["60af924f4f1a2563f8e8b456", "507f1f77bcf86cd799439011"],
        expected: true,
      },
      {
        test: "should return true when a single string MongoDB ObjectId is provided",
        value: "60af924f4f1a2563f8e8b456",
        expected: true,
      },
      {
        test: "should return true when value is undefined",
        value: undefined,
        expected: true,
      },
      {
        test: "should return false when an empty array is provided",
        value: [],
        expected: false,
      },
      {
        test: "should return false when an array with an invalid ObjectId is provided",
        value: ["not-a-valid-id"],
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeIdsFilter().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should normalize a single string value to an array when parsed.", () => {
      const result = zQuestionThemeIdsFilter().safeParse("60af924f4f1a2563f8e8b456");

      expect(result.data).toStrictEqual(["60af924f4f1a2563f8e8b456"]);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeIdsFilter();

      expect(schema.description).toBe("List of theme IDs to filter questions by (OR logic)");
    });

    it("should have the correct inner element description when called.", () => {
      const schema = zQuestionThemeIdsFilter();

      type PreprocessDefinition = { _zod: { def: { out: { _zod: { def: { element: { description: string } } } } } } };

      // Acceptable as Zod internal _zod structure must be accessed to verify nested schema descriptions
      // oxlint-disable-next-line eslint/no-underscore-dangle
      const innerElementDescription = (schema.unwrap() as PreprocessDefinition)._zod.def.out._zod.def.element.description;

      expect(innerElementDescription).toBe("Theme ID to filter questions by");
    });
  });

  describe(zQuestionId, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when a valid MongoDB ObjectId is provided",
        value: "60af924f4f1a2563f8e8b456",
        expected: true,
      },
      {
        test: "should return false when an invalid ObjectId is provided",
        value: "not-a-valid-id",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionId().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionId();

      expect(schema.description).toBe("Question's unique identifier");
    });
  });

  describe(zQuestionCreatedAt, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when a valid ISO datetime is provided",
        value: "2026-04-14T00:00:00.000Z",
        expected: true,
      },
      {
        test: "should return false when an invalid datetime is provided",
        value: "not-a-date",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionCreatedAt().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionCreatedAt();

      expect(schema.description).toBe("Question's creation date");
    });
  });

  describe(zQuestionUpdatedAt, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when a valid ISO datetime is provided",
        value: "2026-04-14T00:00:00.000Z",
        expected: true,
      },
      {
        test: "should return false when an invalid datetime is provided",
        value: "not-a-date",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionUpdatedAt().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionUpdatedAt();

      expect(schema.description).toBe("Question's last update date");
    });
  });
});