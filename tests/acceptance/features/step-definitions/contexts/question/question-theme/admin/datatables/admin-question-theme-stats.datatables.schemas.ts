import { z } from "zod";

const ADMIN_QUESTION_THEME_STATS_TOTAL_DATATABLE_ROW_SCHEMA = z.strictObject({
  field: z.literal("total"),
  value: z.coerce.number(),
});

const ADMIN_QUESTION_THEME_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const ADMIN_QUESTION_THEME_STATS_BY_QUESTION_COUNT_DATATABLE_ROW_SCHEMA = z.strictObject({
  themeSlug: z.string(),
  activeQuestionCount: z.coerce.number(),
});

export {
  ADMIN_QUESTION_THEME_STATS_BY_QUESTION_COUNT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_STATS_TOTAL_DATATABLE_ROW_SCHEMA,
};