import { z } from "zod";

import { QUESTION_THEME_STATUSES } from "@question-theme/domain/constants/question-theme.constants";

import { zTranslationCompletenessStats } from "@shared/application/dto/zod/validators/translation-completeness/translation-completeness.zod.validators";

/**
 * Validates the theme statistics response: totals, per-status buckets and the per-theme active question counts.
 */
const QUESTION_THEME_STATS_DTO = z.strictObject({
  total: z.number().int().nonnegative().describe("Total number of question themes"),
  byStatus: z
    .record(z.enum(QUESTION_THEME_STATUSES), z.number().int().nonnegative())
    .describe("Number of question themes per status"),
  byQuestionCount: z
    .array(z.strictObject({
      themeId: z.string().describe("Theme's unique identifier"),
      themeSlug: z.string().describe("Theme's slug"),
      activeQuestionCount: z
        .number()
        .int()
        .nonnegative()
        .describe("Number of active questions referencing this theme (includes 0 for themes with no active questions)"),
    }))
    .describe("Active question count per theme, sorted alphabetically by slug"),
  byTranslationCompleteness: zTranslationCompletenessStats()
    .describe("Translation completeness breakdown"),
});

/**
 * The theme statistics consumers receive, with every status bucket present and the per-theme counts sorted by slug.
 */
type QuestionThemeStatsDto = z.infer<typeof QUESTION_THEME_STATS_DTO>;

export { QUESTION_THEME_STATS_DTO };

export type { QuestionThemeStatsDto };