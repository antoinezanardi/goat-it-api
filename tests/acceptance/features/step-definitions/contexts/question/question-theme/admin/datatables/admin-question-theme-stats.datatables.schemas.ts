import { z } from "zod";

const QUESTION_THEME_STATS_TOTAL_SCHEMA = z.strictObject({
  field: z.literal("total"),
  value: z.coerce.number(),
});

const QUESTION_THEME_STATS_KEY_VALUE_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const QUESTION_THEME_STATS_BY_QUESTION_COUNT_ROW_SCHEMA = z.strictObject({
  themeSlug: z.string(),
  activeQuestionCount: z.coerce.number(),
});

export {
  QUESTION_THEME_STATS_BY_QUESTION_COUNT_ROW_SCHEMA,
  QUESTION_THEME_STATS_KEY_VALUE_SCHEMA,
  QUESTION_THEME_STATS_TOTAL_SCHEMA,
};