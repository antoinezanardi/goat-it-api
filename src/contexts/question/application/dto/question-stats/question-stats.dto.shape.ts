import { z } from "zod";

import { zTranslationCompletenessStats } from "@shared/application/dto/zod/validators/translation-completeness/translation-completeness.zod.validators";

import {
  QUESTION_AUTHOR_ROLES,
  QUESTION_CATEGORIES,
  QUESTION_COGNITIVE_DIFFICULTIES,
  QUESTION_REJECTION_TYPES,
  QUESTION_STATUSES,
} from "@question/domain/constants/question.constants";

/**
 * Validates the question statistics response: totals and per-status, per-category, per-difficulty, per-author-role and per-rejection-type buckets.
 */
const QUESTION_STATS_DTO = z.strictObject({
  total: z.number().int().nonnegative().describe("Total number of questions"),
  byStatus: z.record(z.enum(QUESTION_STATUSES), z.number().int().nonnegative())
    .describe("Number of questions per status"),
  byCategory: z.record(z.enum(QUESTION_CATEGORIES), z.number().int().nonnegative())
    .describe("Number of questions per category"),
  byCognitiveDifficulty: z.record(z.enum(QUESTION_COGNITIVE_DIFFICULTIES), z.number().int().nonnegative())
    .describe("Number of questions per cognitive difficulty"),
  byAuthorRole: z.record(z.enum(QUESTION_AUTHOR_ROLES), z.number().int().nonnegative())
    .describe("Number of questions per author role"),
  byRejectionType: z.record(z.enum(QUESTION_REJECTION_TYPES), z.number().int().nonnegative())
    .describe("Number of rejected questions per rejection type"),
  byTranslationCompleteness: zTranslationCompletenessStats()
    .describe("Translation completeness breakdown"),
});

/**
 * The question statistics consumers receive; every bucket key is present because the mapper zero-fills the records.
 */
type QuestionStatsDto = z.infer<typeof QUESTION_STATS_DTO>;

export { QUESTION_STATS_DTO };

export type { QuestionStatsDto };