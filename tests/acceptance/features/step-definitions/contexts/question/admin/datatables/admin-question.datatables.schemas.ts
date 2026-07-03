import { z } from "zod";

import { createZLocalizedDataTableRowSchema } from "@acceptance-features/step-definitions/shared/locale/datatables/locale.datatables.helpers";

import { zCoerceOptionalBoolean, zCoerceOptionalString, zCoerceOptionalStringArray } from "@acceptance-support/helpers/datatable.helpers";

const ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("statement");

const ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("answer");

const ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("context");

const ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA = z.strictObject({
  slug: z.string(),
  isPrimary: zCoerceOptionalBoolean(),
  isHint: zCoerceOptionalBoolean(),
});

const ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA = createZLocalizedDataTableRowSchema("label");

const ADMIN_QUESTION_QUERY_PARAMS_SCHEMA = z.strictObject({
  "sort-by": zCoerceOptionalString(),
  "sort-order": zCoerceOptionalString(),
  "status": zCoerceOptionalString(),
  "category": zCoerceOptionalString(),
  "cognitive-difficulty": zCoerceOptionalString(),
  "author-role": zCoerceOptionalString(),
  "theme-ids": zCoerceOptionalStringArray(),
  "limit": zCoerceOptionalString(),
});

export {
  ADMIN_QUESTION_CONTENT_STATEMENT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_CONTENT_ANSWER_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_CONTENT_CONTEXT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_ASSIGNMENT_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_THEME_ASSIGNMENT_LABEL_DATATABLE_ROW_SCHEMA,
  ADMIN_QUESTION_QUERY_PARAMS_SCHEMA,
};