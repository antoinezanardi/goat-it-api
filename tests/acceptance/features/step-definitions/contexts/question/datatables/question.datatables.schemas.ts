import { z } from "zod";

const QUESTION_DATATABLE_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  cognitiveDifficulty: z.string(),
  status: z.string(),
  sourceUrls: z.string(),
});

export {
  QUESTION_DATATABLE_ROW_SCHEMA,
};