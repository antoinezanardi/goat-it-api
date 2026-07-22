import { ZodError } from "zod";

import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";
import type { QuestionStatsDto } from "@question/application/dto/question-stats/question-stats.dto.shape";

import { createFakeQuestionStatsDto } from "@faketories/contexts/question/dto/question-stats/question-stats.dto.faketory";

describe("Question Stats DTO Shape", () => {
  let validDto: QuestionStatsDto;

  beforeEach(() => {
    validDto = createFakeQuestionStatsDto();
  });

  it("should pass validation when assigned valid values.", () => {
    expect(() => QUESTION_STATS_DTO.parse(validDto)).not.toThrow();
  });

  describe("total", () => {
    it("should throw a zod error when missing.", () => {
      const invalidDto = Object.assign(validDto, { total: undefined });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a negative number.", () => {
      const invalidDto = Object.assign(validDto, { total: -1 });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-integer number.", () => {
      const invalidDto = Object.assign(validDto, { total: 1.5 });

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
      const invalidDto = Object.assign(validDto, { byStatus: undefined });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = Object.assign(validDto, { byStatus: "invalid" });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = Object.assign(validDto, { byStatus: { active: -1 } } as QuestionStatsDto);

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = Object.assign(validDto, { byStatus: { ...validDto.byStatus, unknown: 0 } });

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
      const invalidDto = Object.assign(validDto, { byCategory: undefined });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = Object.assign(validDto, { byCategory: "invalid" });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = Object.assign(validDto, { byCategory: { trivia: -1 } } as QuestionStatsDto);

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = Object.assign(validDto, { byCategory: { ...validDto.byCategory, unknown: 0 } });

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
      const invalidDto = Object.assign(validDto, { byCognitiveDifficulty: undefined });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = Object.assign(validDto, { byCognitiveDifficulty: "invalid" });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = Object.assign(validDto, { byCognitiveDifficulty: { easy: -1 } } as QuestionStatsDto);

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = Object.assign(validDto, { byCognitiveDifficulty: { ...validDto.byCognitiveDifficulty, unknown: 0 } });

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
      const invalidDto = Object.assign(validDto, { byAuthorRole: undefined });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = Object.assign(validDto, { byAuthorRole: "invalid" });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = Object.assign(validDto, { byAuthorRole: { admin: -1 } } as QuestionStatsDto);

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = Object.assign(validDto, { byAuthorRole: { ...validDto.byAuthorRole, unknown: 0 } });

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
      const invalidDto = Object.assign(validDto, { byRejectionType: undefined });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when assigned a non-object value.", () => {
      const invalidDto = Object.assign(validDto, { byRejectionType: "invalid" });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when a record value is negative.", () => {
      const invalidDto = Object.assign(validDto, { byRejectionType: { "inappropriate-content": -1 } } as QuestionStatsDto);

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should throw a zod error when an unknown key is present.", () => {
      const invalidDto = Object.assign(validDto, { byRejectionType: { ...validDto.byRejectionType, unknown: 0 } });

      expect(() => QUESTION_STATS_DTO.parse(invalidDto)).toThrow(ZodError);
    });

    it("should have correct description when accessing the description.", () => {
      expect(QUESTION_STATS_DTO.shape.byRejectionType.description).toBe("Number of rejected questions per rejection type");
    });

    it("should have correct metadata when accessing the metadata.", () => {
      expect(QUESTION_STATS_DTO.shape.byRejectionType.meta()).toStrictEqual<Record<string, unknown>>({ description: "Number of rejected questions per rejection type" });
    });
  });
});