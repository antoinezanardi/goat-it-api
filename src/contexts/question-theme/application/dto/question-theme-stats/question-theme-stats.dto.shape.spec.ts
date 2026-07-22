import { ZodError } from "zod";

import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

import { createFakeQuestionThemeStatsDto } from "@faketories/contexts/question-theme/dto/question-theme-stats/question-theme-stats.dto.faketory";

import type { QuestionThemeStatsDto } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

describe("Question Theme Stats DTO Shape", () => {
  let validDto: QuestionThemeStatsDto;

  beforeEach(() => {
    validDto = createFakeQuestionThemeStatsDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_THEME_STATS_DTO.parse(validDto)).not.toThrow();
  });

  describe("total", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = Object.assign(validDto, { total: undefined });

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a negative number.", () => {
      const invalidDto = Object.assign(validDto, { total: -1 });

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-integer number.", () => {
      const invalidDto = Object.assign(validDto, { total: 1.5 });

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
      const invalidDto = Object.assign(validDto, { byStatus: undefined });

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = Object.assign(validDto, { byStatus: "invalid" });

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = Object.assign(validDto, { byStatus: { active: -1 } } as QuestionThemeStatsDto);

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
      const invalidDto = Object.assign(validDto, { byQuestionCount: undefined });

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-array value.", () => {
      const invalidDto = Object.assign(validDto, { byQuestionCount: "invalid" });

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry has a missing themeId.", () => {
      const invalidDto = Object.assign(validDto, { byQuestionCount: [{ themeSlug: "cinema", activeQuestionCount: 2 }] } as QuestionThemeStatsDto);

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry has a missing themeSlug.", () => {
      const invalidDto = Object.assign(validDto, { byQuestionCount: [{ themeId: "a", activeQuestionCount: 2 }] } as QuestionThemeStatsDto);

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry has a negative activeQuestionCount.", () => {
      const invalidDto = Object.assign(validDto, { byQuestionCount: [{ themeId: "a", themeSlug: "cinema", activeQuestionCount: -1 }] } as QuestionThemeStatsDto);

      expect(() => QUESTION_THEME_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an entry contains extra properties.", () => {
      const invalidDto = Object.assign(
        validDto,
        { byQuestionCount: [{ themeId: "a", themeSlug: "cinema", activeQuestionCount: 2, extra: true }] } as unknown as QuestionThemeStatsDto,
      );

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
});