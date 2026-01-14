import { z } from "zod";

import { zCoerceOptionalString } from "@acceptance-support/helpers/datatable.helpers";

const QUESTION_DATATABLE_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  cognitiveDifficulty: z.string(),
  status: z.string(),
  sourceUrls: z.string(),
});

const QUESTION_CONTENT_DATATABLE_ROW_SCHEMA = z.strictObject({
  statement: z.string(),
  answer: z.string(),
  context: zCoerceOptionalString(),
});

const QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA = z.strictObject({
  trivia: z.string(),
});

export {
  QUESTION_DATATABLE_ROW_SCHEMA,
  QUESTION_CONTENT_DATATABLE_ROW_SCHEMA,
  QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA,
};