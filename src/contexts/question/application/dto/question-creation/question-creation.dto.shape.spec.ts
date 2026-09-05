import { ZodError } from "zod";

import { QUESTION_CREATION_DTO } from "@question/application/dto/question-creation/question-creation.dto.shape";

describe("Question Creation DTO Shape", () => {
  let validDto: {
    category: string;
    themes: { themeId: string; isPrimary: boolean; isHint: boolean }[];
    content: { statement: { en: string }; answer: { en: string } };
    cognitiveDifficulty: string;
    author: { role: string; name: string };
    sourceUrls: string[];
    applicableLocales?: string[];
  };

  beforeEach(() => {
    validDto = {
      category: "trivia",
      themes: [{ themeId: "60af924f4f1a2563f8e8b456", isPrimary: true, isHint: false }],
      content: { statement: { en: "What is the capital of France?" }, answer: { en: "Paris" } },
      cognitiveDifficulty: "easy",
      author: { role: "admin", name: "TestAuthor" },
      sourceUrls: ["https://example.com/source1"],
    };
  });

  it("should pass validation when a valid QuestionCreationDto is provided.", () => {
    expect(() => QUESTION_CREATION_DTO.parse(validDto)).not.toThrow();
  });

  describe("themes", () => {
    it("should throw zod error when themes is empty.", () => {
      const invalid = { ...validDto, themes: [] };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should throw zod error when themes exceed maximum items.", () => {
      const themes = [
        { themeId: "60af924f4f1a2563f8e8b456", isPrimary: true, isHint: false },
        { themeId: "60af924f4f1a2563f8e8b457", isPrimary: false, isHint: true },
        { themeId: "60af924f4f1a2563f8e8b458", isPrimary: false, isHint: false },
        { themeId: "60af924f4f1a2563f8e8b459", isPrimary: false, isHint: true },
      ];
      const invalid = { ...validDto, themes };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.themes.meta();
      const expectedMetadata = {
        description: "Question's themes",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });

    it("should throw zod error when themes have non-unique themeIds.", () => {
      const sameThemeId = "60af924f4f1a2563f8e8b456";
      const invalid = {
        ...validDto,
        themes: [
          { themeId: sameThemeId, isPrimary: true, isHint: false },
          { themeId: sameThemeId, isPrimary: false, isHint: true },
        ],
      };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct error message when themes have non-unique themeIds.", () => {
      const sameThemeId = "60af924f4f1a2563f8e8b456";
      const invalid = {
        ...validDto,
        themes: [
          { themeId: sameThemeId, isPrimary: true, isHint: false },
          { themeId: sameThemeId, isPrimary: false, isHint: true },
        ],
      };
      const expectedErrorMessage = "Theme IDs must be unique";
      const result = QUESTION_CREATION_DTO.safeParse(invalid);

      expect(result.error?.issues[0].message).toBe(expectedErrorMessage);
    });

    it("should throw zod error when themes do not have exactly one primary theme.", () => {
      const invalid = {
        ...validDto,
        themes: [
          { themeId: "60af924f4f1a2563f8e8b456", isPrimary: false, isHint: false },
          { themeId: "60af924f4f1a2563f8e8b457", isPrimary: false, isHint: true },
        ],
      };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should throw zod error when themes have more than one primary theme.", () => {
      const invalid = {
        ...validDto,
        themes: [
          { themeId: "60af924f4f1a2563f8e8b456", isPrimary: true, isHint: false },
          { themeId: "60af924f4f1a2563f8e8b457", isPrimary: true, isHint: true },
        ],
      };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct error message when themes do not have exactly one primary theme.", () => {
      const invalid = {
        ...validDto,
        themes: [
          { themeId: "60af924f4f1a2563f8e8b456", isPrimary: false, isHint: false },
          { themeId: "60af924f4f1a2563f8e8b457", isPrimary: false, isHint: true },
        ],
      };
      const expectedErrorMessage = "There must be exactly one primary theme";
      const result = QUESTION_CREATION_DTO.safeParse(invalid);

      expect(result.error?.issues[0].message).toBe(expectedErrorMessage);
    });
  });

  describe("content", () => {
    it("should throw zod error when content is invalid.", () => {
      const invalid = { ...validDto, content: "invalid" };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.content.meta();
      const expectedMetadata = {
        description: "Question's content",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw zod error when cognitiveDifficulty is invalid.", () => {
      const invalid = { ...validDto, cognitiveDifficulty: "invalid" };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.cognitiveDifficulty.meta();
      const expectedMetadata = {
        description: "Question's cognitive difficulty level",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("author", () => {
    it("should throw zod error when author is invalid.", () => {
      const invalid = { ...validDto, author: "invalid" };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.author.meta();
      const expectedMetadata = {
        description: "Question's author",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("sourceUrls", () => {
    it("should throw zod error when sourceUrls is invalid.", () => {
      const invalid = { ...validDto, sourceUrls: "invalid" };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should throw zod error when sourceUrls contain duplicates.", () => {
      const duplicateUrl = "https://example.com/source1";
      const invalid = { ...validDto, sourceUrls: [duplicateUrl, duplicateUrl] };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.sourceUrls.meta();
      const expectedMetadata = {
        description: "List of unique source URLs for the question",
        example: ["https://example.com/source1", "https://example.com/source2"],
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("category", () => {
    it("should throw zod error when category is invalid.", () => {
      const invalid = { ...validDto, category: "invalid" };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.category.meta();
      const expectedMetadata = {
        description: "Question's category",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });

  describe("applicableLocales", () => {
    it("should pass validation when a valid subset of locales is provided.", () => {
      const dtoWithApplicableLocales = { ...validDto, applicableLocales: ["fr"] };

      expect(() => QUESTION_CREATION_DTO.parse(dtoWithApplicableLocales)).not.toThrow();
    });

    it("should pass validation when applicableLocales is omitted.", () => {
      const dtoWithoutApplicableLocales = { ...validDto };
      delete dtoWithoutApplicableLocales.applicableLocales;

      expect(() => QUESTION_CREATION_DTO.parse(dtoWithoutApplicableLocales)).not.toThrow();
    });

    it("should throw zod error when applicableLocales is empty.", () => {
      const invalid = { ...validDto, applicableLocales: [] };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should throw zod error when applicableLocales contains a duplicate locale.", () => {
      const invalid = { ...validDto, applicableLocales: ["fr", "fr"] };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should throw zod error when applicableLocales contains an unsupported locale.", () => {
      const invalid = { ...validDto, applicableLocales: ["jp"] };

      expect(() => QUESTION_CREATION_DTO.parse(invalid)).toThrow(ZodError);
    });

    it("should have correct metadata when accessing the metadata.", () => {
      const metadata = QUESTION_CREATION_DTO.shape.applicableLocales.meta();
      const expectedMetadata = {
        description: "Subset of locales this question is relevant for; omit if relevant for all locales",
      };

      expect(metadata).toStrictEqual<Record<string, unknown>>(expectedMetadata);
    });
  });
});