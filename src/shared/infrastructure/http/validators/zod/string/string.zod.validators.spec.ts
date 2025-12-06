import { zMongoId, zSlug } from "@shared/infrastructure/http/validators/zod/string/string.zod.validators";

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
  });
});