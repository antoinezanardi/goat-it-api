import { ZodError } from "zod";

import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";
import { QUESTION_THEME_STATS_DTO } from "@question-theme/application/dto/question-theme-stats/question-theme-stats.dto.shape";

describe("Question Theme Stats DTO", () => {
  const zeroStatuses = (): Record<string, number> => {
    const result: Record<string, number> = {};

    for (const status of QUESTION_THEME_STATUSES) {
      result[status] = 0;
    }
    return result;
  };

  const createValidShape = (overrides: Partial<Record<string, unknown>> = {}): Record<string, unknown> => ({
    total: 3,
    byStatus: zeroStatuses(),
    byQuestionCount: [
      { themeId: "a", themeSlug: "cinema", activeQuestionCount: 2 },
      { themeId: "b", themeSlug: "music", activeQuestionCount: 0 },
    ],
    ...overrides,
  });

  describe("shape", () => {
    it("should accept when all fields are valid.", () => {
      expect(() => QUESTION_THEME_STATS_DTO.parse(createValidShape())).not.toThrow();
    });

    it("should reject when total is missing.", () => {
      const { total: _, ...rest } = createValidShape();

      expect(() => QUESTION_THEME_STATS_DTO.parse(rest)).toThrow(ZodError);
    });

    it("should reject when total is negative.", () => {
      expect(() => QUESTION_THEME_STATS_DTO.parse(createValidShape({ total: -1 }))).toThrow(ZodError);
    });

    it("should reject when total is not an integer.", () => {
      expect(() => QUESTION_THEME_STATS_DTO.parse(createValidShape({ total: 1.5 }))).toThrow(ZodError);
    });

    it("should reject when byStatus is missing.", () => {
      const { byStatus: _, ...rest } = createValidShape();

      expect(() => QUESTION_THEME_STATS_DTO.parse(rest)).toThrow(ZodError);
    });

    it("should reject when byQuestionCount entry has missing themeId.", () => {
      const valid = createValidShape();
      const broken = { ...valid, byQuestionCount: [{ themeSlug: "s", activeQuestionCount: 0 }] };

      expect(() => QUESTION_THEME_STATS_DTO.parse(broken)).toThrow(ZodError);
    });

    it("should reject when byQuestionCount entry has negative activeQuestionCount.", () => {
      const valid = createValidShape();
      const broken = { ...valid, byQuestionCount: [{ themeId: "a", themeSlug: "s", activeQuestionCount: -1 }] };

      expect(() => QUESTION_THEME_STATS_DTO.parse(broken)).toThrow(ZodError);
    });

    it("should reject when an extra top-level property is present.", () => {
      expect(() => QUESTION_THEME_STATS_DTO.parse({ ...createValidShape(), extra: true })).toThrow(ZodError);
    });
  });
});