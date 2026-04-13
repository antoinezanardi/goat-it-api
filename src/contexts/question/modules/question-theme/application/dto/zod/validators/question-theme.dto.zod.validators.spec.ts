import {
  QUESTION_THEME_ALIASES_EXAMPLE,
  QUESTION_THEME_DESCRIPTION_EXAMPLE,
  QUESTION_THEME_LABEL_EXAMPLE,
  QUESTION_THEME_SLUG_EXAMPLE,
} from "@question/modules/question-theme/application/dto/zod/validators/constants/question-theme.zod.validators.constants";
import { QUESTION_THEME_STATUSES } from "@question/modules/question-theme/domain/value-objects/question-theme-status/question-theme-status.constants";
import {
  zQuestionThemeId,
  zQuestionThemeSlug,
  zQuestionThemeLabel,
  zQuestionThemeLocalizedLabel,
  zQuestionThemeAliases,
  zQuestionThemeLocalizedAliases,
  zQuestionThemeDescription,
  zQuestionThemeLocalizedDescription,
  zQuestionThemeColor,
  zQuestionThemeStatus,
  zQuestionThemeCreatedAt,
  zQuestionThemeUpdatedAt,
} from "@question/modules/question-theme/application/dto/zod/validators/question-theme.dto.zod.validators";

describe("Question Theme DTO Zod Validators", () => {
  describe(zQuestionThemeId, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid MongoDB ObjectId.",
        value: "507f1f77bcf86cd799439011",
        expected: true,
      },
      {
        test: "should return false when value is an invalid MongoDB ObjectId.",
        value: "invalid-id",
        expected: false,
      },
      {
        test: "should return false when value is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeId().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeId();

      expect(schema.description).toBe("Question Theme's unique identifier");
    });
  });

  describe(zQuestionThemeSlug, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid slug.",
        value: "general-knowledge",
        expected: true,
      },
      {
        test: "should return false when value contains uppercase letters.",
        value: "Invalid-Slug",
        expected: false,
      },
      {
        test: "should return false when value is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeSlug().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeSlug();

      expect(schema.description).toBe("Question Theme's unique slug in kebab-case");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionThemeSlug();
      const expectedMeta = { description: "Question Theme's unique slug in kebab-case", example: QUESTION_THEME_SLUG_EXAMPLE };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionThemeLabel, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid string.",
        value: "History",
        expected: true,
      },
      {
        test: "should return false when value is a number.",
        value: 123,
        expected: false,
      },
      {
        test: "should return false when value is undefined.",
        value: undefined,
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeLabel().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeLabel();

      expect(schema.description).toBe("Question Theme's label");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionThemeLabel();
      const expectedMeta = { description: "Question Theme's label", example: QUESTION_THEME_LABEL_EXAMPLE };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionThemeLocalizedLabel, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized text object.",
        value: { en: "History" },
        expected: true,
      },
      {
        test: "should return false when value is a plain string.",
        value: "History",
        expected: false,
      },
      {
        test: "should return false when value has no locale values defined.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeLocalizedLabel().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeLocalizedLabel();

      expect(schema.description).toBe("Question Theme's label");
    });
  });

  describe(zQuestionThemeAliases, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid array of strings.",
        value: ["Historical Events", "Past", "Future"],
        expected: true,
      },
      {
        test: "should return true when value is an empty array.",
        value: [],
        expected: true,
      },
      {
        test: "should return false when value is a string.",
        value: "alias",
        expected: false,
      },
      {
        test: "should return false when value contains a non-string element.",
        value: ["alias", 123],
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeAliases().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeAliases();

      expect(schema.description).toBe("Question Theme's aliases");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionThemeAliases();
      const expectedMeta = { description: "Question Theme's aliases", example: QUESTION_THEME_ALIASES_EXAMPLE };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionThemeLocalizedAliases, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized texts object.",
        value: { en: ["Historical Events"] },
        expected: true,
      },
      {
        test: "should return false when value is a plain array.",
        value: ["alias"],
        expected: false,
      },
      {
        test: "should return false when value has no locale values defined.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeLocalizedAliases().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeLocalizedAliases();

      expect(schema.description).toBe("Question Theme's aliases");
    });
  });

  describe(zQuestionThemeDescription, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid string.",
        value: "Questions related to historical events and timelines.",
        expected: true,
      },
      {
        test: "should return false when value is a number.",
        value: 123,
        expected: false,
      },
      {
        test: "should return false when value is undefined.",
        value: undefined,
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeDescription().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeDescription();

      expect(schema.description).toBe("Question Theme's description");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionThemeDescription();
      const expectedMeta = { description: "Question Theme's description", example: QUESTION_THEME_DESCRIPTION_EXAMPLE };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionThemeLocalizedDescription, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid localized text object.",
        value: { en: "Questions related to historical events and timelines." },
        expected: true,
      },
      {
        test: "should return false when value is a plain string.",
        value: "A description",
        expected: false,
      },
      {
        test: "should return false when value has no locale values defined.",
        value: {},
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeLocalizedDescription().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeLocalizedDescription();

      expect(schema.description).toBe("Question Theme's description");
    });
  });

  describe(zQuestionThemeColor, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid hex color.",
        value: "#FF5733",
        expected: true,
      },
      {
        test: "should return false when value is missing # prefix.",
        value: "FF5733",
        expected: false,
      },
      {
        test: "should return false when value is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeColor().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeColor();

      expect(schema.description).toBe("Question Theme's hex color");
    });
  });

  describe(zQuestionThemeStatus, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is 'active'.",
        value: "active",
        expected: true,
      },
      {
        test: "should return true when value is 'archived'.",
        value: "archived",
        expected: true,
      },
      {
        test: "should return false when value is 'deleted'.",
        value: "deleted",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeStatus().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeStatus();

      expect(schema.description).toBe("Question Theme's status");
    });

    it("should have the correct metadata when called.", () => {
      const schema = zQuestionThemeStatus();
      const expectedMeta = { description: "Question Theme's status", example: QUESTION_THEME_STATUSES[0] };

      expect(schema.meta()).toStrictEqual<Record<string, unknown>>(expectedMeta);
    });
  });

  describe(zQuestionThemeCreatedAt, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid ISO 8601 datetime.",
        value: "2023-10-05T14:48:00.000Z",
        expected: true,
      },
      {
        test: "should return false when value is an invalid datetime format.",
        value: "2023-10-05 14:48:00",
        expected: false,
      },
      {
        test: "should return false when value is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeCreatedAt().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeCreatedAt();

      expect(schema.description).toBe("Question Theme's creation date");
    });
  });

  describe(zQuestionThemeUpdatedAt, () => {
    it.each<{
      test: string;
      value: unknown;
      expected: boolean;
    }>([
      {
        test: "should return true when value is a valid ISO 8601 datetime.",
        value: "2023-10-05T14:48:00.000Z",
        expected: true,
      },
      {
        test: "should return false when value is an invalid datetime format.",
        value: "2023-10-05 14:48:00",
        expected: false,
      },
      {
        test: "should return false when value is empty.",
        value: "",
        expected: false,
      },
    ])("$test", ({ value, expected }) => {
      const result = zQuestionThemeUpdatedAt().safeParse(value);

      expect(result.success).toBe(expected);
    });

    it("should have the correct description when called.", () => {
      const schema = zQuestionThemeUpdatedAt();

      expect(schema.description).toBe("Question Theme's last update date");
    });
  });
});