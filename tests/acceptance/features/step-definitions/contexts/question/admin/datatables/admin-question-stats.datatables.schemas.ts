import { z } from "zod";

const STATS_KEY_VALUE_SCHEMA = z.strictObject({
  field: z.string(),
  value: z.coerce.number(),
});

const STATS_TOTAL_SCHEMA = z.strictObject({
  field: z.literal("total"),
  value: z.coerce.number(),
});

export { STATS_KEY_VALUE_SCHEMA, STATS_TOTAL_SCHEMA };