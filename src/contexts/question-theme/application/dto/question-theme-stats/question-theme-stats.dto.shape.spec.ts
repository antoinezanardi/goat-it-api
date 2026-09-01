import { ZodError } from "zod";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

describe("Question Theme Stats DTO Shape", () => {
  let validDto: {
    total: number;
    byStatus: Record<string, number>;
    byQuestionCount: { themeId: string; themeSlug: string; activeQuestionCount: number }[];
    byTranslationCompleteness: { fullyTranslated: number; incomplete: number };
  };

  beforeEach(() => {
    validDto = {
      total: 10,
      byStatus: { active: 8, archived: 2 },
      byQuestionCount: [{ themeId: "60af924f4f1a2563f8e8b456", themeSlug: "general-knowledge", activeQuestionCount: 5 }],
      byTranslationCompleteness: { fullyTranslated: 7, incomplete: 3 },
    };
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_STATS_DTO.parse(validDto)).not.toThrow();
  });

  describe("total", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, total: undefined };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a negative number.", () => {
      const invalidDto = { ...validDto, total: -1 };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-integer number.", () => {
      const invalidDto = { ...validDto, total: 1.5 };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.total.description).toBe("Total number of question themes");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.total.meta()).toStrictEqual<Record<string, unknown>>({ description: "Total number of question themes" });
    });
  });

  describe("byStatus", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byStatus: undefined };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byStatus: "invalid" };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = { ...validDto, byStatus: { active: -1 } };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.byStatus.description).toBe("Number of question themes per status");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.byStatus.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of question themes per status" });
    });
  });

  describe("byQuestionCount", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byQuestionCount: undefined };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-array value.", () => {
      const invalidDto = { ...validDto, byQuestionCount: "invalid" };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry has a missing themeId.", () => {
      const invalidDto = { ...validDto, byQuestionCount: [{ themeSlug: "cinema", activeQuestionCount: 2 }] };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry has a missing themeSlug.", () => {
      const invalidDto = { ...validDto, byQuestionCount: [{ themeId: "a", activeQuestionCount: 2 }] };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry has a negative activeQuestionCount.", () => {
      const invalidDto = { ...validDto, byQuestionCount: [{ themeId: "a", themeSlug: "cinema", activeQuestionCount: -1 }] };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry contains extra properties.", () => {
      const invalidDto = {
        ...validDto,
        byQuestionCount: [{ themeId: "a", themeSlug: "cinema", activeQuestionCount: 2, extra: true }],
      };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.description).toBe("Active question count per theme, sorted alphabetically by slug");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.meta()).toStrictEqual<Record<string, unknown>>({
        description: "Active question count per theme, sorted alphabetically by slug",
      });
    });

    describe("themeId", () => {
      it("should have correct description when accessing the nested element description.", () => {
        expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.element.shape.themeId.description).toBe("Theme's unique identifier");
      });

      it("should have correct metadata when accessing the nested element metadata.", () => {
        expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.element.shape.themeId.meta()).toStrictEqual<Record<string, unknown>>({ description: "Theme's unique identifier" });
      });
    });

    describe("themeSlug", () => {
      it("should have correct description when accessing the nested element description.", () => {
        expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.element.shape.themeSlug.description).toBe("Theme's slug");
      });

      it("should have correct metadata when accessing the nested element metadata.", () => {
        expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.element.shape.themeSlug.meta()).toStrictEqual<Record<string, unknown>>({ description: "Theme's slug" });
      });
    });

    describe("activeQuestionCount", () => {
      const ACTIVE_QUESTION_COUNT_DESCRIPTION = "Number of active questions referencing this theme (includes 0 for themes with no active questions)";

      it("should have correct description when accessing the nested element description.", () => {
        expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.element.shape.activeQuestionCount.description).toBe(ACTIVE_QUESTION_COUNT_DESCRIPTION);
      });

      it("should have correct metadata when accessing the nested element metadata.", () => {
        expect(QUESTION_THEME_STATS_DTO.shape.byQuestionCount.element.shape.activeQuestionCount.meta()).toStrictEqual<Record<string, unknown>>({
          description: ACTIVE_QUESTION_COUNT_DESCRIPTION,
        });
      });
    });
  });

  describe("byTranslationCompleteness", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: undefined };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: "invalid" };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when fullyTranslated is negative.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: { fullyTranslated: -1, incomplete: 0 } };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when incomplete is not an integer.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: { fullyTranslated: 0, incomplete: 1.5 } };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an extra key is present.", () => {
      const invalidDto = { ...validDto, byTranslationCompleteness: { ...validDto.byTranslationCompleteness, extra: true } };

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.byTranslationCompleteness.description).toBe("Translation completeness breakdown");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_THEME_STATS_DTO.shape.byTranslationCompleteness.meta()).toStrictEqual<Record<string, unknown>>({
        description: "Translation completeness breakdown",
      });
    });
  });
});