import { z } from "zod";

const ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const ADMIN_QUESTION_STATS_TOTAL_DATATABLE_ROW_SCHEMA = z.strictObject({
  field: z.literal("total"),
  value: z.coerce.number(),
});

export { ADMIN_QUESTION_STATS_FIELD_VALUE_DATATABLE_ROW_SCHEMA, ADMIN_QUESTION_STATS_TOTAL_DATATABLE_ROW_SCHEMA };