import { zIsoDateTime, zMongoId, zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";
import { ISO_DATE_TIME_EXAMPLE, SLUG_MAX_LENGTH, SLUG_MIN_LENGTH } from "@shared/infrastructure/http/validators/zod/string/constants/string.zod.validators.constants";

describe("String Zod Validators", () => {
  describe(zSlug, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when slug is valid.",
        value: "valid-slug",
        expected: true,
      },
      {
        test: "should return true when slug length equals SLUG_MIN_LENGTH after trim.",
        value: `  ${"a".repeat(SLUG_MIN_LENGTH - 2)}-b  `,
        expected: true,
      },
      {
        test: "should return true when slug length equals SLUG_MAX_LENGTH.",
        value: "a".repeat(SLUG_MAX_LENGTH),
        expected: true,
      },
      {
        test: "should return true when slug is valid even with spaces around.",
        value: "  valid-slug  ",
        expected: true,
      },
      {
        test: "should return false when slug is invalid (uppercase letters).",
        value: "Invalid-Slug",
        expected: false,
      },
      {
        test: "should return false when slug is invalid (spaces).",
        value: "invalid_slug",
        expected: false,
      },
      {
        test: "should return false when slug is invalid (special characters).",
        value: "invalid slug",
        expected: false,
      },
      {
        test: "should return true when slug is valid with numbers.",
        value: "another-valid-slug-123",
        expected: true,
      },
      {
        test: "should return false when slug is empty.",
        value: "",
        expected: false,
      },
      {
        test: "should return false when slug is too short.",
        value: "a".repeat(SLUG_MIN_LENGTH - 1),
        expected: false,
      },
      {
        test: "should return false when slug is too long.",
        value: "a".repeat(SLUG_MAX_LENGTH + 1),
        expected: false,
      },
      {
        test: "should return false when slug is too short after trim.",
        value: `  ${"a".repeat(SLUG_MIN_LENGTH - 1)}  `,
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zSlug();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should default error message when slug is invalid.", () => {
      const schema = zSlug();
      const result = schema.safeParse("Invalid_Slug");

      expect(result.error?.issues[0].message).toBe("Invalid kebab-case value");
    });

    it("should allow custom error message when slug is invalid.", () => {
      const customMessage = "Custom error: Not a valid slug";
      const schema = zSlug({ error: customMessage });
      const result = schema.safeParse("Invalid_Slug");

      expect(result.error?.issues[0].message).toBe(customMessage);
    });

    it("should trim spaces from the slug value when parsing.", () => {
      const schema = zSlug();
      const parsed = schema.parse("  valid-slug  ");

      expect(parsed).toBe("valid-slug");
    });

    it("should have correct example metadata when accessing the metadata.", () => {
      const schema = zSlug();
      const metadata = schema.meta();

      expect(metadata).toHaveProperty("example", "example-slug-value");
    });
  });

  describe(zMongoId, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when MongoDB ObjectId is valid.",
        value: "507f1f77bcf86cd799439011",
        expected: true,
      },
      {
        test: "should return true when MongoDB ObjectId is valid even with spaces around.",
        value: "  507f1f77bcf86cd799439011  ",
        expected: true,
      },
      {
        test: "should return false when MongoDB ObjectId is invalid (wrong length).",
        value: "507f1f77bcf86cd7994390",
        expected: false,
      },
      {
        test: "should return false when MongoDB ObjectId is invalid (non-hex characters).",
        value: "507f1f77bcf86cd7994390zz",
        expected: false,
      },
      {
        test: "should return false when MongoDB ObjectId is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zMongoId();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should default error message when MongoDB ObjectId is invalid.", () => {
      const schema = zMongoId();
      const result = schema.safeParse("invalid-object-id");

      expect(result.error?.issues[0].message).toBe("Invalid ObjectId value");
    });

    it("should allow custom error message when MongoDB ObjectId is invalid.", () => {
      const customMessage = "Custom error: Not a valid ObjectId";
      const schema = zMongoId({ error: customMessage });
      const result = schema.safeParse("invalid-object-id");

      expect(result.error?.issues[0].message).toBe(customMessage);
    });

    it("should trim spaces from the MongoDB ObjectId value when parsing.", () => {
      const schema = zMongoId();
      const result = schema.parse("  507f1f77bcf86cd799439011  ");

      expect(result).toBe("507f1f77bcf86cd799439011");
    });

    it("should have correct example metadata when accessing the metadata.", () => {
      const schema = zMongoId();
      const metadata = schema.meta();

      expect(metadata).toHaveProperty("example", "60af924f4f1a2563f8e8b456");
    });
  });

  describe(zIsoDateTime, () => {
    it.each<{
      test: string;
      value: string;
      expected: boolean;
    }>([
      {
        test: "should return true when ISO 8601 datetime is valid.",
        value: "2023-10-05T14:48:00.000Z",
        expected: true,
      },
      {
        test: "should return false when ISO 8601 datetime is invalid.",
        value: "2023-10-05 14:48:00",
        expected: false,
      },
      {
        test: "should return false when ISO 8601 datetime is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const schema = zIsoDateTime();
      const result = schema.safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should default error message when ISO 8601 datetime is invalid.", () => {
      const schema = zIsoDateTime();
      const result = schema.safeParse("invalid-datetime");

      expect(result.error?.issues[0].message).toBe("Invalid ISO 8601 datetime value");
    });

    it("should allow custom error message when ISO 8601 datetime is invalid.", () => {
      const customMessage = "Custom error: Not a valid ISO datetime";
      const schema = zIsoDateTime({ error: customMessage });
      const result = schema.safeParse("invalid-datetime");

      expect(result.error?.issues[0].message).toBe(customMessage);
    });

    it("should have correct example metadata when accessing the metadata.", () => {
      const schema = zIsoDateTime();
      const metadata = schema.meta();

      expect(metadata).toHaveProperty("example", ISO_DATE_TIME_EXAMPLE);
    });
  });
});