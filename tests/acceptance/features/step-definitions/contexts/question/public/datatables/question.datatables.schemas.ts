import { z } from "zod";

import { zCoerceOptionalBoolean, zCoerceOptionalString, zCoerceOptionalStringArray } from "@acceptance-support/helpers/datatable.helpers";

const QUESTION_DATATABLE_ROW_SCHEMA = z.strictObject({
  id: z.string(),
  category: z.string(),
  cognitiveDifficulty: z.string(),
  status: z.string(),
  sourceUrls: zCoerceOptionalStringArray(),
});

const QUESTION_CONTENT_DATATABLE_ROW_SCHEMA = z.strictObject({
  statement: z.string(),
  answer: z.string(),
  context: zCoerceOptionalString(),
});

const QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA = z.strictObject({
  trivia: z.string(),
});

const QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  label: z.string(),
  description: z.string(),
  isPrimary: zCoerceOptionalBoolean(),
  isHint: zCoerceOptionalBoolean(),
});

const QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA = z.strictObject({
  role: z.string(),
  name: zCoerceOptionalString(),
  gameId: zCoerceOptionalString(),
});

const QUESTION_REJECTION_DATATABLE_ROW_SCHEMA = z.strictObject({
  type: z.string(),
  comment: zCoerceOptionalString(),
});

const PUBLIC_QUESTION_QUERY_PARAMS_SCHEMA = z.strictObject({
  "sort-by": zCoerceOptionalString(),
  "sort-order": zCoerceOptionalString(),
  "category": zCoerceOptionalString(),
  "cognitive-difficulty": zCoerceOptionalString(),
  "author-role": zCoerceOptionalString(),
  "theme-ids": zCoerceOptionalStringArray(),
  "limit": zCoerceOptionalString(),
});

const RANDOM_QUESTION_QUERY_PARAMS_SCHEMA = z.strictObject({
  limit: zCoerceOptionalString(),
});

export {
  QUESTION_DATATABLE_ROW_SCHEMA,
  QUESTION_CONTENT_DATATABLE_ROW_SCHEMA,
  QUESTION_CONTENT_TRIVIA_DATATABLE_ROW_SCHEMA,
  QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA,
  QUESTION_AUTHOR_DATATABLE_ROW_SCHEMA,
  QUESTION_REJECTION_DATATABLE_ROW_SCHEMA,
  PUBLIC_QUESTION_QUERY_PARAMS_SCHEMA,
  RANDOM_QUESTION_QUERY_PARAMS_SCHEMA,
};