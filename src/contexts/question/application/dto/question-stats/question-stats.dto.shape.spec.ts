import { ZodError } from "zod";

import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";
import { QUESTION_STATS_DTO } from "@question/application/dto/question-stats/question-stats.dto.shape";

import type { z } from "zod";

type QuestionStatsDtoShape = z.input<typeof QUESTION_STATS_DTO>;

describe("Question Stats DTO", () => {
  const createValidShape = (overrides: Partial<QuestionStatsDtoShape> = {}): QuestionStatsDtoShape => {
    const zeroIfMissing = <T extends string>(keys: readonly T[]): Record<T, number> => {
      const result = {} as Record<T, number>;
      for (const key of keys) {
        result[key] = 0;
      }
      return result;
    };
    return {
      total: 5,
      byStatus: zeroIfMissing(QUESTION_STATUSES),
      byCategory: zeroIfMissing(QUESTION_CATEGORIES),
      byCognitiveDifficulty: zeroIfMissing(QUESTION_COGNITIVE_DIFFICULTIES),
      byAuthorRole: zeroIfMissing(QUESTION_AUTHOR_ROLES),
      byRejectionType: zeroIfMissing(QUESTION_REJECTION_TYPES),
      ...overrides,
    };
  };

  describe("shape", () => {
    it("should accept when all fields are valid.", () => {
      expect(() => QUESTION_STATS_DTO.parse(createValidShape())).not.toThrow();
    });

    it("should reject when total is missing.", () => {
      const { total: _, ...rest } = createValidShape();

      expect(() => QUESTION_STATS_DTO.parse(rest)).toThrow(ZodError);
    });

    it("should reject when total is negative.", () => {
      expect(() => QUESTION_STATS_DTO.parse(createValidShape({ total: -1 }))).toThrow(ZodError);
    });

    it("should reject when total is not an integer.", () => {
      expect(() => QUESTION_STATS_DTO.parse(createValidShape({ total: 1.5 }))).toThrow(ZodError);
    });

    it("should reject when byStatus is missing.", () => {
      const { byStatus: _, ...rest } = createValidShape();

      expect(() => QUESTION_STATS_DTO.parse(rest)).toThrow(ZodError);
    });

    it("should reject when byStatus contains a negative value.", () => {
      const valid = createValidShape();

      expect(() => QUESTION_STATS_DTO.parse({ ...valid, byStatus: { ...valid.byStatus, active: -1 } })).toThrow(ZodError);
    });

    it("should reject when byStatus contains an unknown key.", () => {
      const valid = createValidShape();

      expect(() => QUESTION_STATS_DTO.parse({ ...valid, byStatus: { ...valid.byStatus, unknown: 0 } })).toThrow(ZodError);
    });

    it("should reject when an extra top-level property is present.", () => {
      expect(() => QUESTION_STATS_DTO.parse({ ...createValidShape(), extra: true })).toThrow(ZodError);
    });
  });
});