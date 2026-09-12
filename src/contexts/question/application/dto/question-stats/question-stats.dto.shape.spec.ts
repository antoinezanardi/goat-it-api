import { ZodError } from "zod";

import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";

describe("Question Stats DTO Shape", () => {
  let validDto: {
    total: number;
    byStatus: Record<string, number>;
    byCategory: Record<string, number>;
    byCognitiveDifficulty: Record<string, number>;
    byAuthorRole: Record<string, number>;
    byRejectionType: Record<string, number>;
    byTranslationCompleteness: { fullyTranslated: number; incomplete: number };
  };

  beforeEach(() => {
    validDto = {
      total: 100,
      byStatus: { pending: 10, active: 80, archived: 5, rejected: 5 },
      byCategory: { trivia: 50, lexicon: 20, riddle: 15, explanation: 15 },
      byCognitiveDifficulty: { easy: 40, medium: 35, hard: 25 },
      byAuthorRole: { admin: 60, game: 30, ai: 10 },
      byRejectionType: { "inappropriate-content": 2, "incorrect-information": 1, "poor-quality": 1, "duplicate-question": 1, "other": 0 },
      byTranslationCompleteness: { fullyTranslated: 70, incomplete: 30 },
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_STATS_DTO.parse(validDto)).not.toThrow();
  });

  describe("total", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, total: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a negative number.", () => {
      const invalidDto = { ...validDto, total: -1 };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-integer number.", () => {
      const invalidDto = { ...validDto, total: 1.5 };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.total.description).toBe("Total number of questions");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.total.meta()).toStrictEqual<Record<string, unknown>>({ description: "Total number of questions" });
    });
  });

  describe("byStatus", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byStatus: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byStatus: "invalid" };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = { ...validDto, byStatus: { active: -1 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = { ...validDto, byStatus: { ...validDto.byStatus, unknown: 0 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byStatus.description).toBe("Number of questions per status");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byStatus.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of questions per status" });
    });
  });

  describe("byCategory", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byCategory: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byCategory: "invalid" };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = { ...validDto, byCategory: { trivia: -1 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = { ...validDto, byCategory: { ...validDto.byCategory, unknown: 0 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byCategory.description).toBe("Number of questions per category");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byCategory.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of questions per category" });
    });
  });

  describe("byCognitiveDifficulty", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byCognitiveDifficulty: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byCognitiveDifficulty: "invalid" };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = { ...validDto, byCognitiveDifficulty: { easy: -1 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = { ...validDto, byCognitiveDifficulty: { ...validDto.byCognitiveDifficulty, unknown: 0 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byCognitiveDifficulty.description).toBe("Number of questions per cognitive difficulty");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byCognitiveDifficulty.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of questions per cognitive difficulty" });
    });
  });

  describe("byAuthorRole", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byAuthorRole: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byAuthorRole: "invalid" };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = { ...validDto, byAuthorRole: { admin: -1 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = { ...validDto, byAuthorRole: { ...validDto.byAuthorRole, unknown: 0 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byAuthorRole.description).toBe("Number of questions per author role");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byAuthorRole.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of questions per author role" });
    });
  });

  describe("byRejectionType", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byRejectionType: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byRejectionType: "invalid" };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = { ...validDto, byRejectionType: { "inappropriate-content": -1 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = { ...validDto, byRejectionType: { ...validDto.byRejectionType, unknown: 0 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byRejectionType.description).toBe("Number of rejected questions per rejection type");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byRejectionType.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of rejected questions per rejection type" });
    });
  });

  describe("byTranslationCompleteness", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: undefined };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: "invalid" };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when fullyTranslated is negative.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: { fullyTranslated: -1, incomplete: 0 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when incomplete is not an integer.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: { fullyTranslated: 0, incomplete: 1.5 } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an extra key is present.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: { ...validDto.byTranslationCompleteness, extra: true } };

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byTranslationCompleteness.description).toBe("Translation completeness breakdown");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byTranslationCompleteness.meta()).toStrictEqual<Record<string, unknown>>({
        description: "Translation completeness breakdown",
      });
    });
  });
});