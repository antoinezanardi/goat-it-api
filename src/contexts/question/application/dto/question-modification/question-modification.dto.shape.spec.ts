import { ZodError } from "zod";

import { QUESTION_SOURCE_URLS_MAX_ITEMS } from "@question/domain/constants/question.constants";
import { QUESTION_MODIFICATION_DTO } from "@question/application/dto/question-modification/question-modification.dto.shape";

describe("Question Modification DTO Shape", () => {
  let validDto: {
    category?: string;
    cognitiveDifficulty?: string;
    sourceUrls?: string[];
    content?: {
      statement?: { en: string };
      answer?: { en: string };
      context?: { en: string };
      trivia?: Record<string, string[]>;
    };
    applicableLocales?: string[];
  };

  beforeEach(() => {
    validDto = {
      category: "trivia",
      cognitiveDifficulty: "easy",
      sourceUrls: ["https://example.com/source1"],
      content: {
        statement: { en: "What is the capital of France?" },
        answer: { en: "Paris" },
      },
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_MODIFICATION_DTO.parse(validDto)).not.toThrow();
  });

  it("should pass validation when assigned empty object.", () => {
    expect(() => QUESTION_MODIFICATION_DTO.parse({})).not.toThrow();
  });

  describe("category", () => {
    it("should throw a zod error when assigned an invalid category value.", () => {
      const invalidDto = { ...validDto, category: "invalid-category" };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_MODIFICATION_DTO.shape.category.unwrap().description).toBe("Question's category");
    });
  });

  describe("cognitiveDifficulty", () => {
    it("should throw a zod error when assigned an invalid cognitive difficulty value.", () => {
      const invalidDto = { ...validDto, cognitiveDifficulty: "impossible" };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_MODIFICATION_DTO.shape.cognitiveDifficulty.unwrap().description).toBe("Question's cognitive difficulty level");
    });
  });

  describe("sourceUrls", () => {
    it("should throw a zod error when assigned an invalid URL.", () => {
      const invalidDto = { ...validDto, sourceUrls: ["not-a-url"] };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned duplicate URLs.", () => {
      const invalidDto = { ...validDto, sourceUrls: ["https://example.com", "https://example.com"] };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned more than max items.", () => {
      const tooManyUrls = Array.from({ length: QUESTION_SOURCE_URLS_MAX_ITEMS + 1 }, (_, index) => `https://example-${index}.com`);
      const invalidDto = { ...validDto, sourceUrls: tooManyUrls };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_MODIFICATION_DTO.shape.sourceUrls.unwrap().description).toBe("List of unique source URLs for the question");
    });
  });

  describe("content", () => {
    it("should throw a zod error when content has an invalid nested field.", () => {
      const invalidDto = { ...validDto, content: { statement: "not-an-object" } };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should pass validation when content is an empty object.", () => {
      const dtoWithEmptyContent = { ...validDto, content: {} };

      expect(() => QUESTION_MODIFICATION_DTO.parse(dtoWithEmptyContent)).not.toThrow();
    });
  });

  describe("applicableLocales", () => {
    it("should pass validation when a valid subset of locales is provided.", () => {
      const dtoWithApplicableLocales = { ...validDto, applicableLocales: ["fr"] };

      expect(() => QUESTION_MODIFICATION_DTO.parse(dtoWithApplicableLocales)).not.toThrow();
    });

    it("should pass validation when applicableLocales is an empty array.", () => {
      const dtoWithEmptyApplicableLocales = { ...validDto, applicableLocales: [] };

      expect(() => QUESTION_MODIFICATION_DTO.parse(dtoWithEmptyApplicableLocales)).not.toThrow();
    });

    it("should pass validation when applicableLocales is omitted.", () => {
      const dtoWithoutApplicableLocales = { ...validDto };
      delete dtoWithoutApplicableLocales.applicableLocales;

      expect(() => QUESTION_MODIFICATION_DTO.parse(dtoWithoutApplicableLocales)).not.toThrow();
    });

    it("should throw a zod error when applicableLocales contains a duplicate locale.", () => {
      const invalidDto = { ...validDto, applicableLocales: ["fr", "fr"] };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when applicableLocales contains an unsupported locale.", () => {
      const invalidDto = { ...validDto, applicableLocales: ["jp"] };

      expect(() => QUESTION_MODIFICATION_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_MODIFICATION_DTO.shape.applicableLocales.description)
        .toBe("Subset of locales this question is relevant for; submit an empty array to clear the restriction (all locales required again)");
    });
  });
});